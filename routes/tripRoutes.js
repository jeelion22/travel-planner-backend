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
  "/trips/addBudget/:tripId",
  auth.isAuth,
  tripController.addBudget
);
tripRouter.put(
  "/trips/travels/booking/:tripId",
  auth.isAuth,
  tripController.bookTravel
);
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
tripRouter.put(
  "/travels/edit/:travelId",
  auth.isAuth,
  tripController.editTravelBookingById
);

tripRouter.delete(
  "/travels/:travelId",
  auth.isAuth,
  tripController.deleteTravelBookingById
);

tripRouter.post("/trips/toDos/:tripId", auth.isAuth, tripController.addToDos);

tripRouter.put(
  "/trips/toDos/update/status/:toDoId",
  auth.isAuth,
  tripController.updateToDoStatus
);
tripRouter.put(
  "/trips/toDos/edit/:toDoId",
  auth.isAuth,
  tripController.editToDo
);
tripRouter.delete(
  "/trips/toDos/:toDoId",
  auth.isAuth,
  tripController.deleteToDo
);

tripRouter.get("/trips/toDos/:toDoId", auth.isAuth, tripController.getToDo);

tripRouter.get(
  "/trips/trains/from/:from/to/:to",
  auth.isAuth,
  tripController.getTrainsBtnStations
);

module.exports = tripRouter;
