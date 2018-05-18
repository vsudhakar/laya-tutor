import React from 'react';
import ReactDOM from 'react-dom';

import fs from 'fs';
import path from 'path';

let currappmode = 'Render';

/* Builder Components */
class HeaderComponent extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		if (this.props.level == 1) {
			return (
				<h1>{this.props.text}</h1>
			);
		} else if (this.props.level == 2) {
			return (
				<h2>{this.props.text}</h2>
			);
		} else if (this.props.level == 3) {
			return (
				<h3>{this.props.text}</h3>
			);
		} else if (this.props.level == 4) {
			return (
				<h4>{this.props.text}</h4>
			);
		} else {
			return (
				<u>{this.props.text}</u>
			);
		}
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

class ParagraphComponent extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="paragraph">
			<React.Fragment>
				{this.props.content}
			</React.Fragment>
			</div>
		)
	}
}

class TextComponent extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<p className="text">{this.props.text}</p>
		);
	}
}

class FileInfoBar extends React.Component {
	render() {
		var filename = this.props.filepath;
		if (filename === '') {
			filename = 'No File'
		}
		return <div className="highlight-bar"> <p>{filename}</p> <p> Mode: <b>{this.props.mode}</b></p></div> 
	}
}

class LayaRenderPanel extends React.Component {
	render() {
		return (
			<h1> Lesson </h1>
		);
	}
}

/* Helper functions */
var lang = ['#', '\n', ' ', 'THA', 'DI', 'THOM', 'NUM', 'KA', 'NA', 'THAM', 'RI', 'KI', 'TA', ',', 'GI'];

function cleanUpperText(str) {
	if (str.length == 0) {
		return str
	}
	else {
		var cleanStr = '';
		cleanStr += str[0];
		for (var i = 1; i < str.length; i++) {
			cleanStr += str[i].toLowerCase();
		}
		return cleanStr;
	}
}

function renderTreeHeaders(obj, currlevel) {
	var data = {}
	console.log("Data: ");
	console.log(obj);

	if (Object.prototype.toString.call(obj) === '[object Object]') {
		Object.entries(obj).forEach(([key, value]) => {
			// Push key with value
			data[key] = renderTreeHeaders(value, currlevel+1);
		});
	} else {
		if (Object.prototype.toString.call(obj) === '[object Array]') {
			// Iterate over array
			for (var o of obj) {
				if (Object.prototype.toString.call(o) === '[object Object]') {
					// Recurse

					Object.entries(o).forEach(([key, value]) => {
						// Push key with value
						data[key] = renderTreeHeaders(value);
					});
				} else {
					// Do not need values
					continue;
				}
			}
		}
	}

	console.log("Final Data");
	console.log(data);

	return data;
}

function renderTree(obj, currlevel, content) {
	if (Object.prototype.toString.call(obj) === '[object Object]') {
		Object.entries(obj).forEach(([key, value]) => {
			// Render header
			content.push(<HeaderComponent text={key.replace(/['"]+/g, '')} level={currlevel}/>);
			// Recurse
			content = renderTree(value, currlevel, content);
		});
	} else {
		if (Object.prototype.toString.call(obj) === '[object Array]') {
			// Iterate over array
			var parContent = [];
			for (var o of obj) {
				if (Object.prototype.toString.call(o) === '[object Object]') {
					// Recurse
					if (parContent.length >  0) {
						content.push(<ParagraphComponent content={parContent} />);
						parContent = [];
					}
					content = renderTree(o, currlevel+1, content);
				} else {
					// Decode
					o = Number(o);
					var speed = 0;
					if (o < -1) {
						o = o*-1 - 2;
						speed = 1;
					}
					// Render
					var oToText
					if (o == -1) {
						oToText = '!';
					} else {
						oToText = lang[o];
						oToText = cleanUpperText(oToText);
					}
					//content.push(<TextComponent text={oToText} />);
					parContent.push(<TextComponent text={oToText} />);
				}
			}
			if (parContent.length >  0) {
				content.push(<ParagraphComponent content={parContent} />);
				parContent = [];
			}
		}
	}
	return content;
}

/* App Components */
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};

		// Bind event handlers
		this.crossComponentUpdate = this.crossComponentUpdate.bind(this);
		this.updateContent = this.updateContent.bind(this);
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

	render() {
		return (
			<React.Fragment>
				<NavigationPanel renderHandler={this.crossComponentUpdate} data={this.state.data} appmode={this.props.appmode} />
				<ContentPanel data={this.state.data} />
			</React.Fragment>
		)
	}
}

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

ReactDOM.render(
	<App appmode={currappmode} />,
	document.getElementById('app-container')
)

