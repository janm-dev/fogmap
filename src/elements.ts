import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import L from "leaflet";
import { exportData, importData } from "./misc";

const PAN_DURATION = 1;
const PAN_LINEARITY = 0.2;

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
			background-size: 32px;
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

@customElement("fogmap-settings")
export class FogMapSettings extends LitElement {
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
			background-image: url(/settings.svg);
			background-size: 32px;
			background-position: 50% 50%;
			background-repeat: no-repeat;
		}
	`;

	render() {
		return html`
			<a
				@click=${() => {
					window.map.openPopup(
						"<fogmap-popup></fogmap-popup>",
						window.map.getCenter(),
						{
							autoClose: true,
							closeButton: true,
							closeOnClick: false,
							keepInView: true,
							interactive: true,
						}
					);
				}}
				class="button"
				href="#"
				title="Settings"
				role="button"
			></a>
		`;
	}
}

@customElement("fogmap-popup")
export class FogMapPopup extends LitElement {
	static styles = css`
		:host {
			display: block;
			width: 240px;
		}

		.outer {
			margin: 20px;
		}

		.form-elem {
			display: block;
			width: 200px;
		}
	`;

	render() {
		return html`
			<button class="outer form-elem" @click=${exportData}>Export Data</button>

			<form
				class="outer"
				@submit=${(e: Event) => {
					e.preventDefault();
					const data = (<HTMLInputElement | undefined | null>(
						this.shadowRoot?.getElementById("file-import")
					))?.files?.item(0);
					if (data) {
						importData(data);
					} else {
						alert("Error importing data, are you sure you selected a file?");
					}
				}}
			>
				<input
					class="form-elem"
					id="file-import"
					type="file"
					accept="application/json"
				/>
				<input class="form-elem" type="submit" value="Import Data" />
			</form>
		`;
	}
}

export const Follow = L.Control.extend({
	options: {
		position: "topleft",
	},

	onAdd(_map: L.Map): HTMLElement {
		return L.DomUtil.create("fogmap-follow");
	},

	onRemove(_map: L.Map) {},
});

export const Settings = L.Control.extend({
	options: {
		position: "topleft",
	},

	onAdd(_map: L.Map): HTMLElement {
		return L.DomUtil.create("fogmap-settings");
	},

	onRemove(_map: L.Map) {},
});
