import React from 'react';

/* Import constants */
import {TAALAMS} from '../constants/AppConstants.js';

/* Import Variables */
var storeAnga = 0;
var storeAkshara = 0;
var storeMatra = 0;

export var resetTalaCounters = function() {
	storeAnga = 0;
	storeAkshara = 0;
	storeMatra = 0;
}

class MatraComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render () {
		return(
			<div class="matra">
				{this.props.data}
			</div>
		)
	}
}

class AksharaComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div class="akshara">
				{this.props.data}
			</div>
		)
	}
}

class AvarthanamComponent extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div class="avarthanam">
				{this.props.data}
			</div>
		)
	}
}

class AngaComponent extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="anga">
				{this.props.data}
			</div>
		)
	}
}

export class ParagraphComponent extends React.Component {
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

		console.log(this.props.taalam);

		/* Switch for Taalam */
		if(this.props.taalam === TAALAMS.roopaka.name) {
			//structure: 0 1
			loopStruct = [2, Number(this.state.jaathi)];
		} else {
			// structure 1 0 0
			console.log(this.props.taalam + " NOT " + TAALAMS.roopaka.name);
			loopStruct = [this.state.jaathi, 2, 2];
		}

		/*switch (this.props.taalam) {
			// TODO
			case TAALAMS.roopaka.name:
				//structure: 0 1
				loopStruct = [2, Number(this.state.jaathi)];
				break;
			default: 		// triputa taalam
				// structure 1 0 0
				loopStruct = [this.state.jaathi, 2, 2];
				break;
		}*/

		/* Group content into containers */
		var curAnga	   = storeAnga;
		var curAkshara = storeAkshara;
		var curMatra   = storeMatra;
		var maxMatra   = Math.pow(2, Number(this.props.kaalam)-1);
		console.log("Kaalam in ParagraphComponent: " + this.props.kaalam);
		console.log("Matra per Akshara: " + maxMatra);
		var aggContent = [];
		var aksharaContent = [];
		var angaContent  = [];
		var avarthanamContent = [];
		for(var i = 0; i < this.state.content.length; i++) {

			if (curMatra == maxMatra) {
				angaContent.push(<AksharaComponent data={aksharaContent} />);
				aksharaContent = [];
				curMatra = 0;
				curAkshara += 1;
				if (curAkshara == loopStruct[curAnga]) {
					avarthanamContent.push(<AngaComponent data={angaContent} />);
					angaContent = [];
					curAkshara = 0;
					curAnga += 1;
					if (curAnga == loopStruct.length) {
						aggContent.push(<AvarthanamComponent data={avarthanamContent} />);
						avarthanamContent = [];
						curAnga = 0;
					}
				}
			}

			aksharaContent.push(<MatraComponent data={this.state.content[i]} />);
			curMatra = curMatra + 1;
			
		}

		// Push remaining content
		angaContent.push(<AksharaComponent data={aksharaContent} />);
		avarthanamContent.push(<AngaComponent data={angaContent} />);
		aggContent.push(<AvarthanamComponent data={avarthanamContent} />);

		storeMatra = curMatra;
		storeAkshara = curAkshara;
		storeAnga = curAnga;


/*
		var perbeat = Math.pow(2, Number(this.state.kaalam)-1);
		console.log("Per Beat: " + perbeat);
		var x = 0;
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
				container.push(<ContainerComponent content={curr} />);
				curr = [];
				j = j%loopStruct.length;
			}

			// Insert into curr
			curr.push(this.state.content[i]);

			i += 1;
			x += 1;

			if (x == perbeat) {
				x = 0;
				k += 1;
			}

		}

		// Save curr into container
		//container.push(<ContainerComponent content={curr} style={containerStyle} />);

*/

		return (
			<div className="paragraph">
				{aggContent}
			</div>
		)
	}
}
