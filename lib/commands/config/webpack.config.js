"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var clean_webpack_plugin_1 = tslib_1.__importDefault(require("clean-webpack-plugin"));
var html_webpack_plugin_1 = tslib_1.__importDefault(require("html-webpack-plugin"));
var copy_webpack_plugin_1 = tslib_1.__importDefault(require("copy-webpack-plugin"));
var prerender_spa_plugin_1 = tslib_1.__importDefault(require("prerender-spa-plugin"));
var mini_css_extract_plugin_1 = tslib_1.__importDefault(require("mini-css-extract-plugin"));
var configuration = {};
try {
    configuration = require(process.cwd() + '/nimble.json');
}
catch (_a) {
    configuration = {};
}
var Renderer = prerender_spa_plugin_1.default.PuppeteerRenderer;
var distPath = path_1.default.resolve(process.cwd(), 'build');
function webpackConfig(env, isProdMod) {
    if (isProdMod === void 0) { isProdMod = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var enviroment, config;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadEnvFile(env)];
                case 1:
                    enviroment = _a.sent();
                    config = {
                        mode: isProdMod ? 'production' : 'development',
                        entry: getEntries(),
                        output: {
                            chunkFilename: '[name].bundle.[chunkhash].js',
                            filename: '[name].bundle.[chunkhash].js',
                            path: distPath,
                            publicPath: '/'
                        },
                        watch: !isProdMod,
                        watchOptions: { ignored: [process.cwd() + "/node_modules"] },
                        plugins: getPlugins(isProdMod, enviroment),
                        module: {
                            rules: getRules(isProdMod, enviroment)
                        },
                        resolve: {
                            extensions: ['.ts', '.js', '.scss'],
                            alias: (function () {
                                var tsconfigPath = process.cwd() + '/tsconfig.json';
                                var _a = require(tsconfigPath).compilerOptions, baseUrl = _a.baseUrl, paths = _a.paths;
                                var pathPrefix = path_1.default.resolve(path_1.default.dirname(tsconfigPath), baseUrl);
                                var aliases = {};
                                Object.keys(paths).forEach(function (item) {
                                    var name = item.replace('/*', '');
                                    var value = path_1.default.resolve(pathPrefix, paths[item][0].replace('/*', ''));
                                    aliases[name] = value;
                                });
                                return aliases;
                            })(),
                        },
                        optimization: {
                            splitChunks: {
                                cacheGroups: {
                                    defaultVendors: {
                                        reuseExistingChunk: true
                                    },
                                    commons: {
                                        name: function (module, chunks, cacheGroupKey) {
                                            var moduleFileName = module.identifier().split('/').reduceRight(function (item) { return item; });
                                            var allChunksNames = chunks.map(function (item) { return item.name; }).join('~');
                                            return cacheGroupKey + "-" + allChunksNames + "-" + moduleFileName;
                                        },
                                        chunks: 'all'
                                    }
                                }
                            }
                        }
                    };
                    if (!isProdMod)
                        config['devtool'] = 'source-map';
                    return [2 /*return*/, config];
            }
        });
    });
}
exports.webpackConfig = webpackConfig;
;
function getEntries() {
    var entry = {
        'main': [process.cwd() + '/src/main.ts']
    };
    if (configuration.vendors) {
        if (configuration.vendors.js && configuration.vendors.js.length > 0)
            entry.main = entry.main.concat(configuration.vendors.js.map(function (file) {
                return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
            }));
        if (configuration.vendors.css && configuration.vendors.css.length > 0)
            entry.main = entry.main.concat(configuration.vendors.css.map(function (file) {
                return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
            }));
    }
    return entry;
}
function getPlugins(isProdMod, enviroment) {
    var plugins = [
        new clean_webpack_plugin_1.default(),
        new html_webpack_plugin_1.default({
            template: process.cwd() + '/public/index.html',
            filename: 'index.html',
            hash: true,
            minify: isProdMod ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            } : undefined
        }),
        new copy_webpack_plugin_1.default([
            { from: 'public', to: '.' },
        ]),
        new mini_css_extract_plugin_1.default({
            filename: !isProdMod ? '[name].css' : '[name].bundle.[hash].css',
            chunkFilename: !isProdMod ? '[id].css' : '[id].bundle.[hash].css'
        }),
        new webpack_1.default.DefinePlugin({
            'process.env': JSON.stringify(enviroment)
        })
    ];
    var preRender = configuration['pre-render'];
    if (isProdMod && preRender && preRender.enabled && preRender.routes && preRender.routes.length > 0) {
        var routes = preRender.routes.map(function (x) { return !x.startsWith('/') ? "/" + x : x; });
        plugins.push(new prerender_spa_plugin_1.default({
            staticDir: distPath,
            routes: routes,
            renderer: new Renderer({
                renderAfterDocumentEvent: 'render-event'
            }),
            postProcess: function (renderedRoute) {
                renderedRoute.html = renderedRoute.html.replace('<nimble-root', '<nimble-root style="visibility: hidden;"');
                renderedRoute.html = renderedRoute.html.replace(/<style type="text\/css">(.|\n)*?<\/style>/g, '');
                return renderedRoute;
            }
        }));
    }
    return plugins;
}
function getRules(isProdMod, enviroment) {
    var rules = [
        {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        },
        {
            test: /\.(sc|sa|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            loader: [
                !isProdMod ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
                'css-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: !isProdMod,
                        minimize: isProdMod
                    }
                }
            ]
        },
        {
            test: /\.(svg|png|jpg)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputhPath: 'assets/img/',
                publicPath: 'assets/img/'
            }
        },
        {
            test: /\.(ttf|woff|woff2)$/,
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputhPath: 'assets/fonts/',
                publicPath: 'assets/fonts/'
            }
        },
        {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: isProdMod
            },
        }
    ];
    return rules;
}
function loadEnvFile(env) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var enviroment;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!env) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require(process.cwd() + "/src/environments/env." + env + ".js")); })];
                case 1:
                    enviroment = _a.sent();
                    if (enviroment) {
                        return [2 /*return*/, enviroment];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, {
                        production: true
                    }];
            }
        });
    });
}
//# sourceMappingURL=webpack.config.js.map