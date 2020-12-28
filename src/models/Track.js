const mongoose = require("mongoose");

// schema to store 1 point of location data
// includes time, along with other data the IOS/Android API gives us
// the data is stored in a coords object
const pointSchema = new mongoose.Schema({
  timestamp: Number,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number,
  },
});

// Track Schema stores the data specific to a user
// stores the user ID and an array of locations, made up of location point schemas
const trackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    default: "",
  },
  locations: [pointSchema],
});

// defind the track model
mongoose.model("Track", trackSchema);