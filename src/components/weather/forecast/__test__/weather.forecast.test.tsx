global.fetch = require('node-fetch');

import * as React from 'react';
import ReactDOM from 'react-dom';
import Forecast from '../index';

it("renderes w/o crashing", () => {
	const div = document.createElement("div");
	
	ReactDOM.render(
		<Forecast />,
		div);
	ReactDOM.unmountComponentAtNode(div);
});