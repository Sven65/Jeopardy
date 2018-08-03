// Totally not stolen from https://alligator.io/css/collapsible/

import React, { Component } from 'react'

class Collapsible extends Component {
	constructor(props){
		super(props)

		this.clickLabel = this.clickLabel.bind(this)
		this._label = React.createRef()
		this._check = React.createRef()
	}

	clickLabel(){
		this._label.click()
	}

	render(){
		let isOpen = this._check.checked?'open':''

		return (
			<div className={"wrap-collapsible "+this.props.className+" "+isOpen}>
				<p className="panel-heading" onClick={this.clickLabel}>
					<input id={this.props.labelID} className="toggle" type="checkbox" ref={(el) => this._check = el}/>
					<label for={this.props.labelID} className="lbl-toggle" ref={(el) => this._label = el} onClick={this.clickLabel}>{this.props.label}</label>
				</p>

				<div className="collapsible-content panel-block">
					<div className="content-inner">
						{this.props.children}
					</div>
				</div>
			</div>
		)
	}
}

export default Collapsible