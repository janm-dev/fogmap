/// A point in time and space
export interface Point {
	/// Timestamp in milliseconds since the UNIX epoch
	timestamp: number;
	/// Latitude in degrees north
	latitude: number;
	/// Longitude in degrees east
	longitude: number;
	/// Altitude above sea level in meters
	altitude: number | null;
	/// Accuracy of the latitude/longitude and altitude in meters
	accuracy: [number, number | null];
}

export const geoToPoint = (pos: GeolocationPosition): Point => {
	return {
		timestamp: pos.timestamp,
		latitude: pos.coords.latitude,
		longitude: pos.coords.longitude,
		altitude: pos.coords.altitude,
		accuracy: [pos.coords.accuracy, pos.coords.altitudeAccuracy],
	};
};

export const pointsToLatLng = (points: Point[]): [number, number][] => {
	return points.map((p) => [p.latitude, p.longitude]);
};

export const savePoints = () => {
	try {
		localStorage.setItem("points", JSON.stringify(window.points));
		console.info("points saved");
	} catch (e) {
		alert(`Error while saving points: ${e}`);
	}
};

export const loadPoints = () => {
	window.points = JSON.parse(localStorage.getItem("points") || "[]");

	if (window.points.length === 0) {
		window.points.push({
			timestamp: 0,
			latitude: 0,
			longitude: 0,
			altitude: null,
			accuracy: [0, null],
		});
	}

	console.info("points loaded");
};

const DEFAULT_SETTINGS: AppSettings = {
	startPosition: { lat: 0, lon: 0, zoom: 3 },
};

export const saveSettings = () => {
	try {
		localStorage.setItem("settings", JSON.stringify(window.settings));
		console.info("settings saved");
	} catch (e) {
		alert(`Error while saving settings: ${e}`);
	}
};

export const loadSettings = () => {
	window.settings = {
		...DEFAULT_SETTINGS,
		...JSON.parse(localStorage.getItem("settings") || "{}"),
	};

	console.info("settings loaded");
};

export const exportData = () => {
	const data = JSON.stringify(
		{
			settings: window.settings,
			points: window.points,
		},
		null,
		"\t"
	);

	const blob = new Blob([data], { type: "application/json" });

	window.open(URL.createObjectURL(blob));

	console.info("data exported");
};

export const importData = (blob: Blob) => {
	try {
		blob
			.text()
			.then((data) => {
				const { settings, points } = JSON.parse(data);
				window.settings = settings;
				saveSettings();
				window.points = points;
				savePoints();
			})
			.then(() => {
				console.info("data imported");
				window.location.reload();
			});
	} catch (e) {
		alert(`Error importing data: ${e}`);
	}
};

export interface AppSettings {
	startPosition: { lat: number; lon: number; zoom: number };
}

declare global {
	interface Window {
		map: L.Map;
		fog: any;
		fogLayer: L.GeoJSON;
		marker: L.Marker;
		points: Point[];
		settings: AppSettings;
	}
}
