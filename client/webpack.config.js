const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill','./src/client-entry.tsx'],
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
    ],
    devServer: {
        proxy: { 
            '/token': 'http://localhost:8000',
            '/payment': 'http://localhost:8000',
            '/auth': {
                target: 'https://seoul-beta.auth.badanamu.net/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {'^/auth' : '/v1'}
            },
            '/api': {
                target: 'https://seoul-beta.api.badanamu.net/',
                secure: false,
                changeOrigin: true,
                pathRewrite: {'^/api' : '/v1'}
            }
        }
    },
};