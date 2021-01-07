import * as React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './generated.tailwind.css';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("react-root")
)