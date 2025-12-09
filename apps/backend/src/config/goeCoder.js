const { logger } = require("@ims-systems-00/ims-core/lib/logger");
const NodeGeocoder = require("node-geocoder");
const options = {
  provider: "google",
  apiKey: process.env.GOOGLE_API_KEY,
  formatter: null,
};
const geocoder = NodeGeocoder(options);
exports.getGeoLocationFromAddress = async (address) => {
  try {
    const res = await geocoder.geocode(address);
    return res;
  } catch (err) {
    logger.error("geocode error: ", err);
    return []
  }
};
