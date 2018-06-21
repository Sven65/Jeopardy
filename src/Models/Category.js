const nohm = require('nohm')

const CategoryModel = nohm.model('Category', {
	properties: {
		id: {
			type: "integer",
			unique: true,
			validations: ['notEmpty'],
			index: true
		},
		clues_count: {
			type: "integer",
			validations: ['notEmpty']
		},
		title: {
			type: "string",
			validations: ['notEmpty']
		},
		created_at: {
			type: "timestamp",
			validations: ['notEmpty']
		},
		updated_at: {
			type: "timestamp",
			validations: ['notEmpty']
		}
	}
})