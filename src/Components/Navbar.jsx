import React, { Component } from 'react'

class Navbar extends Component {
	constructor(props){
		super(props)		
	}

	render(){
		return (
			<nav className="light-blue lighten-1" role="navigation">
				<div className="nav-wrapper container">
					<a id="logo-container" href="#" className="brand-logo">TriviaParty - <span id="gameCodeHeader">{this.props.gameCode}</span></a>

					<ul id="game-buttons" className={"right "+(this.props.hideButtons?'hidden':'')}>
						<li><a id="game-button-start" className={this.props.hideStartButton?"hidden":''}>Start Game <i className="material-icons right">play_arrow</i></a></li>
						<li><a id="game-button-leave">Leave Game <i className="material-icons right">exit_to_app</i></a></li>
					</ul>
				</div>
			</nav>
		)
	}
}

export default Navbar