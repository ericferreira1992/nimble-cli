"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = void 0;
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var path_1 = tslib_1.__importDefault(require("path"));
var inversify_1 = require("inversify");
var args_resolver_1 = require("../../core/args-resolver");
var webpack_config_1 = require("../config/webpack.config");
var cli_1 = require("../../cli");
var Build = exports.Build = /** @class */ (function () {
    function Build(logger) {
        this.logger = logger;
        this.DEFAULT_ENV = 'prod';
        this.WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
        this.WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
    }
    Object.defineProperty(Build.prototype, "env", {
        get: function () { return this.args.getValue('env', this.DEFAULT_ENV); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Build.prototype, "baseHref", {
        get: function () { return this.args.getValue('baseHref', ''); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Build.prototype, "gziped", {
        get: function () { return this.args.getValue('gziped', ''); },
        enumerable: false,
        configurable: true
    });
    Build.prototype.execute = function (args) {
        if (args === void 0) { args = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, config;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!cli_1.CLI.isNimbleProject()) {
                            this.logger.showError('To continue you must be inside a Nimble project.');
                            process.exit(0);
                        }
                        this.args = new args_resolver_1.ArgsResolver(args);
                        options = {
                            baseHref: this.baseHref,
                            gziped: this.gziped,
                        };
                        return [4 /*yield*/, (0, webpack_config_1.webpackConfig)(this.env, options, true)];
                    case 1:
                        config = _a.sent();
                        this.build(config)
                            .then(function (_a) {
                            var stats = _a.stats, warnings = _a.warnings;
                            if (warnings.length) {
                                console.log(chalk_1.default.green("\u2714 Compiled successfully"), chalk_1.default.yellow("but with warnings:"));
                                console.log('____________________________________________________');
                                console.log();
                                console.log(warnings.join('\n\n'));
                                console.log('____________________________________________________');
                                //console.log(`\nSearch for the ${chalk.underline(chalk.yellow('keywords'))} to learn more about each warning.`);
                                //console.log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`);
                            }
                            else {
                                console.log(chalk_1.default.green('✔ Compiled successfully!\n'));
                            }
                            console.log();
                            var directoriesSplited = process.cwd().split(path_1.default.sep);
                            console.log('❯ Directory where the build is:', chalk_1.default.yellow("".concat(directoriesSplited[directoriesSplited.length - 1], "/build")));
                            console.log();
                        }, function (err) {
                            if (err && err.message) {
                                console.log('');
                                console.log(err.message);
                                console.log('');
                            }
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
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Build.prototype.build = function (config) {
        var _this = this;
        console.log('');
        if (process.env.NODE_PATH) {
            console.log(chalk_1.default.yellow('Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'));
            console.log();
        }
        if (fs_extra_1.default.existsSync("".concat(process.cwd(), "/src/environments/env.").concat(this.env, ".js"))) {
            console.log('❯ Using environment:', chalk_1.default.yellow("src/environments/env.".concat(this.env)));
        }
        else {
            console.log('❯ Environment:', chalk_1.default.red('not found'));
        }
        console.log(chalk_1.default.cyan('❯ Await, creating an optimized production build...'));
        console.log();
        var compiler = (0, webpack_1.default)(config);
        return new Promise(function (resolve, reject) {
            compiler.run(function (err, stats) {
                var messages;
                if (err) {
                    if (!err.message) {
                        return reject(err);
                    }
                    var errMessage = err.message;
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
                    messages = _this.formatWebpackMessages(stats === null || stats === void 0 ? void 0 : stats.toJson({ all: false, warnings: true, errors: true }));
                }
                if (messages.errors.length) {
                    if (messages.errors.length > 1) {
                        messages.errors.length = 1;
                    }
                    return reject(new Error(messages.errors.join('\n\n')));
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
            result.errors = result.errors.filter(this.isLikelyASyntaxError);
        }
        return result;
    };
    Build.prototype.isLikelyASyntaxError = function (message) {
        return message.indexOf('Syntax error:') !== -1;
    };
    Build.prototype.formatMessage = function (message) {
        var lines = message.split('\n');
        lines = lines.filter(function (line) { return !/Module [A-z ]+\(from/.test(line); });
        lines = lines.map(function (line) {
            var parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(line);
            if (!parsingError) {
                return line;
            }
            var errorLine = parsingError[1], errorColumn = parsingError[2], errorMessage = parsingError[3];
            return "".concat('Syntax error:', " ").concat(errorMessage, " (").concat(errorLine, ":").concat(errorColumn, ")");
        });
        message = lines.join('\n');
        message = message.replace(/SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g, "".concat('Syntax error:', " $3 ($1:$2)\n"));
        message = message.replace(/^.*export '(.+?)' was not found in '(.+?)'.*$/gm, "Attempted import error: '$1' is not exported from '$2'.");
        message = message.replace(/^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, "Attempted import error: '$2' does not contain a default export (imported as '$1').");
        message = message.replace(/^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm, "Attempted import error: '$1' is not exported from '$3' (imported as '$2').");
        lines = message.split('\n');
        if (lines.length > 2 && lines[1].trim() === '') {
            lines.splice(1, 1);
        }
        lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, '$1');
        if (lines[1] && lines[1].indexOf('Module not found: ') === 0) {
            lines = [
                lines[0],
                lines[1]
                    .replace('Error: ', '')
                    .replace('Module not found: Cannot find file:', 'Cannot find file:'),
            ];
        }
        if (lines[1] && lines[1].match(/Cannot find module.+node-sass/)) {
            lines[1] = 'To import Sass files, you first need to install node-sass.\n';
            lines[1] +=
                'Run `npm install node-sass` or `yarn add node-sass` inside your workspace.';
        }
        lines[0] = chalk_1.default.inverse(lines[0]);
        message = lines.join('\n');
        message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, '');
        message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, '');
        lines = message.split('\n');
        // Remove duplicated newlines
        lines = lines.filter(function (line, index, arr) {
            return index === 0 || line.trim() !== '' || line.trim() !== arr[index - 1].trim();
        });
        message = lines.join('\n');
        return message.trim();
    };
    Build = tslib_1.__decorate([
        (0, inversify_1.injectable)(),
        tslib_1.__param(0, (0, inversify_1.inject)('Logger'))
    ], Build);
    return Build;
}());
//# sourceMappingURL=build.js.map