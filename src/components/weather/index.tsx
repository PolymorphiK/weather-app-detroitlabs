import * as React from 'react';
import { useTabsState } from '../tabs/Context';
import Current from './current/index';
import Forecast from './forecast/index';

export default function Weather() {
	const tabsState = useTabsState();
	
	return (
		(() => {
			switch(tabsState.tabID) {
				case Weather.ContentIDs.Current: return <Current />
				case Weather.ContentIDs.Forecast: return <Forecast />
			}

			return null;
		})()
	)
}

const ContentIDs = {
	Current: 'Current',
	Forecast: 'Forecast'
};

Weather.ContentIDs = ContentIDs;