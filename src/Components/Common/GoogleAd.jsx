import React, { Component } from 'react'

class GoogleAd extends Component {
	constructor(props){
		super(props)
	}

	componentDidMount () {
		
	}

	render(){
		return (
			<ins className="adsbygoogle"
				style={{ display: 'block' }}
				data-ad-client={this.props.adClient}
				data-ad-slot={this.props.adSlot}
				data-ad-format={this.props.adFormat}
				data-full-width-responsive="true"
			/>
		)
	}
}

export default GoogleAd