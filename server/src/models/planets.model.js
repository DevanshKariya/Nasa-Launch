const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

const habitablePlanets = [];
//to read our csv file we use fs module
//our parse function is meant to be used using streams so we can pipe/connect the readable stream to writeable stream destination

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
} //to filter the confirmed planets and stars

/*
const promise = new Promise((resolve, reject) => {
    resolve(42);
})
promise.then((result) => {

})
const result = await promise;
console.log(result)
*/

//since stream is an asynchronous operation it can be a case that the page is loaded but the planet is not parsed yet so to solve this we can put this stream fuction inside of promise function

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }) //this will return each row in csv as js object
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        // console.log(`${habitablePlanets.length} habitable planets found!`);
        const countPlanetFound = (await getAllPlanets()).length;
        console.log(`${countPlanetFound} habitable planets found!`);
        console.log("done");
        resolve();
      });
    // parse();
  });
}

async function getAllPlanets() {
  // return habitablePlanets;
  // return planets.find(
  //   {
  //     kepler_name: "Kepler-62 f",
  //   },
  //   "-kepler_name anotherField"
  // ); //also allows to add filter in the form of js objects according to our needs

  return await planets.find({});
}

async function savePlanet(planet) {
  try {
    // habitablePlanets.push(data);
    // And this function.

    // Is exported from our planet's model.

    // And called in our server dogs when we start the server.

    // So if we restart the server or run many instances of the server in, say, a cluster, we're going to

    // be calling that load planet's data function.

    // Many, many times and duplicating all of these documents that we create in our database.

    // Luckily, Mongoose makes it easy for us to solve this problem.

    // We can use what's known as a upsert operation, where upsert is just a combination of the words for

    // inserts + update = upsert.

    // Well, an upsert is basically just an insert.

    // Just like our create operation here, inserts the document that we pass in.

    // But the update part allows us to insert only when the object that we're trying to insert doesn't already

    // await planets.create({
    //   kepler_name: data.kepler_name,
    // });

    await planets.updateOne(
      {
        kepler_name: planet.kepler_name,
      },
      {
        kepler_name: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
}; //we are going to use the loadPlanetsData function when we start our server so we'll export it
