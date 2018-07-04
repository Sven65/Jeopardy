const config = require("config")
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const exphbs = require('express-handlebars');

class EmailUtils{
	constructor(){
		this._mailTransporter = nodemailer.createTransport(config.get("Email.Transport"))

		this._mailTransporter.use('compile', hbs({
			viewEngine: exphbs,
			viewPath: __dirname + '/../Static/EmailTemplates/'
		}));
	}

	async sendEmail({
		to = "",
		subject = "",
		template = "",
		context = {}
	}){
		let mailOptions = {
			from: config.get("Email.Options.from"),
			to,
			subject,
			template,
			context
		}

		this._mailTransporter.sendMail(mailOptions, (error, info) => {
			return info
		})
	}
}

module.exports = EmailUtils