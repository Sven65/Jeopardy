function userEdit(state={}, action){
	switch(action.type.replace("s/", "")){
		case "USER_EDIT_SAVED":
			return Object.assign({}, state, {
				unsavedChanges: false,
				editError: ""
			})
		break
		case "USER_EDIT_ERROR":
			return Object.assign({}, state, {
				unsavedChanges: false,
				editError: action.data.error
			})
		break
		case "BUY_COLOR_ERROR":
		case "SET_COLOR_ERROR":
			return Object.assign({}, state, {
				buyColorError: action.data.error
			})
		break
		case "BOUGHT_COLOR":
			return Object.assign({}, state, {
				buyColorError: "",
				boughtColor: true,
				boughtColorSuccess: "Color bought!"
			})
		break

		default:
			return state
		break
	}
}

export default userEdit