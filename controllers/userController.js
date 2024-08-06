const { verify } = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const sendOtpToEmail = require("../utils/email");
const otpGenerator = require("otp-generator");

const userController = {
  register: async (req, res) => {
    try {
      const { firstname, lastname, email, phone, password } = req.body;

      const user = await User.findOne({ email, phone });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstname,
        lastname,
        email,
        phone,
        passwordHash,
      });

      await newUser.save();

      res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`,
        });
      }

      res.status(500).json({ message: err.message });
    }
  },

  verifyAccount: async (req, res) => {
    try {
      const userId = req.params.userId;

      const emailOtp = req.body.emailOtp;

      const hashedEmailOtp = crypto
        .createHash("sha256")
        .update(emailOtp)
        .digest("hex");

      const user = await User.findOneAndUpdate(
        {
          _id: userId,
          hashedEmailOtp: hashedEmailOtp,
          hashedEmailOtpExpiresAt: { $gt: Date.now() },
        },

        {
          $set: {
            isEmailVerified: true,
            isAccountActive: true,
          },
          $unset: { hashedEmailOtp: "", hashedEmailOtpExpiresAt: "" },
        },

        { new: true }
      );

      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found or otp might expired" });
      }

      res.status(200).json({ message: "User account verified successfully!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email, isAccountActive: true });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // if (!user.isEmailVerified && !user.isPhoneVerified) {
      //   return res
      //     .status(400)
      //     .json({ message: "Your email and phone are not verfified." });
      // }

      if (!user.isEmailVerified) {
        return res.status(400).json({ message: "Please verify your email." });
      }

      const token = jwt.sign(
        {
          id: user._id,
          userType: user.userType,
        },
        JWT_SECRET
      );

      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600 * 1000),
      });

      res.status(200).json({ message: "Logged successfully!", token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  me: async (req, res) => {
    try {
      const userId = req.userId;

      const user = await User.findById(userId).select(
        "-__v -passwordHash -hashedEmailVerificationToken -hashedEmailVerificationTokenExpiresAt"
      );

      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const email = req.body.email;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const passwordResetOtp = otpGenerator.generate(6, {
        upperCaseAlphabets: true,
        specialChars: true,
        lowerCaseAlphabets: true,
      });

      const option = {
        email: user.email,
        subject: "OTP for reset Travel Planner App Account password",
        message: `<div style=""><p>Hi ${user.firstname} ${user.lastname}, </p>
        <p>Use the otp <strong>${passwordResetOtp}</strong> for reset your password. Valid only for  <b>15 minutes</b>.</p>
        <p>If it was not initiated by you, then no action required. Please ignore this mail.</p>
  
        <p>
        With regards <br> Travel Planner Team
  
        </p>
        </div>`,
      };

      await sendOtpToEmail(option);

      const hashedPasswordResetOtp = crypto
        .createHash("sha256")
        .update(passwordResetOtp)
        .digest("hex");

      await user.updateOne({
        $set: {
          hashedPasswordResetOtp: hashedPasswordResetOtp,
          // isPasswordResetRequested: true,
          hashedPasswordResetOtpExpiresAt: new Date(
            Date.now() + 15 * 60 * 1000
          ),
        },
      });
      res.status(200).json({
        message:
          "Password reset OTP sent to your registered email address successfully",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  verifyOtpAndUpdatePwd: async (req, res) => {
    try {
      const { passwordResetOtp, email, password } = req.body;

      const hashedPasswordResetOtp = crypto
        .createHash("sha256")
        .update(passwordResetOtp)
        .digest("hex");

      const user = await User.findOne({
        email,
        hashedPasswordResetOtp: hashedPasswordResetOtp,
        hashedPasswordResetOtpExpiresAt: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid otp or user not found" });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await user.updateOne({
        $set: { passwordHash: passwordHash },
        $unset: {
          hashedPasswordResetOtp: "",
          hashedPasswordResetOtpExpiresAt: "",
        },
      });

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({ message: "Password reset done successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const userId = req.userId;

      const user = await User.findById(userId);

      const { firstname, lastname, phone } = req.body;

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      await user.updateOne({ $set: { firstname, lastname, phone } });

      res.status(200).json({ message: "user updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = userController;
