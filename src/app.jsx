import React from 'react';
import ReactDOM from 'react-dom';

import fs from 'fs';
import path from 'path';

/* Import Components */
import NavigationPanel from './components/NavigationPanel.jsx';
import ContentPanel from './components/ContentPanel.jsx';

/* Import Constants */
import {TAALAMS} from './constants/AppConstants.js';

/* App Components */
export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null,
			taalam: TAALAMS.triputa.name,
			kaalam: 1,
			jaathi: null,
			nadai: null
		};

		// Bind event handlers
		this.crossComponentUpdate = this.crossComponentUpdate.bind(this);
		this.updateContent = this.updateContent.bind(this);
		this.renderSettingsUpdate = this.renderSettingsUpdate.bind(this);
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	/* Event Handlers */
	crossComponentUpdate(blob) {
		// Get data from JSON file blob
		var reader = new FileReader();
		var parent = this;
		reader.onload = this.updateContent;
		reader.onerror = function(event) {
			// Handle file read error
			alert('File is invalid!');
		}
		reader.readAsText(blob);
	}

	updateContent(event) {
		this.setState(prevState => ({
			data: JSON.stringify(JSON.parse(event.target.result))
		}));
	}

	renderSettingsUpdate(taalamNew, kaalamNew, jaathiNew, nadaiNew) {
		this.setState(prevState => ({
			taalam: taalamNew,
			kaalam: kaalamNew,
			jaathi: jaathiNew,
			nadai:  nadaiNew
		}), function() {
			console.log("Updated");
			console.log(taalamNew);
			console.log(kaalamNew)
		});
	}

	render() {
		return (
			<React.Fragment>
				<NavigationPanel renderHandler={this.crossComponentUpdate} settingsHandler={this.renderSettingsUpdate} taalam={this.state.taalam} kaalam={this.state.kaalam} data={this.state.data} appmode={this.props.appmode} />
				<ContentPanel data={this.state.data} taalam={this.state.taalam} kaalam={this.state.kaalam}/>
			</React.Fragment>
		)
	}
}

