import * as React from 'react';
import { TabsProvider } from './components/tabs/Context';
import Tabs from './components/tabs/index';
import Weather from './components/weather/index';

export default function App() {
	return (
		<TabsProvider>
			<Tabs
				tabs={[
					{
						label: Weather.ContentIDs.Current
					},
					{
						label: Weather.ContentIDs.Forecast
					}
				]}/>
			<Weather />
		</TabsProvider>
	)
}