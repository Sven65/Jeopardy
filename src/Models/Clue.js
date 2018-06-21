const nohm = require('nohm')

const GameDataModel = nohm.model('Clue', {
	properties: {
		id: {
			type: "integer",
			unique: true,
			validations: ['notEmpty'],
			index: true
		},
		airdate: {
			type: "timestamp",
			validations: ['notEmpty']
		},
		category_id: {
			type: "integer",
			unique: true,
			validations: ['notEmpty']
		},
		created_at: {
			type: "timestamp",
			validations: ['notEmpty']
		},
		question: {
			type: "string",
			validations: ['notEmpty']
		},
		updated_at: {
			type: "timestamp",
			validations: ['notEmpty']
		},
		value: {
			type: "integer",
			validations: ['notEmpty']
		},
		answer: {
			type: "string",
			validations: ['notEmpty']
		}
	}
})