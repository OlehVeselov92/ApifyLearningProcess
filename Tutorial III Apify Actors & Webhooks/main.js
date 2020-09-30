const Apify = require("apify"); // ADDING APIFY LIB

// MAIN FUNCTION
Apify.main(async () => {
  const input = await Apify.getValue("INPUT");

  // CHECKING INPUT
  if (!input) {
    throw new Error("INPUT IS EMPTY");
  }

  //   GETTING LIST OF PREVIOUS RESULTS (OFFER LIST)
  const dataset = await Apify.client.datasets.getItems({
    datasetId: input.resource.defaultDatasetId,
  });
  const offers = dataset.items;

  //   CREATING   EMPTY ARRAYS TO PROCESS DATA
  const output = {};

  // ITERATING EACH OFFER AND SELECTING THE CHEAPEST
  for (const offer of offers) {
    const asin = offer.url.replace("https://www.amazon.com/dp/", "");
    const price = parseFloat(offer.price.replace("$", ""));

    if (!output[asin]) {
      output[asin] = offer;
    }

    if (output[asin]) {
      const storedPrice = parseFloat(output[asin].price.replace("$", ""));
      if (price < storedPrice) {
        output[asin] = offer;
      }
    }
  }

  //   SAVING DATA
  await Apify.pushData(Object.values(output));
});
