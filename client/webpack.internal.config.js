const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: ['./src/client-entry.tsx'],
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
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new webpack.EnvironmentPlugin({
            "PAYMENT_ENDPOINT": "https://payment.internal.badanamu.net/",
            "AUTH_ENDPOINT": "https://auth.internal.badanamu.net/",
            "ACCOUNT_ENDPOINT": "https://account.internal.badanamu.net/",
            "PRODUCT_ENDPOINT": "https://product.internal.badanamu.net/",
            "REGION_ENDPOINT": "https://region.internal.badanamu.net/",
            "ORGANIZATION_ENDPOINT": "https://organization-api.internal.badanamu.net",
            "AUTH_RETURN_LINK": "http://auth.kidsloop.net/",
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