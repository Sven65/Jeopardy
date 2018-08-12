import React, { Component } from 'react'
import Button from './../Common/Button'

import Collapsible from './../Common/Collapsible'

class ClueEdit extends Component {
	constructor(props){
		super(props)

		this._valueSelect = React.createRef()
		this._questionInput = React.createRef()
		this._answerInput = React.createRef()

		this.state = {
			value: 0,
			question: "",
			answer: ""
		}

		this.handleInput = this.handleInput.bind(this)
	}

	componentDidMount() {
		this.setState({
			value: this.props.clue.value,
			question: this.props.clue.question,
			answer: this.props.clue.answer
		})
	}

	handleInput(event){
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	render(){
		return (
			<div>
				<div className="field has-addons">
					<div className="control has-icons-left full-width">
						<input className="input" type="text" autoComplete="off" placeholder="Clue" defaultValue={this.props.clue.question} name="question" onChange={this.handleInput}/>
						
						<span className="icon is-left">
							<i className="mdi mdi-help"></i>
						</span>
					</div>
				</div>

				<div className="field has-addons">
					<div className="control has-icons-left full-width">
						<input className="input" type="text" autoComplete="off" placeholder="Answer" defaultValue={this.props.clue.answer} name="answer" onChange={this.handleInput}/>
						
						<span className="icon is-left">
							<i className="mdi mdi-forum"></i>
						</span>
					</div>
				</div>

				<div className="field has-addons ">
					<div className="control is-fullwidth">
						<a className="button is-profile">Value</a>
					</div>

					<div className="control is-expanded">
						<div className="select is-fullwidth">
							<select defaultValue={this.props.clue.value} onChange={this.handleInput} name="value">
								<option value="200">$200</option>
								<option value="400">$400</option>
								<option value="600">$600</option>
								<option value="800">$800</option>
								<option value="1000">$1000</option>
							</select>
						</div>
					</div>
				</div>

				<form className="mdl-form gameBrowser-button-holder">
					<Button type="button" name="saveClue" id="saveClueButton" text="Save Clue" icon="content-save" className="btn-submit panel-block" onClick={() => this.props.saveClue(this.props.clue.ID, this.state.question, this.state.answer, this.state.value, this.props.boardID)} />
					<Button type="button" name="deleteClue" id="deleteClueButton" text="Delete Clue" icon="delete" className="btn-danger panel-block" onClick={() => this.props.deleteClue(this.props.clue.ID, this.props.boardID)} />

				</form>
			</div>
		)
	}
}

export default ClueEdit