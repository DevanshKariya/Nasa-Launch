const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
} //we return because in express we can only set the header once

module.exports = {
  httpGetAllPlanets,
};
