"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackDevServerUtils = void 0;
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
function createCompiler(_a) {
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
        console.log('Recompiling...');
    });
    var isFirstCompile = true;
    var tsMessagesPromise;
    var tsMessagesResolver;
    compiler.hooks.beforeCompile.tap('beforeCompile', function () {
        tsMessagesPromise = new Promise(function (resolve) {
            tsMessagesResolver = function (msgs) { return resolve(msgs); };
        });
    });
    // compiler.hooks.done.tap('done', async stats => {
    compiler.hooks.done.tap('done', function (stats) {
        var statsData = stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        });
        var messages = format_webpack_msgs_1.formatWebpackMessages(statsData);
        var isSuccessful = !messages.errors.length && !messages.warnings.length;
        if (isSuccessful) {
            setTimeout(function () {
                console.log();
                console.log('✔', chalk_1.default.green('Compiled successfully!'));
                console.log('❯', 'Open the browser at the address:', urls.localUrlForBrowser);
            }, 500);
        }
        if (isSuccessful && (isInteractive || isFirstCompile)) {
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
            return;
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
    });
    return compiler;
}
exports.webpackDevServerUtils = {
    createCompiler: createCompiler,
    prepareUrls: prepareUrls,
};
//# sourceMappingURL=webpack-dev-server-utils.js.map