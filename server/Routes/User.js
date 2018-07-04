const express = require("express")
const bodyParser = require('body-parser')
const config = require("config")
const { Client } = require('pg')
const path = require('path')
const DatabaseUtils = require("../util/DBUtils")
const snekfetch = require("snekfetch")
const crypto = require("crypto")
const CryptoJS = require("crypto-js")


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
		res.sendFile(path.join(__dirname, `../Static/Pages/EmailValidation.html`))
	}else{
		res.status(400).json({error: "Invalid Verification Code."})
	}
})

app.get("/:userID/reset/:verificationCode", async (req, res) => {
	let userData = await dbUtils.getUserByID(req.params.userID)

	if(!isset(userData)){
		res.status(400).json({error: "Invalid user ID."})
		return
	}

	if(userData.passwordResetToken === req.params.verificationCode){
		res.sendFile(path.join(__dirname, `../Static/Pages/ResetPass.html`))
	}else{
		res.status(400).json({error: "Invalid Verification Code."})
	}
})

app.post("/verify/email", async (req, res) => {
	let resp = await snekfetch.post(`https://www.google.com/recaptcha/api/siteverify?response=${req.body.captchaResponse}&secret=${config.get("recaptchaSecret")}`).send()

	if(resp.body.success){
		let userData = await dbUtils.getUserByID(req.body.userID)

		if(userData.verificationCode !== req.body.verificationCode){
			res.send({success: false, errorCode: "1"})
			return
		}else{
			await dbUtils.setUserEmailVerificationCode(userData.ID, null)
			await dbUtils.setUserEmailVerified(req.body.userID, true)

			res.send({success: true})
		}
	}else{
		res.send({success: false, errorCode: "2"})
	}
})

app.post("/verify/password", async (req, res) => {
	let resp = await snekfetch.post(`https://www.google.com/recaptcha/api/siteverify?response=${req.body.captchaResponse}&secret=${config.get("recaptchaSecret")}`).send()

	if(resp.body.success){
		let userData = await dbUtils.getUserByID(req.body.userID)

		if(userData.passwordResetToken !== req.body.verificationCode){
			res.send({success: false, error: "Invalid Verification Code."})
			return
		}

		if(req.body.password !== req.body.cpassword){
			res.send({success: false, error: "Passwords don't match."})
			return
		}

		let salt = crypto.randomBytes(32).toString("hex")

		let password = req.body.password

		password = CryptoJS.SHA512(`${password} + ${config.get("Domain")} + ${salt}`)

		password = CryptoJS.enc.Base64.stringify(password)

		password = password.replace(/\=+$/, "")
		password = password.replace(/\+/g, "-")
		password = password.replace(/\//g, "_")

		password = password.trim()

		await dbUtils.setPasswordResetToken(userData.ID, null)
		await dbUtils.setUserLogin(req.body.userID, password, salt)

		res.send({success: true})
	}else{
		res.send({success: false, error: "Invalid captcha."})
	}
})

module.exports = app