import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, default: "", unique: true }, //c;ousry imagre urt
    profilePicPublicId: { type: String, default: "", unique: true },//clorury public urt
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    token: { type: String, default: null },
    isVarified: { type: Boolean, default: false },
    token: { type: String, default: null },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: Array },
    city: { type: String },
    zipCode: { type: String },
    phoneNumber: { type: String },
},
    {
        timestamps: true,




    })
export const User = mongoose.model("User", userSchema);