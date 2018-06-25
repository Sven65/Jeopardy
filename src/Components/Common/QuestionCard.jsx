import React, { Component } from 'react'

class QuestionCard extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="col l8 s12 left" id="game-question-area">
				<div className="row">
					<div className="col s12">
						<div className="card blue-grey darken-1">
							<div className="card-content white-text">
								<span className="card-title" id="game-question-title">{this.props.title}</span>
								<p id="game-question-clue">
									{this.props.clue}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default QuestionCard