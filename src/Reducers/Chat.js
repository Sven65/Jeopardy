function chat(state={}, action){
	switch(action.type.replace("s/", "")){
		case "LOCAL_COMMAND":
			let response = ""

			switch(action.data.command){
				case "VERSION":
					response = `TriviaParty Version **${VERSION}**`
				break
				case "SUDO":
					response = "I can't let you do that, Dave."
				break
			}

			action.asyncDispatch({type: "EVENT_CHAT", data: {
				message: response,
				user: {
					username: "SYSTEM",
					userID: "SYSTEM"
				},
				timeStamp: Date.now()
			}})
		break

		case "EVENT_CHAT":
			return Object.assign({}, state, {
				messages: [...state.messages||[], action.data]
			})
		break

		default:
			return state
		break
	}
}

export default chat