const Apify = require("apify"); // ADD APIFY LIB
const { createRouter, getSources } = require("./tools"); // IMPORTING UTILITY FUNCTIONS
const {
  utils: { log },
} = Apify; // ADDING "LOG" THROUGH DESTRUCTORING

log.setLevel(log.LEVELS.DEBUG); // SETTING LEVEL OF LOGS (DEBUG, INFO, WARNING, ERROR)

// MAIN FUNCTION
Apify.main(async () => {
  // CREATING PROXY AND SETTING ITS CONFIGURATIONS
  const proxyConfiguration = await Apify.createProxyConfiguration({
    groups: ["BUYPROXIES94952"],
  });

  // SAVING DATA IN CASE OF MIGRATION (first run will be empty)
  let asinOffers = (await Apify.getValue("asinOffers")) || {};

  // FUNCTION TO SAVE DATA IN STORAGE
  const savingDataForMigration = async (asinOffers) => {
    await Apify.setValue("asinOffers", asinOffers);
  };

  
  // FUNCTION FOR INTERVAL LOGGING
  setInterval(async () => {
    console.log(asinOffers);
    await Apify.setValue("asinOffers", asinOffers);
  }, 20000);

  Apify.events.on("migrating", async () => {
    await savingDataForMigration(asinOffers); //
  });

  log.info("Starting crawling");
  const requestList = await Apify.openRequestList(
    "searches",
    await getSources()
  ); // INITIALIZING REQUESTLIST (STATIC LIST), PASSING BASIC URLs
  const requestQueue = await Apify.openRequestQueue(); //INITIALIZING QUEUE (DYNAMIC LIST)

  const router = createRouter({ requestQueue }); //CREATING ROUTES

  //CREATING PUPPETEER
  const crawler = new Apify.PuppeteerCrawler({
    requestList,
    requestQueue,
    proxyConfiguration,
    maxConcurrency: 1,
    sessionPoolOptions: {
      sessionOptions: {
        maxUsageCount: 5, // Session should be used only a limited amount of times. This number indicates how many times the session is going to be used, before it is thrown away.
      },
    },
    useSessionPool: true,
    // A FUNCTION THAT PROCESSES EACH PAGE
    handlePageFunction: async (context) => {
      const { request } = context;
      log.info(`Starting to crawl ${request.url}`);
      await router(request.userData.label, context);
    },
    launchPuppeteerOptions: {
      stealth: true, // MAKES CHROME UNDETECTABLE
      headless: false, // ALLOWS TO OBSERVE THE PROCESS
    },
  });

  await crawler.run(); // LAUNCHING CRAWLER

// CALLING ACTOR FROM STORE TO SEND AN EMAIL


log.info('sending email');
  const env = await Apify.getEnv();
  const datasetId = env.defaultDatasetId;

  if (datasetId !== undefined) {
    log.info(`Sending email...`);
    await Apify.call("apify/send-mail", {
      to: "andrey@apify.com",
      subject: "Oleg Veselov. This is for the Apify SDK exercise",
      html: `https://api.apify.com/v2/datasets/${datasetId}/items`,
    });
    log.info("Email was sent successfully");
  }

  log.info('email sent');

  // WEBHOOK THAT CALLS ANOTHER ACTOR
  // await Apify.addWebhook({
  //   eventTypes: ["ACTOR.RUN.SUCCEEDED"],
  //   requestUrl: `https://api.apify.com/v2/acts/${actorsName}/runs?token=${myToken}`,
  // });
});
