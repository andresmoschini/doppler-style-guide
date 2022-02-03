const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const DotenvFlow = require('dotenv-flow-webpack');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const Dotenv = require('dotenv')

const mapFileManifest = (file) => {
    if (process.env.NODE_ENV === 'development') {
        return file
    }
    file.path = `${process.env.PUBLIC_URL}/${file.path}`
    return file;
}

const serializeManifest = (seed, files, entries) => {
    files = files.map(mapFileManifest)
    const filesSerialized = {}
    for (const file of files) {
        filesSerialized[file.name] = file.path;
    }

    return {
        files: filesSerialized,
        entrypoints: entries
    };
}

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

module.exports = function (env) {
    Dotenv.config({path: './.env.' + env.NODE_ENV});
    const config = {
        output: {
            path: path.resolve(__dirname, 'build')
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new webpack.ProvidePlugin({
                process: 'process/browser',
            }),
            new DotenvFlow({
                node_env: env.NODE_ENV ? env.NODE_ENV : 'development'
            }),
            new WebpackManifestPlugin({
                fileName: 'asset-manifest.json',
                generate: serializeManifest
            }),
        ],
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