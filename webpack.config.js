const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const DotenvFlow = require('dotenv-flow-webpack');
const Dotenv = require('dotenv')

const rulesStyles = {
    test: /\.(sa|sc|c)ss$/,
    use: [
        MiniCssExtractPlugin.loader,
        // Creates `style` nodes from JS strings
        "css-loader",
        // Compiles Sass to CSS
        "sass-loader",
    ],
}

/*const rulesBabel = {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: ['@babel/preset-env']
        }
    }
}*/

module.exports = function (env) {
    Dotenv.config({path: './.env.' + env.NODE_ENV});
    const config = {
        output: {
          filename: env.NODE_ENV === 'production'
            ? 'static/[name].[contenthash].js'
            : 'index.js',
          path: path.resolve(__dirname, 'build'),
          publicPath: '',
          clean: true
        },
        plugins: [
            new MiniCssExtractPlugin({
              filename: "static/[name].[contenthash].css",
            }),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new DotenvFlow({
                node_env: env.NODE_ENV ? env.NODE_ENV : 'development'
            })],
        module: {
            rules: [rulesStyles/*, rulesBabel*/]
        }
    }
    if (env.NODE_ENV === 'development') {
        config.mode = 'development'
        config.devtool = 'inline-source-map'
        config.devServer = {
            historyApiFallback: true,
            static: './build',
            port: 3500,
        }
        config.watchOptions = {
            ignored: [path.resolve(__dirname, 'src'), './node_modules']
        }
    }
    return config
}
