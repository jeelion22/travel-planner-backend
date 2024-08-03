const mongoose = require("mongoose");
const validator = require("validator");

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Accommodation booking name required"],
  },

  accommodationProvider: {
    name: {
      type: String,
      required: [true, "Accommodation provider or hotel name required"],
    },
    address: {
      type: String,
      required: [true, "Accommodation provider or hotel address required"],
    },
  },

  address: {
    type: String,
    required: [true, "Address required"],
  },
  checkInDate: {
    type: Date,
    required: [true, "Check-in date required"],
    validate: {
      validator: (v) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: "Check-in date must be today or later",
    },
  },
  checkOutDate: {
    type: Date,
    required: [true, "Check-out date required"],
    validate: {
      validator: (v) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: "Check-out date must be today or later",
    },
  },
  cost: {
    currency: {
      type: "String",
      required: [true, "Currency type required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount required"],
    },
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: [true, "Trip id required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      name: {
        type: String,
        required: [true, "Member name required"],
      },
      relationship: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
        validate: {
          validator: (v) => validator.isEmail(v),
          message: "Invalid email address",
        },
      },
      phone: {
        type: String,
        required: false,
        validate: {
          validator: (v) =>
            validator.isMobilePhone(v, "any", { strictMode: false }),
          message: "Invalid phone number",
        },
      },
    },
  ],
});

module.exports = mongoose.model(
  "Accommodation",
  accommodationSchema,
  "accommodations"
);
