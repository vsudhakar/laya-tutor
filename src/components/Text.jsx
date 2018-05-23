import React from 'react';

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

export default TextComponent;