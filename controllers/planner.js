import jwt from "jsonwebtoken";
import { Planner } from "../models/planner.js";
import {Event} from "../models/event.js"
import bcrypt from "bcrypt";

export class PlannerController {
  static async signup(req, res) {
    try {
      const { username, email, password,age,gender, phoneNumber,portfolio,experience } = req.body;

      if (
        [age, email, username, password, gender,phoneNumber,portfolio,experience].some(
          (field) => field === ""
        )
      ) {
        return res.status(400).json("All fields are required");
      }

      const existedUser = await Planner.findOne({
        $or: [{ username }, { email }],
      });

      if (existedUser) {
        return res.status(400).json("Planner with same email or username exists");
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
      const { email, password } = req.body;

      if (email === "" || password === "") {
        return res.status(401).json("All fields are required");
      }

      const user = await Planner.findOne({email});
      if (!user) {
        return res.status(401).json("Planner with this email does not exist");
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
          expiresIn:(Date.now()+1)
        }
      );

      return res.status(201)
      .cookie("plannerId", token, {
        httpOnly: true,
        secure:true,
      })
      .send({
        message:"Planner logged in successfully!",
        body:loggedInUser})
     
    } catch (error) {
      res.status(500).send({
        message: error.message || error,
      });
    }
  }

  static async logout (req, res){
  
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(201)
    .clearCookie("plannerId", options)
    .json("Planner logged Out")
}


}
