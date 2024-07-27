import mongoose,{Schema} from "mongoose";


const plannerschema= new Schema(
    {
        username:{
            type:String,
            required: true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type: String,
            required:true,
        },
        phoneNumber:{
            type: String,
            required:true,
            unique:true,
        },
        portfolio:{
            type: String,
        },
        experience:{
            type: Number,
            default: 0,
        },
        ratings:{
            type:Number,
            default:0,
            min:0,
            max:5,
        },
        reviews:[
            {
                type:String,
            }
        ],
    }
)

export const Planner=mongoose.model("Planner",plannerschema)
