"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var webpack_dev_server_1 = tslib_1.__importDefault(require("webpack-dev-server"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var inversify_1 = require("inversify");
var args_resolver_1 = require("../../core/args-resolver");
var webpack_config_1 = require("../config/webpack.config");
var paths_1 = require("../../core/dev-utils/paths");
var webpack_dev_server_utils_1 = require("../../core/dev-utils/webpack-dev-server-utils");
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
    Serve.prototype.execute = function (args) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var config, protocol, appName, urls, devSocket, compiler, devServer;
            return tslib_1.__generator(this, function (_a) {
                this.args = new args_resolver_1.ArgsResolver(args);
                config = webpack_config_1.webpackConfig(this.env);
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
                    historyApiFallback: true
                });
                devServer.listen(this.port, this.host, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(chalk_1.default.cyan('Starting the development server...\n'));
                    // openBrowser(urls.localUrlForBrowser);
                });
                ['SIGINT', 'SIGTERM'].forEach(function (sig) {
                    process.on(sig, function () {
                        devServer.close();
                        process.exit();
                    });
                });
                return [2 /*return*/];
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