import React, { Component } from 'react'

import SwatchColorPicker from './SwatchColorPicker'

class SwatchPicker extends Component {
	constructor(props){
		super(props)

		this._getUnlockedColors = this._getUnlockedColors.bind(this)
		this._getLockedColors = this._getLockedColors.bind(this)
	}

	_getUnlockedColors(){
		let unlockedColors = []

		this.props.colors.forEach(color => {
			if(color.unlocked){
				unlockedColors.push(color)
			}
		})

		return unlockedColors
	}

	_getLockedColors(){
		let lockedColors = []

		this.props.colors.forEach(color => {
			if(!color.unlocked){
				lockedColors.push(color)
			}
		})

		return lockedColors
	}

	render(){
		return (
			<div className="swatch-holder">
				<span>Unlocked Colors</span>
				<br/>
				{this._getUnlockedColors().map((color, i) => {
					return (
						<div className="swatch" data-unlocked={color.unlocked} key={i} data-color={color.color} style={{backgroundColor: color.color}} onClick={() => this.props.onSelect(color)}>
							<div className="swatch-overlay">
								{!color.unlocked&&(
									<span className="icon">
										<i className="mdi mdi-18px mdi-lock-outline"></i>
									</span>
								)}
							</div>
						</div>
					)
				})}

				<br/>
				<span>Available Colors ($2,000 each)</span>
				<br/>

				{this._getLockedColors().map((color, i) => {
					return (
						<div className="swatch" data-unlocked={color.unlocked} key={i} data-color={color.color} style={{backgroundColor: color.color}} onClick={() => this.props.onSelect(color)}>
							<div className="swatch-overlay">
								{!color.unlocked&&(
									<span className="icon">
										<i className="mdi mdi-18px mdi-lock-outline"></i>
									</span>
								)}
							</div>
						</div>
					)
				})}

				<SwatchColorPicker closeHandler={this.props.closeHandler}/>
			</div>
		)
	}
}

export default SwatchPicker