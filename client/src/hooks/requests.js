const API_URL = "v1";

// async function httpGetPlanets() {
//   // TODO: Once API is ready.
//   // Load planets and return as JSON as controller return Js object
//   //the client is on port 3000 and server on 8000 so we fetch the server using async and await
//   const response = await fetch(`${API_URL}/planets`);
//   return await response.json();
// }

// async function httpGetLaunches() {
//   // TODO: Once API is ready.
//   // Load launches, sort by flight number, and return as JSON.
//   const response = await fetch(`${API_URL}/launches`);
//   const fetchedLaunches = await response.json();
//   return fetchedLaunches.sort((a, b) => {
//     return a.flightNumber - b.flightNumber;
//   });
// }

// async function httpSubmitLaunch(launch) {
//   // TODO: Once API is ready.
//   // Submit given launch data to launch system.
//   try {
//     return await fetch(`${API_URL}/launches`, {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(launch),
//     });
//   } catch (err) {
//     return {
//       ok: false,
//     };
//   } //here the body option needs to be a string but our launch parameter is an object so we convert it to string and we get this parameter launch from request.js were we pass the response from the form to our function
//   //if the fetch is successful thr status code is set 200 but if it fails the it is not 200 so we have to catch the error so we use try and catch
// }

// async function httpAbortLaunch(id) {
//   // TODO: Once API is ready.
//   // Delete launch with given ID.
// }

// export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const fetchedLaunches = await response.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
