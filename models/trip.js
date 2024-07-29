const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    // unique: true,
    required: [true, "Trip name required"],
  },
  destination: {
    type: String,
    required: [true, "Destination required"],
  },
  startDate: {
    type: Date,
    required: [true, "Trip start date required"],
    validate: {
      validator: (v) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return v >= today;
      },
      message: "Trip start date must be today or later",
    },
  },
  endDate: {
    type: Date,
    required: [true, "Trip end date required"],
    validate: {
      validator: (v) => v >= new Date(),
      message: "Trip end date must be today or later",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  budget: {
    currency: { type: String, required: [true, "Currency type required"], default: "INR" },
    amount: { type: Number, required: [true, "Amount required"], default: 0 },
  },
  default: {},
});

module.exports = mongoose.model("Trip", tripSchema, "trips");
