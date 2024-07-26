import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export class UserController {
  static async signup(req, res) {
    try {
      const { username, email, password, age, phoneNumber } = req.body;

      if (
        [age, email, username, password, phoneNumber].some(
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
      const { email, password } = req.body;

      if (email === "" || password === "") {
        return res.status(401).json("All fields are required");
      }

      const user = await User.findOne({email});
      if (!user) {
        return res.status(401).json("User with this email does not exist");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json("Wrong Username!!");
      }
      const loggedInUser = await User.findById(user._id).select(
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
      .cookie("id", token, {
        httpOnly: true,
        secure:true,
      })
      .send({
        message:"User logged in successfully!",
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
    .clearCookie("id", options)
    .json("User logged Out")
}
}
