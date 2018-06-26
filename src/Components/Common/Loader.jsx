import React, { Component } from 'react'

class Loader extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="absolute-center loader-inner line-scale">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		)
	}
}

export default Loader