import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/EventX`)
        console.log("MONGODB connected successfully!!")
    } catch (error) {
        console.log("MONGODB connection failed",error)
    }
}

export default connectDB