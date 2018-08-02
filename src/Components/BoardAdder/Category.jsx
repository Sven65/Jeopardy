import React, { Component } from 'react'
import Button from './../Common/Button'

class Category extends Component {
	constructor(props){
		super(props)
	}

	componentDidMount() {
		
	}

	render(){
		let hasClues = this.props.clues.length>1

		return (
			<div className="column">
				<nav className="panel">
					<p className="panel-heading" >
						<span onClick={() => this.props.titleEdit(this.props.categoryID)}>{this.props.categoryName}</span>
					</p>
					
					{this.props.clues.map((clue, i) => {
						return (
							<a className="panel-block" key={i}>
								{clue.question} - ${clue.value}
							</a>
						)
					})}

					{this.props.clues.length<5&& (
						<form className="mdl-form gameBrowser-button-holder">
							<Button type="button" name="newClue" id="newClueButton" text="Add New Clue" icon="plus" onClick={() => this.props.newClue(this.props.categoryID)} className="btn-submit panel-block"/>
						</form>
					)}
				</nav>
			</div>
		)
	}
}

export default Category