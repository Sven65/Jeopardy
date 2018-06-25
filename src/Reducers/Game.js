export const JOIN_GAME = 'JOIN_GAME';

export default function joinGame(state, action){
	console.log("ACT", action)
	if(!state) return {}

	switch(action.type){
		case "__BOOT__":
			
		break;
		default:
			console.log("OOF", action)
		break;
	}

	return state;
}