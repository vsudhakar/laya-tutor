import React from 'react';

/* Import constants */
import {TAALAMS} from '../constants/AppConstants.js';

class RenderSettingsPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taalam: this.props.taalam
		}

		// Bind listeners
		this.taalamSettingChange = this.taalamSettingChange.bind(this);
		this.kaalamSettingChange = this.kaalamSettingChange.bind(this);
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	/* Event Listeners */
	taalamSettingChange(event) {
		this.setState({taalam: event.target.value},
			this.props.updateHandler(event.target.value, this.state.kaalam, 'none', 'none')
		);
	}
	
	kaalamSettingChange(event) {
		this.setState({kaalam: event.target.value},
			this.props.updateHandler(this.state.taalam, event.target.value, 'none', 'none')
		);
	}

	/* Render */
	render() {
		return (
			<form>
				<label>
					taalam
				</label>
				<select value={this.state.taalam} onChange={this.taalamSettingChange}>
					<option value={TAALAMS.triputa.name}>triputa</option>
					<option value={TAALAMS.roopaka.name}>roopaka</option>
				</select>
				<label>
					kaalam
				</label>
				<select value={this.state.kaalam} onChange={this.kaalamSettingChange}>
					<option value={1}>1st Speed</option>
					<option value={2}>2nd Speed</option>
				</select>
			</form>
		);
	}
}

export default RenderSettingsPanel;