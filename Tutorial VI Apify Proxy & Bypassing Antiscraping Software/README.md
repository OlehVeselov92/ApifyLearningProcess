1. What types of proxies does the Apify Proxy include? What are the main differences between them?

    - Datacenter proxy - cheapest ones (priced per IP), represent proxies located in data centers, rotated monthly (if talking about pool).

    - Residential proxy - proxies which represent real-world devices (like mobile phones, routers etc). Priced per GB, therefore more expensive, but nearly undetectable. Should be used only if Datacenter proxies are blocked quickly/instantly or for some geo-targeted scraping/access.

    - Google SERP proxy - only used to get search results from Google Search or other google search powered services from multiple countries with an option to dynamically switch between countries.

2. Which proxies (proxy groups) can users access with the Apify Proxy trial? How long does this trial last?

    - you can get a free trial of Apify Datacenter Proxy for 30 days. Also, in free trial mode You can use up to 100 Google SERP requests.
    - the trial doesn't apply to Residential proxy because it is just too easy to abuse.


3. How can you prevent a problem that one of the hardcoded proxy groups that a user is using stops working (a problem with a provider)? What should be the best practices?

    - you can use more proxy groups at a time or set value as 'auto' to get all available proxies. The number of proxy servers (and groups) available depends on the user's subscription plan.

4. Does it make sense to rotate proxies when you are logged in?

   - It's depends on how website is protected from web scraping.
    If there is limitation of requests by IP we should rotate proxies.
    But sometimes you don't necessarily need to rotate them, as some websites would consider the activity when you login with different IPs as suspicios.

5. Construct a proxy URL that will select proxies only from the US (without specific groups).

    - http://country-US:{process.env.APIFY_PROXY_PASSWORD}@proxy.apify.com:8000


6. What do you need to do to rotate proxies (one proxy usually has one IP)? How does this differ for Cheerio Scraper and Puppeteer Scraper?

    - Puppeteer gets assigned with proxy IP during launch, therefore you need to provide proxyConfiguration as option;
    - Cheerio -  you need to provide proxyConfiguration as crawler option, however each request would use random IP out of specified group.




7. Try to set up the Apify Proxy (using any group or auto) in your browser. This is useful for testing how websites behave with proxies from specific countries (although most are from the US). You can try Switchy Omega extension but there are many more. Were you successful?

    - it was successful. Status was changed to "connected";


8. Name a few different ways a website can prevent you from scraping it.

- IP detection - denies access to content based on the location of your IP address;
- IP rate limiting - limits access based on how many requests were made from a single IP address in a certain period of time;
- Browser detection - is based on the web browser that you are using;
- Special services like Captcha / Cloudflare - check for some token which should be within url/payload;
- Tracking user behavior;
- Blocking PhantomJS;
- Blocking headless Chrome with Puppeteer;
- Browser fingerprinting -  creates a unique fingerprint of the web browser and connect it using a cookie with the browser's IP address.

9. Do you know any software companies that develop anti-scraping solutions? Have you ever encountered them on a website?

 - there are a lot of them. For example Google Captcha, Cloudflare and www.shieldsquare.