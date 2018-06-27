const nohm = require('nohm')

const GameDataModel = nohm.model('Game', {
	properties: {
		gameID: {
			type: "string",
			unique: true,
			validations: ['notEmpty'],
			index: true
		}
	}
})