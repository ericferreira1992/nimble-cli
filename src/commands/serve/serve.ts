import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import { inject, injectable } from 'inversify';
import { Logger } from '../../utils/logger.util';
import { ArgsResolver } from '../../core/args-resolver';
import { webpackConfig } from '../config/webpack.config';
import { PATHS } from '../../core/dev-utils/paths';
import { webpackDevServerUtils } from '../../core/dev-utils/webpack-dev-server-utils';

@injectable()
export class Serve {
    private args!: ArgsResolver;

    private DEFAULT_PORT = '8090';
    private DEFAULT_HOST = '0.0.0.0';
    private DEFAULT_ENV = 'local';

    private get host() { return this.args.getValue('host', this.DEFAULT_HOST) as string; }
    private get port() { return parseInt(this.args.getValue('port', this.DEFAULT_PORT) as string); }
    private get env() { return this.args.getValue('env', this.DEFAULT_ENV) as string; }

    constructor(
        @inject('Logger') private logger: Logger
    ) {
    }

    public async execute(args: string[]) {
        this.args = new ArgsResolver(args);

        const config = webpackConfig(this.env);
        const protocol = this.args.has('https') ? 'https' : 'http';
        const appName = require(PATHS.appPackageJson).name;
        const urls = webpackDevServerUtils.prepareUrls(protocol, this.host, this.port);

        const devSocket = {
            warnings: (warnings) => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
            errors: (errors) => devServer.sockWrite(devServer.sockets, 'errors', errors),
        };

        // Create a webpack compiler that is configured with custom messages.
        const compiler = webpackDevServerUtils.createCompiler({
            appName,
            config,
            devSocket,
            urls,
            webpack,
        });

        const devServer = new WebpackDevServer(compiler, {
            host: this.host,
            port: this.port,
            historyApiFallback: true
        });

        devServer.listen(this.port, this.host, err => {
            if (err) {
                return console.log(err);
            }

            console.log(chalk.cyan('Starting the development server...\n'));
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