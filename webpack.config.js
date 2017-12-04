const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/src/index.js',
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: "./build", //本地服务器所加载的页面所在的目录
        inline: true //实时刷新
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
            }
        
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + "/src/index.template.html"
        })
    ],
};