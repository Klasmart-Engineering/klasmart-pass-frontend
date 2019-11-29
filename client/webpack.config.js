const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Visualizer = require('webpack-visualizer-plugin');

const output_file_name = 'bundle.[chunkhash].js'
module.exports = {
    mode: 'production',
    entry: ['./src/client-entry.tsx'],
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
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
        filename: output_file_name,
        chunkFilename: output_file_name,
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new Visualizer({ filename: '../webpack-stats.html' }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 64 * 1024,
            maxSize: 1024 * 1024,
            minChunks: 1,
            name: false,
            maxAsyncRequests: 6,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        },
    },
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