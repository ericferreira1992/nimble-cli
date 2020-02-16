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
    configuration = require(process.cwd() + '/src/configuration.json');
}
catch (_a) {
    configuration = {};
}
var Renderer = prerender_spa_plugin_1.default.PuppeteerRenderer;
var distPath = path_1.default.resolve(process.cwd(), 'build');
function webpackConfig(env, isProdMod) {
    if (isProdMod === void 0) { isProdMod = false; }
    var enviroment = loadEnvFile(env);
    var config = {
        mode: isProdMod ? 'production' : 'development',
        entry: getEntries(),
        output: {
            chunkFilename: '[name]bundle.[chunkhash].js',
            filename: '[name]bundle.[chunkhash].js',
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
            extensions: ['.tsx', '.ts', '.js', '.scss'],
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
        }
    };
    if (!isProdMod)
        config['devtool'] = 'source-map';
    return config;
}
exports.webpackConfig = webpackConfig;
;
function getEntries() {
    var entry = { 'main': process.cwd() + '/src/index.ts' };
    if (configuration.vendors) {
        if (configuration.vendors.js && configuration.vendors.js.length > 0)
            entry['js.vendors'] = configuration.vendors.js.map(function (file) {
                return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
            });
        if (configuration.vendors.css && configuration.vendors.css.length > 0)
            entry['css.vendors'] = configuration.vendors.css.map(function (file) {
                return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
            });
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
        plugins.push(new prerender_spa_plugin_1.default({
            staticDir: distPath,
            routes: preRender.routes,
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
            test: /\.s(a|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            loader: [
                !isProdMod ? 'style-loader' : mini_css_extract_plugin_1.default.loader,
                'css-loader',
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: !isProdMod
                    }
                }
            ]
        },
        // {
        //     test: /\.css$/,
        //     use: ['style-loader', 'css-loader']
        // },
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
            use: 'html-loader'
        }
    ];
    return rules;
}
function loadEnvFile(env) {
    if (env) {
        var enviroment = require(process.cwd() + "/src/enviroments/env." + env + ".js");
        if (enviroment) {
            return enviroment;
        }
    }
    return {
        production: true
    };
}
//# sourceMappingURL=webpack.config.js.map