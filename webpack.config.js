// Variables
const outputPath = './docs';
const srcPath = './src';
const stylesDist = './styles/';
const jsDist = './js/';
const imgDist = './images/';

// Dependencies
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

global.faker = require('faker');
global.faker.locale = 'fr';

//console.log('env: ' + process.env.NODE_ENV.trim());


// Config
module.exports = (env, argv) => {
    const isDEV = argv.mode === 'development';
    console.log(isDEV);
    const glob = require('glob');

    let config = {
        entry: {
            main: ['@scss/main.scss', '@js/main.js']
        },
        watch: isDEV,
        output: {
            path: path.resolve(__dirname, outputPath),
            filename: isDEV ? `${jsDist}[name].js` : `${jsDist}[name].[chunkhash:8].js`,
            publicPath: '',
        },
        mode: isDEV ? 'development' : 'production',
        devtool: isDEV ? 'source-maps' : false,
        resolve: {
            extensions: ['.jsx', '.js'],
            alias: {
                // alias src
                '@scss': path.resolve(__dirname, srcPath, 'scss'),
                '@js': path.resolve(__dirname, srcPath, 'js'),
                '@img': path.resolve(__dirname, srcPath, 'images'),
                '@partials': path.resolve(__dirname, srcPath, 'partials'),
                // alias node modules
                jquery: "jquery/src/jquery"
            }
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            writeToDisk: true
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: ['babel-loader']
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    //Les loaders s'appliquent à partir de la fin du tableau vers le début du tableau
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDEV
                            },
                        },
                        {
                            loader: 'css-loader?importLoaders=1',
                            options: {
                                sourceMap: isDEV
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [
                                    require('autoprefixer')({
                                        browsers: ['last 2 versions', 'ie > 8']
                                    })
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDEV
                            }
                        }
                    ],
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use: ['file-loader']
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: `${imgDist}[name].[hash:8].[ext]`
                            }
                        },
                        {
                            loader: 'img-loader',
                            options: {
                                enabled: !isDEV
                            }
                        }
                    ]
                },
                {
                    test: /\.ejs$/,
                    use: ['ejs-loader']
                }
            ]
        },
        optimization: {
            minimizer: [
                new OptimizeCssAssetsPlugin({}),
                new TerserPlugin()
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                dry: false,
                verbose: true
            }),
            new MiniCssExtractPlugin({
                filename: isDEV ? `${stylesDist}[name].css` : `${stylesDist}[name].[hash:8].css`,
                chunkFilename: isDEV ? `${stylesDist}[id].css` : `${stylesDist}[id].[hash:8].css`,
            })//,
            // new PurgecssPlugin({
            //     paths: glob.sync(`${srcPath}/**/*.ejs`, { nodir: true })
            // })
        ]
    };


    //const files = glob.sync('./src/*.ejs');
    const files = glob.sync(`${srcPath}/*.ejs`);

    files.forEach(file => {
        config.plugins.push(new HtmlWebpackPlugin({
            filename: path.basename(file, '.ejs') + '.html',
            template: file,
            minify: !isDEV ?
                {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                } : false
        }))
    })

    if (!isDEV) {
        config.plugins.push(new BundleAnalyzerPlugin({
            openAnalyzer: false,
            defaultSizes: 'gzip',
            analyzerMode: 'static'
        })),
        config.plugins.push(new PurgecssPlugin({
            paths: glob.sync(`${srcPath}/**/*.ejs`, { nodir: true })
        }))

    }

    return config;
}

