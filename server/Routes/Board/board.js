const express = require("express")
const config = require("config")
const { Client } = require('pg')
const path = require('path')
const DatabaseUtils = require("../../util/DBUtils")
const GameUtils = require("../../util/GameUtils")

const client = new Client(config.get("Database"))
client.connect()

const dbUtils = new DatabaseUtils(client)

const app = express()

app.use(express.json())

function isset(variable){
	return (variable !== null && variable !== undefined)
}

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

app.get("/", async (req, res) => {
	res.status(404).send("Not Found.")
})

app.get("/:board", async (req, res) => {
	let boardData = await dbUtils.getBoardByID(req.params.board)

	if(boardData.rows.length <= 0){
		res.status(404).json({status: 404, message: "Board not found"})
		return
	}

	boardData = boardData.rows[0]

	let categoryData = []
	let clues = {}

	const start = async () => {
		await asyncForEach(boardData.categories, async (category) => {
			let categoryData = await dbUtils.getCategoryByID(category)

			if(clues[category] === undefined){
				clues[category] = []
			}

			let clueGet = await dbUtils.getCluesByCategoryID(category)

			if(clueGet.rows.length > 0){

				clueGet = clueGet.rows

				clueGet.forEach(clue => {
					clue.category = categoryData.rows[0]
				})

				clues[category] = clueGet					

				clues[category] = clues[category].slice(0, 5)

				clues[category] = GameUtils.valueFixer(GameUtils.valueFixer(clues[category]))

				GameUtils.categoryUpperCase(clues[category])
				GameUtils.answerUnescape(clues[category])
			}
		})

		res.header("Content-Type",'application/json');
		res.status(200).send(JSON.stringify({boardData, clues}, null, 4))
	}
	
	start()
})

module.exports =  app