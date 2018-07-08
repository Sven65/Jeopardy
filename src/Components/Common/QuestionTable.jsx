import React, { Component } from 'react'

import store from './../../store'

class QuestionTable extends Component {
	constructor(props){
		super(props)

		this.state = {
			clues: {}
		}

		this.onClick = this.onClick.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	onClick(e){
		store.dispatch({type: "s/GAME_ACTION_GET_QUESTION", data: {
			clueID: e.target.dataset.id,
			categoryID: e.target.dataset.category,
			roomID: this.state.roomID,
			userID: this.state.user.userID
		}})
	}

	getBody(){
		let rows = {}

		Object.keys(this.state.clues).map(categoryID => {
							
			this.props.values.map(value => {
				if(rows[value] === undefined){
					rows[value] = []
				}

				rows[value].push(this.state.clues[categoryID].filter(clue => {
					return clue.value === value
				})[0])
			})
		})

		return Object.keys(rows).map((value, i) => {
			let rowEl = []

			rows[value].map((clue, i) => {
				if(clue.category === undefined){
					clue.category = {}
				}

				rowEl.push(<td data-label={clue.category.title} key={i} data-key={i} className="game-clue" data-revealed={clue.revealed||false} data-id={clue.id} data-category={clue.category.id} onClick={this.onClick}>{clue.revealed?'X':'$'+value}</td>)
			})

			return (
				<tr key={i} data-value={value}>
					{rowEl}
				</tr>
			)
		})
	}

	render(){
		return (
			<div id="game-table-area" className="card">
				<table id="gameTable" className="table">
					<thead>
						<tr>
							{Object.keys(this.state.clues).map((categoryID, i) => {
								return (<th key={i}>{this.state.clues[categoryID][0].category.title}</th>)
							})}
						</tr>
					</thead>
					<tbody>
						{this.getBody()}
					</tbody>
				</table>
			</div>
		)
	}
}

export default QuestionTable