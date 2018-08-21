function boardEdit(state={}, action){
	switch(action.type.replace("s/", "")){
		
		case "GOT_BOARDS":
			return Object.assign({}, state, {
				boards: action.data.boards
			})
		break
		case "GOT_BOARD":
			return Object.assign({}, state, {
				boardErrorMessage: "",
				boardData: action.data,
				listBoards: false
			})
		break

		case "SET_TITLE_ERROR":
		case "ADD_CATEGORY_ERROR":
		case "ADD_CLUE_ERROR":
		case "DELETE_BOARD_ERROR":
		case "DELETE_CATEGORY_ERROR":
		case "DELETE_CLUE_ERROR":
		case "SAVE_CLUE_ERROR":
		case "SET_BOARD_TITLE_ERROR":
			return Object.assign({}, state, {
				boardErrorMessage: action.data.error
			})
		break

		case "ADDED_CATEGORY":
			action.asyncDispatch({type: "s/ADD_CLUE", data: {
				boardID: action.data.boardID,
				answer: "Example Answer",
				question: "Example Question",
				value: 200,
				categoryID: action.data.id,
				userToken: action.data.userToken
			}})

			return Object.assign({}, state, {
				
			})
		return

		case "ADDED_CLUE":
			action.asyncDispatch({type: "s/GET_BOARD", data: {
				boardID: action.data.boardID
			}})

			return Object.assign({}, state, {
				
			})
		return

		case "CREATED_BOARD":
			action.asyncDispatch({type: "s/GET_BOARD", data: {
				boardID: action.data.boardID
			}})

			action.asyncDispatch({type: "s/USER_GET_BOARDS", data: {
				userToken: action.data.userToken
			}})

			return Object.assign({}, state, {
				
			})
		return

		case "DELETED_BOARD":
			action.asyncDispatch({type: "s/USER_GET_BOARDS", data: {
				userToken: action.data.userToken
			}})

			return Object.assign({}, state, {
				
			})
		return

		case "DELETED_CATEGORY":
		case "DELETED_CLUE":
			action.asyncDispatch({type: "s/GET_BOARD", data: {
				boardID: action.data.boardID
			}})

			return Object.assign({}, state, {
				
			})
		break
		case "SAVED_CLUE":
			console.log("BOARD EDIT STATE", state)

			let boardData = state.boardData

			console.log("boardData", boardData)

			clueIndex = boardData.clues[""+action.data.categoryID].findIndex(clue => ""+(clue.id||clue.ID) === ""+action.data.clueID)

			boardData.clues[""+action.data.categoryID][clueIndex].answer = action.data.answer
			boardData.clues[""+action.data.categoryID][clueIndex].value = action.data.value
			boardData.clues[""+action.data.categoryID][clueIndex].question = action.data.question

			return Object.assign({}, state, {
				boardData
			})
		break

		case "CREATE_BOARD_ERROR":
			return Object.assign({}, state, {
				boardErrorMessage: action.data.error,
				boardData: null,
				listBoards: true
			})
		break

		case "CLOSE_BOARD": 
			return Object.assign({}, state, {
				listBoards: true,
				boardData: {}
			})
		break

		case "GERROR":
			return Object.assign({}, state, {
				validUserBoards:  []
			})
		break

		default:
			return Object.assign({}, {
				validUserBoards: [],
				boardErrorMessage: "",
				boardData: {},
				boards: [],
				listBoards: true
			}, state)
		break
	}
}

export default boardEdit