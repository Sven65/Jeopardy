const LOADER_ACTIONS = [
	"ACTION_USER_EDIT",
	"USER_CHANGE_THEME",
	"USER_BUY_COLOR",
	"USER_SET_COLOR",
	"SEND_VERIFICATION_EMAIL",
	"SET_CATEGORY_TITLE",
	"USER_GET_BOARDS",
	"GET_BOARD",
	"ADD_CATEGORY",
	"DELETE_BOARD",
	"DELETE_CATEGORY",
	"DELETE_CLUE",
	"SAVE_CLUE",
	"CREATE_BOARD",
	"SET_BOARD_TITLE",
	"GET_USER_VALID_BOARDS",
	"GET_USER_SETTINGS",
	"SAVE_USER_SETTINGS"
]

const LOADER_DONE_ACTIONS = [
	"USER_EDIT_SAVED",
	"USER_EDIT_ERROR",
	"BUY_COLOR_ERROR",
	"SET_COLOR_ERROR",
	"BOUGHT_COLOR",
	"USER_COLOR_SET",
	"SENT_VERIFICATION_EMAIL",
	"SENT_VERIFICATION_EMAIL_ERROR",
	"GOT_BOARDS",
	"GOT_BOARD",
	"SET_TITLE_ERROR",
	"ADD_CATEGORY_ERROR",
	"ADD_CLUE_ERROR",
	"DELETE_BOARD_ERROR",
	"DELETE_CATEGORY_ERROR",
	"DELETE_CLUE_ERROR",
	"SAVE_CLUE_ERROR",
	"SET_BOARD_TITLE_ERROR",
	"TITLE_EDIT_SAVED",
	"BOARD_TITLE_EDIT_SAVED",
	"ADDED_CATEGORY",
	"ADDED_CLUE",
	"CREATED_BOARD",
	"DELETED_BOARD",
	"DELETED_CATEGORY",
	"DELETED_CLUE",
	"SAVED_CLUE",
	"CREATE_BOARD_ERROR",
	"GOT_VALID_USER_BOARDS",
	"GOT_USER_SETTINGS",
	"SAVED_USER_SETTINGS",
	"SAVE_USER_SETTINGS_ERROR"
]

function loader(state={}, action){
	let actionType = action.type.replace("s/", "")

	if(LOADER_ACTIONS.indexOf(actionType) > -1){
		return Object.assign({}, state, {
			isLoading: true
		})
	}

	if(LOADER_DONE_ACTIONS.indexOf(actionType) > -1){
		return Object.assign({}, state, {
			isLoading: false
		})
	}

	return {
		isLoading: false
	}
}

export default loader