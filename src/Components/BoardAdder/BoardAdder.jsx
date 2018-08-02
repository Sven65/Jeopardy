import React, { Component } from 'react'
import Loader from './../Common/Loader'

import Category from './Category'

import store from './../../store'

class BoardAdder extends Component {
	constructor(props){
		super(props)

		this.state = {
			isLoading: false,
			unsavedChanges: false,
			editError: "",
			boardData: {
				"boardData": {
					"id": "jk9hg7if",
					"owner": "14",
					"created_at": "2018-07-31T09:11:38.343Z",
					"updated_at": "2018-07-31T09:11:38.343Z",
					"categories": [
						1
					]
				},
				"clues": {
					"1": [
						{
							"id":87908,
							"answer":"baseball",
							"question":"P.E.:Practice hard to become a Hall of Famer in this sport, like Cal Ripken Jr.",
							"value":200,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.137Z",
							"updated_at":"2014-02-14T01:53:34.137Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87914,
							"answer":"Mars",
							"question":"Science:\"Rover\" around \u0026 discover that a \"year\" on this planet lasts 687 days",
							"value":400,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.399Z",
							"updated_at":"2014-02-14T01:53:34.399Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87920,
							"answer":"torch",
							"question":"Shop:No, you will most certainly not be working with the gas-flame device called an acetylene this",
							"value":600,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.615Z",
							"updated_at":"2014-02-14T01:53:34.615Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87926,
							"answer":"the book",
							"question":"French:\"Le livre est sur la table\" means this is on the table; pick it up \u0026 start learning",
							"value":800,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.825Z",
							"updated_at":"2014-02-14T01:53:34.825Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87932,
							"answer":"F. Scott Fitzgerald",
							"question":"English:Learn that he left Princeton without a degree in 1917 \u0026 8 years later penned \"The Great Gatsby\"",
							"value":1000,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:35.038Z",
							"updated_at":"2014-02-14T01:53:35.038Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						}
					],
					"2": [
						{
							"id":87908,
							"answer":"baseball",
							"question":"P.E.:Practice hard to become a Hall of Famer in this sport, like Cal Ripken Jr.",
							"value":200,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.137Z",
							"updated_at":"2014-02-14T01:53:34.137Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"yeet CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87914,
							"answer":"Mars",
							"question":"Science:\"Rover\" around \u0026 discover that a \"year\" on this planet lasts 687 days",
							"value":400,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.399Z",
							"updated_at":"2014-02-14T01:53:34.399Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87920,
							"answer":"torch",
							"question":"Shop:No, you will most certainly not be working with the gas-flame device called an acetylene this",
							"value":600,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.615Z",
							"updated_at":"2014-02-14T01:53:34.615Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87926,
							"answer":"the book",
							"question":"French:\"Le livre est sur la table\" means this is on the table; pick it up \u0026 start learning",
							"value":800,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:34.825Z",
							"updated_at":"2014-02-14T01:53:34.825Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						},
						{
							"id":87932,
							"answer":"F. Scott Fitzgerald",
							"question":"English:Learn that he left Princeton without a degree in 1917 \u0026 8 years later penned \"The Great Gatsby\"",
							"value":1000,
							"airdate":"2009-07-13T12:00:00.000Z",
							"created_at":"2014-02-14T01:53:35.038Z",
							"updated_at":"2014-02-14T01:53:35.038Z",
							"category_id":11545,
							"game_id":null,
							"invalid_count":null,
							"category":{
								"id":11545,
								"title":"YAY CLASS",
								"created_at":"2014-02-14T01:53:33.936Z",
								"updated_at":"2016-11-21T15:26:19.062Z",
								"clues_count":5
							}
						}
					]
				}
			}
		}

		this.newClue = this.newClue.bind(this)
		this.titleEdit = this.titleEdit.bind(this)
		this.setCategoryTitle = this.setCategoryTitle.bind(this)
	}

	componentDidMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	newClue(categoryID){
		console.log(categoryID)

		let boardData = this.state.boardData

		if(boardData.clues[categoryID] === undefined){
			boardData.clues[categoryID] = []
		}

		boardData.clues[categoryID].push({
	        "id":87908,
	        "answer":"baseball",
	        "question":"P.E.:Practice hard to become a Hall of Famer in this sport, like Cal Ripken Jr.",
	        "value":200,
	        "airdate":"2009-07-13T12:00:00.000Z",
	        "created_at":"2014-02-14T01:53:34.137Z",
	        "updated_at":"2014-02-14T01:53:34.137Z",
	        "category_id":categoryID,
	        "game_id":null,
	        "invalid_count":null,
	        "category":{
	            "id":categoryID,
	            "title":"Random",
	            "created_at":"2014-02-14T01:53:33.936Z",
	            "updated_at":"2016-11-21T15:26:19.062Z",
	            "clues_count":5
	        }
	    })

		this.setState({
			...this.state,
			boardData: boardData
		})
	}

	titleEdit(categoryID){
		console.log("cat ID", categoryID)
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
	}

	render(){
		// Probably want to do something to change the color of the loader

		let showError = !this.state.unsavedChanges&&this.state.editError!==""

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
									/>
								)
							})}
							<Category 
								categoryName="New Category" 
								clues={[]}
								categoryID={Date.now().toString(36)}
								newClue={this.newClue}
							/>
						</div>
					</div>
					<button className="modal-close is-large" aria-label="close" onClick={this.props.closeButtonFunction}></button>
				</div>
			</div>
		)
	}
}

export default BoardAdder