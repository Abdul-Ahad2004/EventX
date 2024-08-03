import jwt from "jsonwebtoken"


export class AuthMiddleware {
  static async userverify(req, res, next) {
    try {
      const token = req.cookies.id
      console.log(token)
      if(!token)
      {
        return res.status(400).json("User not authenticated");
      }

      jwt.verify(token, 'secret', function(err) {
        if (err)
          return res.status(403).json("Your Token is Invalid ")
       else{   
        next()
       }
      });
    } catch(err) {
      
     console.log(err)
    }
  }
  static async plannerverify(req, res, next) {
    try {
      const token = req.cookies.plannerId
      
      if(!token)
      {
        return res.status(400).json("Planner not authenticated");
      }

      jwt.verify(token, 'secret', function(err) {
        if (err)
          return res.status(403).json("Your Token is Invalid ")
       else{   
        next()
       }
      });
    } catch(err) {
      
     console.log(err)
    }
  }
}
