import React, { Component } from 'react'

class SwatchPicker extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="swatch-holder">
				{this.props.colors.map((color, i) => {
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
			</div>
		)
	}
}

export default SwatchPicker