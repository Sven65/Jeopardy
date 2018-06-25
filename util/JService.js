// Jservice wrapper thing

const snekfetch = require("snekfetch")

class JService{
	constructor(){
		this._maxOffset = 18414
		this._minOffset = 0

		this._categoryCount = 6

		this._baseURL = "http://jservice.io/api"
	}

	/**
	 * Gets an amount of random categories
	 * @function
	 * @param {Number} count - The amount of categories to get
	 * @param {Number} offset - The amount of offset to use
	 * @returns {Promise.<Array.<Object>>}
	 * @author Mackan
 	 */
	async getCategories(count, offset){
		return await snekfetch.get(`${this._baseURL}/categories?count=${count}&offset=${offset}`)
	}

	/**
	 * Gets the clues of a category
	 * @function
	 * @param {number} category - The ID of the category to get
	 * @returns {Promise.<Array.<Object>>}
	 * @author Mackan
	 */
	async getClues(category){
		return await snekfetch.get(`${this._baseURL}/clues?category=${category}`)
	}
}

module.exports = JService