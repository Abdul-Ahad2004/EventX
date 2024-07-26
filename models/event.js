import mongoose,{Schema} from "mongoose";

const eventschema= new Schema(
    {
        eventType:{
            type:String
        },
        date:{
            type:Date,
            required:true,
        },
        location:{
            type: String,
            required:true,
        },
        budget:{
            type:Number,
            required:true,
        },
        tasks:[
            {
                type:String,
            }
        ],
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        preferences:[
            {
                type:String,
            }
        ],
        planners:[
            {
                type:Schema.Types.ObjectId,
                ref:"Planner"
            }
        ],
        isAssigned:{
            type:Boolean,
            default:false,
        },
        assignedPlanner:{
            type:Schema.Types.ObjectId,
            ref: "Planner"
        }
    }
)

export default Event=mongoose.model("Event",eventschema)