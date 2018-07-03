const express = require("express")
const bodyParser = require('body-parser')
const config = require("config")
const { Client } = require('pg')
const path = require('path')
const DatabaseUtils = require("../util/DBUtils")
const snekfetch = require("snekfetch")

const client = new Client(config.get("Database"))
client.connect()

const dbUtils = new DatabaseUtils(client)

const app = express()

app.use(express.json())

function isset(variable){
	return (variable !== null && variable !== undefined)
}

app.get("/:userID/verify/:verificationCode", async (req, res) => {
	let userData = await dbUtils.getUserByID(req.params.userID)

	if(!isset(userData)){
		res.status(400).json({error: "Invalid user ID."})
		return
	}

	if(userData.verificationCode === req.params.verificationCode){
		res.sendFile(path.join(__dirname, `../Static/EmailValidation/Validated.html`))
	}else{
		res.status(400).json({error: "Invalid Verification Code."})
	}
})

app.post("/verify", async (req, res) => {
	console.log("BOD", req.body)

	let resp = await snekfetch.post(`https://www.google.com/recaptcha/api/siteverify?response=${req.body.captchaResponse}&secret=${config.get("recaptchaSecret")}`).send()

	if(resp.body.success){
		let userData = await dbUtils.getUserByID(req.body.userID)

		if(userData.verificationCode !== req.body.verificationCode){
			res.send({success: false, errorCode: "1"})
			return
		}else{
			await dbUtils.setUserEmailVerified(req.body.userID, true)

			res.send({success: true})
		}
	}else{
		res.send({success: false, errorCode: "2"})
	}

	
	//console.log("RES", response.body)
})

module.exports = app