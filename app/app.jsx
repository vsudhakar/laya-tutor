import React from 'react';
import ReactDOM from 'react-dom';

import fs from 'fs';
import path from 'path';

let currappmode = 'Render';

/* ENUMS */
var TAALAMS = Object.freeze({
	"eka": {
		id: 0,
		name: "Eka"
	},
	"roopaka": {
		id: 1,
		name: "roopaka"
	},
	"triputa": {
		id: 2,
		name: "tripuTa"
	},
	"matya": {
		id: 3,
		name: "matya"
	},
	"jhampa": {
		id: 4,
		name: "jhampa"
	},
	"ata": {
		id: 5,
		name: "aTa"
	},
	"dhruva": {
		id: 6,
		name: "dhruva"
	}
});

/* Default Render Settings */

let DEFAULT_TAALAM = TAALAMS.triputa
let DEFAULT_JAATHI = 4;
let DEFAULT_KAALAM = 1;
let DEFAULT_NADAI  = 4;

var GLOBAL_TAALAM = JSON.stringify(DEFAULT_TAALAM);
var GLOBAL_JAATHI = DEFAULT_JAATHI;
var GLOBAL_KAALAM = JSON.stringify(DEFAULT_KAALAM);
var GLOBAL_NADAI  = JSON.stringify(DEFAULT_NADAI);

console.log("talam:");
console.log(GLOBAL_TAALAM);


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

		this.state = {
			taalam:  this.props.taalam,
			jaathi:  this.props.jaathi,
			kaalam:  this.props.kaalam,
			nadai:   this.props.nadai,

			content: this.props.content
		};
	}

	render() {
		var loopStruct = [];

		/* Switch for Taalam */
		switch (this.state.taalam) {
			// TODO
			case JSON.stringify(TAALAMS.roopaka):
				//structure: 0 1
				loopStruct = [2, Number(this.state.jaathi)];
				break;
			default: 		// triputa taalam
				// structure 1 0 0
				loopStruct = [this.state.jaathi, 2, 2];
				break;
		}

		/* Group content into containers */
		var i = 0;
		var j = 0;	// cycle through parts of talam
		var k = 0;  // cycle through each beat of each part
		var container = [];
		var curr = [];
		var containerWidth = (loopStruct[j]/1.)*100;
		var containerStyle = {
			width: '100%'
		};
		while (i < this.state.content.length) {
			var beatLen = loopStruct[j];
			if (k == beatLen) {
				// Shift to next beat
				k = 0;
				j += 1;
				// Save and clear curr into container
				container.push(<ContainerComponent content={curr} style={containerStyle} />);
				curr = [];
				/*if (j == loopStruct.length) {
					// Save and clear curr into container
					j = 0;
				}*/
				j = j%loopStruct.length;
			}

			// Insert into curr
			curr.push(this.state.content[i]);

			i += 1;
			k += 1;

		}

		// Save curr into container
		//container.push(<ContainerComponent content={curr} style={containerStyle} />);

		/*return (
			<React.Fragment>
			<p>{loopStruct}</p>
			<p>{JSON.stringify(this.state.taalam)}</p>
			<p>{JSON.stringify(this.state.jaathi)}</p>
			<p>{JSON.stringify(this.state.kaalam)}</p>
			</React.Fragment>
		)*/

		return (
			<div className="paragraph">
				{container}
			</div>
		)
	}
}

class ContainerComponent extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="textContainer" style={this.props.style}>
				{this.props.content}
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
			<div className="text">{this.props.text}</div>
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
						console.log("Using talam: ");
						console.log(GLOBAL_TAALAM);
						content.push(<ParagraphComponent content={parContent} taalam={GLOBAL_TAALAM} jaathi={GLOBAL_JAATHI} kaalam={GLOBAL_KAALAM} nadai={GLOBAL_NADAI} />);
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
				console.log("Using talam: ");
				console.log(GLOBAL_TAALAM);
				content.push(<ParagraphComponent content={parContent} taalam={GLOBAL_TAALAM} jaathi={GLOBAL_JAATHI} kaalam={GLOBAL_KAALAM} nadai={GLOBAL_NADAI} />);
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

