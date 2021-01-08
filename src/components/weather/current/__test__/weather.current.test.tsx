global.fetch = require('node-fetch');

import * as React from 'react';
import ReactDOM from 'react-dom';
import Current from '../index';

it("renderes w/o crashing", () => {
	const div = document.createElement("div");
	
	ReactDOM.render(
		<Current />,
		div);
	ReactDOM.unmountComponentAtNode(div);
});