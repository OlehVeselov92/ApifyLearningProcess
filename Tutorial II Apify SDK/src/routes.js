const Apify = require("apify");
const {
  utils: { log },
} = Apify;

// Get all product ASINs ( products IDs) from the first page of results. The ASIN is the product ID on Amazon.
exports.SEARCH_PAGE = async ({ page, request }, { requestQueue }) => {
  log.info("Getting ASINs on the first page");

  //getting array of ASINs (output)
  const asins = await page.$$eval("div[data-asin]", ($divs) => {
    // $$eval - nodeList (pseudoArray of elements) ($eval - one elem)
    const output = [];
    $divs.forEach(($div) => {
      const asin = $div.getAttribute("data-asin");
      asin && output.push(asin); // && - returns true or false (additional check)
    });
    return output;
  });

  log.debug(`List of ASINs ${asins}`);

  //Main step of this part - adding each product page to the requestQueue
  // FIXED PROMISE.ALL(ASINS.MAP())

  for (const asin of asins) {
    await requestQueue.addRequest({
      url: `https://www.amazon.com/dp/${asin}`,
      userData: {
        label: "ITEM_PAGE",
        keyword: request.userData.keyword,
        asin,
      },
    });
  }
};

// From here, we are going to each product's detail page and save its title, url and description
exports.ITEM_PAGE = async ({ page, request }, { requestQueue }) => {
  log.info(`Crawling item details ${request.url}`);

  // Getting url, title and description as ItemData (type:Object)
  const itemData = {
    url: request.url,
    title: await page.$eval('meta[name="title"]', ($meta) =>
      $meta.getAttribute("content")
    ),
    description: await page.$eval('meta[name="description"]', ($meta) =>
      $meta.getAttribute("content")
    ),
    keyword: request.userData.keyword,
  };

  log.debug(`Item details crawled ${JSON.stringify(itemData)}`);

  // ENQUEUING OFFERS TO THE REQUESTQUEUE
  await requestQueue.addRequest({
    url: `https://www.amazon.com/gp/offer-listing/${request.userData.asin}`,
    userData: {
      label: "OFFER_PAGE",
      itemData, // SAVING  url, title and description as ItemData
    },
  });
};

// Scraping and pushing all offers to the dataset. each offer should have its specific sellerName, price, and shippingPrice.
exports.OFFER_PAGE = async ({ page, request }) => {
  log.info(`Crawling offers ${request.url}`);

  const offerData = await page.$$eval('div[role="row"].olpOffer', ($rows) => {
    const output = [];

    $rows.forEach(($row) =>
      output.push({
        sellerName:
          $row.querySelector("h3 > span > a") &&
          $row.querySelector("h3 > span > a").textContent.trim(),
        price:
          $row.querySelector("div.olpPriceColumn > span") && // USING '&&' TO MAKE ADDITIONAL CHECKING
          /[0-9\.$]+/g.exec(
            $row.querySelector("div.olpPriceColumn > span").textContent.trim()
          ) && // USING REGEXPS TO GET WHAT WE NEED
          /[0-9\.$]+/g.exec(
            $row.querySelector("div.olpPriceColumn > span").textContent.trim()
          )[0],
        shippingPrice:
          $row.querySelector("p.olpShippingInfo") && // as an element of the page structure i have found this element (due to className it must be shipping price), but it's empty. So i couldn't get it. (maybe i'm doing something wrong)
          /(FREE|[0-9\.$]+)/g.exec(
            $row.querySelector("p.olpShippingInfo").textContent
          ) &&
          /(FREE|[0-9\.$]+)/g.exec(
            $row.querySelector("p.olpShippingInfo").textContent
          )[0],
      })
    );
    return output;
  });
  log.debug(`Item offers crawled ${JSON.stringify(offerData)}`);

  const output = [
    ...offerData.map((offer) => ({
      ...offer,
      ...request.userData.itemData,
    })),
  ];

  await Apify.pushData(output);

  
};
