const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // entry: __dirname + '/src/index.js',
    entry: {
        index: __dirname + '/src/index.js',
        // vendor: [
        //     __dirname + '/src/lib/calcite-web.min.js'
        // ],
    },
    output: {
        path: __dirname + '/build',
        // publicPath: "/assets/",
        filename: '[name].js'
    },
    devServer: {
        contentBase: "./build", 
        inline: true 
    },
    module: {
        loaders: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader" 
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            { test: /\.(png|jpg)$/,  loader: 'url-loader' }, 
            { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf$/,  loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot$/,  loader: "file-loader" },
            { test: /\.svg$/,  loader: "url-loader?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'AI for Earth - LandcoverApp',
            template: __dirname + "/src/index.template.html"
        }),
        new UglifyJsPlugin(),
        new ExtractTextPlugin("styles.css")
    ],
};