import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Event } from "../models/event.js";
import { Planner } from "../models/planner.js";
import { Message } from "../models/message.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export class UserController {
  static async signup(req, res) {
    try {
     
      const { username, email, password, age, phoneNumber ,gender} = req.body;

      if (
        [age, email, username, password,gender, phoneNumber].some(
          (field) => field === ""
        )
      ) {
        return res.status(400).json("All fields are required");
      }

      const existedUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existedUser) {
        return res.status(400).json("User with same email or username exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        age,
        phoneNumber,
        gender,
      });
      const createdUser = await User.findById(user._id).select("-password");
      
      if (!createdUser) {
        return res.status(500).json("Error!! User not created");
      }

      return res.status(201).send({
        message: "User created successfully",
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

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json("User with this username does not exist");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json("Wrong Password!!");
      }
      const loggedInUser = await User.findById(user._id).select("-password ");

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
        .cookie("id", token, {
          httpOnly: true,
        })
        .send({
          message: "User logged in successfully!",
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
      secure: true,
      samesite:'none'
    };

    return res
      .status(201)
      .clearCookie("id", options)
      .json({ message: "User logged Out" });
  }

  static async postevent(req, res) {
    try {
      const { eventType, location, date, budget, preferences } = req.body;

      const token = req.cookies?.id;
      const userId = jwt.verify(token, "secret").data;

      if (
        eventType === "" ||
        location === "" ||
        date === "" ||
        budget === "" ||
        preferences.length === 0
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const event = await Event.create({
        eventType,
        location,
        date: Date(date),
        budget,
        preferences,
        user: userId,
      });

      const cereatedEvent = await Event.findById(event._id);

      if (!cereatedEvent) {
        return res.status(500).json({ message: "Event not created" });
      }

      return res.status(201).json({ message: "Event created succesfully!!" });
    } catch (error) {
      res.send(error);
    }
  }

  static async postReview(req, res) {
    try {
      const plannerName = req.params.planner;
      const { feedback, rating } = req.body;
      const planner = await Planner.findOne({ username: plannerName });
      if (!planner) {
        return res
          .status(400)
          .json({ message: "Planner does not exist with this username" });
      }
      planner.reviews.push({ ratings: rating, feedback });
      await planner.save();
      return res
        .status(201)
        .json({ message: "Review has been sent to the planner" });
    } catch (error) {
      console.log("Error:", error);
    }
  }
  static async getPlanners(req, res) {
    try {
      const token = req.cookies?.id;
      const userId = jwt.verify(token, "secret").data;
      if (!userId) {
        return res.status(400).json({ message: "User is not authenticated" });
      }
  
      const planners = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "user",
            as: "userEvents",
          },
        },
        {
          $unwind: "$userEvents",
        },
        {
          $lookup: {
            from: "planners",
            localField: "userEvents.planners",
            foreignField: "_id",
            as: "plannerDetails",
          },
        },
        {
          $unwind: "$plannerDetails",
        },
        {
          $group: {
            _id: "$_id",
            planners: { $addToSet: "$plannerDetails" },
          },
        },
      ]);
      if (planners.length === 0) {
        return res.status(406).json("No planners applied to this event");
      }
  
      const plannerdetails = planners[0].planners.map(
        ({ password, email, ...rest }) => rest
      );
  
      return res.status(201).json(plannerdetails);
    } catch (error) {
      console.log("Error: ",error)
      return res.error(error)
    }
  }

  static async sendMessage(req, res) {
    const { senderId, receiverId, receiverModel, content } = req.body;
    try {
      const sender = await User.findById(senderId);
      if (!sender) {
        throw new Error("Sender not found");
      }

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
        sender: { id: senderId, model: "User" },
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

  static async getEvents(req,res){
  try {
    console.log("Reached")
      const token = req.cookies?.id;
      const userId = jwt.verify(token, "secret").data;
      if (!userId) {
        return res.status(400).json({ message: "User is not authenticated" });
      }
      const events = await User.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "user",
            as: "userEvents",
          },
        },
        {
          $unwind: "$userEvents",
        },
        {
          $group: {
            _id: "$_id",
            events: { $addToSet: "$userEvents" },
          },
        },
      ]);
      if (events[0].events=== 0) {
        return res.status(407).json("No events posted by this user");
      }
      const eventlist=events[0].events
      return res.status(201).json({message:"Events fetched successfully",eventlist})
  } catch (error) {
    console.log("Error: ",error)
    return res.status(500).json({error:error})
  }
  }

  static async getnumberOfApplicants(req,res){
    try {
      console.log("Reached")
      const token = req.cookies?.id;
      const {eventId}=req.params
      const userId = jwt.verify(token, "secret").data;
      if (!userId) {
        return res.status(400).json({ message: "User is not authenticated" });
      }
      const event= await Event.findById(eventId)
      if(!event){
        return res.status(404).json({message:"Event does not exist"})
      }
      const number=event.planners.length
      return res.status(201).send(number)
    } catch (error) {
      console.log("Error",error)
    }
  }
}
