module.exports = {
	checkUsernameInRoom: function(username, room){
		if(room === undefined){
			return false
		}

		return room.users.filter(u => {return u.username === username}).length>0
	},

	checkUserIDInRoom: function(userID, room){
		//roomData[room]
		if(room === undefined){
			return false
		}

		return room.users.filter(u => {return u.userID === userID}).length>0
	},

	getUserByID: function(userID, room){
		if(room === undefined){
			return null
		}

		return room.users.filter(u => {return u.userID === userID})[0]||null
	},

	valueFixer: function(clues){
		let valueMatch = [200, 400, 600, 800, 1000]
		let hasValues = []

		clues.forEach((clue, i) => {
			if(clue.value !== undefined && clue.value !== null && clue.hasOwnProperty("value")){
				if(clue.value%200 === 100){
					clue.value *= 2
				}

				if(hasValues.indexOf(clue.value) > -1){
					/*clue.value = valueMatch.filter(value => {
						return hasValues.indexOf(value)<=-1
					})[0]||0*/

					let found = clues.some(cl => {
						return clue.value === cl.value 
					})

					if(found){
						 //console.log("DOUNG", found)
						/*clue.value = valueMatch.filter(value => {
							return hasValues.indexOf(value)<=-1
						})[0]||0*/

						delete clue.value
					}

					delete clue.value
				}else{
					hasValues.push(clue.value)
				}
			}else{
				clue.value = valueMatch.filter(value => {
					return hasValues.indexOf(value)<=-1
				})[i-1]
			}
		})

		clues.forEach((clue, i) => {
			if(!clue.hasOwnProperty("value") || clue.value === undefined || clue.value === null){
				//clue.value = 0
				let VMG = valueMatch.filter(value => {
					return hasValues.indexOf(value)<=-1
				})

				//console.log("VMG", VMG, "I", i, "CLUE", clue, "HASVAL", hasValues)

				clue.value = VMG[i-1]||VMG[0]
			}
		})

		return clues
	},

	categoryUpperCase: function(clues){
		clues.forEach(clue => {
			clue.category.title = clue.category.title.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
		})

		return clues
	},

	answerUnescape: function(clues){
		clues.forEach(clue => {
			clue.answer = unescape(clue.answer).replace(/<(?:.|\n)*?>/gm, '')
		})

		return clues
	}
}