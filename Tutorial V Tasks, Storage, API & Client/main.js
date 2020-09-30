const Apify = require("apify");
const apifyClient = Apify.client; 
const TOKEN = process.env.TOKEN;
const rp = require("request-promise"); // Lib used to make requests (old, but still works)
const TASK_ID = "**************"; // (platform - task - settings - id)

const INPUT = {
  // INPUT FOR TASK
  foo: "bar",
  email: "olegveselov.92@gmail.com",
};

// setting logLevel
const { log } = Apify.utils;
log.setLevel(log.LEVELS.WARNING);

// function to run task through ApifyClient
async function taskUsingClient(memory, limit, fields) {

  // Runs the given task.
  const actRun = await apifyClient.tasks.runTask({
    taskId: TASK_ID,
    memory: memory, // Amount of memory allocated for the act run, in megabytes.
    waitForFinish: 120, // Number of seconds to wait for task to finish. If task doesn't finish in time then task run in RUNNING state is returned.
    input: INPUT, // Actor task input object.
  });

  // Get data from dataset with unique ID.
  const datasets = await apifyClient.datasets;

  const data = await datasets.getItems({
    // Returns items in the dataset based on the provided parameters
    datasetId: actRun.defaultDatasetId, // Unique dataset ID
    limit: limit, // Maximum number of array elements to return.
    fields: fields, // An array of field names that will be included in the result. If omitted, all fields are included in the results.
    format: "csv", //  Format of the items property, possible values are: json, csv, xlsx, html, xml and rss. Defaults to 'json'.
  });
  // the result of the function is an array of items we need
  return data.items;
}

// function to run task through API
async function taskUsingApi(memory, limit, fields) {
  // Request's options to get datasetID
  const reqOptions = {
    method: "POST",
    uri: `https://api.apify.com/v2/actor-tasks/${TASK_ID}/runs?token=${TOKEN}&memory=${memory}&waitForFinish=160`,
    headers: {
      "Content-Type": "application/json",
    },
    json: true,
    body: INPUT,
  };

  // making request and getting datasetID as a result
  let datasetId = null;

  await rp(reqOptions).then(function (json) {
    datasetId = json.data.defaultDatasetId;
  });

  // Request's options to get data from dataset with ID we need
  const optionsData = {
    method: "GET",
    uri: `https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}&format=csv&limit=${limit}&fields=${fields}`,
    headers: {
      "Content-Type": "application/json",
    },
    json: true,
  };

  // making request to get data from dataset
  return await rp(optionsData);
}

//  Main function
Apify.main(async () => {
  // getting input values
  const input = await Apify.getInput();

  // empty array to store data
  let data = [];

  if (input.useClient) {
    data = await taskUsingClient(input.memory, input.maxItems, input.fields);
  } else {
    data = await taskUsingApi(input.memory, input.maxItems, input.fields);
  }

  await Apify.setValue(
    // Stores or deletes a value in the default KeyValueStore associated with the current actor run.
    "OUTPUT", // key
    data, // value
    { contentType: "text/csv" } // option - specifies a custom MIME content type of the record.
  );

  console.log("Everything was done successfully.");
});
