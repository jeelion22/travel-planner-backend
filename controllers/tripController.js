const Trip = require("../models/trip");
const User = require("../models/user");

const tripController = {
  addTrip: async (req, res) => {
    try {
      const userId = req.userId;

      const { tripName, destination, startDate, endDate } = req.body;

      if (!tripName || !destination || !startDate || !endDate) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const newTrip = new Trip({
        tripName,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId,
      });

      await newTrip.save();

      res.status(201).json({ message: "New trip added successfully!" });
    } catch (err) {
      if (err.name === "ValidationError") {
        const field = Object.keys(err.errors)[0];

        const errMsg = err.errors[field].properties.message;

        return res.status(400).json({ message: errMsg });
      }

      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`,
        });
      }

      res.status(500).json({ message: err });
    }
  },

  getAllTripsByUserId: async (req, res) => {
    try {
      const userId = req.userId;

      const allTrips = await Trip.find({ userId });

      if (!allTrips) {
        return res.status(400).json({ message: "No trips found" });
      }

      res.status(200).json(allTrips);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  editTrip: async (req, res) => {
    try {
      const userId = req.userId;
      const tripId = req.params.tripId;

      const tripData = Object.keys(req.body);

      const isIncludeAll = [
        "tripName",
        "destination",
        "startDate",
        "endDate",
      ].every((trip) => tripData.includes(trip));

      if (!isIncludeAll) {
        return res.status(400).json({ message: "All fields required" });
      }

      const trip = await Trip.findOneAndUpdate(
        { userId, _id: tripId },
        { ...req.body },
        { new: true }
      );

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      res.status(200).json(trip);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteTrip: async (req, res) => {
    try {
      const userId = req.userId;
      const tripId = req.params.tripId;

      const trip = await Trip.findOneAndDelete({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      res.status(204).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  addBudget: async (req, res) => {
    try {
      const userId = req.userId;
      const tripId = req.params.tripId;
      const { budget } = req.body;

      const trip = await Trip.findOne({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }


      const message =
        (trip.budget.currency !== budget.currency ||
        trip.budget.amount !== budget.amount)
          ? "Budget updated successfully"
          : "Budget added successfully";

       await Trip.findOneAndUpdate(
        { userId, _id: tripId },
        { budget },
        { new: true, runValidators: true }
      );

      res.status(200).json({ message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = tripController;
