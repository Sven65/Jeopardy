module.exports = {
	entry: "./app/js/app.js",
	output: {
		path: __dirname+'/app/js',
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'/*,
					options: {
						presets: ["es2015"]
					}*/
				}
			}
		]
	}
}