import webpack from 'webpack';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { inject, injectable } from 'inversify';
import { Logger } from '../../utils/logger.util';
import { ArgsResolver } from '../../core/args-resolver';
import { webpackConfig } from '../config/webpack.config';
import { CLI } from '../../cli';
import { formatWebpackMessages } from '../../core/dev-utils/format-webpack-msgs';

@injectable()
export class Build {
    private args!: ArgsResolver;

    private DEFAULT_ENV = 'prod';
    private WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
    private WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

    private get env() { return this.args.getValue('env', this.DEFAULT_ENV) as string; }
    private get baseHref() { return this.args.getValue('baseHref', '') as string; }
    private get gziped() { return this.args.getValue('gziped', '') as boolean; }

    constructor(
        @inject('Logger') private logger: Logger
    ) {
    }

    public async execute(args: string[] = []) {
        if (!CLI.isNimbleProject()) {
            this.logger.showError('To continue you must be inside a Nimble project.');
            process.exit(0);
        }

        this.args = new ArgsResolver(args);

        let options = {
            baseHref: this.baseHref,
            gziped: this.gziped,
        }

        const config = await webpackConfig(this.env, options, true);

        this.build(config)
            .then(
                ({ stats, warnings }) => {
                    console.log(chalk.green('✔ Compiled successfully!\n'));

                    let directoriesSplited = process.cwd().split(path.sep);
                    console.log('✅ Directory where the build is:', chalk.yellow(`${directoriesSplited[directoriesSplited.length - 1]}/build`));
                    console.log();
                },
                err => {
                    if (Array.isArray(err)) {
                        err.forEach((e) => {
                            console.error(e);
                        });
                    }
                    else {
                        console.error(err);
                    }
                    console.log('');

                    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';

                    if (tscCompileOnError) {
                        console.log(
                            chalk.yellow(
                                'Compiled with the following type errors (you may want to check these before deploying your app):\n'
                            )
                        );
                    } else {
                        console.log(chalk.red('Failed to compile.\n'));
                        process.exit(1);
                    }
                }
            );
    }

    private build(config: any) {
        console.log('');

        if (fs.existsSync(`${process.cwd()}/src/environments/env.${this.env}.js`)) {
            console.log('⚙️ Using environment:', chalk.yellow(`src/environments/env.${this.env}`));
        }
        else {
            console.log('💔 Environment:', chalk.red('not found'));
        }

        console.log(chalk.cyan('🚀 Await, creating an optimized production build...'));
        console.log();

        const compiler = webpack(config);
        return new Promise<{ stats: any, warnings: string[] }>((resolve, reject) => {
            compiler.run((err, stats) => {
                let messages;
                if (err) {
                    if (!err.message) {
                        return reject(err);
                    }

                    let errMessage = err.message;

                    if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
                        errMessage +=
                            '\nCompileError: Begins at CSS selector ' +
                            err['postcssNode'].selector;
                    }

                    messages = formatWebpackMessages({
                        errors: [errMessage],
                        warnings: [],
                    });
                }
                else {
                    messages = formatWebpackMessages(
                        stats?.toJson({ all: false, warnings: true, errors: true })
                    );
                }
                if (messages.errors.length) {
                    return reject(messages.errors);
                }

                return resolve({ stats, warnings: messages.warnings });
            });
        });
    }
}