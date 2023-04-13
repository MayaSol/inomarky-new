const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SvgStore = require("webpack-svgstore");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
console.log(path.resolve(__dirname, './index.js'));

const compiler = webpack({
    entry: {
        main: path.resolve(__dirname, './index.js'),
    },
    output: {
        filename: "[name].bundle.js",
        publicPath: './'
    },
    mode: 'production',
    module: {
        rules: [{
                test: /\.css$/,
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
    optimization: {
        minimizer: [
          // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
          // `...`,
          new CssMinimizerPlugin(),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "ltr.min.css",
        }),
        new SvgStore({
          path: path.resolve(__dirname, "./svg-icons/*.svg"),
          fileName: "./images/svg-sprite.svg",
          prefix: "icon-",
        }),
    ],
});

compiler.run((err, stats) => { // [Stats Object](#stats-object)
    console.log(err);
    console.log(stats.compilation.errors);
    // ...
    compiler.close((closeErr) => {
        // ...
    });
});