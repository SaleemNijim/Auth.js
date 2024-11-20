import mongoose from "mongoose";



const userSchems = new mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, select: false },
    role: { type: String, default: 'user' },
    image: { type: String },

    //Google &Github Providers
    authProviderId: { type: String },
});

export const User = mongoose.models?.User || mongoose.model("User", userSchems)