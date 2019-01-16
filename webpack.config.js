const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: [
		'./src/main.ts'
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ['ts-loader', 'angular2-template-loader'],
				exclude: /node_modules/
			},
			{
				test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
				parser: {system: true},
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(css|scss)$/,
				use: [
					{
						loader: "to-string-loader"
					},
					{
						loader: "style-loader"
					}, {
						loader: "css-loader"
					}, {
						loader: "sass-loader"
					}]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=10000',
			}, {
				test: /\.(eot|ttf|wav|mp3|pdf)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader',
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js', '.scss']
	},
	plugins: [
		new CleanWebpackPlugin('dist'),
		new webpack.ContextReplacementPlugin(
			/angular([\\/])core/,
			path.resolve(__dirname, 'src'),
			{}
		),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			inject: 'body'
		}),
		new webpack.DefinePlugin({
			// global app config object
			config: JSON.stringify({
				apiUrl: 'http://localhost:8080/rest'
			})
		}),
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
			jquery: 'jquery'
		}),
		new ExtractTextWebpackPlugin('styles/styles.scss'),
		new OptimizeCssAssetsWebpackPlugin()
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					chunks: "initial",
					minChunks: 3,
					name: "commons",
					enforce: true
				}
			}
		},
		runtimeChunk: true,
		minimizer:
			[
				new UglifyJsPlugin({
					cache: true,
					parallel: true,
					uglifyOptions: {
						compress: false,
						ecma: 6,
						mangle: true
					},
					sourceMap: true
				})
			]
	},
	devtool: 'source-map',
	devServer: {
		port: 3000,
		contentBase: './src/',
		historyApiFallback: true
	}
};
