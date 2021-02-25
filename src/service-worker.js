import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({request}) => request.destination !== 'script' && request.destination !== "document",
  new CacheFirst()
);

registerRoute(
  ({ request }) => request.destination === "script" || request.destination === "document",
  new StaleWhileRevalidate()
);