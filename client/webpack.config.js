const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

const { loadBrandingOptions } = require("kidsloop-branding");

const brandingOptions = loadBrandingOptions(process.env.BRAND);

module.exports = {
    mode: 'development',
    entry: ['./src/client-entry.tsx'],
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    'css-modules-typescript-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true
                        }
                    }
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            // mozjpeg: {
                            //     progressive: true,
                            //     quality: 65
                            // },
                            // // optipng.enabled: false will disable optipng
                            // optipng: {
                            //     enabled: false,
                            // },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                        }
                    },
                ],
            }
        ],
    },
    resolve: {
        alias: {
            react: path.resolve("./node_modules/react"),
            ...brandingOptions.webpack.resolve.alias
        },
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            ...brandingOptions.webpack.html,
        }),
        new webpack.EnvironmentPlugin({
            "PAYMENT_ENDPOINT": "http://localhost:8092/",
            "AUTH_ENDPOINT": "http://localhost:8080/",
            "ACCOUNT_ENDPOINT": "http://localhost:8089/",
            "PRODUCT_ENDPOINT": "http://localhost:8044/",
            "REGION_ENDPOINT": "http://localhost:8094/",
            "ORGANIZATION_ENDPOINT": "http://localhost:8084/",
            "AUTH_RETURN_LINK": "https://auth.kidsloop.live/",
        })
    ],
    devServer: {
        host: "0.0.0.0",
        proxy: {
            '/payment': {
                target: 'http://localhost:8092/',
                secure: false,
                changeOrigin: true,
                pathRewrite: { '^/payment': '/' }
            }
        }
    },
};
