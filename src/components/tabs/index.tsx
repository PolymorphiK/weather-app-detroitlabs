import * as React from 'react';
import { useTabsDispatch, useTabsState } from './Context';

export default function Tabs({tabs} : ITabsProps) {
	const tabsState = useTabsState();
	const tabsDispatch = useTabsDispatch();

	React.useEffect(() => {
		if(!tabsState.tabID) {
			tabsDispatch({
				tabID: tabs[0].label
			});
		}
	}, []);


	return (
		<nav className="flex justify-center py-4">
			{
				tabs.map((tab, index) => {
					return (
						<button
							key={index}
							className={`focus:outline-none w-32 border-b ${tab.label === tabsState.tabID ? 'border-white text-white' : 'border-black text-black'}`}
							onClick={() => tabsDispatch({tabID: tab.label})}>
								{tab.label}
						</button>
					)
				})
			}
		</nav>
	)
}

interface ITabsProps {
	tabs: Array<ITab>
}

interface ITab {
	label: string;
}