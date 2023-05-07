import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
// import * as BaseHref from 'base-href-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import PrerenderSpaPlugin from 'prerender-spa-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';

let configuration: {
	'pre-render': {
		enabled: boolean,
		routes: string[]
	},
	baseHref: string,
	vendors: { js: string[], css: string[] }
} = {} as any;

try { configuration = require(process.cwd() + '/nimble.json'); }
catch { configuration = {} as any; }

const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;
// const BaseHrefWebpackPlugin = BaseHref.BaseHrefWebpackPlugin;

const distPath = path.resolve(process.cwd(), 'build');

let options: { baseHref?: string, gziped?: boolean } = {} as any;

export async function webpackConfig(env: string, opts: { baseHref?: string, gziped?: boolean }, inBuilding: boolean = false) {
	options = opts;
	let config = {
		mode: inBuilding ? 'production' : 'development',
		entry: getEntries(),
		output: {
			chunkFilename: '[name].bundle.[chunkhash].js',
			filename: '[name].bundle.[chunkhash].js',
			path: distPath,
			publicPath: ''
		},
		watch: !inBuilding,
		watchOptions: { ignored: [`${process.cwd()}/node_modules`] },
		plugins: await getPlugins(inBuilding, env),
		module: {
			rules: getRules(inBuilding)
		},
		resolve: {
			extensions: ['.ts', '.js', '.scss'],
			alias: (() => {
				const tsconfigPath = process.cwd() + '/tsconfig.json';
				const { baseUrl, paths } = require(tsconfigPath).compilerOptions;
				const pathPrefix = path.resolve(path.dirname(tsconfigPath), baseUrl);
				const aliases = {} as any;

				Object.keys(paths).forEach((item) => {
					const name = item.replace('/*', '');
					const value = path.resolve(pathPrefix, paths[item][0].replace('/*', ''));

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
					}
				}
			}
		}
	};

	if (!inBuilding) {
		config['devtool'] = 'source-map';
	}
	else {
		config['performance'] = {
			maxEntrypointSize: 450000,
			hints: 'warning'
		};
	}

	return config;
};

function getEntries() {

	let entry: { [key: string]: string[] } = {
		'main': [process.cwd() + '/src/main.ts']
	};

	if (configuration.vendors) {
		if (configuration.vendors.js && configuration.vendors.js.length > 0)
			entry.main = entry.main.concat(configuration.vendors.js.map((file: string) => {
				return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
			}));
		if (configuration.vendors.css && configuration.vendors.css.length > 0)
			entry.main = entry.main.concat(configuration.vendors.css.map((file: string) => {
				return process.cwd() + (file.endsWith('/') ? '' : '/') + file;
			}));
	}

	return entry;
}

async function getPlugins(inBuilding: boolean, env: string) {

	let baseHref = options.baseHref ?? configuration.baseHref ?? '/';
	if (baseHref === '') baseHref = '/';
	let willUseBaseHref = baseHref !== '' && baseHref !== '/';

	let plugins: any[] = [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: process.cwd() + '/public/index.html',
			filename: 'index.html',
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
		new CopyPlugin({
			patterns: [
				{ from: 'public', to: '' }
			]
		}),
		new MiniCssExtractPlugin({
			filename: !inBuilding ? '[name].css' : '[name].bundle.[hash].css',
			chunkFilename: !inBuilding ? '[id].css' : '[id].bundle.[hash].css'
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(await loadEnvFile(env, inBuilding))
		}),
	];

	if (inBuilding && options.gziped) {
		plugins.push(new CompressionPlugin({
			test: /\.js(\?.*)?$/i,
			algorithm: 'gzip',
			filename(info) {
				let opFile = info.path.split('.'),
					opFileType = opFile.pop(),
					opFileName = opFile.join('.');
				return `${opFileName}.${opFileType}.gzip`;
			}
		}));
	}

	let preRender = configuration['pre-render'];
	let preRenderRoutes = preRender?.routes ?? [];
	let preRenderEnabled = preRender?.enabled ?? false;
	let willUsePreRender = inBuilding && preRenderEnabled && preRenderRoutes.length > 0;
	if (willUsePreRender) {
		let routes = (preRender.routes as string[]).map(x => !x.startsWith('/') ? `/${x}` : x);
		plugins.push(new PrerenderSpaPlugin({
			staticDir: distPath,
			routes: routes,
			renderer: new Renderer({
				renderAfterDocumentEvent: 'render-event',
				injectProperty: 'pre-rendering',
				inject: 'true',
				headless: true
			}),
			postProcess: (renderedRoute: any) => {
				renderedRoute.route = renderedRoute.originalRoute;
				renderedRoute.html = renderedRoute.html.replace('<nimble-root', '<nimble-root style="visibility: hidden;"');
				renderedRoute.html = renderedRoute.html.replace(/<style type="text\/css">(.|\n)*?<\/style>/g, '');

				if (willUseBaseHref) {
					renderedRoute.html = renderedRoute.html.replace('<base href="/">', `<base href="${baseHref}">`);
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

	return plugins;
}

function getRules(inBuilding: boolean) {
	let rules = [
		{
			test: /\.(ts|js)x?$/,
			exclude: /node_modules/,
			loader: 'ts-loader'
		},
		{
			test: /\.(sc|sa|c)ss$/,
			exclude: /\.module.(s(a|c)ss)$/,
			loader: [
				!inBuilding ? 'style-loader' : MiniCssExtractPlugin.loader,
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

async function loadEnvFile(env: string, inBuilding: boolean = false) {
	if (env) {
		var enviroment = await import(`${process.cwd()}/src/environments/env.${env}.js`);
		if (enviroment) {
			return enviroment;
		}
	}
	return {
		production: inBuilding
	};
}