const axios = require("axios");
const launchesDataBase = require("./launches.mongo"); //with mong0
const planets = require("./planets.mongo");

// const launches = new Map(); //without mongo

const DEFAULT_FLIGHT_NUMBER = 100;
// const latestFlightNumber = 100;

// const launch = {
//   flightNumber: 100, //flight_number
//   mission: "Kepler Exploration X", //name
//   rocket: "Explorer IS1", //rocket.name in spacex api
//   launchDate: new Date("December 27, 2030"), //date_local in api
//   target: "Kepler-442 b", //N/A in spacex as they dont target our kepler planets
//   customer: ["ZTM", "NASA"], //payload.customers for each payload
//   upcoming: true, //upcoming in api
//   success: true, //success in api
// };

// // launches.set(launch.flightNumber, launch);
// saveLaunch(launch); //not needed as we are getting real life data from our space x api

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
//funciton to load our spacex launch data from the api

async function populateLaunches() {
  console.log("Downloading launch data...");
  //to make a post requiest we will await the promise returned by axios.post which takes two main arguments 1st url, 2nd is the data that is passed in the body of our post request

  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false, //refer video 195 transcript and notes
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed");
  }

  //create a launchDocs And taking the data property from that response, which is where Axios puts the body of the response
  // from the server, so launch data is now the data coming in from the body of our response.
  //   And if we remember our postmen request when we use the query end point, the result came in this docs

  // array.
  // So in our code, let's fetch this array that's coming back from our query by saying response thought
  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    //Now inside of our loop, our goal will be to convert this launch dock as it comes back from our response.
    // Into a launch object that can be saved into our database.
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    }); //refer lect number 194 transcript and resources

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      upcoming: launchDoc["upcoming"],
      launchDate: launchDoc["date_local"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);

    //Populate launches collection
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  }); //we do this to find if the data already exists in the db which means it has been loaded once so to prevent it from loading again and thereby reducing the load on the server
  if (firstLaunch) {
    console.log("laucnh data already loaded");
  } else {
    await populateLaunches();
  }
}

// function existLaunchWithId(launchId) {
//   return launches.has(launchId);
// }

async function findLaunch(filter) {
  return await launchesDataBase.findOne(filter);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

//function to get flight number. As to store it in mongo so the data persists and can be incremented. We store it in mongo as our api should be stateless and earlier stored the state in our api.Since it is to be stored in mongo the function should be async

async function getLatestFlightNumber() {
  //we are going to get the latest flight number that already exists in our launches collection instead of the latest flight number state that was earlier in the memory
  const latestLaunch = await launchesDataBase.findOne().sort("-flightNumber"); //this will get us the latest flight number.Here sort function sorts it in ascending order and findone returns the first number so to return the latest flight we sort in descending order which can be done by adding - in front of our property name

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches(skip, limit) {
  // return Array.from(launches.values());
  return await launchesDataBase
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  // const planet = await planets.findOne({
  //   kepler_name: launch.target,
  // });

  // if (!planet) {
  //   throw new Error("No matching planet found");
  // } refer video 197
  //use upsert
  await launchesDataBase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber, //to check if the launch already exists
    },
    launch,
    /*to insert the launch if doesnot exist or update if exist*/ {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    kepler_name: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Zero to Mastery", "Nasa"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   return launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       flightNumber: latestFlightNumber,
//       customer: ["ZTM", "NASA"],
//       upcoming: true,
//       success: true,
//     })
//   );
// }

async function abortLaunchById(launchId) {
  //we can delete the launch by simply using launches.delete and this wipe the launch completely but we can do it more efficiently by not completely deleting it and storing the data for future purposes
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
  const aborted = await launchesDataBase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  existLaunchWithId,
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  abortLaunchById,
};
