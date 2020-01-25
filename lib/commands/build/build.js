"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var inversify_1 = require("inversify");
var args_resolver_1 = require("../../core/args-resolver");
var webpack_config_1 = require("../config/webpack.config");
var Build = /** @class */ (function () {
    function Build(logger) {
        this.logger = logger;
        this.DEFAULT_ENV = 'prod';
        this.WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
        this.WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
    }
    Object.defineProperty(Build.prototype, "env", {
        get: function () { return this.args.getValue('env', this.DEFAULT_ENV); },
        enumerable: true,
        configurable: true
    });
    Build.prototype.execute = function (args) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config;
            return tslib_1.__generator(this, function (_a) {
                this.args = new args_resolver_1.ArgsResolver(args);
                config = webpack_config_1.webpackConfig(this.env, true);
                this.build(config)
                    .then(function (_a) {
                    var stats = _a.stats, warnings = _a.warnings;
                    if (warnings.length) {
                        console.log(chalk_1.default.yellow('Compiled with warnings.\n'));
                        console.log(warnings.join('\n\n'));
                        console.log('\nSearch for the ' +
                            chalk_1.default.underline(chalk_1.default.yellow('keywords')) +
                            ' to learn more about each warning.');
                        console.log('To ignore, add ' +
                            chalk_1.default.cyan('// eslint-disable-next-line') +
                            ' to the line before.\n');
                    }
                    else {
                        console.log(chalk_1.default.green('Compiled successfully.\n'));
                    }
                    console.log('File sizes after gzip:\n');
                    /* printFileSizesAfterBuild(
                        stats,
                        PATHS.appBuild,
                        this.WARN_AFTER_BUNDLE_GZIP_SIZE,
                        this.WARN_AFTER_CHUNK_GZIP_SIZE
                    );
                    console.log(); */
                    /* const appPackage = require(PATHS.appPackageJson);
                    const publicUrl = PATHS.appPublic;
                    const publicPath = config.output.publicPath;
                    const buildFolder = path.relative(process.cwd(), PATHS.appBuild);
                    printHostingInstructions(
                        appPackage,
                        publicUrl,
                        publicPath,
                        buildFolder
                    ); */
                }, function (err) {
                    var tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
                    if (tscCompileOnError) {
                        console.log(chalk_1.default.yellow('Compiled with the following type errors (you may want to check these before deploying your app):\n'));
                        // printBuildError(err);
                    }
                    else {
                        console.log(chalk_1.default.red('Failed to compile.\n'));
                        // printBuildError(err);
                        process.exit(1);
                    }
                })
                    .catch(function (err) {
                    if (err && err.message) {
                        console.log(err.message);
                    }
                    process.exit(1);
                });
                ;
                return [2 /*return*/];
            });
        });
    };
    Build.prototype.build = function (config) {
        var _this = this;
        if (process.env.NODE_PATH) {
            console.log(chalk_1.default.yellow('Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'));
            console.log();
        }
        console.log('Creating an optimized production build...');
        var compiler = webpack_1.default(config);
        return new Promise(function (resolve, reject) {
            compiler.run(function (err, stats) {
                var messages;
                if (err) {
                    if (!err.message) {
                        return reject(err);
                    }
                    var errMessage = err.message;
                    // Add additional information for postcss errors
                    if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
                        errMessage +=
                            '\nCompileError: Begins at CSS selector ' +
                                err['postcssNode'].selector;
                    }
                    messages = _this.formatWebpackMessages({
                        errors: [errMessage],
                        warnings: [],
                    });
                }
                else {
                    messages = _this.formatWebpackMessages(stats.toJson({ all: false, warnings: true, errors: true }));
                }
                if (messages.errors.length) {
                    // Only keep the first error. Others are often indicative
                    // of the same problem, but confuse the reader with noise.
                    if (messages.errors.length > 1) {
                        messages.errors.length = 1;
                    }
                    return reject(new Error(messages.errors.join('\n\n')));
                }
                if (process.env.CI &&
                    (typeof process.env.CI !== 'string' ||
                        process.env.CI.toLowerCase() !== 'false') &&
                    messages.warnings.length) {
                    console.log(chalk_1.default.yellow('\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'));
                    return reject(new Error(messages.warnings.join('\n\n')));
                }
                return resolve({ stats: stats, warnings: messages.warnings });
            });
        });
    };
    Build.prototype.formatWebpackMessages = function (json) {
        var _this = this;
        var formattedErrors = json.errors.map(function (message) {
            return _this.formatMessage(message);
        });
        var formattedWarnings = json.warnings.map(function (message) {
            return _this.formatMessage(message);
        });
        var result = { errors: formattedErrors, warnings: formattedWarnings };
        if (result.errors.some(this.isLikelyASyntaxError)) {
            // If there are any syntax errors, show just them.
            result.errors = result.errors.filter(this.isLikelyASyntaxError);
        }
        return result;
    };
    Build.prototype.isLikelyASyntaxError = function (message) {
        return message.indexOf('Syntax error:') !== -1;
    };
    // Cleans up webpack error messages.
    Build.prototype.formatMessage = function (message) {
        var lines = message.split('\n');
        // Strip Webpack-added headers off errors/warnings
        // https://github.com/webpack/webpack/blob/master/lib/ModuleError.js
        lines = lines.filter(function (line) { return !/Module [A-z ]+\(from/.test(line); });
        // Transform parsing error into syntax error
        // TODO: move this to our ESLint formatter?
        lines = lines.map(function (line) {
            var parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(line);
            if (!parsingError) {
                return line;
            }
            var errorLine = parsingError[1], errorColumn = parsingError[2], errorMessage = parsingError[3];
            return 'Syntax error:' + " " + errorMessage + " (" + errorLine + ":" + errorColumn + ")";
        });
        message = lines.join('\n');
        // Smoosh syntax errors (commonly found in CSS)
        message = message.replace(/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g, 'Syntax error:' + " $3 ($1:$2)\n");
        // Clean up export errors
        message = message.replace(/^.*export '(.+?)' was not found in '(.+?)'.*$/gm, "Attempted import error: '$1' is not exported from '$2'.");
        message = message.replace(/^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, "Attempted import error: '$2' does not contain a default export (imported as '$1').");
        message = message.replace(/^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, "Attempted import error: '$1' is not exported from '$3' (imported as '$2').");
        lines = message.split('\n');
        // Remove leading newline
        if (lines.length > 2 && lines[1].trim() === '') {
            lines.splice(1, 1);
        }
        // Clean up file name
        lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');
        // Cleans up verbose "module not found" messages for files and packages.
        if (lines[1] && lines[1].indexOf('Module not found: ') === 0) {
            lines = [
                lines[0],
                lines[1]
                    .replace('Error: ', '')
                    .replace('Module not found: Cannot find file:', 'Cannot find file:'),
            ];
        }
        // Add helpful message for users trying to use Sass for the first time
        if (lines[1] && lines[1].match(/Cannot find module.+node-sass/)) {
            lines[1] = 'To import Sass files, you first need to install node-sass.\n';
            lines[1] +=
                'Run `npm install node-sass` or `yarn add node-sass` inside your workspace.';
        }
        lines[0] = chalk_1.default.inverse(lines[0]);
        message = lines.join('\n');
        // Internal stacks are generally useless so we strip them... with the
        // exception of stacks containing `webpack:` because they're normally
        // from user code generated by Webpack. For more information see
        // https://github.com/facebook/create-react-app/pull/1050
        message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, ''); // at ... ...:x:y
        message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, ''); // at <anonymous>
        lines = message.split('\n');
        // Remove duplicated newlines
        lines = lines.filter(function (line, index, arr) {
            return index === 0 || line.trim() !== '' || line.trim() !== arr[index - 1].trim();
        });
        // Reassemble the message
        message = lines.join('\n');
        return message.trim();
    };
    Build = tslib_1.__decorate([
        inversify_1.injectable(),
        tslib_1.__param(0, inversify_1.inject('Logger'))
    ], Build);
    return Build;
}());
exports.Build = Build;
//# sourceMappingURL=build.js.map