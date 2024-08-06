const mongoose = require("mongoose");
const validator = require("validator");
const otpGenerator = require("otp-generator");
const sendOtpToEmail = require("../utils/email");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [, "First name required"],
    minLength: [3, "First name should be at least 3 characters."],
    maxLength: [12, "First name should not exceed 12 characters."],
  },
  lastname: {
    type: String,
    minLength: [1, "Second name should be at least 1 character."],
    maxLength: [15, "Second name should not exceed 15 characters,"],
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: (props) => `${props.value} is not a valid email address`,
    },
    required: [true, "User email address required"],
  },
  phone: {
    type: String,
    unique: true,
    required: [true, "User mobile number required"],
    validate: {
      validator: (phone) =>
        validator.isMobilePhone(phone, "any", { strictMode: false }),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
  userType: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
  },
  passwordHash: {
    type: String,
    required: [true, "Password required"],
  },
  hashedEmailOtp: {
    type: String,
  },
  hashedEmailOtpExpiresAt: Date,
  hashedPhoneOtp: {
    type: String,
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now,
  },
  isAccountActive: {
    type: Boolean,
    default: false,
  },
  trips: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
  ],
  hashedPasswordResetOtp: String,
  hashedPasswordResetOtpExpiresAt: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailOtp = otpGenerator.generate(8, {
      upperCaseAlphabets: true,
      specialChars: true,
      lowerCaseAlphabets: true,
    });

    const hashedEmailOtp = crypto
      .createHash("sha256")
      .update(emailOtp)
      .digest("hex");

    this.hashedEmailOtp = hashedEmailOtp;
    this.hashedEmailOtpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // expires in 15 minutes

    const option = {
      email: this.email,
      subject: "Verify your Email for Travel Planner App Account",
      message: `<div style=""><p>Hi ${this.firstname} ${this.lastname}, </p>
      <p>Please verify your account by the otp <strong>${emailOtp}</strong></p>
      <p>If it was not initiated by you, then no action required. Please ignore this mail.</p>

      <p>
      With regards <br> Travel Planner Team
      </p>
      </div>`,
    };

    await sendOtpToEmail(option);
  }
  next();
});

module.exports = mongoose.model("User", userSchema, "users");
