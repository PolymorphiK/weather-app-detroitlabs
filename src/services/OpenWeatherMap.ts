// This is overkill but I want to demonstrate my ability to read
// an API manual and write an API wrapper in a language (TypeScript/JavaScript in this instance)

class OpenWeatherAPI {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	public getAPIKey() : string {
		return this.apiKey;
	}
}

export default class OpenWeatherMap extends OpenWeatherAPI {
	private static _endpoint: string = "https://api.openweathermap.org/data/2.5";
	private _current: CurrentWeather;

	constructor(apiKey: string) {
		super(apiKey);

		this._current = new CurrentWeather(apiKey);
	}

	/**
	 * Gets the current weather API
	 */
	public current() : CurrentWeather {
		return this._current;
	}

	/**
	 * Constructs a link to be used to extract an icon from OpenWeatherMap. Use this
	 * in img.src for ease of icon displaying.
	 * 
	 * @param weather The weather data supplied in a response from OpenWeatherMap.
	 * @param iconSize The size of the icon to be used.
	 */
	public static icon(weather: IWeather, iconSize: IconSize = IconSize.Small) : string {
		return `http://openweathermap.org/img/wn/${weather.icon}@${iconSize}x.png`;
	}

	public static endpoint() : string {
		return OpenWeatherMap._endpoint;
	}
}

class CurrentWeather extends OpenWeatherAPI {
	/**
	 * Gets the current weather based on the city, state, and/or country code.
	 * 
	 * @param cityName The name of the city.
	 * @param units The units to be used see Units for more details.
	 * @param stateCode The state code used by OpenWeatherMap.
	 * @param countryCode The country code used by OpenWeatherMap.
	 */
	public async byCityName(
		cityName: string,
		units: Units = Units.imperial,
		stateCode: string = '',
		countryCode: string = '') : Promise<IResult<ICurrentWeather>> {
		let query = '';

		query += cityName;

		if(stateCode) query += ',' + stateCode;

		if(countryCode) query += ',' + countryCode

		try {
			const response = await fetch(OpenWeatherMap.endpoint() + `/weather?q=${query}` + '&units=' + units + '&appid=' + this.getAPIKey());
			const json = await response.json();
	
			return {
				error: response.status === 200 ? null : json,
				payload: response.status === 200 ? json : null
			};
		} catch(e) {
			return {
				error: {
					cod: "internal",
					message: e.message
				},
				payload: null
			}
		}
	}

	/**
	 * Gets the current weather by city id.
	 * 
	 * @param cityID City id used by OpenWeatherMap
	 * @param units The units to be used see Units for more details.
	 */
	public async byCityId(cityID: number, units: Units = Units.imperial) : Promise<IResult<ICurrentWeather>> {
		try {
			const response = await fetch(`${OpenWeatherMap.endpoint()}/weather?id=${cityID}&units=${units}&appid=${this.getAPIKey()}`);
			const json = await response.json();
	
			return {
				error: response.status === 200 ? null : json,
				payload: response.status === 200 ? json : null
			};
		} catch(e) {
			return {
				error: {
					cod: "internal",
					message: e.message
				},
				payload: null
			}
		}
	}

	/**
	 * Gets the current weather based on a Geolocation coordinate.
	 * 
	 * @param coord The latitude and longitude used to query against.
	 * @param units The units to be used see Units for more details.
	 */
	public async byGeoCoord(coord: ICoord, units: Units = Units.imperial) : Promise<IResult<ICurrentWeather>> {
		try {
			const response = await fetch(`${OpenWeatherMap.endpoint()}/weather?lat=${coord.lat}&lon=${coord.lon}&units=${units}&appid=${this.getAPIKey()}`);
			const json = await response.json();
	
			return {
				error: response.status === 200 ? null : json,
				payload: response.status === 200 ? json : null
			};
		} catch(e) {
			return {
				error: {
					cod: "internal",
					message: e.message
				},
				payload: null
			}
		}
	}

	/**
	 * 
	 * @param zip The zipcode.
	 * @param countryCode The country code used by OpenWeatherMap.
	 * @param units The units to be used see Units for more details.
	 */
	public async byZipCode(zip: Number, countryCode: string = 'us', units: Units = Units.imperial) : Promise<IResult<ICurrentWeather>> {
		try {
			const response = await fetch(`${OpenWeatherMap.endpoint()}/weather?zip=${zip},${countryCode}&units=${units}&appid=${this.getAPIKey()}`);
			const json = await response.json();
	
			return {
				error: response.status === 200 ? null : json,
				payload: response.status === 200 ? json : null
			};
		} catch(e) {
			return {
				error: {
					cod: "internal",
					message: e.message
				},
				payload: null
			}
		}
	}
}

export enum Units {
	standard = "standard",
	metric = "metric",
	imperial = "imperial"
}

export enum IconSize {
	Small = 2,
	Medium = 4
}

export interface IResult<T> {
	error: IError | null,
	payload: T | null
}

export interface IError {
	cod: string;
	message: string;
}

export interface ICurrentWeather {
	coord: ICoord;
	weather: Array<IWeather>;
	base: string;
	main: IMain;
	visibility: number;
	wind: IWind;
	clouds: IClouds;
	dt: number;
	sys: ISys;
	timezone: number;
	id: number;
	name: string;
	cod: number;
}

export interface ICoord {
	lon: number;
	lat: number;
}

export interface IWind {
	speed: number;
	deg: number;
}

export interface ISys {
	type: number;
	id: number;
	country: string;
	sunrise: number;
	sunset: number;
}

export interface IClouds {
	all: number;
}

export interface IWeather {
	id: number;
	main: string;
	description: string;
	icon: string;
}

export interface IMain {
	temp: number;
	feels_like: number;
	temp_min: number;
	temp_max: number;
	pressure: number;
	humidity: number;
}