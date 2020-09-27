1. Actors have a Restart on error option in their Settings. Would you use this for your regular actors? Why? When would you use it, and when not?

 -   You should not do restart on error unless you absolutely know what and why you're doing.

 -  But it might be used carefully because there could be any exceptions which could be thrown any time and it could cost too much.

2. Migrations happen randomly, but by setting Restart on error and then throwing an error in the main process, you can force a similar situation. Observe what happens. What changes and what stays the same in a restarted actor run?

 -  During restart you are loosing loop progress and  variables values. 
 -  Actor ID, input, default key-value store, dataset, request queue stay the same.



3. Why don't you usually need to add any special code to handle migrations in normal crawling/scraping? Is there a component that essentially solves this problem for you?

 - Migrations in normal run would be handled automatically and storage is persisted and this storage is handled across instances.

4. How can you intercept the migration event? How much time do you need after this takes place and before the actor migrates?

    -   Apify.events.on('migrating', data => {
        console.log('migration event: ' + data);
    });

    - 'migrating' event is emitted when the actor running on the Apify platform is going to be migrated to another worker server soon.

5. When would you persist data to a default key-value store and when would you use a named key-value store?

    - Default key-value store should be used when you don't need to share this store across noncontinuous actor chain (or between different actor runs/different actors).