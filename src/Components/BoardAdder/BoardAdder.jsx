import React, { Component } from 'react'
import Loader from './../Common/Loader'

import Category from './Category'
import Alert from './../Common/Alert'
import BoardListing from './BoardListing'

import swal from 'sweetalert'

import store from './../../store'

class BoardAdder extends Component {
	constructor(props){
		super(props)

		this.state = {
			unsavedChanges: false,
			loader: {
				isLoading: false
			},
			boardEdit: {
				boardErrorMessage: "",
				boardData: {},
				boards: [],
				listBoards: true
			}
		}

		this.newClue = this.newClue.bind(this)

		this.titleEdit = this.titleEdit.bind(this)
		this.setCategoryTitle = this.setCategoryTitle.bind(this)

		this.boardTitleEdit = this.boardTitleEdit.bind(this)
		this.setBoardTitle = this.setBoardTitle.bind(this)

		this.showBoard = this.showBoard.bind(this)
		this.newBoard = this.newBoard.bind(this)

		this.deleteBoard = this.deleteBoard.bind(this)
		this.deleteCategory = this.deleteCategory.bind(this)
		this.deleteClue = this.deleteClue.bind(this)

		this.saveClue = this.saveClue.bind(this)
	}

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => {

		})

		store.subscribe(() => {
			this.setState(store.getState())
		})

		store.dispatch({type: "s/USER_GET_BOARDS", data: {
			userToken: this.props.userToken
		}})
	}

	componentWillUnmount() {
		console.log("UNMOUNT BOARDADDER")
		this.unsubscribe();
	}

	newClue(categoryID){
		let boardData = this.state.boardEdit.boardData

		if(boardData.clues[categoryID] === undefined){
			store.dispatch({type: "s/ADD_CATEGORY", data: {
				userToken: this.props.userToken,
				boardID: this.state.boardEdit.boardData.boardData.id
			}})
		}else{
			store.dispatch({
				type: "s/ADD_CLUE",
				data: {
					boardID: this.state.boardEdit.boardData.boardData.id,
					answer: "Example Answer!",
					question: "Example Question",
					value: 200,
					categoryID: categoryID,
					userToken: this.props.userToken
				}
			})
		}



		this.setState({
			...this.state,
			boardData: boardData
		})
	}

	titleEdit(categoryID){
		let boardData = this.state.boardEdit.boardData
		let setCategoryTitle = this.setCategoryTitle

		if(boardData.clues[categoryID] === undefined){
			boardData.clues[categoryID] = []
		}

		let originalTitle = boardData.clues[categoryID][0].category.title

		boardData.clues[categoryID][0].category.title = (
			<input
				type="text"
				autoFocus
				onBlur={(e) => setCategoryTitle(categoryID, e.target.value, originalTitle)}
				onKeyDown={e => e.keyCode===13?setCategoryTitle(categoryID, e.target.value, originalTitle):null}
			/>
		)

		this.setState({
			...this.state,
			boardData: boardData
		})
	}

	boardTitleEdit(boardID){
		let boards = this.state.boards

		let boardIndex =  boards.findIndex(board => board.id === boardID)

		let boardData = boards[boardIndex]

		let setBoardTitle = this.setBoardTitle

		if(boardData === undefined){
			boardData = {}
		}

		let originalTitle = boardData.title

		boardData.title = (
			<input
				type="text"
				autoFocus
				onBlur={(e) => setBoardTitle(boardID, e.target.value, originalTitle)}
				onKeyDown={e => e.keyCode===13?setBoardTitle(boardID, e.target.value, originalTitle):null}
			/>
		)

		this.setState({
			...this.state,
			boards: boards
		})
	}

	setBoardTitle(boardID, title, originalTitle){

		let boards = this.state.boardEdit.boards

		let boardIndex = boards.findIndex(board => board.id === boardID)

		let boardData = boards[boardIndex]

		if(title === ""){
			title = originalTitle
		}

		if(boardData === undefined){
			boardData = {}
		}

		boardData.title = title

		this.setState({
			...this.state,
			boards: boards
		})

		store.dispatch({type: "s/SET_BOARD_TITLE", data: {
			boardID,
			title,
			userToken: this.props.userToken
		}})

		this.setState({isLoading: true})

	}

	setCategoryTitle(categoryID, title, originalTitle){
		let boardData = this.state.boardEdit.boardData

		if(title === ""){
			title = originalTitle
		}

		if(boardData.clues[categoryID] === undefined){
			boardData.clues[categoryID] = []
		}

		boardData.clues[categoryID][0].category.title = title

		this.setState({
			...this.state,
			boardData: boardData
		})

		store.dispatch({type: "s/SET_CATEGORY_TITLE", data: {
			categoryID,
			title,
			userToken: this.props.userToken
		}})

		this.setState({isLoading: true})

	}

	showBoard(id){
		store.dispatch({type: "s/GET_BOARD", data: {
			boardID: id
		}})
	}

	newBoard(){
		store.dispatch({type: "s/CREATE_BOARD", data: {
			userToken: this.props.userToken
		}})
	}

	hideBoard(){
		this.setState({
			listBoards: true,
			boardData: {}
		})
	}

	deleteBoard(id){
		swal({
			title: "Do you really want to delete this board? It can't be undone!",
			buttons: ["Nope!", true]
		}).then(confirm => {
			if(confirm){
				store.dispatch({type: "s/DELETE_BOARD", data: {
					boardID: id,
					userToken: this.props.userToken
				}})
			}
		});
	}

	deleteCategory(id, boardID){
		swal({
			title: "Do you really want to delete this category? It can't be undone!",
			buttons: ["Nope!", true]
		}).then(confirm => {
			if(confirm){
				store.dispatch({type: "s/DELETE_CATEGORY", data: {
					categoryID: id,
					boardID: boardID,
					userToken: this.props.userToken
				}})
			}
		});
	}

	deleteClue(id, boardID){
		swal({
			title: "Do you really want to delete this clue? It can't be undone!",
			buttons: ["Nope!", true]
		}).then(confirm => {
			if(confirm){
				store.dispatch({type: "s/DELETE_CLUE", data: {
					clueID: id,
					boardID: boardID,
					userToken: this.props.userToken
				}})
			}
		});
	}

	saveClue(id, question, answer, value, boardID){
		store.dispatch({type: "s/SAVE_CLUE", data: {
			clueID: id,
			question,
			answer,
			value,
			boardID: boardID,
			userToken: this.props.userToken
		}})
	}

	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.unsavedChanges&&this.state.boardEdit.boardErrorMessage!==""
		let listBoards = this.state.boardEdit.listBoards

		return (
			<div>
				{this.state.isLoading &&
					<div className="loader-holder">
						<Loader />
					</div>
				}
				<div className="modal is-active" id="board-adder">
					<div className="modal-background"></div>
					<div className="modal-card box">
						{showError&& (
							<Alert message={
								<span>
									{this.state.boardEdit.boardErrorMessage}
								</span>
							} type="danger"/>
						)}

						{!listBoards&& (
							<Alert message={
								<span className="is-right pointer-cursor">
									<span className="icon is-left">
										<i className="mdi mdi-arrow-left"></i>
									</span>
									Go Back
								</span>
							} type="success" onClick={this.hideBoard.bind(this)}/>
						)}

						{!listBoards?(
							<div className="columns">
								{/* TODO: Make this pull data from board api, list all boards user has and make them editable by pulling the data by board id from api*/}
								{Object.keys(this.state.boardEdit.boardData.clues).map((id, key) => {
									return (
										<Category
											key = {key}
											categoryName={this.state.boardEdit.boardData.clues[id][0].category.title}
											clues={this.state.boardEdit.boardData.clues[id]}
											categoryID={id}
											newClue={this.newClue}
											titleEdit={this.titleEdit}
											delete={this.deleteCategory}
											boardID={this.state.boardEdit.boardData.boardData.id}
											saveClue={this.saveClue}
											deleteClue={this.deleteClue}
										/>
									)
								})}

								{Object.keys(this.state.boardEdit.boardData.clues).length<6&&(
									<Category 
										categoryName="New Category" 
										clues={[]}
										categoryID={"-1"}
										newClue={this.newClue}
									/>
								)}
							</div>
						):(
							<div className="columns">
								{this.state.boardEdit.boards.map((board, key) => {
									return (
										<BoardListing
											key={key}
											id={board.id}
											boardName={board.title||"Board Title"}
											editBoard={this.showBoard}
											onDelete={this.deleteBoard}
											boardNameEdit={this.boardTitleEdit}
										/>
									)
								})}

								{Object.keys(this.state.boardEdit.boards).length<6&&(
									<BoardListing
										id="???"
										boardName="New Board"
										editBoard={this.newBoard}
										isCreate={true}
										boardNameEdit={null}
									/>
								)}
							</div>
						)}
					</div>
					<button className="modal-close is-large" aria-label="close" onClick={this.props.closeButtonFunction}></button>
				</div>
			</div>
		)
	}
}

export default BoardAdder