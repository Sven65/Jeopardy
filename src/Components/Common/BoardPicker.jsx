import React, { Component } from 'react'
import Button from './Button'

class BoardPicker extends Component {
	constructor(props){
		super(props)

		this.selectBoard = this.selectBoard.bind(this)

		this.state = {
			selected: "default"
		}
	}

	selectBoard(board){
		this.setState({selected: board.id})

		if(this.props.onSelect !== undefined || this.props.onSelect !== null){
			this.props.onSelect(board)
		}
	}

	render(){
		return (
			<div>
				<form className="mdl-form boardPicker-button-holder">
					{this.props.boards.map((board, i) => {
						return (
							<Button type="button" name="join" text={board.name} icon="send" onClick={((e) => {this.selectBoard(board)})} className={"btn-submit board-button "+(this.state.selected===board.id?'selected':'')}/>
						)
					})}
					<Button type="button" name="join" text="Default" icon="send" onClick={((e) => {this.selectBoard({id: "default"})})} className={"btn-submit board-button "+(this.state.selected==="default"?'selected':'')}/>
				</form>
			</div>
		)
	}
}

export default BoardPicker