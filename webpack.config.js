const HtmlWebpackPlugin = require('html-webpack-plugin');

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
        publicPath: "/assets/",
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
                use: [
                    {
                        loader: "style-loader"
                    }, 
                    {
                        loader: "css-loader"
                    }
                ]
            },
            { 
                test: /\.(png|jpg)$/, 
                loader: 'url-loader' 
            }, 
        
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'AI for Earth - LandcoverApp',
            template: __dirname + "/src/index.template.html"
        })
    ],
};