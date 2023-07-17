const mongoose = require("mongoose");

//Constant that will store the schema defining the shape of our launches
const launchesSchema = new mongoose.Schema({
  //this object has a property for each of the possible data items that we want to store in any launch. Mongoose allows us to do more than jsut assigning types to launch we can capture this in our schema by assigning flight number not just a type but as an object where we assign the type explicitly and we can also say that the flight number is required and set that to true we can also set other properties
  flightNumber: {
    type: Number,
    required: true,
    // default: 100,
    // min: 100,
    // max: 999,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  //   But here is where we get interesting.
  // Our next property is this target.
  // Which refers to a planet's.
  // Which is going to have its own schema because we'll be storing planets in their own mongo collection.
  // As we discussed earlier, using a sequel database, we would reference a target planets by using what
  // SQL calls a foreign key and assigning only the I.D. of the target planets in our launch.
  // And it would be the target planet that lives in the planet's collection and the planet's table that
  // would actually store the data for our planet.
  // In this case, the name.
  // And Mongoose actually supports a similar approach.
  // We could say that a target.
  // References
  // A planet in our planet's collection.
  // This would look something like this, we would say that our target is a reference pointing to a planet.
  // And that its type.
  // Is this property from our Mongoose?
  // Package called Mongoose thought object ID, this ID would allow us to look up planets from that planet's
  // collection when creating new launches.
  // Mongoose would now check and verify that any planet we reference in our launch is actually one of the
  // planets in our planet's collection and mongo
  //   target: {
  //     type: mongoose.ObjectId,
  //     ref: "Planet",
  //   },
  //   But the truth is this approach with references.
  // Actually ends up making our life with Mongoose a lot more difficult.
  // Mongo doesn't support features of sequel that make this approach work.
  // In Sequel, we have what we call joints, which make it easy to combine the data from one table with
  // the data in another table like launches and planets.
  // Because Mongo doesn't support these joints.
  // We'd have to code all that logic ourselves and essentially recreate part of what a sequel database would
  // do.
  // This wouldn't be very easy to do well at all.
  // Databases are highly specialized pieces of software that have been perfected over decades.
  // So instead of adding all of this complexity.
  // With Mongo, we generally want to take a different approach.
  // It's the no sequel approach where we include the relevant data from our planet directly in our launch,
  // directly in this target property.
  // So no extra lockups are required.
  // All of the data that we're interested in lives in this collection.
  // What does this look like?
  // Well, the data from our planet that we actually care about is just the name, which is a string.
  // So we'll just store the string, including the name of our planet as the target.
  // And we can see that, of course, every launch needs to be targeting something, so we'll see that's
  // required as well
  target: {
    type: String,
    // required: true, reffer video 197
  },
  customer: [String],
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

//Connects launchesSchema with the "launches" collection. You pass in the collection as singular property and mongoose will automatically convert it to plural as mongo collection are to be plural
module.exports = mongoose.model("Launch", launchesSchema);
