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
var BaseHref = tslib_1.__importStar(require("base-href-webpack-plugin"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var configuration = {};
try {
    configuration = require(process.cwd() + '/nimble.json');
}
catch (_a) {
    configuration = {};
}
var Renderer = prerender_spa_plugin_1.default.PuppeteerRenderer;
var BaseHrefWebpackPlugin = BaseHref.BaseHrefWebpackPlugin;
var distPath = path_1.default.resolve(process.cwd(), 'build');
var options = {};
function webpackConfig(env, opts, inBuilding) {
    if (inBuilding === void 0) { inBuilding = false; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var config, _a;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = opts;
                    _a = {
                        mode: inBuilding ? 'production' : 'development',
                        entry: getEntries(),
                        output: {
                            chunkFilename: '[name].bundle.[chunkhash].js',
                            filename: '[name].bundle.[chunkhash].js',
                            path: distPath,
                            publicPath: ''
                        },
                        watch: !inBuilding,
                        watchOptions: { ignored: [process.cwd() + "/node_modules"] }
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
                            maxEntrypointSize: 400000,
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
    var _a, _b, _c, _d, _e, _f;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var baseHref, willUseBaseHref, plugins, _g, _h, _j, _k, _l, _m, _o, preRender, preRenderRoutes, preRenderEnabled, willUsePreRender, routes;
        return tslib_1.__generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    baseHref = (_b = (_a = options.baseHref, (_a !== null && _a !== void 0 ? _a : configuration.baseHref)), (_b !== null && _b !== void 0 ? _b : '/'));
                    if (baseHref === '')
                        baseHref = '/';
                    willUseBaseHref = baseHref !== '' && baseHref !== '/';
                    _g = [new clean_webpack_plugin_1.default(),
                        new html_webpack_plugin_1.default({
                            template: process.cwd() + '/public/index.html',
                            filename: 'index.html',
                            hash: true,
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
                        new copy_webpack_plugin_1.default([
                            { from: 'public', to: '' },
                        ]),
                        new mini_css_extract_plugin_1.default({
                            filename: !inBuilding ? '[name].css' : '[name].bundle.[hash].css',
                            chunkFilename: !inBuilding ? '[id].css' : '[id].bundle.[hash].css'
                        })];
                    _j = (_h = webpack_1.default.DefinePlugin).bind;
                    _k = {};
                    _l = 'process.env';
                    _o = (_m = JSON).stringify;
                    return [4 /*yield*/, loadEnvFile(env, inBuilding)];
                case 1:
                    plugins = _g.concat([
                        new (_j.apply(_h, [void 0, (_k[_l] = _o.apply(_m, [_p.sent()]),
                                _k)]))()
                    ]);
                    preRender = configuration['pre-render'];
                    preRenderRoutes = (_d = (_c = preRender) === null || _c === void 0 ? void 0 : _c.routes, (_d !== null && _d !== void 0 ? _d : []));
                    preRenderEnabled = (_f = (_e = preRender) === null || _e === void 0 ? void 0 : _e.enabled, (_f !== null && _f !== void 0 ? _f : false));
                    willUsePreRender = inBuilding && preRenderEnabled && preRenderRoutes.length > 0;
                    if (willUsePreRender) {
                        routes = preRender.routes.map(function (x) { return !x.startsWith('/') ? "/" + x : x; });
                        plugins.push(new prerender_spa_plugin_1.default({
                            staticDir: distPath,
                            routes: routes,
                            renderer: new Renderer({
                                renderAfterDocumentEvent: 'render-event'
                            }),
                            postProcess: function (renderedRoute) {
                                renderedRoute.html = renderedRoute.html.replace('<nimble-root', '<nimble-root style="visibility: hidden;"');
                                renderedRoute.html = renderedRoute.html.replace(/<style type="text\/css">(.|\n)*?<\/style>/g, '');
                                if (willUseBaseHref) {
                                    renderedRoute.html = renderedRoute.html.replace('<base href="/">', "<base href=\"" + baseHref + "\">");
                                }
                                return renderedRoute;
                            }
                        }));
                    }
                    if (!willUsePreRender && willUseBaseHref) {
                        if ('baseHref' in options && !inBuilding) {
                            console.log();
                            console.log(chalk_1.default.yellow('Warning:'), 'the --baseHref argument is not supported on the development server.');
                            plugins.push(new BaseHrefWebpackPlugin({ baseHref: '/' }));
                        }
                        else {
                            plugins.push(new BaseHrefWebpackPlugin({ baseHref: baseHref }));
                        }
                    }
                    else {
                        plugins.push(new BaseHrefWebpackPlugin({ baseHref: '/' }));
                    }
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
            test: /\.(sc|sa|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            loader: [
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
                        minimize: inBuilding
                    }
                }
            ]
        },
        {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                interpolate: true,
                attrs: [],
                minimize: inBuilding
            },
        },
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
                    return [4 /*yield*/, Promise.resolve().then(function () { return tslib_1.__importStar(require(process.cwd() + "/src/environments/env." + env + ".js")); })];
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