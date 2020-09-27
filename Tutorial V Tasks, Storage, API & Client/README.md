1. What is the relationship between actor and task?

    - Task is configuration for actors. It makes an actor to perform a specific job.
        Using tasks you can adopt someone's else actor (from store) to your needs and aims.
        To make a conclusion, task is the dynamic part of an actor that can be easily changed to get some new results.
        Actor is a piece of code, and the task is changable varialbe. Through task you change input, timeout, max memory value.


2. What are the differences between default (unnamed) and named storage? Which one would you use for everyday usage?

    - Named and unnamed storages are the same in all regards except their retention period.
    Unnamed storages expire after 7 days unless otherwise specified (if you use free plan of usege). (For small price it's possible to increase expire period up to 30 days).
    Named storages are retained indefinitely.
    And named storages could be used for sharing information between runs/actors.
    Unnamed storages should be used by default unless you don't need to keep the data/share data between runs/actors.
    

3. What is the relationship between Apify API and Apify client? Are there any significant differences?
    - The Apify API provides programmatic access to the Apify platform. The API is organized around RESTful HTTP requests (which is not comfortable to use during development).
    - Apify-client is JS/NodeJs library for the Apify API. The main thing is that the Apify-client is just a thin wrapper around the API. (So this lib makes development more comfortable)
 
    To get access to the API from actor/nodeJS is recommended to use the Apify-client. The client's functions correspond to the API endpoints and have the same parameters. This simplifies development of apps that depend on the Apify platform.


4. Is it possible to use a request queue for deduplication of product IDs? If yes, how would you do that?

    - Yes. 
     The queue can only contain unique URLs. It can only contain Request instances with distinct uniqueKey properties.
     uniqueKey is generated from the URL. To add a single URL multiple times to the queue, corresponding Request objects will need to have different uniqueKey properties.


5. What is data retention and how does it work for all types of storages (default and named)?

    -   All storages by default are created without a name (with only an ID).
    This allows them to expire after 7 days and not take up your storage space.

    Unnamed(default) storages expire after 7 days unless otherwise specified.
    Named storages are retained indefinitely.



6. How do you pass input when running actor or task via API?
 
    - You can override the actor input configuration by passing a JSON object as the POST payload and setting the Content-Type: application/json HTTP header. 