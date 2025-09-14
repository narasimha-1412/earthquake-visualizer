import axios from "axios";

const USGS_API_BASE = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const USGS_FEED_BASE =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary";

export class EarthquakeAPI {
  // Get earthquakes from the last 24 hours
  static async getTodayEarthquakes() {
    try {
      const response = await axios.get(`${USGS_FEED_BASE}/all_day.geojson`);
      return response.data;
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      throw error;
    }
  }

  // Get earthquakes from the last week
  static async getWeekEarthquakes() {
    try {
      const response = await axios.get(`${USGS_FEED_BASE}/all_week.geojson`);
      return response.data;
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      throw error;
    }
  }

  // Get earthquakes with custom parameters
  static async getCustomEarthquakes(params) {
    try {
      const response = await axios.get(USGS_API_BASE, {
        params: {
          format: "geojson",
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      throw error;
    }
  }
}
