import webpack from 'webpack';
import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import { inject, injectable } from 'inversify';
import { Logger } from '../../utils/logger.util';
import { ArgsResolver } from '../../core/args-resolver';
import { webpackConfig } from '../config/webpack.config';
import { PATHS } from '../../core/dev-utils/paths';
import { webpackDevServerUtils } from '../../core/dev-utils/webpack-dev-server-utils';
import { FileSizeReporter } from '../../core/dev-utils/file-size-reporter';

@injectable()
export class Build {
    private args!: ArgsResolver;

    private DEFAULT_ENV = 'prod';

    private get env() { return this.args.getValue('env', this.DEFAULT_ENV) as string; }
    private get isProdMode() { return this.args.getValue('prod', true); }

    constructor(
        @inject('Logger') private logger: Logger
    ) {
    }

    public async execute(args: string[]) {
        /* this.args = new ArgsResolver(args);

        const config = webpackConfig(this.env, this.isProdMode);

        FileSizeReporter.measureFileSizesBeforeBuild(PATHS.appBuild).then(previousFileSizes => {
            // Remove all content but keep the directory so that
            // if you're in it, you don't end up in Trash
            fs.emptyDirSync(PATHS.appBuild);
            // Merge with the public folder
            copyPublicFolder();
            // Start the webpack build
            return build(previousFileSizes);
        })
        .then(
            ({ stats, previousFileSizes, warnings }) => {
                if (warnings.length) {
                    console.log(chalk.yellow('Compiled with warnings.\n'));
                    console.log(warnings.join('\n\n'));
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
                } else {
                    console.log(chalk.green('Compiled successfully.\n'));
                }

                console.log('File sizes after gzip:\n');
                printFileSizesAfterBuild(
                    stats,
                    previousFileSizes,
                    PATHS.appBuild,
                    WARN_AFTER_BUNDLE_GZIP_SIZE,
                    WARN_AFTER_CHUNK_GZIP_SIZE
                );
                console.log();

                const appPackage = require(PATHS.appPackageJson);
                const publicUrl = PATHS.publicUrl;
                const publicPath = config.output.publicPath;
                const buildFolder = path.relative(process.cwd(), PATHS.appBuild);
                printHostingInstructions(
                    appPackage,
                    publicUrl,
                    publicPath,
                    buildFolder
                );
            },
            (err) => {
                const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
                if (tscCompileOnError) {
                    console.log(
                        chalk.yellow(
                            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
                        )
                    );
                    printBuildError(err);
                } else {
                    console.log(chalk.red('Failed to compile.\n'));
                    printBuildError(err);
                    process.exit(1);
                }
            }
        )
        .catch(err => {
            if (err && err.message) {
                console.log(err.message);
            }
            process.exit(1);
        }); */
    }
}