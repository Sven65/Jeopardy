const config = require("config")
const fs = require("fs")

const { Client } = require('pg')
const client = new Client(config.get("Database"))

const app = require('./app')
const JService = require('./util/JService')

const JS = new JService()
const FuzzyMatching = require('fuzzy-matching')
const CryptoJS = require("crypto-js")
const crypto = require("crypto")

const DatabaseUtils = require("./util/DBUtils")


/** 
 * @TODO: Add passwords to rooms
 * @TODO: Make users able to register to keep track of wins and such
 * @TODO: Make registered users able to add custom categories
 * @TODO: Move roomData into postgres
 * @TODO: Make the clues actually get inserted into the game.questions column in postgres
 * @TODO: Cleanup
 */

/*const Query = require('pg').Query;
const submit = Query.prototype.submit;
Query.prototype.submit = function() {
	const text = this.text;
	const values = this.values;
	const query = values.reduce((q, v, i) => q.replace(`$${i + 1}`, v), text);
	console.log(query);
	submit.apply(this, arguments);
};*/

client.connect()

let roomData = {}
let roomTimers = {}

const port = (config.get("Server.port") || 3100)
const host = (config.get("Server.host") || undefined)

const questionAmount = config.get("Game.questionAmount")
const minPlayers = config.get("Game.minPlayers")
const maxPlayers = config.get("Game.maxPlayers")

const GameUtils = require("./util/GameUtils")

const User = require("./Structs/User")
const Game = require("./Structs/Game")
const DBUtils = new DatabaseUtils(client)

const server = app.listen(port, host, () => {
	// ask server for the actual address and port its listening on
	const listenAddress = server.address()
	console.log(`Jeopardy server running on ${listenAddress.address}:${listenAddress.port}` )
})

const io = require("socket.io")(server)

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}

Object.defineProperty(String.prototype, "sanitizeHTML", {
	enumerable: false,
	writable: true,
	value: function(){

		const map = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#x27;",
			"/": "&#x2F;"
		}

		return this.replace(/[&<>]/g, c => {
			return map[c]
		})
	}
})

function isset(variable){
	return (variable !== null && variable !== undefined)
}

function sendSystemMessage(roomID, message){
	io.to(roomID).emit('EVENT_CHAT', {
		message: message,
		user: {
			username: "SYSTEM",
			userID: "SYSTEM"
		},
		timeStamp: Date.now()
	})
}

async function getRoomByID(roomID){
	let roomData = await client.query(`SELECT * FROM games WHERE "roomID" = $1`, [roomID])

	if(!isset(roomData.rows[0])){
		return null
	}

	roomData.rows[0].db = client
	return new Game(roomData.rows[0])
}

