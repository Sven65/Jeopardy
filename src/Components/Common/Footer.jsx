import React, { Component } from 'react'

class Footer extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<footer className="footer">
				<div className="copyright right">
					<p>© 2018 <a href="mailto:&#109;&#097;&#099;&#107;&#097;&#110;&#064;&#100;&#105;&#115;&#099;&#111;&#114;&#100;&#100;&#117;&#110;&#103;&#101;&#111;&#110;&#115;&#046;&#109;&#101;">Mackan</a></p>
					<p>TriviaParty Version {this.props.version}</p>
				</div>
			</footer>
		)
	}
}

export default Footer