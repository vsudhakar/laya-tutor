import React from 'react';

import {renderTree} from '../scripts/renderer.jsx'

/* Import global variables */
import {resetTalaCounters} from './Paragraph.jsx';


class ContentPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}	

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		// Parse data
		resetTalaCounters();
		console.log("Kaalam in Control Panel: " + this.props.kaalam);
		var content = [];
		if (this.props.data !== null) {
			content = renderTree(JSON.parse(this.props.data), 1, [], this.props.taalam, this.props.kaalam);
		}
		return (
			<div className="app-main">
				<React.Fragment>
				{content}
				</React.Fragment>
			</div>
		)
	}
}

export default ContentPanel;