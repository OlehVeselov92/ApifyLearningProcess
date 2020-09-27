1. How do you allocate more CPU for your actor run?

    - The share of CPU is computed automatically from the memory as follows: for each 4096 MB of memory, the actor gets 1 full CPU core. For other amounts of memory the number of CPU cores is computed fractionally. For example, an actor with 1024 MB of memory will have a 1/4 share of a CPU core.
    To set value we can use environment variable APIFY_MEMORY_MBYTES.


2. How can you get the exact time when the actor was started from within the running actor process?

    - To get this information we have Environment variable APIFY_STARTED_AT - that represents Date when the actor was started.
      To access environment variables in Node.js we need to use the process.env object:
      console.log(process.env.APIFY_USER_ID)

3. Which are the default storages an actor run is allocated (connected to)?

    - There ate three of them:
        - key-value;
        - dataset;
        - request-queue.

4. Can you change the memory allocated to a running actor?
    - You can't change the memory to a running actor.
    You can change the memory only for the new actor run using method 
    Apify.call(actId, [input],[options]: Object = {
        [memoryMbytes]: number
        }).


5. How can you run an actor with Puppeteer in a headful (non-headless) mode?
    In Apify.PuppeteerCrawler() we should set
    launchPuppeteerOptions: {
            headless: false
        }
    Also it's important to use appropriate docker image (chrome+xvfb).
    Or we can use environment variable APIFY_HEADLESS.

6. Imagine the server/instance the container is running on has a 32 GB, 8-core CPU. What would be the most performant (speed/cost) memory allocation for CheerioCrawler? (Hint: NodeJS processes cannot use user-created threads)

    - NodeJs is singe-threaded, so we could use only 1 CPU core. 4GB is usually enough since cheerio is lightweight.