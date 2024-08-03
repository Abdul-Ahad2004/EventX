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
        },
        portfolio:{
            type: String,
        },
        age:{
            type:Number,
        },
        gender:{
            type:String
        },
        experience:{
            type: Number,
            default: 0,
        },
        reviews:[
            {
                ratings:{
                    type:Number,
                    default:0,
                    min:0,
                    max:5,
                },
                feedback:{
                    type:String,
                },
            }
        ],
    }
)

export const Planner=mongoose.model("Planner",plannerschema)
