var path = require('path');
var webpack=require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 覆盖ant样式
var theme = require('../src/theme/modifyVars');

module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/index.js'), //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
    output: {
        path: path.resolve(__dirname, '../dist/'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        '@babel/preset-env', 
                        '@babel/preset-react'
                    ],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        [
                            "import", 
                            {
                                libraryName: "antd",
                                libraryDirectory: "es",
                                style: true // `style: true` 会加载 less 文件
                            }
                        ]
                    ]
                }
            },{
                test: /\.html/, 
                loader: "html-loader"
            },{                  
                test: /\.css$/,                 
                loader: 'style-loader!css-loader',
                options: {
                    sourceMap: true
                }
            },{                  
                // test: /\.less$/,                 
                // loader: 'less-loader',
                test: /\.less$/,
                exclude: [path.resolve(__dirname, 'node_modules')],
                use: [{
                    loader: 'style-loader'
                },{
                    loader: 'css-loader'
                },{
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                        modifyVars: theme(),
                        javascriptEnabled: true,
                    }
                }]
            },{
                test: /\.jpg$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        alias: {
            // 图片资源
            'images': path.resolve(__dirname, '../src/images'),
            // Redux ActionType
            'ActionTypes': path.resolve(__dirname, '../src/reducers/ActionTypes'),
            // 工具
            'HttpPost': path.resolve(__dirname, '../src/utils/HttpPost'),
            'MathFloat': path.resolve(__dirname, '../src/utils/MathFloat'),
            // 主题
            'theme': path.resolve(__dirname, '../src/theme'),
            // 配置
            'config': path.resolve(__dirname, '../src/config'),
            // 常量
            'constantclient': path.resolve(__dirname, '../src/constants/client'),
            'constantrisk': path.resolve(__dirname, '../src/constants/risk'),
            'constanthome': path.resolve(__dirname, '../src/constants/home'),
            'constantlayout': path.resolve(__dirname, '../src/constants/layout'),
            'constantrights': path.resolve(__dirname, '../src/constants/rights'),
            'constantsystem': path.resolve(__dirname, '../src/constants/system'),
            'constanttrade': path.resolve(__dirname, '../src/constants/trade'),
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "掌玩科技后台管理系统",
            template: path.resolve(__dirname, '../index.html'),
            filename: path.resolve(__dirname, '../dist/index.html'),
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            CryptoJS: 'crypto-js',
            moment: 'moment'
        })
    ],
    devServer: {
        // 解决界面刷新路由问题
        historyApiFallback: true
    }
}