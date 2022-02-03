const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
    return {
        output: {
            path: path.resolve(__dirname, 'build')
        },
        plugins: [new MiniCssExtractPlugin()],
        module: {
            rules: [rulesStyles/*, rulesBabel*/]
        }
    }
}