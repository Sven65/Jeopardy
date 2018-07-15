const ConfigWebpackPlugin = require("config-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

function getPlugins() {
	let plugins =  [
		new ConfigWebpackPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(require("./package.json").version)
		}),

		new MiniCssExtractPlugin({
			path: __dirname+'/dist',
			publicPath: '/',
			filename: "bundle.css"
		})
	]

	// Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
	// inside your code for any environment checks; UglifyJS will automatically
	// drop any unreachable code.
	

	// Conditionally add plugins for Production builds.
	if (process.env.NODE_ENV === "production") {
		plugins.push(new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
			}
		}));

		plugins.push(new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		}))
	}

	return plugins;
}

module.exports = {
	entry: "./src/index.js",
	output: {
		path: __dirname+'/dist',
		publicPath: '/',
		filename: 'bundle.js',
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
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	plugins: getPlugins()
}