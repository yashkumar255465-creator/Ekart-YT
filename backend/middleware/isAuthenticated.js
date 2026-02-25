import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const isAAuthenticated = async(req, res, next) => {
    try{
         
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({ success:false,message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        try{
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        }catch(error){
            if(error.name === "TokenExpiredError"){
                return res.status(401).json({ success:false,message: "Token expired" });
            }
            return res.status(401).json({ success:false,message: "Invalid token" });
        }
        const user = await User.findById(decoded.id)
            if(!user){
                return res.status(404).json({ success:false,message: "User not found" });
            }
            req.id = user._id
            next()
        
        
    }catch(error){
        return res.status(500).json({ success:false,message: "Server error", error: error.message });
    }



}