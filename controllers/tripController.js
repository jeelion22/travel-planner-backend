const Trip = require("../models/trip");
const User = require("../models/user");
const TravelBooking = require("../models/travelBooking");
const Accommodation = require("../models/accommodation");
const ToDos = require("../models/toDos");
const axios = require("axios");

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

      await User.findOneAndUpdate(
        { _id: userId, isAccountActive: true },
        { $push: { trips: newTrip._id } }
      );

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
  getTripById: async (req, res) => {
    try {
      const userId = req.userId;
      const tripId = req.params.tripId;

      const trip = await Trip.findOne({ _id: tripId, userId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      res.status(200).json(trip);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getAllTripsByUserId: async (req, res) => {
    try {
      const userId = req.userId;

      const allTrips = await Trip.find({ userId });

      if (allTrips.length === 0) {
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

      const user = await User.findById(userId);
      user.trips.pull(tripId);
      await user.save();

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
        trip.budget.currency !== budget.currency ||
        trip.budget.amount !== budget.amount
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

  bookTravel: async (req, res) => {
    try {
      const userId = req.userId;

      const tripId = req.params.tripId;

      const trip = await Trip.findOne({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      req.body["tripId"] = tripId;
      req.body["userId"] = userId;

      const travelBooking = new TravelBooking({ ...req.body });
      await travelBooking.save();

      await Trip.findOneAndUpdate(
        { userId, _id: tripId },
        { $push: { travelBookings: travelBooking._id } },
        { new: true, runValidators: true }
      );

      res
        .status(200)
        .json({ message: "Travel booking done successfully", travelBooking });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  bookAccommodation: async (req, res) => {
    try {
      const userId = req.userId;
      const tripId = req.params.tripId;

      const trip = await Trip.findOne({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      req.body["tripId"] = tripId;
      req.body["userId"] = userId;

      const accommodation = new Accommodation({
        ...req.body,
      });

      await accommodation.save();

      await Trip.findOneAndUpdate(
        { userId, _id: tripId },
        { $push: { accommodations: accommodation._id } },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        message: "Booking accommodaion done successfully",
        accommodation,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getAccommodationById: async (req, res) => {
    try {
      const userId = req.userId;

      const accId = req.params.accId;

      const accommodation = await Accommodation.findOne({
        userId,

        _id: accId,
      });

      if (!accommodation) {
        return res.status(400).json({ message: "Accommodation not found" });
      }

      res.status(400).json(accommodation);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  editAccommmodationById: async (req, res) => {
    try {
      const userId = req.userId;

      const accId = req.params.accId;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }

      const updatedAccommodation = await Accommodation.findOneAndUpdate(
        {
          userId,
          _id: accId,
        },
        { ...req.body },
        { new: true, runValidators: true }
      );

      if (!updatedAccommodation) {
        return res.status(400).json({ message: "Accommodation not found" });
      }

      res.status(200).json({
        message: "Accommodation information updated successfully",
        updatedAccommodation,
      });
    } catch (err) {}
  },
  deleteAccommodationById: async (req, res) => {
    try {
      const userId = req.userId;
      const accId = req.params.accId;

      const deletedAccommodation = await Accommodation.findOneAndDelete({
        userId,
        _id: accId,
      });

      if (!deletedAccommodation) {
        return res.status(400).json({ message: "Accommodation not found" });
      }

      const tripId = deletedAccommodation.tripId;

      const trip = await Trip.findOne({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      trip.accommodations.pull(accId);

      await trip.save();

      res.status(200).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getTravelBookingById: async (req, res) => {
    try {
      const userId = req.userId;

      const travelId = req.params.travelId;

      const travelBooking = await TravelBooking.findOne({
        userId,

        _id: travelId,
      });

      if (!travelBooking) {
        return res
          .status(400)
          .json({ message: "Travel booking information not found" });
      }

      res.status(400).json(travelBooking);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  editTravelBookingById: async (req, res) => {
    try {
      const userId = req.userId;

      const travelId = req.params.travelId;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is empty" });
      }

      const updatedTravelBooking = await TravelBooking.findOneAndUpdate(
        {
          userId,
          _id: travelId,
        },
        { ...req.body },
        { new: true, runValidators: true }
      );

      if (!updatedTravelBooking) {
        return res
          .status(400)
          .json({ message: "Travel booking information not found" });
      }

      res.status(200).json({
        message: "Travel booking information updated successfully",
        updatedTravelBooking,
      });
    } catch (err) {}
  },

  deleteTravelBookingById: async (req, res) => {
    try {
      const userId = req.userId;
      const travelId = req.params.travelId;

      const deletedTravelBooking = await TravelBooking.findOneAndDelete({
        userId,
        _id: travelId,
      });

      if (!deletedTravelBooking) {
        return res.status(400).json({ message: "Travel booking not found" });
      }

      const tripId = deletedTravelBooking.tripId;

      const trip = await Trip.findOne({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      trip.travelBookings.pull(travelId);

      await trip.save();

      res.status(200).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  addToDos: async (req, res) => {
    try {
      const userId = req.userId;
      const tripId = req.params.tripId;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "Request body might empty or not included" });
      }

      (req.body["userId"] = userId), (req.body["tripId"] = tripId);

      const toDos = new ToDos({ ...req.body });

      await toDos.save();

      const trip = await Trip.findOne({ userId, _id: tripId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      trip.toDos.push(toDos._id);

      await trip.save();

      res.status(201).json({ message: "ToDo created successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateToDoStatus: async (req, res) => {
    try {
      const userId = req.userId;
      const toDoId = req.params.toDoId;
      const toDoStatus = req.body.toDoStatus;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "Request body might empty or not included" });
      }

      const updatedToDo = await ToDos.findOneAndUpdate(
        { userId, _id: toDoId },
        { toDoStatus },
        { runValidators: true }
      );

      if (!updatedToDo) {
        return res.status(400).json({ message: "ToDo not found" });
      }

      res.status(200).json({ message: "ToDo status updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  editToDo: async (req, res) => {
    try {
      const userId = req.userId;
      const toDoId = req.params.toDoId;

      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "Request body might empty or not included" });
      }

      const updatedToDo = await ToDos.findOneAndUpdate(
        { userId, _id: toDoId },
        { ...req.body },
        { runValidators: true }
      );

      if (!updatedToDo) {
        return res.status(400).json({ message: "ToDo not found" });
      }

      res.status(200).json({ message: "ToDo  updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteToDo: async (req, res) => {
    try {
      const userId = req.userId;
      const toDoId = req.params.toDoId;

      const deletedToDo = await ToDos.findOneAndDelete({ userId, _id: toDoId });

      if (!deletedToDo) {
        return res.status(400).json({ message: "ToDo not found" });
      }

      const tripId = deletedToDo.tripId;

      const trip = await Trip.findOne({ _id: tripId, userId });

      if (!trip) {
        return res.status(400).json({ message: "Trip not found" });
      }

      trip.toDos.pull(toDoId);

      await trip.save();

      res.status(200).send();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getToDo: async (req, res) => {
    try {
      const userId = req.userId;
      const toDoId = req.params.toDoId;

      const toDo = await ToDos.findOne({ userId, _id: toDoId });

      if (!toDo) {
        return res.status(400).json({ message: "ToDo not found" });
      }

      res.status(200).json(toDo);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getTrainsBtnStations: async (req, res) => {
    try {
      const from = req.params.from;
      const to = req.params.to;

      const response = await axios.get(
        `http://indianrailapi.com/api/v2/TrainBetweenStation/apikey/9abdae9ebdd7b42aaa48c30815a4dbcb/From/${from}/To/${to}`
      );

      res.status(200).json(response.data);
    } catch (err) {
      res.status(500).json(err.message);
    }
  },
};

module.exports = tripController;
