const axios = require("axios");

async function geocodeLocation(place) {
  const apiKey = process.env.MAP_KEY; // put your key in .env
  const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(place)}.json?key=${apiKey}`;

  const response = await axios.get(url);

  if (response.data.features.length === 0) {
    throw new Error("No results found for that location");
  }

  const geojson = response.data.features[0].geometry;
  // geojson.coordinates.re verse(); // ✅ reverses [lng, lat] → [lat, lng]

  return geojson;;
}

module.exports = geocodeLocation;