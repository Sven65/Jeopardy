module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname+'/dist',
		publicPath: '/',
		filename: "bundle.js"
	},
	devServer: {
		contentBase: './dist'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	}
}