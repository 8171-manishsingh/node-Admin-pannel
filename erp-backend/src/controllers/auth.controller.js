
const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const sendOtp = require("../utils/sendOtp");
const generateToken = require("../utils/generateToken");


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });

    if (!user.isActive) {
      return res.status(403).json({ msg: "Account is deactivated" });
    }


    if (user.role === "admin") {
      const token = generateToken(user);
      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    await OTP.create({
      userId: user._id,
      otpCode: otp,
      type: "login",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    console.log(`OTP for ${email}: ${otp}`);

    try {
      await sendOtp(user.email, otp);
      res.json({ msg: "OTP sent to your email" });
    } catch (emailError) {
      console.error("Email send error:", emailError.message);
      return res.status(500).json({ msg: "Failed to send OTP email. Check backend logs." });
    }
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Please provide email and OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const record = await OTP.findOne({
      userId: user._id,
      otpCode: otp,
      type: "login",
      used: false,
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    record.used = true;
    await record.save();

    const token = generateToken(user);

    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Please provide email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

    await OTP.create({
      userId: user._id,
      otpCode: otp,
      type: "forgot_password",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await sendOtp(email, otp);

    res.json({ msg: "Reset OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: "Please provide email, OTP and new password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const record = await OTP.findOne({
      userId: user._id,
      otpCode: otp,
      type: "forgot_password",
      used: false,
    });

    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();

    record.used = true;
    await record.save();

    res.json({ msg: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide name, email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hash,
      role: role || "employee",
      isVerified: true
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};
