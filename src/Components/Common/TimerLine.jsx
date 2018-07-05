import React, { Component } from 'react'

class TimerLine extends Component {
	constructor(props){
		super(props)
		
		this._percentColors = [
			{ pct: 0.0, color: { r: 0xEF, g: 0x53, b: 0x50 } },
			{ pct: 0.5, color: { r: 0xFF, g: 0xA7, b: 0x26 } },
			{ pct: 1.0, color: { r: 0x66, g: 0xBB, b: 0x6A } }
		]
	}

	getColorForPercentage(pct){
		for (var i = 1; i < this._percentColors.length - 1; i++) {
			if (pct < this._percentColors[i].pct) {
				break;
			}
		}
		
		let lower = this._percentColors[i - 1];
		let upper = this._percentColors[i];
		let range = upper.pct - lower.pct;
		let rangePct = (pct - lower.pct) / range;
		let pctLower = 1 - rangePct;
		let pctUpper = rangePct;
		let color = {
			r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
			g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
			b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
		};
		return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
		// or output as hex if preferred
	}  

	render(){
		let percent = (this.props.timeLeft/this.props.maxTime)*100

		let styles = {
			width: `${percent}%`,
			height: "5px",
			background: this.getColorForPercentage(percent/100)
		}

		return (
			<div className="timer" style={styles}></div>
		)
	}
}

export default TimerLine