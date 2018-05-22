import React from 'react';

/* Import constants */
import {TAALAMS} from '../constants/AppConstants.js';

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

export default ParagraphComponent;