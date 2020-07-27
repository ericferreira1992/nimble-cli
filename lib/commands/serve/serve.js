"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var webpack_dev_server_1 = tslib_1.__importDefault(require("webpack-dev-server"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var inversify_1 = require("inversify");
var args_resolver_1 = require("../../core/args-resolver");
var webpack_config_1 = require("../config/webpack.config");
var paths_1 = require("../../core/dev-utils/paths");
var webpack_dev_server_utils_1 = require("../../core/dev-utils/webpack-dev-server-utils");
var cli_1 = require("../../cli");
var Serve = /** @class */ (function () {
    function Serve(logger) {
        this.logger = logger;
        this.DEFAULT_PORT = '8090';
        this.DEFAULT_HOST = '0.0.0.0';
        this.DEFAULT_ENV = 'local';
    }
    Object.defineProperty(Serve.prototype, "host", {
        get: function () { return this.args.getValue('host', this.DEFAULT_HOST); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serve.prototype, "port", {
        get: function () { return parseInt(this.args.getValue('port', this.DEFAULT_PORT)); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serve.prototype, "env", {
        get: function () { return this.args.getValue('env', this.DEFAULT_ENV); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Serve.prototype, "baseHref", {
        get: function () { return this.args.getValue('baseHref', ''); },
        enumerable: true,
        configurable: true
    });
    Serve.prototype.execute = function (args) {
        if (args === void 0) { args = []; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var options, config, protocol, appName, urls, devSocket, compiler, devServer;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!cli_1.CLI.isNimbleProject()) {
                            this.logger.showError('To continue you must be in a Nimble project.');
                            process.exit(0);
                        }
                        this.args = new args_resolver_1.ArgsResolver(args);
                        options = {};
                        if (this.args.has('baseHref'))
                            options.baseHref = this.baseHref;
                        return [4 /*yield*/, webpack_config_1.webpackConfig(this.env, options)];
                    case 1:
                        config = _a.sent();
                        protocol = this.args.has('https') ? 'https' : 'http';
                        appName = require(paths_1.PATHS.appPackageJson).name;
                        urls = webpack_dev_server_utils_1.webpackDevServerUtils.prepareUrls(protocol, this.host, this.port);
                        devSocket = {
                            warnings: function (warnings) { return devServer.sockWrite(devServer.sockets, 'warnings', warnings); },
                            errors: function (errors) { return devServer.sockWrite(devServer.sockets, 'errors', errors); },
                        };
                        compiler = webpack_dev_server_utils_1.webpackDevServerUtils.createCompiler({
                            appName: appName,
                            config: config,
                            devSocket: devSocket,
                            urls: urls,
                            webpack: webpack_1.default,
                        });
                        devServer = new webpack_dev_server_1.default(compiler, {
                            host: this.host,
                            port: this.port,
                            historyApiFallback: true,
                            onListening: function (server) {
                            },
                            before: function (app, server) {
                                server.log.info = function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    return null;
                                    //return server.log.info(...args);
                                    // return server.log.info(...(args.map(s => {
                                    // 	return `--- ${s}`
                                    // })));
                                };
                            }
                        });
                        devServer.listen(this.port, this.host, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log('');
                            console.log('❯ Nimble project is running at', chalk_1.default.yellow("http://" + _this.host + ":" + _this.port + "/"));
                            if (fs_extra_1.default.existsSync(process.cwd() + "/src/environments/env." + _this.env + ".js")) {
                                console.log('❯ Environment from:', chalk_1.default.yellow("src/environments/env." + _this.env));
                            }
                            else {
                                console.log('❯ Environment:', chalk_1.default.red('not found'));
                            }
                            console.log('');
                            console.log(chalk_1.default.cyan('❯ Await, starting the server...\n'));
                            // openBrowser(urls.localUrlForBrowser);
                        });
                        ['SIGINT', 'SIGTERM'].forEach(function (sig) {
                            process.on(sig, function () {
                                devServer.close();
                                process.exit();
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Serve = tslib_1.__decorate([
        inversify_1.injectable(),
        tslib_1.__param(0, inversify_1.inject('Logger'))
    ], Serve);
    return Serve;
}());
exports.Serve = Serve;
//# sourceMappingURL=serve.js.map