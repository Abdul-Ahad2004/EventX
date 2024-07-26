import express from "express"
import { accounts } from "../constants/accounts.js";
import jwt from "jsonwebtoken"

let id = 1;

const accountInfo = {
  id: "",
  name: "",
  email: "",
  password: "",
  age: "",
  gender: "",
  phone: "",
};

export class AuthController {
  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  static async signup(req, res) {
    try {
      const user = accountInfo;
      
      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email === req.body.email) {
          return res.status(409).send({
            message: "Email already exists",
          });
        }
      }
      
      
      user.id = id++;
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;
      user.age = req.body.age;
      user.gender = req.body.gender;
      user.phone = req.body.phone;
      
      accounts.push(user);

      const token= jwt.sign({
        data: user.id
      }, "secret");

      res.cookie("id",token,
        {
          httpOnly:true
        }
      )
      
      // res.cookie("id_token", "random_secret_key", {
      //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      //   maxAge: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      //   secure: false,
      //   httpOnly: false,
      // });

      res.status(201).send({
        message: "User created successfully",
        body: user,
      })
    } catch (error) {
      res.status(500).send({
        message: (error.message || error)
      })
    }
  }
    
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].email === email) {
          if (accounts[i].password === password) {
            return res.status(200).send({
              message: "Login successful",
              body: accounts[i],
            })
          } else {
            return res.status(401).send({
              message: "Invalid email or password",
            })
          }
        } 
      }

      return res.status(401).send({
        message: "Credentials not found",
      })
    } catch (error) {
      res.status(500).send({
        message: (error.message || error)
      })
    }
   
  }
}
