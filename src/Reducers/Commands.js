// Local Commands

function localCommand(state, action) {
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
}

export {localCommand}