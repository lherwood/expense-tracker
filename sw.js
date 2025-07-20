// Copied from dev-dist/sw.js for service worker registration at root

if (!self.define) {
  let registry = {};
  let nextDefineUri;
  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      new Promise(resolve => {
        if ("document" in self) {
          const script = document.createElement("script");
          script.src = uri;
          script.onload = resolve;
          document.head.appendChild(script);
        } else {
          nextDefineUri = uri;
          importScripts(uri);
          resolve();
        }
      })
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };
  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-e7681877'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();

  workbox.precacheAndRoute([
    { "url": "registerSW.js", "revision": "3ca0b8505b4bec776b69afdba2768812" },
    { "url": "index.html", "revision": "0.00vhrcfkq1c" }
  ], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html"), {
    allowlist: [/^\/$/]
  }));
  workbox.registerRoute(/^https:\/\/expense-tracker-zslu\.vercel\.app\/api\/.*/i, new workbox.NetworkFirst({
    "cacheName": "api-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 50,
      maxAgeSeconds: 86400
    })]
  }), 'GET');

  self.addEventListener('push', function(event) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Notification', body: event.data.text() };
    }
    const title = data.title || 'Expense Tracker';
    const options = {
      body: data.body || '',
      data: data.data || {},
      icon: '/icon-192.png',
      badge: '/icon-192.png'
    };
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  });

})); 