const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

//Our  mongoose object exposes this connection property whichwe can access with mongoose.connection and this is a event emiiter that emits events when the connection is ready and things have succeeded

mongoose.connection.once("open", () => {
  console.log("Mongo connection ready!");
}); //but this event will emit only once when the first time the connection is reafy so use once instead of on
mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    //THESE FOUR OPTIONS ARE THE MUST WHILE CONNECTING MONGO TO MONGOOSE
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useStrictQuery: false,
    //MongoDb drive is the official driver that node uses to talk to mongo databases
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
