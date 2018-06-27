// @TODO: Make this redis ORM thing work

const config = require("config")
/*const redis = require("redis")*/

const app = require('./app')
const JService = require('./util/JService')

const JS = new JService()
const FuzzyMatching = require('fuzzy-matching')
/*
const redisCli = redis.createClient({
	host: config.get('redis.host'),
	port: config.get('redis.port')
})

redisCli.on("error", err => {
	throw err
})

redisCli.on("connect", () => {
	nohm.setClient(redisCli)
})


// START: NOHM START \\

nohm.setPrefix('Jeopardy')
require('./util/Models')

// END: NOHM SETUP \\

//const http = require("http").Server(app)

/** 
 * @TODO: Add passwords to rooms
 * @TODO: Add instructions to main page
 * @TODO: Make the game layout work on mobile phones
 * @TODO: Make users able to register to keep track of wins and such
 * @TODO: Make registered users able to add custom categories
 * @TODO: Move roomData into redis or something
 * @TODO: Cleanup
 */


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

io.on("connection", socket => {

	/**
	 * Handles events emitted before a user is disconnected, such as by a refresh of the page
	 */
	socket.on("disconnecting", () => {
		let roomID = socket.rooms[Object.keys(socket.rooms)[1]]
		room = roomData[roomID]

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

		room.removeUser(user)

		if(room.playerCount <= 0){
			delete roomData[roomID]

			clearTimeout(roomTimers[roomID])
			clearInterval(roomTimers[roomID])

			delete roomTimers[roomID]
		}

		socket.leave(roomID)
		io.to(roomID).emit("USER_LEAVE", data)
	})

	/**
	 * Handles when a user clicks the "Leave Game" button
	 */
	socket.on("USER_ACTION_LEAVE", data => {
		let roomID = data.roomID

		room = roomData[roomID]

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

		room.removeUser(user)

		if(room.playerCount <= 0){
			delete roomData[roomID]

			clearTimeout(roomTimers[roomID])
			clearInterval(roomTimers[roomID])

			delete roomTimers[roomID]
		}

		socket.leave(roomID)
		io.to(roomID).emit("USER_LEAVE", data)
	})

	/**
	 * Handles user joining
	 */
	socket.on("JOIN", data => {

		let isHost = false
		let canJoin = false
		let errorMessage = "Game is still loading, please wait."

		data.roomID = data.roomID.sanitizeHTML()
		data.username = data.username.sanitizeHTML()

		if(roomData[data.roomID] === undefined){
			roomData[data.roomID] = new Game({
				users: [],
				isStarted: false,
				currentQuestion: null
			})
		}


		if(!isset(roomData[data.roomID].questions) && roomData[data.roomID].users.length <= 0){
			isHost = true
		}

		if(isset(roomData[data.roomID].questions) && roomData[data.roomID].questions.loaded){
			canJoin = true
		}else{
			if(isHost){
				canJoin = true
			}
		}

		if(roomData[data.roomID].checkUsernameInRoom(data.username)){
			canJoin = false
			errorMessage = "Username already in use."
		}

		if(roomData[data.roomID].users.length >= maxPlayers){
			canJoin = false
			errorMessage = "Game is full."
		}

		if(canJoin){
			socket.join(data.roomID)

			data.timeStamp = Date.now()
			data.roomCode = data.roomID
			data.userID = socket.id
			data.host = isHost
			data.isTurn = isHost
			data.balance = 0

			let user = new User(data)

			roomData[data.roomID].users.push(data)

			roomData[data.roomID].users.forEach(user => {
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
	socket.on('chat', data => {
		let emitChat = true

		let room = roomData[data.roomID]

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
				
				let turnData = room.changeTurn(user)

				user.balance += room.currentQuestion.value

				io.to(data.roomID).emit('GAME_EVENT_ANSWERED', {
					user: user,
					clue: room.currentQuestion,
					newBalance: user.balance
				})

				room.currentQuestion = null

				if(isset(roomTimers[data.roomID])){
					clearTimeout(roomTimers[data.roomID])
					clearInterval(roomTimers[data.roomID])
				}

				if(room.checkQuestionsLeft(questionAmount) <= 0){
					room.gameOver = true

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

		let room = roomData[data.roomID]

		if(!isset(room)){
			return
		}

		if(data.force){
			room.questions = null
		}

		if(isset(roomData[data.roomID].questions) && !data.force){
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

				room.questions = {
					loaded: true,
					clues
				}
			}
			
			start()
		}
	})

	/**
	 * Starts the game if there's enough users
	 */
	socket.on("GAME_ACTION_START", data => {
		let room = roomData[data.roomID]

		if(!isset(room)){
			return
		}

		if(room.playerCount >= minPlayers){

			room.isStarted = true

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
	socket.on("GAME_ACTION_GET_QUESTION", data => {
		console.log("GETQ", data)

		let room = roomData[data.roomID]

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

		room.setClueRevealed(data.categoryID, parseInt(data.clueID))

		room.currentQuestion = clueData

		roomTimers[data.roomID] = setTimeout(() => {
			clearTimeout(roomTimers[data.roomID])

			let timeLeft = config.get("Game.timers.answerTime.countdown")

			roomTimers[data.roomID] = setInterval(() => {
				if(timeLeft > 0){
					sendSystemMessage(data.roomID, `User **${user.username}** has **${timeLeft}** seconds to answer`)
					timeLeft--
					return
				}

				clearInterval(roomTimers[data.roomID])

				
				sendSystemMessage(data.roomID, `User **${user.username}** took too long to answer correctly! The answer was **${room.currentQuestion.answer}**!`)
				
				room.currentQuestion = null

				if(room.checkQuestionsLeft(questionAmount) > 0){

					let turnData = room.changeTurn(user)
					io.to(data.roomID).emit("CHANGE_TURN", {
						oldTurn: user.userID,
						newTurn: room.users[turnData.newTurnIndex].userID,
						ID: 3
					})

					return
				}

				room.gameOver = true

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
})

process.on('unhandledRejection', (reason, p) => {
	console.error("\n\nUnhandled Rejection at ", p, '\nreason\n ', reason, "\n\n")
})
