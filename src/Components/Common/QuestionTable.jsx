import React, { Component } from 'react'

class QuestionTable extends Component {
	constructor(props){
		super(props)
	}

	getBody(){
		let rows = {}

		Object.keys(this.props.clues).map(categoryID => {
							
			this.props.values.map(value => {
				if(rows[value] === undefined){
					rows[value] = []
				}

				rows[value].push(this.props.clues[categoryID].filter(clue => {
					return clue.value === value
				})[0])
			})
		})

		return Object.keys(rows).map((value, i) => {
			let rowEl = []

			rows[value].map((clue, i) => {
				rowEl.push(<td key={i} data-key={i} className="game-clue" data-revealed={clue.revealed||false} data-id={clue.id} data-category={clue.category.id}>${value}</td>)
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
			<div className="col l8 s12" id="game-table-area">
				<table id="gameTable">
					<thead>
						<tr>
							{Object.keys(this.props.clues).map((categoryID, i) => {
								return (<th key={i}>{this.props.clues[categoryID][0].category.title}</th>)
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