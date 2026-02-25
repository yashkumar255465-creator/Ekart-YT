import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided, authorization denied" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.id = decoded.userId;

            // Optionally check if the user is still in DB and not deleted
            const user = await User.findById(req.id).select("-password");
            if (!user) {
                return res.status(401).json({ success: false, message: "Token is valid, but user no longer exists" });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
            }
            return res.status(401).json({ success: false, message: "Token is not valid" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Authentication Error" });
    }
};
