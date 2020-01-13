"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var address_1 = tslib_1.__importDefault(require("address"));
var url_1 = tslib_1.__importDefault(require("url"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var dev_various_utils_1 = require("../../core/dev-utils/dev-various-utils");
var format_webpack_msgs_1 = require("../../core/dev-utils/format-webpack-msgs");
/* import typescriptFormatter from './typescriptFormatter';
import forkTsCheckerWebpackPlugin from './ForkTsCheckerWebpackPlugin'; */
var isInteractive = process.stdout.isTTY;
function prepareUrls(protocol, host, port) {
    var formatUrl = function (hostname) {
        return url_1.default.format({
            protocol: protocol,
            hostname: hostname,
            port: port,
            pathname: '/',
        });
    };
    var prettyPrintUrl = function (hostname) {
        return url_1.default.format({
            protocol: protocol,
            hostname: hostname,
            port: chalk_1.default.bold(port),
            pathname: '/',
        });
    };
    var isUnspecifiedHost = host === '0.0.0.0' || host === '::';
    var prettyHost, lanUrlForConfig, lanUrlForTerminal;
    if (isUnspecifiedHost) {
        prettyHost = 'localhost';
        try {
            lanUrlForConfig = address_1.default.ip();
            if (lanUrlForConfig) {
                if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
                    lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
                }
                else {
                    lanUrlForConfig = undefined;
                }
            }
        }
        catch (_e) {
            // ignored
        }
    }
    else {
        prettyHost = host;
    }
    var localUrlForTerminal = prettyPrintUrl(prettyHost);
    var localUrlForBrowser = formatUrl(prettyHost);
    return {
        lanUrlForConfig: lanUrlForConfig,
        lanUrlForTerminal: lanUrlForTerminal,
        localUrlForTerminal: localUrlForTerminal,
        localUrlForBrowser: localUrlForBrowser,
    };
}
function printInstructions(appName, urls) {
    console.log();
    console.log("You can now view " + chalk_1.default.bold(appName) + " in the browser.");
    console.log();
    if (urls.lanUrlForTerminal) {
        console.log("  " + chalk_1.default.bold('Local:') + "            " + urls.localUrlForTerminal);
        console.log("  " + chalk_1.default.bold('On Your Network:') + "  " + urls.lanUrlForTerminal);
    }
    else {
        console.log("  " + urls.localUrlForTerminal);
    }
    console.log();
    console.log('Note that the development build is not optimized.');
    console.log("To create a production build, use " +
        (chalk_1.default.cyan("npm run build") + "."));
    console.log();
}
function createCompiler(_a) {
    var _this = this;
    var appName = _a.appName, config = _a.config, devSocket = _a.devSocket, urls = _a.urls, webpack = _a.webpack;
    // "Compiler" is a low-level interface to Webpack.
    // It lets us listen to some events and provide our own custom messages.
    var compiler;
    try {
        compiler = webpack(config);
    }
    catch (err) {
        console.log(chalk_1.default.red('Failed to compile.'));
        console.log();
        console.log(err.message || err);
        console.log();
        process.exit(1);
    }
    compiler.hooks.invalid.tap('invalid', function () {
        if (isInteractive) {
            dev_various_utils_1.clearConsole();
        }
        console.log('Compiling...');
    });
    var isFirstCompile = true;
    var tsMessagesPromise;
    var tsMessagesResolver;
    compiler.hooks.beforeCompile.tap('beforeCompile', function () {
        tsMessagesPromise = new Promise(function (resolve) {
            tsMessagesResolver = function (msgs) { return resolve(msgs); };
        });
    });
    /* forkTsCheckerWebpackPlugin
        .getCompilerHooks(compiler)
        .receive.tap('afterTypeScriptCheck', (diagnostics, lints) => {
            const allMsgs = [...diagnostics, ...lints];
            const format = message =>
                `${message.file}\n${typescriptFormatter(message, true)}`;

            tsMessagesResolver({
                errors: allMsgs.filter(msg => msg.severity === 'error').map(format),
                warnings: allMsgs
                    .filter(msg => msg.severity === 'warning')
                    .map(format),
            });
        }); */
    compiler.hooks.done.tap('done', function (stats) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var statsData, delayedMsg, messages_1, messages, isSuccessful;
        var _a, _b, _c, _d;
        return tslib_1.__generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    statsData = stats.toJson({
                        all: false,
                        warnings: true,
                        errors: true,
                    });
                    if (!(statsData.errors.length === 0)) return [3 /*break*/, 2];
                    delayedMsg = setTimeout(function () {
                    }, 100);
                    return [4 /*yield*/, tsMessagesPromise];
                case 1:
                    messages_1 = _f.sent();
                    clearTimeout(delayedMsg);
                    (_a = statsData.warnings).push.apply(_a, messages_1.errors);
                    (_b = statsData.warnings).push.apply(_b, messages_1.warnings);
                    (_c = stats.compilation.warnings).push.apply(_c, messages_1.errors);
                    (_d = stats.compilation.warnings).push.apply(_d, messages_1.warnings);
                    if (messages_1.errors.length > 0) {
                        devSocket.warnings(messages_1.errors);
                    }
                    else if (messages_1.warnings.length > 0) {
                        devSocket.warnings(messages_1.warnings);
                    }
                    _f.label = 2;
                case 2:
                    messages = format_webpack_msgs_1.formatWebpackMessages(statsData);
                    isSuccessful = !messages.errors.length && !messages.warnings.length;
                    if (isSuccessful) {
                        console.log(chalk_1.default.green('Compiled successfully!'));
                    }
                    if (isSuccessful && (isInteractive || isFirstCompile)) {
                        printInstructions(appName, urls);
                    }
                    isFirstCompile = false;
                    if (messages.errors.length) {
                        // Only keep the first error. Others are often indicative
                        // of the same problem, but confuse the reader with noise.
                        if (messages.errors.length > 1) {
                            messages.errors.length = 1;
                        }
                        console.log(chalk_1.default.red('Failed to compile.\n'));
                        console.log(messages.errors.join('\n\n'));
                        return [2 /*return*/];
                    }
                    // Show warnings if no errors were found.
                    if (messages.warnings.length) {
                        console.log(chalk_1.default.yellow('Compiled with warnings.\n'));
                        console.log(messages.warnings.join('\n\n'));
                        // Teach some ESLint tricks.
                        console.log('\nSearch for the ' +
                            chalk_1.default.underline(chalk_1.default.yellow('keywords')) +
                            ' to learn more about each warning.');
                        console.log('To ignore, add ' +
                            chalk_1.default.cyan('// eslint-disable-next-line') +
                            ' to the line before.\n');
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    return compiler;
}
exports.webpackDevServerUtils = {
    createCompiler: createCompiler,
    prepareUrls: prepareUrls,
};
//# sourceMappingURL=webpack-dev-server-utils.js.map