const express = require("express");

const auth = require("../middleware/auth");

const tripController = require("../controllers/tripController");

const tripRouter = express.Router();

tripRouter.post("/addTrip", auth.isAuth, tripController.addTrip);
tripRouter.get("/allTrips", auth.isAuth, tripController.getAllTripsByUserId);
tripRouter.put("/trips/:tripId", auth.isAuth, tripController.editTrip);
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
module.exports = tripRouter;
