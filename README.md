# FogMap

A real-life map with fog of war

## Your Data

### Data that is collected and stays on your device / in your browser

- Your location
  - Latitude
  - Longitude
  - Altitude
  - Time
- App settings

This information can be exported in the app using the export feature in the settings

### Data that your browser / device sends to us

- Any data your browser sends when making an HTTP request
  - Your public IP address
  - Your browser's brand and version
  - Basic information about your operating system
  - Other similar data depending on your browser's configuration

### Data that your browser / device sends to others

- Any data your browser sends when making an HTTP request
  - see above
- The approximate location you are viewing on the map
  - This app only downloads map tiles that you are viewing, which necessarily requires sending information about *which* tiles to download. This is an inherent limitation of any online map software.
  - The accuracy of this location data is not very great (about a city block at best) and depends on zoom level

#### Who is "others"?

"Others" are tile map providers listed in `src/layers.json`, specifically:

- [Openstreetmap](https://www.openstreetmap.org/) at `tile.openstreetmap.org`
- [CARTO](https://carto.com/) at `*.basemaps.cartocdn.com`
- Esri/ArcGIS at `server.arcgisonline.com`
- [OpenSeaMap](https://www.openseamap.org/) at `tiles.openseamap.org`
- [OpenRailwayMap](https://www.openrailwaymap.org/) at `*.tiles.openrailwaymap.org`
- [Waymarked Trails](https://waymarkedtrails.org/) at `tile.waymarkedtrails.org`

## Attribution

Icons from [Google Fonts](https://fonts.google.com/icons), used under the terms of the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).

## [License](./LICENSE)

With the exception of the files listed above in [Attribution](#attribution), this program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License (`AGPL-3.0-or-later`) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
