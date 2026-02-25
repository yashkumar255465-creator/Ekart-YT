import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { sendBrevoEmail } from "../utils/sendBrevoEmail.js";
import { UAParser } from "ua-parser-js";

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isVarified: false
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    newUser.token = token;
    await newUser.save();

    await verifyEmail(email, token);

    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: newUser
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/* ================= VERIFY EMAIL ================= */
export const verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ success: false, message: "Token expired or invalid" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isVarified = true;
    user.token = null;
    await user.save();

    return res.status(200).json({ success: true, message: "Email verified successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isVarified) {
      return res.status(401).json({ success: false, message: "Verify your email first" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

    user.token = accessToken;
    await user.save();

    await Session.deleteOne({ userId: user._id });
    await Session.create({ userId: user._id });

    // Parse Device Information
    const parser = new UAParser(req.headers['user-agent']);
    const deviceInfo = parser.getResult();
    const deviceName = `${deviceInfo.device.vendor || ''} ${deviceInfo.device.model || ''}`.trim() || 'Unknown Device';
    const osName = `${deviceInfo.os.name || ''} ${deviceInfo.os.version || ''}`.trim() || 'Unknown OS';
    const browserName = `${deviceInfo.browser.name || ''} ${deviceInfo.browser.version || ''}`.trim() || 'Unknown Browser';

    // Send Login Alert Email
    const loginTime = new Date().toLocaleString();
    const emailSubject = "New Login Alert - Ekart Security";
    const emailHtml = `
      <h3>New Login to your account</h3>
      <p>Hello ${user.firstName},</p>
      <p>We noticed a new login to your account with the following details:</p>
      <ul>
        <li><strong>Time:</strong> ${loginTime}</li>
        <li><strong>Device:</strong> ${deviceName}</li>
        <li><strong>OS:</strong> ${osName}</li>
        <li><strong>Browser:</strong> ${browserName}</li>
      </ul>
      <p>If this was you, you can ignore this email. If you don't recognize this activity, please change your password immediately.</p>
    `;
    await sendBrevoEmail(user.email, emailSubject, emailHtml);


    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      accessToken,
      refreshToken
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/* ================= LOGOUT ================= */
export const logout = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId);

    await Session.deleteOne({ userId });
    await User.findByIdAndUpdate(userId, { token: null });

    if (user) {
      const parser = new UAParser(req.headers['user-agent']);
      const deviceInfo = parser.getResult();
      const browserName = `${deviceInfo.browser.name || ''}`.trim() || 'Unknown Browser';

      const logoutTime = new Date().toLocaleString();
      const emailSubject = "Successful Logout - Ekart Security";
      const emailHtml = `
          <h3>Account Logout Notice</h3>
          <p>Hello ${user.firstName},</p>
          <p>You have successfully logged out from Ekart Security on ${browserName} at ${logoutTime}.</p>
          <p>Have a great day!</p>
        `;
      await sendBrevoEmail(user.email, emailSubject, emailHtml);
    }

    return res.status(200).json({ success: true, message: "Logout successful" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPMail(otp, email);

    return res.status(200).json({ success: true, message: "OTP sent to email" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/* ================= VERIFY OTP ================= */
export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ success: true, message: "OTP verified" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


/* ================= CHANGE PASSWORD ================= */
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
