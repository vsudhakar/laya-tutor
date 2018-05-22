import React from 'react';

import {renderTree} from '../scripts/renderer.jsx'
import {renderTreeHeaders} from '../scripts/renderer.jsx'

class FileInfoBar extends React.Component {
	render() {
		var filename = this.props.filepath;
		if (filename === '') {
			filename = 'No File'
		}
		return <div className="highlight-bar"> <p>{filename}</p> <p> Mode: <b>{this.props.mode}</b></p></div> 
	}
}

class HierarchyPanelComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data
		};
	}

	render() {
		var renderlist = [];

		var jsonData = JSON.parse(this.props.data);

		if (jsonData != null) {
			Object.entries(jsonData).forEach(([key, value]) => {
				// Render key
				var elem;
				switch(Number(this.props.level)) {
					case 1:
						elem = <h1>{key}</h1>;
						break;
					case 2:
						elem = <h2>{key}</h2>;
						break;
					case 3:
						elem = <h3>{key}</h3>;
						break;
					case 4:
						elem = <h4>{key}</h4>;
						break;
					default:
						elem = <h5>{key}</h5>
				}
				renderlist.push(elem);
				// Parse value
				if (Object.keys(value).length > 0) {
					// Recurse
					var valData = JSON.stringify(value);
					elem = <HierarchyPanelComponent data={valData} level={this.props.level+1} />;
					renderlist.push(elem);
				}
			});
		}

		return(
			<React.Fragment>
				{renderlist}
			</React.Fragment>
		);
	}
}

class NavigationPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
						filename: null,
						data: this.props.data,
						selecttext: 'Choose a file'
					};

		// Bind listeners
		this.handleFileUpdate = this.handleFileUpdate.bind(this);
		this.handleFileSelect = this.handleFileSelect.bind(this);
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	/* Event Listeners */
	handleFileUpdate(event) {
		event.preventDefault();

		if (this.fileInput.files.length == 0) {
			return null;
		}

		var file = this.fileInput.files[0];

		this.setState(prevState => ({
			filename: file.name
		}), () => this.props.renderHandler(file));
	}

	handleFileSelect() {
		var filename = this.fileInput.files[0].name;

		this.setState(prevState => ({
			selecttext: filename
		}));
	}

	render() {
		// Process navdata
		var contentdata = renderTree(JSON.parse(this.props.data), 1, []);
		var navdata = JSON.stringify(renderTreeHeaders(JSON.parse(this.props.data), 1));

		return (
			<div className="app-sidebar">
				<FileInfoBar filepath={this.state.filename} mode={this.props.appmode} />
				<form className="nav-form" onSubmit={this.handleFileUpdate}>
					<input
						type="file"
						id="file-input-select"
						className="button-fileselect"
						onChange={this.handleFileSelect}
						ref={input => {
						  this.fileInput = input;
						}}
					/>
					<label for="file-input-select">
						<i className="fas fa-upload"></i>
						&ensp;
						{this.state.selecttext}
					</label>
					<br />
					<button type="submit" className="button-render">
						<i className="fas fa-folder-open"></i>
						&ensp;
						Open
					</button>
				</form>
				<HierarchyPanelComponent data={navdata} level={1} />
			</div>
		)
	}
}

export default NavigationPanel;