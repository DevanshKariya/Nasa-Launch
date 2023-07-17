const http = require("http");

require("dotenv").config();

// const mongoose = require("mongoose");
const { mongoConnect } = require("./services/mongo");

const app = require("./app");

const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchesData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000; //process.env.PORT is used to make the port configurable by the administrator so that he can choose which port to use in other case it defaults to 8000. To set the port via package.json use set PORT=PORTNUMBER && command for windows and for mac and linux drop set

const server = http.createServer(app);

//Here we will wrap our express server inside our http server. as listen function for both are same so we pass in express app in our server which acts as a callback function and any middleware or handlers listen to the request on http server.THE added benefit is that now we can organize our code a little more by seperating the server functionality here from our express code which we're going to put into new file

async function startServer() {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchesData();
  //we will load  our spacex launch data the same way as we load our planets data and this data lies in our launches model
  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
} //the problem with require is that unlike import you cant call await at the top level without async function so we create a async function to start our server
startServer();
