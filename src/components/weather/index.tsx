import * as React from 'react';
import { useTabsState } from '../tabs/Context';
import Current from './current/index';
import Forecast from './forecast/index';

export default function Weather() {
	const tabsState = useTabsState();
	
	return (
		<div
			style={{
				minHeight: "24rem"
			}}
			className="bg-white rounded-lg max-w-3xl mx-auto px-8 py-4 flex">
			{
				(() => {
					switch(tabsState.tabID) {
						case Weather.ContentIDs.Current: return <Current />
						case Weather.ContentIDs.Forecast: return <Forecast />
					}
		
					return null;
				})()
			}
		</div>
	)
}

const ContentIDs = {
	Current: 'Current',
	Forecast: 'Forecast'
};

Weather.ContentIDs = ContentIDs;