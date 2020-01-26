export const WEBPACK_CONFIG = 
`const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PrerenderSpaPlugin = require('prerender-spa-plugin');
const Renderer = PrerenderSpaPlugin.PuppeteerRenderer;
const ts = require('typescript');
const configuration = require('./src/configuration.json');

const distPath = path.resolve(__dirname, 'build');

module.exports = (env) => {
    let enviroment = loadEnvFile(env);
    return {
        mode: enviroment.production ? 'production' : 'development',
        entry: getEntries(),
        output: {
            chunkFilename: '[name].[chunkhash].bundle.js',
            filename: '[name].[chunkhash].bundle.js',
            path: distPath,
            publicPath: '/'
        },
        devServer: {
            host: '0.0.0.0',
            port: 8090,
            historyApiFallback: true
        },
        watch: !enviroment.production,
        watchOptions: { ignored: [ './node_modules' ] },
        plugins: getPlugins(enviroment),
        module: {
            rules: getRules(enviroment)
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            alias: (function() {
                const tsconfigPath = './tsconfig.json';
                const { baseUrl, paths } = require(tsconfigPath).compilerOptions;
                const pathPrefix = path.resolve(path.dirname(tsconfigPath), baseUrl);
                const aliases = {};

                Object.keys(paths).forEach((item) => {
                    const name = item.replace("/*", "");
                    const value = path.resolve(pathPrefix, paths[item][0].replace("/*", ""));

                    aliases[name] = value;
                });

                return aliases;
            })(),
        }
    };
};

function getEntries() {
    
    let entry = { 'main': './src/index.ts' };
    
    if (configuration.vendors) {
        if (configuration.vendors.js && configuration.vendors.js.length > 0)
            entry['js-vendors'] = configuration.vendors.js.map((file) => {
                return path.resolve(file);
            });
        if (configuration.vendors.css && configuration.vendors.css.length > 0)
            entry['css-vendors'] = configuration.vendors.css.map((file) => {
                return path.resolve(file);
            });
    }
    return entry;
}

function getPlugins(enviroment) {
    let plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            hash: true
        }),
        new CopyPlugin([
            { from: 'public', to: '.' },
        ]),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(enviroment)
        })
    ];
    
    let preRender = configuration['pre-render'];
    if (enviroment.production && preRender && preRender.enabled && preRender.routes && preRender.routes.length > 0) {
        plugins.push(new PrerenderSpaPlugin({
            staticDir: distPath,
            routes: preRender.routes,
            renderer: new Renderer({
                renderAfterDocumentEvent: 'render-event'
            }),
            postProcess: function (renderedRoute) {
                renderedRoute.html = renderedRoute.html.replace('<nimble-root', '<nimble-root style="visibility: hidden;"');
                renderedRoute.html = renderedRoute.html.replace(/<style type="text\\/css">(.|\\n)*?<\\/style>/g, '');
                return renderedRoute;
            }
        }));
    }

    return plugins;
}

function getRules(enviroment) {
    let rules = [
        {
            test: /\\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'ts-loader'
        },
        {
            test: /\\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\\.scss$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader',
            ]
        },
        {
            test: /\\.(svg|png|jpg)$/,
            loader: 'file-loader',
            options: {
                name:'[name].[ext]',
                outputhPath: 'assets/img/',
                publicPath: 'assets/img/'
            }
        },
        {
            test: /\\.(ttf|woff|woff2)$/,
            loader: 'file-loader',
            options: {
                name:'[name].[ext]',
                outputhPath: 'assets/fonts/',
                publicPath: 'assets/fonts/'
            }
        },
        {
            test: /\\.html$/,
            use: 'html-loader'
        }
    ];

    return rules;
}

function loadEnvFile(env) {
    if (env) {
        var enviroment = require(\`./src/enviroments/env.\${env}.js\`);
        if (enviroment) {
            return enviroment;
        }
    }
    return {
        production: true
    };
}

function readTsFile(filePath) {
    if (filePath) {
        if (!filePath.endsWith('.ts'))
            filePath += '.ts';
        const content = ts.transpileModule(fs.readFileSync(filePath, 'utf8'), {
            compilerOptions: { module: ts.ModuleKind.CommonJS }
        }).outputText;
        return eval(content);
    }
    return  {};
}`;

export const PACKAGE_JSON =
`{
    "name": "[[ProjectName]]",
    "version": "1.0.0",
    "scripts": {
        "start": "npm run serve:local",
        "build": "npm run build:prod",
        "serve:local": "webpack-dev-server --env=local --devtool source-map",
        "serve:dev": "webpack-dev-server --env=dev --devtool source-map",
        "build:prod": "webpack --env=prod",
        "build:dev": "webpack --env=dev",
        "initialize": "npm i webpack webpack-cli webpack-dev-server -g && npm i --save-dev && npm rebuild node-sass"
    },
    "private": true,
    "dependencies": {
        "@nimble-ts/core": "^[[NimbleVersion]]"
    },
    "devDependencies": {
        "@types/node": "^12.12.7",
        "@types/webpack-env": "^1.14.1",
        "clean-webpack-plugin": "^2.0.1",
        "copy-webpack-plugin": "^5.0.2",
        "css-loader": "^2.1.1",
        "file-loader": "^3.0.1",
        "html-loader": "^0.5.5",
        "html-webpack-plugin": "^3.2.0",
        "mini-css-extract-plugin": "^0.8.0",
        "node-sass": "^4.11.0",
        "postcss-loader": "^3.0.0",
        "prerender-spa-plugin": "^3.4.0",
        "sass-loader": "^7.1.0",
        "style-loader": "^0.23.1",
        "ts-loader": "^5.4.5",
        "typescript": "^3.7.3",
        "typescript-require": "^0.2.10",
        "webpack": "^4.28.1",
        "webpack-cli": "^3.2.1",
        "webpack-dev-server": "^3.1.14"
    }
}
`;

export const README = 
`# Nimble Application
This is a Nimble project application.`;

export const TSCONFIG =
`{
    "compileOnSave": false,
    "compilerOptions": {
        "allowJs": true,
        "module": "esnext",
        "target": "es5",
        "sourceMap": true,
        "baseUrl": "./",
        "outDir": "./dist/",
        "downlevelIteration": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "declaration": false,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "moduleResolution": "node",
        "typeRoots": [
            "node_modules/@types"
        ],
        "lib": [
            "es2018",
            "dom"
        ],
        "paths": {
            "src/*": ["./src/*"]
        }
    },
    "include": [
        "./src/**/*"
    ]
}`;

export const GITIGNORE =
`dist

.DS_Store

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage

# nyc test coverage
.nyc_output

# Grunt intermediate storage (http://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules
/node_modules/
jspm_packages

# TypeScript v1 declaration files
typings/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# next.js build output
.next
`;