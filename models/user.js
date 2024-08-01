import mongoose,{Schema} from "mongoose";

const userschema =new Schema(
    {
      username:{
        type:String,
        required:true,
        unique:true,
      },
      email:{
        type: String,
        required:true,
        unique:true,
      },
      password:{
        type:String,
        required:true,
      },
      age:{
        type:Number,
        required:true,

      },
      gender:{
        type:String
      },
      phoneNumber:{
        type:String,
        required:true,
      }
    }
)

export const User = mongoose.model("User",userschema)