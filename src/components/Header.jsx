import React from 'react';

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

export default HeaderComponent;