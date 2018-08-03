import React, { Component } from 'react'
import Button from './../Common/Button'

import Collapsible from './../Common/Collapsible'
import InputField from './../Common/InputField'

import ClueEdit from './ClueEdit'

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
					{this.props.clues.length>0&&
						<p className="panel-tabs">
							<a className="is-right" onClick={() => this.props.delete(this.props.categoryID, this.props.boardID)}>
								<span className="icon is-left">
									<i className="mdi mdi-close"></i>
								</span>
								Delete
							</a>
						</p>
					}
					
					{this.props.clues.map((clue, i) => {
						return (
							<Collapsible label={clue.question+" - $"+clue.value} key={i} className="panel" labelID={"collapsible-"+clue.ID}>
								<ClueEdit saveClue={this.props.saveClue} clue={clue} boardID={this.props.boardID} deleteClue={this.props.deleteClue}/>
							</Collapsible>
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