global.fetch = require('node-fetch');

import OpenWeatherMap, { ICoord } from '../OpenWeatherMap';

const APP_ID = "773c419f4aa7b96427bdebdbc70b20bf";
const GEO_LOC_WEST_SACRAMENTO: ICoord = {
	lat: 38.634308,
	lon: -121.517639
}

test('No API Key', async () => {
	const owm = new OpenWeatherMap("wrong-api-key");
	const result = await owm.current().byCityName("Sacramento");

	expect(result.error).not.toBeNull();
});

test("CurrentWeather - By CityName", async () => {
	const owm = new OpenWeatherMap(APP_ID);
	const result = await owm.current().byCityName("Sacramento");

	expect(result.payload?.name).toBe("Sacramento");
});

test("CurrentWeather - By Geolocation", async () => {
	const owm = new OpenWeatherMap(APP_ID);
	const result = await owm.current().byGeoCoord(GEO_LOC_WEST_SACRAMENTO);

	expect(result.payload?.name).toBe("West Sacramento");
});

test("ForecastWeather - By CityName", async () => {
	const owm = new OpenWeatherMap(APP_ID);
	const result = await owm.forecast5().byCityName("Sacramento");

	expect(result.payload?.city.name).toBe("Sacramento");
});

test("ForecastWeather - By Geolocation", async () => {
	const owm = new OpenWeatherMap(APP_ID);
	const result = await owm.forecast5().byGeoCoord(GEO_LOC_WEST_SACRAMENTO);

	expect(result.payload?.city.name).toBe("West Sacramento");
})