io.on("connection", socket => {

	/**
	 * Handles events emitted before a user is disconnected, such as by a refresh of the page
	 */
	socket.on("disconnecting", async () => {
	    let rooms = Object.keys(socket.rooms);

		const start = async () => {
			await asyncForEach(rooms, async (roomID) => {
				if(!isset(roomID)){
					return
				}

				let room = await getRoomByID(roomID)

				if(!isset(room)){
					return
				}

				let user = room.getUserByID(socket.id)

				if(!isset(user)){
					return
				}

				let data = {
					timeStamp: Date.now(),
					roomCode: roomID,
					user: {
						id: socket.id,
						username: user.username
					}
				}

				await room.removeUser(user)

				if(room.playerCount <= 0){

					clearTimeout(roomTimers[roomID])
					clearInterval(roomTimers[roomID])

					delete roomTimers[roomID]

					room.delete()
				}

				io.to(roomID).emit("USER_LEAVE", data)
				socket.leave(roomID)
			})
		}
		
		start()
	})

	/**
	 * Handles when a user clicks the "Leave Game" button
	 */
	socket.on("USER_ACTION_LEAVE", async data => {
		let roomID = data.roomID

		room = await getRoomByID(roomID)

		if(!isset(room)){
			return
		}

		let user = room.getUserByID(socket.id)

		if(!isset(user)){
			return
		}

		Object.assign(data, {
			timeStamp: Date.now(),
			roomCode: roomID,
			user: {
				id: socket.id,
				username: user.username
			}
		})

		await room.removeUser(user)

		if(room.playerCount <= 0){

			clearTimeout(roomTimers[roomID])
			clearInterval(roomTimers[roomID])

			delete roomTimers[roomID]

			room.delete()
		}

		io.to(roomID).emit("USER_LEAVE", data)
		socket.leave(roomID)
	})

	/**
	 * Handles user joining
	 */
	socket.on("JOIN", async data => {

		let isHost = false
		let canJoin = false
		let errorMessage = "Game is still loading, please wait."
		

		data.roomID = data.roomID.sanitizeHTML()
		data.username = data.username.sanitizeHTML()

		let room = await getRoomByID(data.roomID)

		if(!isset(room)){

			await client.query(`INSERT INTO games ("roomID", "currentQuestion", "isStarted", questions, users) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
				data.roomID,
				null,
				false,
				{},
				[]
			])	

			room = await getRoomByID(data.roomID)
		}
		
		if(Object.keys(room.questions) <= 0 && room.users.length <= 0){
			isHost = true
		}

		if(isset(room.questions) && room.questions.loaded){
			canJoin = true
		}else{
			if(isHost){
				canJoin = true
			}
		}

		if(room.checkUsernameInRoom(data.username)){
			canJoin = false
			errorMessage = "Username already in use."
		}

		if(room.users.length >= maxPlayers){
			canJoin = false
			errorMessage = "Game is full."
		}

		if(canJoin){
			socket.join(data.roomID)

			data.timeStamp = Date.now()
			data.roomID = data.roomID
			data.userID = socket.id
			data.host = isHost
			data.isTurn = isHost
			data.balance = 0

			let user = new User(data)

			await room.addUser(user)

			room.users.forEach(user => {
				socket.emit("USER_JOIN", user)
			})


			io.to(data.roomID).emit("USER_JOIN", data)
		}else{
			socket.emit("GERROR", {type: "JOIN", reason: errorMessage})
		}
	})

	/**
	 * Handles all chat messages along with answering in the chat
	 */
	socket.on('chat', async data => {
		let emitChat = true

		let room = await getRoomByID(data.roomID)

		if(!isset(room)){
			return
		}

		data.message = data.message.sanitizeHTML()

		if(data.message.length <= 0){
			return
		}

		if(!room.checkUserIDInRoom(data.user.userID)){
			return
		}

		let user = room.getUserByID(data.user.userID)

		if(!isset(user)){
			return
		}

		if(room.isStarted && user.isTurn && isset(room.currentQuestion)){
			let answer = room.currentQuestion.answer.toLowerCase()
			let fm = new FuzzyMatching([answer])

			if(answer === fm.get(data.message.toLowerCase(), {maxChanges: 2}).value){
				emitChat = false
				sendSystemMessage(data.roomID, `User **${user.username}** got it right! The answer was **${room.currentQuestion.answer}**`)
				
				let turnData = await room.changeTurn(user)

				//user.balance += room.currentQuestion.value

				await room.addUserBalance(user.userID, room.currentQuestion.value)

				io.to(data.roomID).emit('GAME_EVENT_ANSWERED', {
					user: user,
					clue: room.currentQuestion,
					newBalance: user.balance
				})

				await room.setCurrentQuestion(null)

				if(isset(roomTimers[data.roomID])){
					clearTimeout(roomTimers[data.roomID])
					clearInterval(roomTimers[data.roomID])
				}

				if(room.checkQuestionsLeft(questionAmount) <= 0){
					await room.setGameOver(true)

					io.to(data.roomID).emit("GAME_OVER", {
						standings: room.users.sort((a, b) => {
							return b.balance - a.balance
						})
					})
				}else{
					io.to(data.roomID).emit("CHANGE_TURN", {
						oldTurn: user.userID,
						newTurn: room.users[turnData.newTurnIndex].userID,
						ID: 1
					})
				}
			}
		}

		if(emitChat){
			io.to(data.roomID).emit('EVENT_CHAT', data)
		}
		
	})

	/**
	 * Gets and sends data from jservice to the client
	 */
	socket.on("ACTION_GETQUESTIONS", async data => {
		console.log("ACT_GQ", data)

		let room = await getRoomByID(data.roomID)

		if(!isset(room)){
			return
		}

		if(data.force){
			room.questions = null
		}

		if(Object.keys(room.questions).length > 0 && !data.force){
			data.clues = room.questions.clues
			io.to(data.roomID).emit("ACTION_GOTQUESTIONS", data)
		}else{

			let categoryGet = await JS.getCategories(JS._categoryCount, Math.floor(Math.random() * JS._maxOffset) + JS._minOffset)
			let categories = categoryGet.body

			let clues = {}

			const start = async () => {
				await asyncForEach(categories, async (category) => {
					if(clues[category.id] === undefined){
						clues[category.id] = []
					}

					let clueGet = await JS.getClues(category.id)

					clues[category.id] = clueGet.body					

					clues[category.id] = clues[category.id].slice(0, 5)

					clues[category.id] = GameUtils.valueFixer(GameUtils.valueFixer(clues[category.id]))

					GameUtils.categoryUpperCase(clues[category.id])
					GameUtils.answerUnescape(clues[category.id])
				})

				data.clues = clues

				io.to(data.roomID).emit("ACTION_GOTQUESTIONS", data)

				if(!isset(room.questions)){
					room.questions = {}
				}

				await room.setQuestions({
					loaded: true,
					clues
				})
			}
			
			start()
		}
	})

	/**
	 * Starts the game if there's enough users
	 */
	socket.on("GAME_ACTION_START", async data => {
		let room = await getRoomByID(data.roomID)

		if(!isset(room)){
			return
		}

		if(room.playerCount >= minPlayers){

			//room.isStarted = true
			await room.setStarted(true)

			io.to(data.roomID).emit("GAME_ACTION_STARTED", {timeStamp: Date.now()})

			sendSystemMessage(data.roomID, `User ${room.getUserByID(data.userID).username} started the game!`)

			io.to(data.roomID).emit("CHANGE_TURN", {
				oldTurn: data.userID,
				newTurn: data.userID,
				ID: 2
			})
		}else{
			socket.emit('EVENT_CHAT', {
				message: `Not enough users to start game!`,
				user: {
					username: "SYSTEM",
					userID: "SYSTEM"
				},
				timeStamp: Date.now()
			})
		}
	})

	/**
	 * Gets and sends clue data to the client and rooms when requested
	 */
	socket.on("GAME_ACTION_GET_QUESTION", async data => {
		console.log("GETQ", data)

		let room = await getRoomByID(data.roomID)

		if(!isset(room)){
			return
		}

		if(room.gameOver){
			return
		}

		let user = room.getUserByID(data.userID)

		if(!isset(user)){
			return
		}

		if(!user.isTurn || !room.isStarted){
			return
		}

		if(isset(room.currentQuestion)){
			return
		}

		if(!isset(room.questions.clues[data.categoryID])){
			return
		}

		let clueData = room.getClueData(data.categoryID, parseInt(data.clueID))

		if(!isset(clueData)){
			return
		}

		if(clueData.revealed){
			return
		}

		data.questionData = clueData

		await room.setClueRevealed(data.categoryID, parseInt(data.clueID))

		await room.setCurrentQuestion(clueData)

		roomTimers[data.roomID] = setTimeout(() => {
			clearTimeout(roomTimers[data.roomID])

			let timeLeft = config.get("Game.timers.answerTime.countdown")

			roomTimers[data.roomID] = setInterval(async () => {
				if(timeLeft > 0){
					sendSystemMessage(data.roomID, `User **${user.username}** has **${timeLeft}** seconds to answer`)
					timeLeft--
					return
				}

				clearInterval(roomTimers[data.roomID])

				
				sendSystemMessage(data.roomID, `User **${user.username}** took too long to answer correctly! The answer was **${room.currentQuestion.answer}**!`)
				
				await room.setCurrentQuestion(null)

				if(room.checkQuestionsLeft(questionAmount) > 0){

					let turnData = await room.changeTurn(user)
					io.to(data.roomID).emit("CHANGE_TURN", {
						oldTurn: user.userID,
						newTurn: room.users[turnData.newTurnIndex].userID,
						ID: 3
					})

					return
				}

				await room.setGameOver(true)

				io.to(data.roomID).emit("GAME_OVER", {
					standings: room.users.sort((a, b) => {
						return b.balance - a.balance
					})
				})

			}, 1000)
		}, config.get("Game.timers.answerTime.beforeCountdown")*1000)

		io.to(data.roomID).emit("GAME_ACTION_GOT_QUESTION", data)
	})

	/**
	 * Gets and sends room data to a client
	 */
	socket.on("GET_ROOM", d => {
		socket.emit("DEBUG", roomData[d.roomID])
	})

	/**
	 * Sends debug information
	 */
	socket.on("DEBUG", d => {
		console.log("DEBUG", d)
		socket.emit("DEBUG", d)
	})

	/**
	 * Handles user registration
	 */
	socket.on("USER_REGISTER", async data => {
		if(data.password !== data.cpassword){
			socket.emit("USER_REGISTER_ERROR", {reason: "Passwords don't match"})
			return
		}

		let usernameExists = await DBUtils.usernameExists(data.username)

		if(usernameExists){
			socket.emit("USER_REGISTER_ERROR", {reason: "Username Already Registered."})
			return
		}

		let emailExists = await DBUtils.emailExists(data.email)

		if(emailExists){
			socket.emit("USER_REGISTER_ERROR", {reason: "Email Already Registered."})
			return
		}

		data.salt = crypto.randomBytes(32).toString("hex")

		data.cpassword = ""

		data.password = CryptoJS.SHA512(`${data.password} + ${config.get("Domain")} + ${data.salt}`)

		data.password = CryptoJS.enc.Base64.stringify(data.password)

		data.password = data.password.replace(/\=+$/, "")
		data.password = data.password.replace(/\+/g, "-")
		data.password = data.password.replace(/\//g, "_")

		data.password = data.password.trim()

		await DBUtils.registerUser(data)

		socket.emit("USER_REGISTERED", data)
	})
})

process.on('unhandledRejection', (reason, p) => {
	console.error("\n\nUnhandled Rejection at ", p, '\nreason\n ', reason, "\n\n")
})
