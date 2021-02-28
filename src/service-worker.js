import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({request}) => request.destination !== 'script' && request.destination !== "document",
  new CacheFirst()
);

registerRoute(
  ({ request }) => request.destination === "script" || request.destination === "document",
  process.env.NODE_ENV === "production" ? new StaleWhileRevalidate() : new NetworkFirst()
);