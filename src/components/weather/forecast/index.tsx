import * as React from 'react';
import dayjs from 'dayjs';
import OpenWeatherMap, { IForecast, IForecastResult, IResult } from '../../../services/openWeatherMap/OpenWeatherMap';

const owm = new OpenWeatherMap("773c419f4aa7b96427bdebdbc70b20bf");

export default function Forecast() {
	const [state, setState] = React.useState<IResult<IForecastResult>>({error: null, payload: null});

	const getCurrentWeather = () => {
		// Check Geolocation is supported
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					// Attempt to fetch the current weather by lat & lon.
					setState(await owm.forecast5().byGeoCoord({
						lat: position.coords.latitude,
						lon: position.coords.longitude
					}));
				},
				(error) => {
					// We might have a network error
					// we will handle it here, in case there is a timeout
					// recovery is dependant on the browser
					// EDGE seems to struggle to recover, FireFox seems fine.
					setState({
						error: {
							cod: error.code.toString(),
							message: error.message
						},
						payload: null
					});
			}, {
				timeout: 10000
			});
		} else {
			// Throw an error
			setState({
				error: {
					cod: "Error",
					message: "Geolocation is not supported on your device"
				},
				payload: null
			})
		}
	};

	React.useEffect(() => {
		// We want to repeat this process forever
		// we will update the current weather every 30 seconds.
		const id = setInterval(getCurrentWeather, 1000 * 30.0);

		getCurrentWeather();

		return () => {
			// When we unmount, kill the interval process
			clearInterval(id);
		}
	}, []);

	if(state.error) return <Message message={state.error.message}/>

	return (
		<div className="flex flex-col space-y-4 w-full h-full self-center text-white">
			{
				state.payload ?
					subdivide(state.payload.list, 8).map((reports, index) => {
						return <ForecastDay key={index} reports={reports} />
					})
				: <Message message={"Loading..."} />
			}
		</div>
	)
}

const ForecastDay = ({reports} : {reports: Array<IForecast>}) => {
	const date = dayjs(reports[0].dt_txt);

	return (
		<div className="bg-blue-300 px-4 py-2 rounded-lg shadow-md">
			<h2 className="text-sm">{`${date.format("MM-DD")}`}</h2>
			<div className="flex mt-3">
				{
					reports.map((report, index) => {
						return <SimpleWeatherDisplay key={index} weather={report} />
					})
				}
			</div>
		</div>
	);
}

const SimpleWeatherDisplay = ({weather} : {weather: IForecast}) => {
	const date = dayjs(weather.dt_txt);

	return (
		<div className="flex-grow flex flex-col items-center space-y-2">
			{weather.main.feels_like}&deg;F
			<img className="w-8 h-8" src={OpenWeatherMap.icon(weather.weather[0])} alt="null"/>
			<label className="flex w-full space-x-1">
				<span>{date.format('hh:mm')}</span>
				<span>{date.hour() < 12 ? 'AM' : 'PM'}</span>
			</label>
		</div>
	)
}

const Message = ({message} : {message: string}) => {
	return (
		<div className="self-center text-black">
			{message}
		</div>
	)
}

const subdivide = <T extends unknown>(items: Array<T>, size: number) : Array<Array<T>> => {
	const maxGroups = items.length / size;
	const result = [];

	for(let i = 0; i < maxGroups; ++i) {
		const group = [];

		for(let j = size * i; j < size * i + size; ++j) {
			group.push(items[j]);
		}

		result.push(group);
	}

	if(maxGroups * size < items.length) {
		const group = [];

		for(let i = maxGroups * size; i < items.length; ++i) {
			group.push(items[i]);
		}

		result.push(group);
	}


	return result;
}