const ConfigWebpackPlugin = require("config-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');

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
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': process.env.NODE_ENV
		}),
		new ConfigWebpackPlugin(),
		new webpack.DefinePlugin({
			VERSION: JSON.stringify(require("./package.json").version)
		}),

		new MiniCssExtractPlugin({
			path: __dirname+'/dist',
			publicPath: '/',
			filename: "bundle.css"
		}),
		new webpack.optimize.AggressiveMergingPlugin(),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		})
	],
	optimization: {
		minimize: true
	}
	/*optimization: {
		splitChunks: {
			chunks: 'async',
			minSize: 30000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			automaticNameDelimiter: '~',
			name: true,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		}
	}*/
}