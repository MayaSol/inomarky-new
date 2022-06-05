const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log(path.resolve(__dirname, './index.js'));


const compiler = webpack({
    entry: {
        main: path.resolve(__dirname, './index.js'),
    },
    output: {
        filename: "[name].bundle.js",
        publicPath: './'
    },
    mode: 'development',
    module: {
        rules: [{
                test: /\.css$/i,
                exclude: /node_modules/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        url: false
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            config: path.resolve(__dirname, 'postcss.config.js'),
                        },
                    },
                }
            ]
        }]
},
plugins: [new MiniCssExtractPlugin({
    filename: "ltr.min.css",
})],
});

compiler.run((err, stats) => { // [Stats Object](#stats-object)
    console.log(err);
    console.log(stats.compilation.errors);
    // ...
    compiler.close((closeErr) => {
        // ...
    });
});