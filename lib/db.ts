import mongoose from "mongoose";

export const connectDB = async () =>{

    try {
        await mongoose.connect(process.env.MONGO_URL!)
        console.log(`successfully connected to mongoodb`);
        
    } catch (error:unknown) {
        console.error(`Error :${error.message}`)
        process.exit(1)
    }
}