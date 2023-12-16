import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

const PAN_DURATION = 1;
const PAN_LINEARITY = 0.2;

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

@customElement("fogmap-follow")
export class FogMapFollow extends LitElement {
	static styles = css`
		:host {
			background-color: #fff;
			color: #000;
			border-radius: 5px;
			border: 2px solid rgba(0, 0, 0, 0.2);
			background-clip: padding-box;
			width: 44px;
			height: 44px;
			display: block;
			text-align: default;
			text-decoration: none;
			margin: 10px 0 0 10px;
			padding: 0;
		}

		.button {
			display: block;
			width: 44px;
			height: 44px;
			background-image: url(/location.svg);
			background-position: 50% 50%;
			background-repeat: no-repeat;
		}
	`;

	render() {
		return html`
			<a
				@click=${() => {
					window.map.setZoom(14);
					window.map.panTo(window.marker.getLatLng(), {
						animate: true,
						duration: PAN_DURATION,
						easeLinearity: PAN_LINEARITY,
					});
				}}
				class="button"
				href="#"
				title="Follow"
				role="button"
			></a>
		`;
	}
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
	} catch (e) {
		alert(`Error while storing points: ${e}`);
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
};

declare global {
	interface Window {
		map: L.Map;
		fog: any;
		fogLayer: L.GeoJSON;
		marker: L.Marker;
		points: Point[];
	}
}
