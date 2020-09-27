const Apify = require("apify"); // ADDING APIFY LIB

// MAIN FUNCTION
Apify.main(async () => {
  const input = await Apify.getValue("INPUT");

  // CHECKING INPUT
  if (!input) {
    throw new Error("iNPUT IS EMPTY");
  }

  //   GETTING LIST OF PREVIOUS RESULTS (OFFER LIST)
  const dataset = await Apify.client.datasets.getItems({datasetId: input.resource.defaultDatasetId});
  const offers = dataset.items;

  //   CREATING   EMPTY ARRAYS TO PROCESS DATA
  const iteratedItem = [];
  const minOffersArray = [];

  // ITERATING EACH OFFER AND SELECTING THE CHEAPEST
  for (const offer of offers) {
    if (!iteratedItem.includes(offer.url)) {
      const productOffers = offers.filter(
        (productOffer) => productOffer.url === offer.url
      );
      const minOffer = productOffers.reduce((accamulator, currentValue) => {
        return currentValue.price < accamulator.price
          ? currentValue
          : accamulator;
      });
      minOffersArray.push(minOffer);
      iteratedItem.push(offer.url);
    }
  }

  //   SAVING DATA
  await Apify.pushData(minOffersArray);
});
