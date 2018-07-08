import React, { Component } from 'react'

class QuestionCard extends Component {
	constructor(props){
		super(props)
	}

	getTitle(){
		if(Object.keys(this.props.question).length <= 0){
			return "Question"
		}

		return `${this.props.question.questionData.category.title} for $${this.props.question.questionData.value}`
	}

	getClue(){
		if(Object.keys(this.props.question).length <= 0){
			return "This is the clue"
		}

		return this.props.question.questionData.question
	}

	render(){
		return (
			<div className="tile is-child is-12" id="game-question-area">
				<div className="card">
					<div className="card-content">
						<span className="card-title title" id="game-question-title">{this.getTitle()}</span>
						<p id="game-question-clue">
							{this.getClue()}
						</p>
					</div>
				</div>
			</div>
		)
	}
}

export default QuestionCard