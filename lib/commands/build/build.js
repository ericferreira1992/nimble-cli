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
var format_webpack_msgs_1 = require("../../core/dev-utils/format-webpack-msgs");
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
                            console.log(chalk_1.default.green('✔ Compiled successfully!\n'));
                            var directoriesSplited = process.cwd().split(path_1.default.sep);
                            console.log('✅ Directory where the build is:', chalk_1.default.yellow("".concat(directoriesSplited[directoriesSplited.length - 1], "/build")));
                            console.log();
                        }, function (err) {
                            console.error(err);
                            console.log('');
                            var tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
                            if (tscCompileOnError) {
                                console.log(chalk_1.default.yellow('Compiled with the following type errors (you may want to check these before deploying your app):\n'));
                            }
                            else {
                                console.log(chalk_1.default.red('Failed to compile.\n'));
                                process.exit(1);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Build.prototype.build = function (config) {
        console.log('');
        if (fs_extra_1.default.existsSync("".concat(process.cwd(), "/src/environments/env.").concat(this.env, ".js"))) {
            console.log('⚙️ Using environment:', chalk_1.default.yellow("src/environments/env.".concat(this.env)));
        }
        else {
            console.log('💔 Environment:', chalk_1.default.red('not found'));
        }
        console.log(chalk_1.default.cyan('🚀 Await, creating an optimized production build...'));
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
                    messages = (0, format_webpack_msgs_1.formatWebpackMessages)({
                        errors: [errMessage],
                        warnings: [],
                    });
                }
                else {
                    messages = (0, format_webpack_msgs_1.formatWebpackMessages)(stats === null || stats === void 0 ? void 0 : stats.toJson({ all: false, warnings: true, errors: true }));
                }
                if (messages.errors.length) {
                    return reject(new Error(messages.errors.join('\n\n')));
                }
                return resolve({ stats: stats, warnings: messages.warnings });
            });
        });
    };
    Build = tslib_1.__decorate([
        (0, inversify_1.injectable)(),
        tslib_1.__param(0, (0, inversify_1.inject)('Logger'))
    ], Build);
    return Build;
}());
//# sourceMappingURL=build.js.map