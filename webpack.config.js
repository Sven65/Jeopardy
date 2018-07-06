const ConfigWebpackPlugin = require("config-webpack");
const webpack = require('webpack');

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
			},
			{
				 test: /\.(png|jpg|gif|webp|svg)$/,
				 use: [
				 	'file-loader'
				 ]
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: [
		new ConfigWebpackPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(require("./package.json").version)
		})
	]
}