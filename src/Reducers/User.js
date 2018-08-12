function user(state={}, action){
	switch(action.type.replace("s/", "")){
		case "JOIN":
			return Object.assign({}, state, {
				validUserBoards: []
			})
		break

		case "USER_REGISTER_ERROR":
			return Object.assign({}, state, {
				registerError: action.data,
				userFormLoad: false
			})
		break
		case "USER_REGISTERED": 
			action.asyncDispatch({type: "s/GET_USER_BY_TOKEN", data: {
				token: action.data.token
			}})

			return Object.assign({}, state, {
				registerError: {},
				userRegistered: true,
				userFormLoad: false,
				userData: action.data,
				userLoggedIn: true,
				disableRegisterForm: true,
				disableLoginForm: true
				//showLoginForm: false
			})
		break

		case "USER_LOGIN_ERROR":
			return Object.assign({}, state, {
				loginError: action.data,
				userFormLoad: false
			})
		break
		case "USER_LOGGED_IN":
			return Object.assign({}, state, {
				loginError: {reason: ""},
				userLoggedIn: true,
				userFormLoad: false,

				//showLoginForm: false,
				userData: action.data,

				disableRegisterForm: true,
				disableLoginForm: true
			})
		break
		case "USER_FORM_LOAD":
			return Object.assign({}, state, {
				userFormLoad: true
			})
		break
		case "INIT_GET_USER_DATA":
			let loadedData = localStorage.getItem( 'userData' )

			let userData = {}

			if(loadedData !== undefined && loadedData !== null){
				userData = JSON.parse(atob(loadedData))
			}

			if(userData.token !== undefined){
				action.asyncDispatch({type: "s/GET_USER_BY_TOKEN", data: {
					token: userData.token
				}})
			}

			return Object.assign({}, state, {
				userData: userData,
				userLoggedIn: Object.keys(userData).length>0
			})
		break

		case "USER_LOGOUT":

			localStorage.removeItem("userData")

			return Object.assign({}, state, {
				userData: {},
				userLoggedIn: false,
				showProfile: false,
				clearUserForm: true,
				disableRegisterForm: false,
				disableLoginForm: false,
				registerError: {},
				userRegistered: false
			})
		break

		case "CHANGE_THEME":
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					theme: action.data.theme
				}
			})
		break

		case "BOUGHT_COLOR":
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					unlockedColors: [...state.userData.unlockedColors, action.data.color],
					balance: action.data.newBalance
				}
			})
		break

		case "USER_COLOR_SET":
			return Object.assign({}, state, {
				userData: {
					...state.userData,
					color: action.data.color
				}
			})
		break

		case "SENT_VERIFICATION_EMAIL":
			return Object.assign({}, state, {
				appEmailSent: true
			})
		break
		case "SENT_VERIFICATION_EMAIL_ERROR":
			return Object.assign({}, state, {
				appEmailSent: false,
				verifyEmailError: action.data.error
			})
		break
		case "PASSWORD_RESET_ERROR":
			return Object.assign({}, state, {
				forgotPasswordSent: false,
				passwordResetError: action.data.reason
			})
		break
		case "RESET_PASSWORD_RESET_ERROR":
			return Object.assign({}, state, {
				forgotPasswordSent: false,
				passwordResetError: null
			})
		break
		case "SENT_FORGOT_PASSWORD_EMAIL":
			return Object.assign({}, state, {
				forgotPasswordSent: true,
				passwordResetError: null
			})
		break
		
		case "RESET_CLEAR_USER_FORM":
			return Object.assign({}, state, {
				clearUserForm: false
			})
		break

		default:
			return Object.assign({
				"registerError": {},
				"loginError": {
					reason: ""
				},
				userData: {},
				verifyEmailError: "",
				passwordResetError: null
			}, state)
		break
	}
}

export default user