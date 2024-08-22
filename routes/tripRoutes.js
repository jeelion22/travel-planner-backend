const express = require("express");

const auth = require("../middleware/auth");

const tripController = require("../controllers/tripController");

const tripRouter = express.Router();

tripRouter.post("/addTrip", auth.isAuth, tripController.addTrip);
tripRouter.get("/trips/:tripId", auth.isAuth, tripController.getTripById);
tripRouter.get("/allTrips", auth.isAuth, tripController.getAllTripsByUserId);
tripRouter.put("/trips/edit/:tripId", auth.isAuth, tripController.editTrip);
tripRouter.delete("/trips/:tripId", auth.isAuth, tripController.deleteTrip);
tripRouter.put(
  "/trips/updateBudget/:tripId",
  auth.isAuth,
  tripController.updateBudget
);

// transportation booking
tripRouter.put(
  "/trips/travels/booking/:tripId",
  auth.isAuth,
  tripController.bookTravel
);

// accommodation booking
tripRouter.put(
  "/trips/accommodations/booking/:tripId",
  auth.isAuth,
  tripController.bookAccommodation
);

tripRouter.get(
  "/accommodations/:accId",
  auth.isAuth,
  tripController.getAccommodationById
);
tripRouter.put(
  "/accommodations/edit/:accId",
  auth.isAuth,
  tripController.editAccommmodationById
);
tripRouter.delete(
  "/accommodations/:accId",
  auth.isAuth,
  tripController.deleteAccommodationById
);

tripRouter.get(
  "/travels/:travelId",
  auth.isAuth,
  tripController.getTravelBookingById
);

tripRouter.get(
  "/travels/booking/all/:tripId",
  auth.isAuth,
  tripController.getAllTravelBooking
);

tripRouter.put(
  "/travels/edit/:travelId",
  auth.isAuth,
  tripController.editTravelBookingById
);

// deleting booked travel ticket
tripRouter.delete(
  "/travels/booking/:travelId",
  auth.isAuth,
  tripController.deleteTravelBookingById
);

// todos' routes
tripRouter.post("/trips/toDos/:tripId", auth.isAuth, tripController.addToDos);

// get all todos
tripRouter.get(
  "/trips/toDos/all/:tripId",
  auth.isAuth,
  tripController.getAllToDos
);

// updte todo status
tripRouter.put(
  "/trips/toDos/update/status/:toDoId",
  auth.isAuth,
  tripController.updateToDoStatus
);

// toDo edit
tripRouter.put(
  "/trips/toDos/edit/:toDoId",
  auth.isAuth,
  tripController.editToDo
);
// delete todo
tripRouter.delete(
  "/trips/toDos/:toDoId",
  auth.isAuth,
  tripController.deleteToDo
);

// get toDo
tripRouter.get("/trips/toDos/:toDoId", auth.isAuth, tripController.getToDo);

tripRouter.get(
  "/trips/trains/from/:from/to/:to",
  auth.isAuth,
  tripController.getTrainsBtnStations
);

tripRouter.get(
  "/trips/flights/search",
  auth.isAuth,
  tripController.suggestFlights
);

tripRouter.get(
  "/trips/trains/search",
  auth.isAuth,
  tripController.suggestTrains
);

module.exports = tripRouter;
