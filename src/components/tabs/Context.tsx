import * as React from 'react';

const StateContext = React.createContext<IState | undefined>(undefined);
const DispatchContext = React.createContext<React.Dispatch<React.SetStateAction<IState>>>(() => null);

const useTabsState = () => {
	const context = React.useContext(StateContext);

	if(context === undefined) {
		throw new Error('useTabsState cannot be used outside of a TabsProvider!');
	}

	return context;
}

const useTabsDispatch = () => {
	const context = React.useContext(DispatchContext);

	if(context === undefined) {
		throw new Error('useTabsDispatch cannot be used outside of a TabsProvider!');
	}

	return context;
}

const TabsProvider: React.FunctionComponent = ({children}) => {
	const [state, setState] = React.useState<IState>({tabID: ""});

	return (
		<StateContext.Provider value={state}>
			<DispatchContext.Provider value={setState}>
				{children}
			</DispatchContext.Provider>
		</StateContext.Provider>
	)
};

interface IState {
	tabID: string
}

export {
	useTabsState,
	useTabsDispatch,
	TabsProvider
}