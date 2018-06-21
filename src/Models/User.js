const nohm = require('nohm')

const UserModel = nohm.model('User', {
	properties: {
		gameCode: {
			type: "string",
			validations: ['notEmpty']
		},
		roomCode: {
			type: "string",
			validations: ['notEmpty']
		},
		timeStamp: {
			type: "string",
			validations: ['notEmpty']
		},
		username: {
			type: "string",
			validations: ['notEmpty']
		},
		host: {
			type: "boolean"
		},
		userID: {
			type: "string",
			unique: true,
			validations: ['notEmpty'],
			index: true
		}
	}
})