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

		case "RESET_BOUGHT_COLOR":
			return Object.assign({}, state, {
				boughtColor: false
			})
		break

		case "RESET_BUY_COLOR_ERROR":
			return Object.assign({}, state, {
				buyColorError: ""
			})
		break

		case "USER_COLOR_SET":

			return Object.assign({}, state, {
				buyColorError: "",
				boughtColor: true,
				boughtColorSuccess: "Color Set!"
			})
		break

		case "SAVE_USER_SETTINGS_ERROR":
			return Object.assign({}, state, {
				editError: `Error saving settings: ${action.data.error}`
			})
		break

		case "SAVED_USER_SETTINGS":
			return Object.assign({}, state, {
				boughtColorSuccess: `Settings saved!${action.data.setNewEmail?' Check your emails to verify your new address!':''}`,
				boughtColor: true,
				editError: ""
			})
		break

		default:
			return Object.assign({
				unsavedChanges: false,
				editError: "",
				buyColorError: "",
				boughtColor: false,
				boughtColorSuccess: ""
			}, state)
		break
	}
}

export default userEdit