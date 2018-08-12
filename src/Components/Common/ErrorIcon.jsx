import React, { Component } from 'react'

class ErrorIcon extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="errorIcon">
				<div className="errorIcon-error">
					<div className="errorIcon-error-x">
						<div className="errorIcon-error-left"></div>
						<div className="errorIcon-error-right"></div>
					</div>
					<div className="errorIcon-error-placeholder"></div>
					<div className="errorIcon-error-fix"></div>
				</div>
			</div>

		)
	}
}

export default ErrorIcon