"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackConfig = void 0;
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var webpack_1 = tslib_1.__importDefault(require("webpack"));
// import * as BaseHref from 'base-href-webpack-plugin';
var html_webpack_plugin_1 = tslib_1.__importDefault(require("html-webpack-plugin"));
var prerender_spa_plugin_1 = tslib_1.__importDefault(require("prerender-spa-plugin"));
var mini_css_extract_plugin_1 = tslib_1.__importDefault(require("mini-css-extract-plugin"));
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var compression_webpack_plugin_1 = tslib_1.__importDefault(require("compression-webpack-plugin"));
var configuration = {};
try {
    configuration = require(process.cwd() + '/nimble.json');
}
catch (_a) {
    configuration = {};
}
var Renderer = prerender_spa_plugin_1.default.PuppeteerRenderer;
// const BaseHrefWebpackPlugin = BaseHref.BaseHrefWebpackPlugin;
var distPath = path_1.default.resolve(process.cwd(), 'build');
var options = {};
function webpackConfig(env, opts, inBuilding) {
    if (inBuilding === void 0) { inBuilding = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var config;
        var _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = opts;
                    _a = {
                        mode: inBuilding ? 'production' : 'development',
                        entry: getEntries(),
                        output: {
                            chunkFilename: '[name].bundle.[chunkhash].js',
                            sourceMapFilename: '[name].bundle.[chunkhash].map',
                            filename: '[name].bundle.[chunkhash].js',
                            path: distPath,
                            publicPath: ''
                        },
                        watch: !inBuilding,
                        watchOptions: { ignored: ["".concat(process.cwd(), "/node_modules")] }
                    };
                    return [4 /*yield*/, getPlugins(inBuilding, env)];
                case 1:
                    config = (_a.plugins = _b.sent(),
                        _a.module = {
                            rules: getRules(inBuilding)
                        },
                        _a.resolve = {
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
                            fallback: {
                                util: require.resolve('util/'),
                            }
                        },
                        _a.optimization = {
                            splitChunks: {
                                cacheGroups: {
                                    defaultVendors: {
                                        reuseExistingChunk: true
                                    }
                                }
                            }
                        },
                        _a);
                    if (!inBuilding) {
                        config['devtool'] = 'source-map';
                    }
                    else {
                        config['performance'] = {
                            maxEntrypointSize: 450000,
                            hints: 'warning'
                        };
                    }
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
function getPlugins(inBuilding, env) {
    var _a, _b, _c, _d;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var baseHref, willUseBaseHref, plugins, _e, _f, _g, _h, _j, _k, preRender, preRenderRoutes, preRenderEnabled, willUsePreRender, routes;
        var _l;
        return tslib_1.__generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    baseHref = (_b = (_a = options.baseHref) !== null && _a !== void 0 ? _a : configuration.baseHref) !== null && _b !== void 0 ? _b : '/';
                    if (baseHref === '')
                        baseHref = '/';
                    willUseBaseHref = baseHref !== '' && baseHref !== '/';
                    _e = [new clean_webpack_plugin_1.CleanWebpackPlugin(),
                        new html_webpack_plugin_1.default({
                            template: process.cwd() + '/public/index.html',
                            filename: 'index.html',
                            inject: 'body',
                            minify: inBuilding ? {
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
                        // new CopyPlugin({
                        // 	patterns: [
                        // 		{ from: 'public', to: '' }
                        // 	],
                        // 	options: {
                        // 	  concurrency: 100,
                        // 	},
                        // }),
                        new mini_css_extract_plugin_1.default({
                            filename: !inBuilding ? '[name].css' : '[name].bundle.[hash].css',
                            chunkFilename: !inBuilding ? '[id].css' : '[id].bundle.[hash].css'
                        })];
                    _g = (_f = webpack_1.default.DefinePlugin).bind;
                    _l = {};
                    _h = 'process.env';
                    _k = (_j = JSON).stringify;
                    return [4 /*yield*/, loadEnvFile(env, inBuilding)];
                case 1:
                    plugins = _e.concat([
                        new (_g.apply(_f, [void 0, (_l[_h] = _k.apply(_j, [_m.sent()]),
                                _l)]))()
                    ]);
                    if (inBuilding && options.gziped) {
                        plugins.push(new compression_webpack_plugin_1.default({
                            test: /\.js(\?.*)?$/i,
                            algorithm: 'gzip',
                            filename: function (info) {
                                var opFile = info.path.split('.'), opFileType = opFile.pop(), opFileName = opFile.join('.');
                                return "".concat(opFileName, ".").concat(opFileType, ".gzip");
                            }
                        }));
                    }
                    preRender = configuration['pre-render'];
                    preRenderRoutes = (_c = preRender === null || preRender === void 0 ? void 0 : preRender.routes) !== null && _c !== void 0 ? _c : [];
                    preRenderEnabled = (_d = preRender === null || preRender === void 0 ? void 0 : preRender.enabled) !== null && _d !== void 0 ? _d : false;
                    willUsePreRender = inBuilding && preRenderEnabled && preRenderRoutes.length > 0;
                    if (willUsePreRender) {
                        routes = preRender.routes.map(function (x) { return !x.startsWith('/') ? "/".concat(x) : x; });
                        plugins.push(new prerender_spa_plugin_1.default({
                            staticDir: distPath,
                            routes: routes,
                            renderer: new Renderer({
                                renderAfterDocumentEvent: 'render-event',
                                injectProperty: 'pre-rendering',
                                inject: 'true',
                                headless: true
                            }),
                            postProcess: function (renderedRoute) {
                                renderedRoute.route = renderedRoute.originalRoute;
                                renderedRoute.html = renderedRoute.html.replace('<nimble-root', '<nimble-root style="visibility: hidden;"');
                                renderedRoute.html = renderedRoute.html.replace(/<style type="text\/css">(.|\n)*?<\/style>/g, '');
                                if (willUseBaseHref) {
                                    renderedRoute.html = renderedRoute.html.replace('<base href="/">', "<base href=\"".concat(baseHref, "\">"));
                                }
                                return renderedRoute;
                            }
                        }));
                    }
                    // if (!willUsePreRender && willUseBaseHref) {
                    // 	if ('baseHref' in options && !inBuilding) {
                    // 		console.log();
                    // 		console.log(chalk.yellow('Warning:'), 'the --baseHref argument is not supported on the development server.');
                    // 		plugins.push(new BaseHrefWebpackPlugin({ baseHref: '/' }));
                    // 	}
                    // 	else {
                    // 		plugins.push(new BaseHrefWebpackPlugin({ baseHref }));
                    // 	}
                    // }
                    // else {
                    // 	plugins.push(new BaseHrefWebpackPlugin({ baseHref: '/' }));
                    // }
                    return [2 /*return*/, plugins];
            }
        });
    });
}
function getRules(inBuilding) {
    var rules = [
        {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        },
        {
            test: /\.s[ac]ss$/i,
            use: [
                !inBuilding ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
                {
                    loader: 'css-loader',
                    options: {
                        url: false,
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: !inBuilding,
                        // minimize: inBuilding
                    }
                }
            ]
        },
        {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                // interpolate: true,
                // attrs: [],
                sources: false,
                minimize: inBuilding
            },
        },
        // {
        // 	test: /\.(svg|png|jpg|jpeg)$/,
        // 	loader: 'file-loader',
        // 	options: {
        // 		name: '[name].[ext]',
        // 		outputhPath: 'assets/img/',
        // 		publicPath: 'assets/img/'
        // 	}
        // },
        // {
        // 	test: /\.(ttf|woff|woff2)$/,
        // 	loader: 'file-loader',
        // 	options: {
        // 		name: '[name].[ext]',
        // 		outputhPath: 'assets/fonts/',
        // 		publicPath: 'assets/fonts/'
        // 	}
        // },
    ];
    return rules;
}
function loadEnvFile(env, inBuilding) {
    if (inBuilding === void 0) { inBuilding = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var enviroment;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!env) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve("".concat("".concat(process.cwd(), "/src/environments/env.").concat(env, ".js"))).then(function (s) { return tslib_1.__importStar(require(s)); })];
                case 1:
                    enviroment = _a.sent();
                    if (enviroment) {
                        return [2 /*return*/, enviroment];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, {
                        production: inBuilding
                    }];
            }
        });
    });
}
//# sourceMappingURL=webpack.config.js.map