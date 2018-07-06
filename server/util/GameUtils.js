let converter = require("number-to-words");
let wordsToNumbers = require('words-to-numbers');

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
	},

	_nth(n){
		return["st","nd","rd"][(((n<0?-n:n)+90)%100-10)%10-1]||"th"
	},

	answerResolver: function(answer){
		let answers = [
			answer,
			// Symbols
			answer.replace(/&/g, "and"),
			answer.replace(/"/g, ""),
			answer.replace(/'/g, ""),
			answer.replace(/-(?!\d)/g, " "),

			// Parenthesis
			answer.replace(/\(/g, "").replace(/\)/g, ""),

			// Determiners
			answer.replace(/an\s/i, ""),
			answer.replace(/a\s/i, ""),
			answer.replace(/the\s/i, ""),

			// Words to symbols

			answer.replace(/and/gi, "&"),

			// Words in parenthesis at start and end of answer

			answer.replace(/^\(.*\)\s/, ""),
			answer.replace(/\(.*\)$/, "").replace(/\s*$/, ""),

			// Fix answers with (or *)
			answer.replace(/\s\(or\s(.*)\)/i, ""),

			// Numbers

			// Converts integers into words
			answer.replace(/\d/g, s => {
				return converter.toWords(s)
			}),

			// Coverts words into numbers
			answer.replace(/\d/g, s => {
				return wordsToNumbers.wordsToNumbers(s).toString()
			}),

			// Converts words into numbers
			wordsToNumbers.wordsToNumbers(answer),

			// Converts words in the answer to ordinal strings
			wordsToNumbers.wordsToNumbers(answer).toString().replace(/\d/g, s => {
				return converter.toWordsOrdinal(s)
			}),

			// Converts words at the end of the string into ordinal numbers
			wordsToNumbers.wordsToNumbers(answer).toString().replace(/\d$/g, s => {
				return s+this._nth(s)
			}),

			// Converts words with dashes at the end of the string into ordinal numbers
			wordsToNumbers.wordsToNumbers(answer.replace(/-(?!\d)/g, " ")).toString().replace(/\d$/g, s => {
				return s+this._nth(s)
			})
		]

		// Fix answers with "(or *)"
		let parenthesisOrMatch = answer.match(/\(or\s.*\)/i)

		if(parenthesisOrMatch !== null){

			if(parenthesisOrMatch.length >= 1){
				parenthesisOrMatch = parenthesisOrMatch[0]

				parenthesisOrMatch = parenthesisOrMatch.match(/\(or\s(.*)\)/i)

				if(parenthesisOrMatch !== null){

					if(parenthesisOrMatch.length >= 2){
						let fixedAnswer = answer.replace(/^.*\(or\s.*\)/i, parenthesisOrMatch[1])
						
						if(fixedAnswer.split(" ").length > 1){
							answers.push(fixedAnswer)
						}
					}
				}
			}
		}

		return answers
	}
}