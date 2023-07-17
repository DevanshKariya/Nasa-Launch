const {
  getAllLaunches,
  // addNewLaunch,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
  console.log(req.query);
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
} //we use values to iterate over map but the value is not json or js object or array so we need to convert it so we use from which converts it to an array

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  } // to check if the date is valid, so we use isNaN this will return true if the string date is not a number and false if a number
  // addNewLaunch(launch);
  await scheduleNewLaunch(launch);
  console.log(launch);
  return res.status(201).json(launch);
} //the launchdate is a string in the json req body so to use it we convert it into the date object

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id); //the id that we get is in a string form and the flight number we use is an int so change it to int

  const existLaunch = await existLaunchWithId(launchId);

  //if launch doesn't exist
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  //if launch does exist
  const aborted = await abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
