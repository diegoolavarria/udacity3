const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");

const port = 3000;

const app = express();

let projectData = {};

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cors for cross origin allowance
app.use(cors());

// respond with "hello world" when a GET request is made to the homepage
app.get("/getProjectData", (req, res) => {
  console.log("getProjectData");
  console.log({ projectData });
  res.send(projectData);
});

app.post("/addData", (req, res) => {
  const newData = req.body;

  projectData.temperature = newData.temperature;
  projectData.date = moment(newData.date).format("MM/DD/YYYY, hh:mm");
  projectData.userResponse = newData.userResponse;
  console.log("addData");
  console.log({ projectData });
});

const server = app.listen(port, () =>
  console.log(`running on localhost: ${port}`)
);
