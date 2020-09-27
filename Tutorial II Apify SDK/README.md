1. Where and how can you use JQuery with the SDK?
    - We can use JQuery in CheerioCrawler (actually this is something like server-side JQuery); Also we can use JQuery with Puppeteer using Apify.utils.puppeteer.injectJQuery(page) helper function. 

2. What is the main difference between Cheerio and JQuery?

    -  Cheerio doesn't have access to the browser’s DOM (JQuery attaches to DOM). 
        Instead, we need to load the source code of the webpage we want to crawl. Cheerio allows us to load HTML code as a string, and returns an instance that we can use just like jQuery.
        So, Cheerio uses "document" as a default context and runs in NodeJS environment. JQuery runs in the browser environment.



3. When would you use CheerioCrawler and what are its limitations?

    - Cheerio should be used for simple sites (If the  website doesn't require JavaScript to display the content);
    - Limitations: we can't manipulate of website during scraping;
    Cheerio does not produce a visual rendering, load external resources, or execute JavaScript (because it's not a headless browser).

4. What are the main classes for managing requests and when and why would you use one instead of another?

    There are four of them: 
    - Request - Represents one URL to be crawled. We can use Apify.Request({userData}) property to custom data to distinguish between different types of pages or pass some data between requests;
    - RequestList - Represents a static list of URLs to crawl. After the initialization no more URLs can be added to the list. Unlike RequestQueue, RequestList is static (also fast and cheap) but it can contain millions of URLs;
    - RequestQueue - Represents a queue of URLs to crawl, which is used for deep crawling of websites where you start with several URLs and then recursively follow links to other pages. It supports dynamic adding and removing of requests. But the queue is not optimized for operations with a large number of URLs;
    - PseudoUrl - an URL pattern used by web crawlers to specify which URLs should the crawler visit (to do so we need to use RegExp).

5. How can you extract data from a page in Puppeteer without using JQuery?

    - We can use vanilla JS methods (such as querySelector(), querySelectorAll(), getElementById() etc...);
    - We can use Puppeteer's methods $eval(), $$eval();
    - We can extract data from XHR requests using DevTools.

6. What is the default concurrency/parallelism the SDK uses?

    -  Default value is 1 (minConcurrency) and the highest possible is 1000(maxConcurrency).
     It is good to remember that If you set this value too high with respect to the available system memory and CPU, your code might run extremely slow or crash. If you're not sure, just keep the default value and the concurrency will scale up automatically.