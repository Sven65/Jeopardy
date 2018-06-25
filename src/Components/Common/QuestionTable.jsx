import React, { Component } from 'react'

class QuestionTable extends Component {
	constructor(props){
		super(props)
	}

	render(){
		return (
			<div className="col l8 s12" id="game-table-area">
				<table id="gameTable">
					<thead>
						<tr>
							{this.props.categories.map(category => {
								return <th>{category}</th>
							})}
						</tr>
					</thead>
					<tbody>
						{this.props.values.map(value => {
							return (
								<tr data-value={value}>
									
								</tr>
							)
						})}
					</tbody>
				</table>
			</div>
		)
	}
}

export default QuestionTable