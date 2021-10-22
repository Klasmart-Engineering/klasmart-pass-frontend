const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const output_file_name = 'bundle.[chunkhash].js'

const { loadBrandingOptions } = require("kidsloop-branding");

const brandingOptions = loadBrandingOptions(process.env.BRAND);

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
        alias: {
            react: path.resolve("./node_modules/react"),
            ...brandingOptions.webpack.resolve.alias
        },
        extensions: ['.js', '.jsx', '.tsx', '.ts'],
    },
    output: {
        filename: output_file_name,
        chunkFilename: output_file_name,
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index_prod.html',
            ...brandingOptions.webpack.html,
            newRelicAccountID: `3286825`,
            newRelicAgentID: `322534651`,
            newRelicTrustKey: `3286825`,
            newRelicLicenseKey: `NRJS-eff8c9c844416a5083f`,
            newRelicApplicationID: `322534651`,
        }),
        new webpack.EnvironmentPlugin({
            "PAYMENT_ENDPOINT": "https://payment.dev.badanamu.net/",
            "AUTH_ENDPOINT": "https://auth.dev.badanamu.net/",
            "ACCOUNT_ENDPOINT": "https://account.dev.badanamu.net/",
            "PRODUCT_ENDPOINT": "https://product.dev.badanamu.net/",
            "REGION_ENDPOINT": "https://prod.region.badanamu.net/",
            "ORGANIZATION_SEOUL_ENDPOINT": "https://seoul.organization-api.badanamu.net/",
            "PASS_FILTER": ["com.calmid.badanamu.esl.premium"],
            "AUTH_RETURN_LINK": "https://auth.loadtest.kidsloop.live/",
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 32 * 1024,
            maxSize: 128 * 1024,
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
