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
			isLoading: false,
			unsavedChanges: false,
			boardErrorMessage: "",
			boardData: {},
			boards: [],
			listBoards: false
		}

		this.newClue = this.newClue.bind(this)
		this.titleEdit = this.titleEdit.bind(this)
		this.setCategoryTitle = this.setCategoryTitle.bind(this)
		this.showBoard = this.showBoard.bind(this)
		this.deleteBoard = this.deleteBoard.bind(this)
		this.deleteCategory = this.deleteCategory.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})

		store.dispatch({type: "s/USER_GET_BOARDS", data: {
			userToken: this.props.userToken
		}})
	}

	newClue(categoryID){
		let boardData = this.state.boardData

		if(boardData.clues[categoryID] === undefined){
			store.dispatch({type: "s/ADD_CATEGORY", data: {
				userToken: this.props.userToken,
				boardID: this.state.boardData.boardData.id
			}})
		}else{
			store.dispatch({
				type: "s/ADD_CLUE",
				data: {
					boardID: this.state.boardData.boardData.id,
					answer: "Example Answer",
					question: "Example Question",
					value: 0,
					categoryID: categoryID,
					userToken: this.props.userToken,
				}
			})
		}



		this.setState({
			...this.state,
			boardData: boardData
		})
	}

	titleEdit(categoryID){
		let boardData = this.state.boardData
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

	setCategoryTitle(categoryID, title, originalTitle){
		let boardData = this.state.boardData

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
		if(id === "???"){
			store.dispatch({type: "s/CREATE_BOARD", data: {
				userToken: this.props.userToken
			}})
		}else{
			store.dispatch({type: "s/GET_BOARD", data: {
				boardID: id
			}})
		}
	}

	hideBoard(){
		this.setState({
			listBoards: false,
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

	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.unsavedChanges&&this.state.boardErrorMessage!==""
		let listBoards = this.state.listBoards

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
									{this.state.boardErrorMessage}
								</span>
							} type="danger"/>
						)}

						{listBoards&& (
							<Alert message={
								<span className="is-right pointer-cursor">
									<span className="icon is-left">
										<i className="mdi mdi-arrow-left"></i>
									</span>
									Go Back
								</span>
							} type="success" onClick={this.hideBoard.bind(this)}/>
						)}

						{listBoards?(
							<div className="columns">
								{/* TODO: Make this pull data from board api, list all boards user has and make them editable by pulling the data by board id from api*/}
								{Object.keys(this.state.boardData.clues).map((id, key) => {
									return (
										<Category
											key = {key}
											categoryName={this.state.boardData.clues[id][0].category.title}
											clues={this.state.boardData.clues[id]}
											categoryID={id}
											newClue={this.newClue}
											titleEdit={this.titleEdit}
											delete={this.deleteCategory}
											boardID={this.state.boardData.boardData.id}
										/>
									)
								})}

								{Object.keys(this.state.boardData.clues).length<6&&(
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
								{this.state.boards.map((board, key) => {
									return (
										<BoardListing
											key={key}
											id={board.id}
											boardName={board.title||"Board Title"}
											editBoard={this.showBoard}
											onDelete={this.deleteBoard}
										/>
									)
								})}

								{Object.keys(this.state.boards).length<6&&(
									<BoardListing
										id="???"
										boardName="New Board"
										editBoard={this.showBoard}
										isCreate={true}
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