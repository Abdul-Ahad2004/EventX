import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import bcrypt from "bcrypt"

export class UserController {
  static async signup(req, res) {
    try {
      const { username, email, password, age, phoneNumber } = req.body;

      if (
        [age, email, username, password, phoneNumber].some((field) => field === "")
      ) {
        return res.status(400).json("All fields are required");
      }

      const existedUser = await User.findOne({
        $or: [{ username }, { email }],
      });

      if (existedUser) {
        return res.status(400).json("User with same email or username exists");
      }
      const hashedPassword= await bcrypt.hash(password,10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        age,
        phoneNumber
      });

      const createdUser= await User.findById(user._id).select("-password")
      if(!createdUser){
        return res.status(500).json("Error!! User not created")
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
  
      // const token = jwt.sign(
      //   {
      //     // data: user.id
      //   },
      //   "secret"
      // );

      // res.cookie("id", token, {
      //   httpOnly: true,
      // });

     
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email === email) {
          if (accounts[i].password === password) {
            return res.status(200).send({
              message: "Login successful",
              body: accounts[i],
            });
          } else {
            return res.status(401).send({
              message: "Invalid email or password",
            });
          }
        }
      }

      return res.status(401).send({
        message: "Credentials not found",
      });
    } catch (error) {
      res.status(500).send({
        message: error.message || error,
      });
    }
  }
}
