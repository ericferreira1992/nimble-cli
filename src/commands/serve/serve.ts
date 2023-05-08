import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import fs from 'fs-extra';
import { inject, injectable } from 'inversify';
import { Logger } from '../../utils/logger.util';
import { ArgsResolver } from '../../core/args-resolver';
import { webpackConfig } from '../config/webpack.config';
import { PATHS } from '../../core/dev-utils/paths';
import { CLI } from '../../cli';
import { prepareUrls, createCompiler } from '../../core/dev-utils/webpack-dev-server-utils';

@injectable()
export class Serve {
    private args!: ArgsResolver;

    private DEFAULT_PORT = '8090';
    private DEFAULT_HOST = '0.0.0.0';
    private DEFAULT_ENV = 'local';

    private get host() { return this.args.getValue('host', this.DEFAULT_HOST) as string; }
    private get port() { return parseInt(this.args.getValue('port', this.DEFAULT_PORT) as string); }
    private get env() { return this.args.getValue('env', this.DEFAULT_ENV) as string; }
    private get baseHref() { return this.args.getValue('baseHref', '') as string; }

    constructor(
        @inject('Logger') private logger: Logger
    ) {
    }

    public async execute(args: string[] = []) {
        if (!CLI.isNimbleProject()) {
            this.logger.showError('To continue you must be in a Nimble project.');
            process.exit(0);
        }

        this.args = new ArgsResolver(args);

        let options = {} as any;

        if (this.args.has('baseHref')) options.baseHref = this.baseHref

        const config = await webpackConfig(this.env, options);
        const protocol = this.args.has('https') ? 'https' : 'http';
        const appName = require(PATHS.appPackageJson).name;
        const urls = prepareUrls(protocol, this.host, this.port);

        // const devSocket = {
        //     warnings: (warnings) => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
        //     errors: (errors) => devServer.sockWrite(devServer.sockets, 'errors', errors),
        // };

        // Create a webpack compiler that is configured with custom messages.
        const compiler = createCompiler({
            appName,
            config,
            urls,
            useYarn: false,
            useTypeScript: true,
            webpack
        });

        compiler.hooks.done.tap('done', (stats) => {

        });

        const devServer = new WebpackDevServer(
            {
                host: this.host,
                port: this.port,
                historyApiFallback: true,
            },
            compiler
        );

        // devServer.listen(this.port, this.host, err => {
        devServer.startCallback(err => {
            if (err) {
                return console.log(err);
            }

            console.log('');
            console.log('❯ Nimble project is running at', chalk.yellow(`http://${this.host}:${this.port}/`));

            if (fs.existsSync(`${process.cwd()}/src/environments/env.${this.env}.js`)) {
                console.log('❯ Environment from:', chalk.yellow(`src/environments/env.${this.env}`));
            }
            else {
                console.log('❯ Environment:', chalk.red('not found'));
            }

            console.log('');

            console.log(chalk.cyan('❯ Await, starting the server...\n'));
            // openBrowser(urls.localUrlForBrowser);
        });

        ['SIGINT', 'SIGTERM'].forEach((sig: any) => {
            process.on(sig, () => {
                devServer.close();
                process.exit();
            });
        });
    }
}