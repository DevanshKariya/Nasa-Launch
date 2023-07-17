//We can create a test fixture with different test cases by using the describe function and passing in a description for the group of tests our tests are defined in the callback function that we pass into the function which calls the test function which defines each of the test cases

//We use supertest to test our response against our req, we require it in the name of request because it will be the tool that makes requests against our api

const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  //   Now we have this nested structure.

  // Where we have the lunches API tests grouped by the HTP method and each HTP method has some tests that

  // need to succeed with this change.

  // We can now add a set up step.

  // Two are launches API tests.

  // Which we can do with this before all statements.

  // Which takes a callback that needs to run.

  // Before all.

  // The tests in this block are run.

  // Whatever is in this callback will run once to set up all the tests that come after.

  // What we want to set up is our Mongo connection.

  // By calling Mongo Connect.

  // Which is an async function.

  // So we're going to await.

  // The result and make our call back async
  beforeAll(async () => {
    await mongoConnect();
  });

  //   Jest is still not exiting one second after the test run has completed.

  // And this usually means that there are asynchronous operations that weren't stopped in your tests.

  // One thing that we can try doing here is explicitly disconnecting from our Mongo database when our tests

  // complete so that the connection doesn't stick around forever.
  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      // const response = await request(app).get("/launches");
      // //use assertions to specify what response do we expect
      // expect(response.statusCode).toBe(200);
      //instead of doing the above thing we can use assertions given by supertest like chaining
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "January 4, 2028",
    };

    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "DK",
    };

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing requires properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
