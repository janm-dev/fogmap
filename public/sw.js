const CACHE = "v1";

const fetchAndCache = async (req) => {
	const res = await fetch(req.clone(), {
		mode: "cors",
		credentials: "omit",
	});

	const cache = await caches.open(CACHE);
	await cache.add(req, res.clone());
	console.info(`added to cache: ${req.url}`);
	return res;
};

const activateHandler = async () => {
	console.info("service worker activated");
};

const installHandler = async () => {
	const cache = await caches.open(CACHE);
	await cache.addAll(["/", "/sw.js", "/site.webmanifest"]);
	console.info("service worker installed");
};

const fetchHandler = async (event) => {
	const req = event.request;
	const cache = await caches.open(CACHE);

	const cached = await cache.match(req.clone());
	if (cached) {
		console.debug(`fetched from cache: ${req.url}`);
		event.waitUntil(fetchAndCache(req));
		return cached;
	}

	try {
		return await fetchAndCache(req);
	} catch (e) {
		console.warn(`error fetching ${req.url}: ${e}`);
		return new Response(`network error: ${e}`, {
			status: 408,
			headers: { "Content-Type": "text/plain" },
		});
	}
};

self.addEventListener("activate", (event) => {
	event.waitUntil(activateHandler());
});

self.addEventListener("install", (event) => {
	event.waitUntil(installHandler());
});

self.addEventListener("fetch", (event) => {
	event.respondWith(fetchHandler(event));
});
