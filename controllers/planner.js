import jwt from "jsonwebtoken";
import { Planner } from "../models/planner.js";
import { Event } from "../models/event.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { Message } from "../models/message.js";

export class PlannerController {
  static async signup(req, res) {
    try {
      const {
        username,
        email,
        password,
        age,
        gender,
        phoneNumber,
        portfolio,
        experience,
      } = req.body;

      if (
        [
          age,
          email,
          username,
          password,
          gender,
          phoneNumber,
          portfolio,
          experience,
        ].some((field) => field === "")
      ) {
        return res.status(400).json("All fields are required");
      }

      const existedUser = await Planner.findOne({
        $or: [{ username }, { email }],
      });

      if (existedUser) {
        return res
          .status(400)
          .json("Planner with same email or username exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
       
      const user = await Planner.create({
        username,
        email,
        password: hashedPassword,
        age,
        phoneNumber,
        gender,
        portfolio,
        experience,
      });
      const createdUser = await Planner.findById(user._id).select("-password");
      if (!createdUser) {
        return res.status(500).json("Error!! Planner not created");
      }

      return res.status(201).send({
        message: "Planner created successfully",
        body: createdUser,
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message || error,
      });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (username === "" || password === "") {
        return res.status(401).json("All fields are required");
      }

      const user = await Planner.findOne({ username });
      if (!user) {
        return res.status(401).json("Planner with this username does not exist");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json("Wrong Password!!");
      }
      const loggedInUser = await Planner.findById(user._id).select(
        "-password "
      );

      const token = jwt.sign(
        {
          data: user._id,
        },
        "secret",
        {
          expiresIn: Date.now() + 1,
        }
      );

      return res
        .status(201)
        .cookie("plannerId", token, {
          httpOnly: true,
          secure: true,
        })
        .send({
          message: "Planner logged in successfully!",
          body: loggedInUser,
        });
    } catch (error) {
      res.status(500).send({
        message: error.message || error,
      });
    }
  }

  static async logout(req, res) {
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(201)
      .clearCookie("plannerId", options)
      .json({ message: "Planner logged Out" });
  }

  static async getEvents(req, res) {
    try {
      const events = await Event.find({
        assignedPlanner:null
        });
      if (!events) {
        return res.status(500).json("Error in fetching events");
      }
      return res
        .status(201)
        .json({ events, message: "Events fetched successfully" });
    } catch (error) {
      console.log("Error", error);
    }
  }

  static async myEvents(req, res) {
    try {
      const token = req.cookies?.plannerId;
      const plannerId = jwt.verify(token, "secret").data;
      if (!plannerId) {
        return res
          .status(400)
          .json({ message: "Planner is not authenticated" });
      }
      const events = await Event.find({assignedPlanner:plannerId});
     
      return res
        .status(201)
        .json({ events, message: "Events fetched successfully" });
    } catch (error) {
      console.log("Error", error);
    }
  }
  static async getId(req, res) {
    try {
      const token = req.cookies?.plannerId;
      const plannerId = jwt.verify(token, "secret").data;
      if (!plannerId) {
        return res
          .status(400)
          .json({ message: "Planner is not authenticated" });
      }
      return res
        .status(201)
        .json({ plannerId, message: "Planners Id sent successfully" });
    } catch (error) {
      console.log("Error", error);
    }
  }

  static async addRequest(req, res) {
    try {
      const eventId = req.params.eventId;

      const token = req.cookies?.plannerId;
      const plannerId = jwt.verify(token, "secret").data;
      if (!plannerId) {
        return res
          .status(400)
          .json({ message: "Planner is not authenticated" });
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(406).json({ message: "This event does not exist" });
      }

      if (event.isAssigned) {
        return res.status(406).json({
          message: "The event has already been assigned to another planner",
        });
      }

      event.planners.push(plannerId);
      await event.save();

      return res
        .status(201)
        .json({ message: "Successfully applied for the event" });
    } catch (error) {
      console.log("Error", error);
    }
  }

  static async sendMessage(req, res) {
    const { senderId, receiverId, receiverModel, content } = req.body;
    try {
      const sender = await Planner.findById(senderId);
      if (!sender) throw new Error("Sender not found");

      let receiver;
      if (receiverModel === "User") {
        receiver = await User.findById(receiverId);
      } else if (receiverModel === "Planner") {
        receiver = await Planner.findById(receiverId);
      } else {
        throw new Error("Invalid receiver model");
      }

      if (!receiver) throw new Error("Receiver not found");

      const message = new Message({
        sender: { id: senderId, model: "Planner" },
        receiver: { id: receiverId, model: receiverModel },
        content,
      });

      await message.save();
      return res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.error(error);
    }
  }
}
