import React from 'react';

import {renderTree} from '../scripts/renderer.jsx'


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
		var content = [];
		if (this.props.data !== null) {
			content = renderTree(JSON.parse(this.props.data), 1, []);
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