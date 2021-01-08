const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	devtool: "eval-source-map",
	// Relative path
	entry: "./src/index.tsx",
	output: {
		filename: "bundle.js",
		// Absolute path
		path: path.resolve(__dirname, "dist")
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					"style-loader",
					"css-loader"
				]
			},
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript"
						]
					}
				}
			},
			{
				test: /\.svg$/i,
				use: [
					{
						loader: 'babel-loader'
					},
					{
						loader: 'react-svg-loader',
						options: {
							jsx: true
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html"
		})
	],
	resolve: {
		extensions: [
			".ts",
			".tsx",
			".js",
			".jsx"
		],
		alias: {
			"src": path.resolve("./src")
		}
	}
};