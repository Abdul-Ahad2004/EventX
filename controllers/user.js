import express from "express"
import jwt from "jsonwebtoken"


export class AuthController {
  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  static async signup(req, res) {
    try {
     
      const token= jwt.sign({
        // data: user.id
      }, "secret");

      res.cookie("id",token,
        {
          httpOnly:true
        }
      )
    
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
