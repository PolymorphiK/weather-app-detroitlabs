const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	devtool: 'eval-source-map',
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
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript"
						]
					}
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html'
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