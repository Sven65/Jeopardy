import React, { Component } from 'react'

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';

class SwatchColorPicker extends Component {
	constructor(props){
		super(props)

		this.state = {
			color: '#000'
		}

		this.changeHandler = this.changeHandler.bind(this)
		this.closeHandler = this.closeHandler.bind(this)
	}

	changeHandler(colors){
		this.setState({
			color: colors.color
		})

		if(this.props.changeHandler !== undefined){
			this.props.changeHandler(colors)
		}
	}

	closeHandler(colors){
		this.setState({
			color: colors.color
		})

		if(this.props.closeHandler !== undefined){
			this.props.closeHandler(colors)
		}
	}

	render(){
		return (
			<ColorPicker placement="topLeft" enableAlpha={false} color={this.state.color} onChange={this.changeHandler} onClose={this.closeHandler} destroyPopupOnHide={false}>
				<div className="swatch">
					<div className="swatch-overlay swatch-color-picker">
						<span className="icon icon-question">
							<i className="mdi mdi-18px mdi-help"></i>
						</span>
					</div>
				</div>
			</ColorPicker>
		)
	}
}

export default SwatchColorPicker