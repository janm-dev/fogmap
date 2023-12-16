import "./style.scss";
import "leaflet/dist/leaflet.css";
import layers from "./layers.json";
import L from "leaflet";
import * as turf from "@turf/turf";

import { loadPoints, savePoints, geoToPoint, pointsToLatLng } from "./misc.ts";
import "./misc.ts";

const FOG_RADIUS = 0.5;

const Follow = L.Control.extend({
	options: {
		position: "topleft",
	},

	onAdd(_map: L.Map): HTMLElement {
		return L.DomUtil.create("fogmap-follow");
	},

	onRemove(_map: L.Map) {},
});

const maps = Object.fromEntries(
	layers.maps.map((l) => [
		`<img src="${l.url.replace(/\{[rsxyz]\}/gu, (m) =>
			(layers.icon as { [key: string]: { toString: () => string } })[
				m
			].toString()
		)}" class="fogmap-layer-icon" /> <span class="fogmap-layer-name">${
			l.name
		}</span>`,
		L.tileLayer(l.url, {
			crossOrigin: "anonymous",
			attribution: l.attribution,
			noWrap: true,
		}),
	])
);

const overlays = Object.fromEntries(
	layers.overlays.map((l) => [
		`<img src="${l.url.replace(/\{[rsxyz]\}/gu, (m) =>
			(layers.icon as { [key: string]: { toString: () => string } })[
				m
			].toString()
		)}" class="fogmap-layer-icon" /> <span class="fogmap-layer-name">${
			l.name
		}</span>`,
		L.tileLayer(l.url, {
			crossOrigin: "anonymous",
			attribution: l.attribution,
			noWrap: true,
		}),
	])
);

loadPoints();
savePoints(); // Try to save points to detect storage issues early
window.onunload = savePoints;
setInterval(savePoints, 30000);

const locationIcon = L.icon({
	iconUrl: "/location.svg",
	iconSize: [32, 32],
	iconAnchor: [16, 16],
});

window.fog = pointsToLatLng(window.points)
	.map(([lat, lon]) =>
		turf.buffer(turf.point([lon, lat]), FOG_RADIUS, {
			units: "kilometers",
		})
	)
	.reduce(turf.union);

window.map = L.map("map", {
	center: [0, 0],
	zoom: 2,
	layers: [Object.values(maps)[0]],
	zoomControl: false,
	doubleClickZoom: false,
	attributionControl: false,
});

const fogPane = window.map.createPane("fog");
fogPane.style.filter = "blur(10px)";

window.fogLayer = L.geoJSON([turf.mask(window.fog)] as any, {
	pane: "fog",
	style: {
		fillColor: "#ccc",
		fillOpacity: 0.95,
		weight: 0,
	},
});

window.fogLayer.addTo(window.map);

window.marker = L.marker([0, 0], {
	icon: locationIcon,
	alt: "",
	interactive: false,
}).addTo(window.map);

new Follow().addTo(window.map);
L.control.layers(maps, overlays, { position: "topleft" }).addTo(window.map);
L.control.zoom({ position: "topright" }).addTo(window.map);
L.control
	.attribution({
		position: "bottomright",
		prefix: `<a href="https://github.com/janm-dev/fogmap">Info and Source</a> | <a href="https://janm.dev/legal/privacy-policy">Privacy Policy</a> | Leaflet`,
	})
	.addTo(window.map);
L.control
	.scale({
		imperial: false,
		maxWidth: 300,
	})
	.addTo(window.map);

navigator.geolocation.watchPosition(
	(pos) => {
		console.debug(`Location update: ${JSON.stringify(geoToPoint(pos))}`);

		window.marker.setLatLng([pos.coords.latitude, pos.coords.longitude]);
		window.points.push(geoToPoint(pos));
		const lat = pos.coords.latitude;
		const lon = pos.coords.longitude;
		window.fog = turf.union(
			turf.buffer(turf.point([lon, lat]), FOG_RADIUS, {
				units: "kilometers",
			}),
			window.fog
		);

		const oldLayer = window.fogLayer;
		window.fogLayer = L.geoJSON([turf.mask(window.fog)] as any, {
			pane: "fog",
			style: {
				fillColor: "#ccc",
				fillOpacity: 0.95,
				weight: 0,
			},
		});

		window.fogLayer.addTo(window.map);
		oldLayer.remove();
	},
	console.warn,
	{
		enableHighAccuracy: true,
	}
);
