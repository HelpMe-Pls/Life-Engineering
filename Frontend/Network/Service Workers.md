- Using a Service worker you can easily set an app up to use cached assets first, thus providing a default experience even when *offline*, before then getting more data from the network (commonly known as [Offline First](https://offlinefirst.org/))
- To run code using service workers, you'll need to serve your code via HTTPS (or `localhost`)

## Basic architecture
1. The service worker URL is fetched and registered via [`serviceWorkerContainer.register()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
2. If successful, the service worker is executed in a [`ServiceWorkerGlobalScope`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope)
3. Installation of the worker is attempted when service worker-controlled pages are accessed subsequently. An Install event is always the first one sent to a service worker, making everything available for use offline.
4. When the `oninstall` handler completes, it then receives an activate event. The primary use of `onactivate` is for cleanup of resources used in previous versions of a service worker script.
5. The Service worker will now control pages, but only those opened after the `register()` is successful.

- SW flow:
![[SW life cycle.png]]

- SW events:
![[SW Events.png]]

