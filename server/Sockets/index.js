const config = require("config")
const { Client } = require('pg')
const client = new Client(config.get("Database"))
client.connect()

const DatabaseUtils = require("../util/DBUtils")
const dbUtils = new DatabaseUtils(client)

require('fs').readdirSync(__dirname + '/').forEach(file => {
	if (file.match(/\.js$/) !== null && file !== 'index.js') {
		let name = file.replace('.js', '').toLowerCase();
		let reqFile = require('./' + file);
		exports[name] = new reqFile({dbUtils})
	}
});