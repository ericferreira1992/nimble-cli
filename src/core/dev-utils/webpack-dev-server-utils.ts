import address from 'address';
import url from 'url';
import chalk from 'chalk';
import { clearConsole } from '../../core/dev-utils/dev-various-utils';
import { formatWebpackMessages } from '../../core/dev-utils/format-webpack-msgs';
/* import typescriptFormatter from './typescriptFormatter';
import forkTsCheckerWebpackPlugin from './ForkTsCheckerWebpackPlugin'; */

const isInteractive = process.stdout.isTTY;

function prepareUrls(protocol, host, port) {
    const formatUrl = hostname =>
        url.format({
            protocol,
            hostname,
            port,
            pathname: '/',
        });
    const prettyPrintUrl = hostname =>
        url.format({
            protocol,
            hostname,
            port: chalk.bold(port),
            pathname: '/',
        });

    const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
    let prettyHost, lanUrlForConfig, lanUrlForTerminal;
    if (isUnspecifiedHost) {
        prettyHost = 'localhost';
        try {
            lanUrlForConfig = address.ip();
            if (lanUrlForConfig) {
                if (
                    /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
                        lanUrlForConfig
                    )
                ) {
                    lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
                } else {
                    lanUrlForConfig = undefined;
                }
            }
        } catch (_e) {
            // ignored
        }
    } else {
        prettyHost = host;
    }
    const localUrlForTerminal = prettyPrintUrl(prettyHost);
    const localUrlForBrowser = formatUrl(prettyHost);
    return {
        lanUrlForConfig,
        lanUrlForTerminal,
        localUrlForTerminal,
        localUrlForBrowser,
    };
}

function createCompiler({ appName, config, urls, webpack }) {
    // "Compiler" is a low-level interface to Webpack.
    // It lets us listen to some events and provide our own custom messages.
    let compiler;
    try {
        compiler = webpack(config);
    } catch (err) {
        console.log(chalk.red('Failed to compile.'));
        console.log();
        console.log(err);
        console.log();
        process.exit(1);
    }

    compiler.hooks.invalid.tap('invalid', () => {
        if (isInteractive) {
            clearConsole();
        }
        console.log('Recompiling...');
    });

    let isFirstCompile = true;
    let tsMessagesPromise;
    let tsMessagesResolver;

    compiler.hooks.beforeCompile.tap('beforeCompile', () => {
        tsMessagesPromise = new Promise(resolve => {
            tsMessagesResolver = msgs => resolve(msgs);
        });
    });

    // compiler.hooks.done.tap('done', async stats => {
    compiler.hooks.done.tap('done', (stats) => {
        const statsData = stats.toJson({
            all: false,
            warnings: true,
            errors: true,
        });

        const messages = formatWebpackMessages(statsData);
        const isSuccessful = !messages.errors.length && !messages.warnings.length;
        if (isSuccessful) {
            setTimeout(() => {
				console.log();
				console.log('✔', chalk.green('Compiled successfully!'));
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
            console.log(chalk.red('Failed to compile.\n'));
            console.log(messages.errors.join('\n\n'));
            return;
        }

        // Show warnings if no errors were found.
        if (messages.warnings.length) {
            console.log(chalk.yellow('Compiled with warnings.\n'));
            console.log(messages.warnings.join('\n\n'));

            // Teach some ESLint tricks.
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            );
            console.log(
                'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n'
            );
		}
    });

    return compiler;
}

export const webpackDevServerUtils = {
    createCompiler,
    prepareUrls,
};