import * as React from 'react';
import OpenWeatherMap, { IconSize, ICurrentWeather, IResult }  from '../../../services/openWeatherMap/OpenWeatherMap';

// To make it clear, I would never do this I would use a proxy.
// Given that you might expect this know I know this is terrible
// the number of times I've taken keys from production websites so I can
// learn how an API works is crazy high.
// I could do security through obscurity but that is beyond the scope.
const owm = new OpenWeatherMap("773c419f4aa7b96427bdebdbc70b20bf");

export default function Current() {
	const [state, setState] = React.useState<IResult<ICurrentWeather>>({error: null, payload: null});

	const getCurrentWeather = () => {
		// Check Geolocation is supported
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					// Attempt to fetch the current weather by lat & lon.
					setState(await owm.current().byGeoCoord({
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

	return(
		<div className="flex items-center w-full h-full self-center">
			<section className="max-w-2xl mx-auto">
				{
					// IEFE
					(() => {
						// If there is an error, notify the user...
						if(state.error) return <Message message={state.error.message} />

						// We might just be waiting for the payload to arrive
						// let them know we are loading...
						if(!state.payload) return <Message message="Loading..." />

						// Display the weather information based on the payload
						// We will be extracting the first element because the documention
						// is not clear on when i should iterate, though it does mention
						// the first element is the one with the highest weight so let's go with that.
						return (
							<section className="flex flex-col items-center">
								<div className="flex items-center">
									<img src={OpenWeatherMap.icon(state.payload.weather[0], IconSize.Medium)} alt="weather icon"/>
									<h2 className="text-5xl">{state.payload.main.temp}&deg;F</h2>
								</div>
								<label className="block text-center text-2xl tracking-wide">{state.payload.name}</label>
								<p className="py-2 text-black text-opacity-50">
									{state.payload.weather[0].description}
								</p>
							</section>
						)
					})()
				}
			</section>
		</div>
	)
}

const Message = ({message}: {message: string}) => {
	return (
		<div>
			{message}
		</div>
	)
};