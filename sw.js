const CACHE_NAME =
  "heidi-monsen-pilates-v2";


self.addEventListener(
  "install",
  function(event) {

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches
        .keys()
        .then(function(cacheNames) {

          return Promise.all(

            cacheNames.map(
              function(cacheName) {

                if (
                  cacheName !== CACHE_NAME
                ) {

                  return caches.delete(
                    cacheName
                  );

                }

              }
            )

          );

        })
        .then(function() {

          return self.clients.claim();

        })

    );

  }
);


self.addEventListener(
  "fetch",
  function(event) {

    if (
      event.request.method !== "GET"
    ) {

      return;

    }


    /*
      HTML pages:
      always try the internet first.

      This prevents old versions of the app
      getting stuck on the user's phone.
    */

    if (
      event.request.mode === "navigate"
    ) {

      event.respondWith(

        fetch(event.request)

          .then(function(response) {

            return response;

          })

          .catch(function() {

            return caches.match(
              event.request
            );

          })

      );

      return;

    }


    /*
      Other files:
      network first, then cache.
    */

    event.respondWith(

      fetch(event.request)

        .then(function(response) {

          const copy =
            response.clone();


          caches
            .open(CACHE_NAME)
            .then(function(cache) {

              cache.put(
                event.request,
                copy
              );

            });


          return response;

        })

        .catch(function() {

          return caches.match(
            event.request
          );

        })

    );

  }
);
