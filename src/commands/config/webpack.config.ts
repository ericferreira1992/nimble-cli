import path from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import PrerenderSpaPlugin from 'prerender-spa-plugin';

let configuration: any = {};
try { configuration = require(process.cwd() + '/src/configuration.json'); }
catch{ configuration = {}; }

const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;

const distPath = path.resolve(process.cwd(), 'build');

export function webpackConfig(env: string, isProdMod: boolean = false) {
    let enviroment = loadEnvFile(env);
    let config = {
        mode: isProdMod ? 'production' : 'development',
        entry: getEntries(),
        output: {
            chunkFilename: '[name].[chunkhash].bundle.js',
            filename: '[name].[chunkhash].bundle.js',
            path: distPath,
            publicPath: '/'
        },
        watch: !isProdMod,
        watchOptions: { ignored: [`${process.cwd()}/node_modules`] },
        plugins: getPlugins(isProdMod, enviroment),
        module: {
            rules: getRules(isProdMod, enviroment)
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            alias: (function () {
                const tsconfigPath = process.cwd() + '/tsconfig.json';
                const { baseUrl, paths } = require(tsconfigPath).compilerOptions;
                const pathPrefix = path.resolve(path.dirname(tsconfigPath), baseUrl);
                const aliases = {} as any;

                Object.keys(paths).forEach((item) => {
                    const name = item.replace("/*", "");
                    const value = path.resolve(pathPrefix, paths[item][0].replace("/*", ""));

                    aliases[name] = value;
                });

                return aliases;
            })(),
        }
    };

    if (!isProdMod)
        config['devtool'] = 'source-map';

    return config;
};

function getEntries() {

    let entry = { 'main': process.cwd() + '/src/index.ts' } as any;

    if (configuration.vendors) {
        if (configuration.vendors.js && configuration.vendors.js.length > 0)
            entry['js.vendors'] = configuration.vendors.js.map((file: string) => {
                return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
            });
        if (configuration.vendors.css && configuration.vendors.css.length > 0)
            entry['css.vendors'] = configuration.vendors.css.map((file: string) => {
                return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
            });
    }
    return entry;
}

function getPlugins(isProdMod: boolean, enviroment: any) {
    let plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
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
        new CopyPlugin([
            { from: 'public', to: '.' },
        ]),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(enviroment)
        })
    ];

    let preRender = configuration['pre-render'];
    if (isProdMod && preRender && preRender.enabled && preRender.routes && preRender.routes.length > 0) {
        plugins.push(new PrerenderSpaPlugin({
            staticDir: distPath,
            routes: preRender.routes,
            renderer: new Renderer({
                renderAfterDocumentEvent: 'render-event'
            }),
            postProcess: function (renderedRoute: any) {
                renderedRoute.html = renderedRoute.html.replace('<nimble-root', '<nimble-root style="visibility: hidden;"');
                renderedRoute.html = renderedRoute.html.replace(/<style type="text\/css">(.|\n)*?<\/style>/g, '');
                return renderedRoute;
            }
        }));
    }

    return plugins;
}

function getRules(isProdMod: boolean, enviroment: any) {
    let rules = [
        {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
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
            use: 'html-loader'
        }
    ];

    return rules;
}

function loadEnvFile(env: string) {
    if (env) {
        var enviroment = require(`${process.cwd()}/src/enviroments/env.${env}.js`);
        if (enviroment) {
            return enviroment;
        }
    }
    return {
        production: true
    };
}