const express = require("express")
const app = express()
const path = require("path")

app.use('/user', require('./Routes/User'))
app.use('/board', require('./Routes/Board'))
app.use('/Assets', express.static(path.join(__dirname, './Static/Assets')))

app.get('/Privacy', (req, res) => {
	res.sendFile(path.join(__dirname, './Static/Pages/Privacy.html'))
})

if(process.env.NODE_ENV === "production"){
	app.get('*.js', function (req, res, next) {
		console.log("NIGGER")
		req.url = req.url + '.gz';
		res.set('Content-Encoding', 'gzip');
		next();
	});
}


app.use(express.static(path.join(__dirname, '../dist')))



module.exports = app