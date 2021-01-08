import * as React from 'react';
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

	if(!state.payload) return <Message message={"Loading..."} />;

	return (
		<div>
			{
				subdivide(state.payload.list, 8).map((reports, index) => {
					return <ForecastDay key={index} reports={reports} />
				})
			}
		</div>
	)
}

const ForecastDay = ({reports} : {reports: Array<IForecast>}) => {
	return (
		<div className="bg-white">
			{
				reports.map((report, index) => {
					return <SimpleWeatherDisplay key={index} weather={report} />
				})
			}
		</div>
	);
}

const SimpleWeatherDisplay = ({weather} : {weather: IForecast}) => {
	return (
		<div>
			{weather.main.feels_like}
		</div>
	)
}

const Message = ({message} : {message: string}) => {
	return (
		<div>
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