import * as React from 'react';
import ReactDOM from 'react-dom';
import Tabs from '../index';
import {TabsProvider} from '../Context';

it("renderers w/o crashing", () => {
	const div = document.createElement("div");
	ReactDOM.render(
		<TabsProvider>
			<Tabs
				tabs={[
					{
						label: 'Current'
					},
					{
						label: 'Forecast'
					}
				]}/>
		</TabsProvider>,
		div);
	ReactDOM.unmountComponentAtNode(div);
});

it("crashes - No TabsProvider", () => {
	const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	expect(() => {
		const div = document.createElement("div");

		ReactDOM.render(
			<Tabs tabs={[
				{
					label: 'Current',
				},
				{
					label: 'Forecast'
				}
			]} />,
			div);
		ReactDOM.unmountComponentAtNode(div);
	}).toThrow("useTabsState cannot be used outside of a TabsProvider!");
	consoleSpy.mockRestore();
});

it("crashes - No Tabs", () => {
	const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	expect(() => {
		const div = document.createElement("div");

		ReactDOM.render(
			<TabsProvider>
				<Tabs tabs={[]} />
			</TabsProvider>,
			div);
		ReactDOM.unmountComponentAtNode(div);
	}).toThrow("Cannot read property 'label' of undefined");
	consoleSpy.mockRestore();
});