// Totally not stolen from https://codepen.io/jareko999/pen/eBayYL

import React, { Component } from 'react'

class ToggleSwitch extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="onoffswitch">
				<input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="onoffswitch" defaultChecked onChange={this.props.onChange}/>
				<label className="onoffswitch-label" htmlFor="onoffswitch">
					<span className="onoffswitch-inner"></span>
					<span className="onoffswitch-switch"></span>
				</label>
			</div>
		)
	}
}

export default ToggleSwitch