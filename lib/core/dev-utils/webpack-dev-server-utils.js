"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.choosePort = exports.prepareProxy = exports.createCompiler = exports.prepareUrls = void 0;
var tslib_1 = require("tslib");
var address_1 = tslib_1.__importDefault(require("address"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var url_1 = tslib_1.__importDefault(require("url"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var detect_port_alt_1 = tslib_1.__importDefault(require("detect-port-alt"));
var is_root_1 = tslib_1.__importDefault(require("is-root"));
var prompts_1 = tslib_1.__importDefault(require("prompts"));
var clear_console_1 = require("./clear-console");
var format_webpack_msgs_1 = require("./format-webpack-msgs");
var process_for_port_1 = require("./process-for-port");
var fork_ts_checker_webpack_plugin_1 = require("./fork-ts-checker-webpack-plugin");
var isInteractive = process.stdout.isTTY;
function prepareUrls(protocol, host, port, pathname) {
    if (pathname === void 0) { pathname = '/'; }
    var formatUrl = function (hostname) {
        return url_1.default.format({
            protocol: protocol,
            hostname: hostname,
            port: port,
            pathname: pathname,
        });
    };
    var prettyPrintUrl = function (hostname) {
        return url_1.default.format({
            protocol: protocol,
            hostname: hostname,
            port: chalk_1.default.bold(port),
            pathname: pathname,
        });
    };
    var isUnspecifiedHost = host === '0.0.0.0' || host === '::';
    var prettyHost, lanUrlForConfig, lanUrlForTerminal;
    if (isUnspecifiedHost) {
        prettyHost = 'localhost';
        try {
            // This can only return an IPv4 address
            lanUrlForConfig = address_1.default.ip();
            if (lanUrlForConfig) {
                // Check if the address is a private ip
                // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
                if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
                    // Address is private, format it for later use
                    lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
                }
                else {
                    // Address is not private, so we will discard it
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
exports.prepareUrls = prepareUrls;
function printInstructions(appName, urls, useYarn) {
    console.log();
    console.log("You can now view ".concat(chalk_1.default.bold(appName), " in the browser."));
    console.log();
    if (urls.lanUrlForTerminal) {
        console.log("  ".concat(chalk_1.default.bold('Local:'), "            ").concat(urls.localUrlForTerminal));
        console.log("  ".concat(chalk_1.default.bold('On Your Network:'), "  ").concat(urls.lanUrlForTerminal));
    }
    else {
        console.log("  ".concat(urls.localUrlForTerminal));
    }
    console.log();
    console.log('Note that the development build is not optimized.');
    console.log("To create a production build, use " +
        "".concat(chalk_1.default.cyan("".concat(useYarn ? 'yarn' : 'npm run', " build")), "."));
    console.log();
}
function createCompiler(_a) {
    var _this = this;
    var appName = _a.appName, config = _a.config, urls = _a.urls, useYarn = _a.useYarn, useTypeScript = _a.useTypeScript, webpack = _a.webpack;
    // "Compiler" is a low-level interface to webpack.
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
    // "invalid" event fires when you have changed a file, and webpack is
    // recompiling a bundle. WebpackDevServer takes care to pause serving the
    // bundle, so if you refresh, it'll wait instead of serving the old one.
    // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
    compiler.hooks.invalid.tap('invalid', function () {
        if (isInteractive) {
            (0, clear_console_1.clearConsole)();
        }
        console.log('Compiling...');
    });
    var isFirstCompile = true;
    var tsMessagesPromise;
    if (useTypeScript) {
        fork_ts_checker_webpack_plugin_1.forkTsCheckerWebpackPlugin
            .getCompilerHooks(compiler)
            .waiting.tap('awaitingTypeScriptCheck', function () {
            console.log(chalk_1.default.yellow('Files successfully emitted, waiting for typecheck results...'));
        });
    }
    // "done" event fires when webpack has finished recompiling the bundle.
    // Whether or not you have warnings or errors, you will get this event.
    compiler.hooks.done.tap('done', function (stats) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var statsData, messages, isSuccessful;
        return tslib_1.__generator(this, function (_a) {
            if (isInteractive) {
                (0, clear_console_1.clearConsole)();
            }
            statsData = stats.toJson({
                all: false,
                warnings: true,
                errors: true,
            });
            messages = (0, format_webpack_msgs_1.formatWebpackMessages)(statsData);
            isSuccessful = !messages.errors.length && !messages.warnings.length;
            if (isSuccessful) {
                console.log(chalk_1.default.green('Compiled successfully!'));
                setTimeout(function () {
                    console.log();
                    console.log('✔', chalk_1.default.green('Compiled successfully!'));
                    console.log('❯', 'Open the browser at the address:', urls.localUrlForBrowser);
                }, 100);
            }
            if (isSuccessful && (isInteractive || isFirstCompile)) {
                printInstructions(appName, urls, useYarn);
            }
            isFirstCompile = false;
            // If errors exist, only show errors.
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
        });
    }); });
    // You can safely remove this after ejecting.
    // We only use this block for testing of Create React App itself:
    var isSmokeTest = process.argv.some(function (arg) { return arg.indexOf('--smoke-test') > -1; });
    if (isSmokeTest) {
        compiler.hooks.failed.tap('smokeTest', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tsMessagesPromise];
                    case 1:
                        _a.sent();
                        process.exit(1);
                        return [2 /*return*/];
                }
            });
        }); });
        compiler.hooks.done.tap('smokeTest', function (stats) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tsMessagesPromise];
                    case 1:
                        _a.sent();
                        if (stats.hasErrors() || stats.hasWarnings()) {
                            process.exit(1);
                        }
                        else {
                            process.exit(0);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    }
    return compiler;
}
exports.createCompiler = createCompiler;
function resolveLoopback(proxy) {
    var o = url_1.default.parse(proxy);
    o.host = undefined;
    if (o.hostname !== 'localhost') {
        return proxy;
    }
    // Unfortunately, many languages (unlike node) do not yet support IPv6.
    // This means even though localhost resolves to ::1, the application
    // must fall back to IPv4 (on 127.0.0.1).
    // We can re-enable this in a few years.
    /*try {
      o.hostname = address.ipv6() ? '::1' : '127.0.0.1';
    } catch (_ignored) {
      o.hostname = '127.0.0.1';
    }*/
    try {
        // Check if we're on a network; if we are, chances are we can resolve
        // localhost. Otherwise, we can just be safe and assume localhost is
        // IPv4 for maximum compatibility.
        if (!address_1.default.ip()) {
            o.hostname = '127.0.0.1';
        }
    }
    catch (_ignored) {
        o.hostname = '127.0.0.1';
    }
    return url_1.default.format(o);
}
// We need to provide a custom onError function for httpProxyMiddleware.
// It allows us to log custom error messages on the console.
function onProxyError(proxy) {
    return function (err, req, res) {
        var host = req.headers && req.headers.host;
        console.log(chalk_1.default.red('Proxy error:') +
            ' Could not proxy request ' +
            chalk_1.default.cyan(req.url) +
            ' from ' +
            chalk_1.default.cyan(host) +
            ' to ' +
            chalk_1.default.cyan(proxy) +
            '.');
        console.log('See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' +
            chalk_1.default.cyan(err.code) +
            ').');
        console.log();
        // And immediately send the proper error response to the client.
        // Otherwise, the request will eventually timeout with ERR_EMPTY_RESPONSE on the client side.
        if (res.writeHead && !res.headersSent) {
            res.writeHead(500);
        }
        res.end('Proxy error: Could not proxy request ' +
            req.url +
            ' from ' +
            host +
            ' to ' +
            proxy +
            ' (' +
            err.code +
            ').');
    };
}
function prepareProxy(proxy, appPublicFolder, servedPathname) {
    // `proxy` lets you specify alternate servers for specific requests.
    if (!proxy) {
        return undefined;
    }
    if (typeof proxy !== 'string') {
        console.log(chalk_1.default.red('When specified, "proxy" in package.json must be a string.'));
        console.log(chalk_1.default.red('Instead, the type of "proxy" was "' + typeof proxy + '".'));
        console.log(chalk_1.default.red('Either remove "proxy" from package.json, or make it a string.'));
        process.exit(1);
    }
    // If proxy is specified, let it handle any request except for
    // files in the public folder and requests to the WebpackDevServer socket endpoint.
    // https://github.com/facebook/create-react-app/issues/6720
    var sockPath = process.env.WDS_SOCKET_PATH || '/ws';
    var isDefaultSockHost = !process.env.WDS_SOCKET_HOST;
    function mayProxy(pathname) {
        var maybePublicPath = path_1.default.resolve(appPublicFolder, pathname.replace(new RegExp('^' + servedPathname), ''));
        var isPublicFileRequest = fs_1.default.existsSync(maybePublicPath);
        // used by webpackHotDevClient
        var isWdsEndpointRequest = isDefaultSockHost && pathname.startsWith(sockPath);
        return !(isPublicFileRequest || isWdsEndpointRequest);
    }
    if (!/^http(s)?:\/\//.test(proxy)) {
        console.log(chalk_1.default.red('When "proxy" is specified in package.json it must start with either http:// or https://'));
        process.exit(1);
    }
    var target;
    if (process.platform === 'win32') {
        target = resolveLoopback(proxy);
    }
    else {
        target = proxy;
    }
    return [
        {
            target: target,
            logLevel: 'silent',
            // For single page apps, we generally want to fallback to /index.html.
            // However we also want to respect `proxy` for API calls.
            // So if `proxy` is specified as a string, we need to decide which fallback to use.
            // We use a heuristic: We want to proxy all the requests that are not meant
            // for static assets and as all the requests for static assets will be using
            // `GET` method, we can proxy all non-`GET` requests.
            // For `GET` requests, if request `accept`s text/html, we pick /index.html.
            // Modern browsers include text/html into `accept` header when navigating.
            // However API calls like `fetch()` won’t generally accept text/html.
            // If this heuristic doesn’t work well for you, use `src/setupProxy.js`.
            context: function (pathname, req) {
                return (req.method !== 'GET' ||
                    (mayProxy(pathname) &&
                        req.headers.accept &&
                        req.headers.accept.indexOf('text/html') === -1));
            },
            onProxyReq: function (proxyReq) {
                // Browsers may send Origin headers even with same-origin
                // requests. To prevent CORS issues, we have to change
                // the Origin to match the target URL.
                if (proxyReq.getHeader('origin')) {
                    proxyReq.setHeader('origin', target);
                }
            },
            onError: onProxyError(target),
            secure: false,
            changeOrigin: true,
            ws: true,
            xfwd: true,
        },
    ];
}
exports.prepareProxy = prepareProxy;
function choosePort(host, defaultPort) {
    return (0, detect_port_alt_1.default)(defaultPort, host).then(function (port) {
        return new Promise(function (resolve) {
            if (port === defaultPort) {
                return resolve(port);
            }
            var message = process.platform !== 'win32' && defaultPort < 1024 && !(0, is_root_1.default)()
                ? "Admin permissions are required to run a server on a port below 1024."
                : "Something is already running on port ".concat(defaultPort, ".");
            if (isInteractive) {
                (0, clear_console_1.clearConsole)();
                var existingProcess = (0, process_for_port_1.getProcessForPort)(defaultPort);
                var question = {
                    type: 'confirm',
                    name: 'shouldChangePort',
                    message: chalk_1.default.yellow(message +
                        "".concat(existingProcess ? " Probably:\n  ".concat(existingProcess) : '')) + '\n\nWould you like to run the app on another port instead?',
                    initial: true,
                };
                (0, prompts_1.default)(question).then(function (answer) {
                    if (answer.shouldChangePort) {
                        resolve(port);
                    }
                    else {
                        resolve(null);
                    }
                });
            }
            else {
                console.log(chalk_1.default.red(message));
                resolve(null);
            }
        });
    }, function (err) {
        throw new Error(chalk_1.default.red("Could not find an open port at ".concat(chalk_1.default.bold(host), ".")) +
            '\n' +
            ('Network error message: ' + err.message || err) +
            '\n');
    });
}
exports.choosePort = choosePort;
//# sourceMappingURL=webpack-dev-server-utils.js.map