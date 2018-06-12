const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const ExtractPlugin = require('extract-text-webpack-plugin');
const VueServerPlugin = require('vue-server-renderer');
const path = require('path');

let config = merge(baseConfig, {
    target: 'node',
    entry: path.join(__dirname, '../client/server-entry.js'),
    devtool: 'source-map',
    output: {
        // 打包入口
        libraryTarget: 'commonjs2',
        filename: 'server-entry.js',
        path: path.join(__dirname, '../server-build')
    },
    // 不需要将vue的核心代码打包到server-entry.js，服务端环境可以直接require到。
    externals: Object.keys(require('../package.json').dependencies),
    module: {
        rules: [
            {
                test: /\.styl/,
                use: ExtractPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: [
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                })
            }
        ]
    },
    resolve: {
    },
    plugins: [
        new ExtractPlugin('styles.css'),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        // 利用 vue-server-renderer去进行服务端渲染
        new VueServerPlugin()
    ]
});
module.exports = config;
