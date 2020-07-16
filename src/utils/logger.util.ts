import { red, green, cyan, yellow, bold } from 'kleur';
import * as figlet from 'figlet';
import * as semver from 'semver';

import { injectable } from 'inversify';
import { ConsoleMessage } from './console-message';
import { CLI } from '../cli';

@injectable()
export class Logger {
	private newLine = '\n';

	public breakLine() {
		console.log('');
	}

	public showVersion(): void {
		let inLocalProject = CLI.workingInLocalProject();
		console.log(cyan(figlet.textSync(ConsoleMessage.TITLE, { horizontalLayout: 'full' })));

		if (inLocalProject && CLI.hasGlobalInstalled()) {
			let version = CLI.version;
			let globalVersion = CLI.globalVersion;
			if (semver.gt(globalVersion, version)) {
				console.info(yellow(`⚠️ Your global Nimble CLI version (${globalVersion}) is greater than your local version (${version}). The local Nimble CLI version is used.`));
				console.info('');
			}
		}

		console.info('Versions:');
		console.info(` • ${bold('Nimble CLI')}\t -> ` + cyan(CLI.version) + yellow(` (Using ${inLocalProject ? 'local version of this project' : 'global'})`));
		console.info(` • ${bold('Node')}\t\t -> ` + cyan(process.versions.node));
		console.info(` • ${bold('OS')}\t\t -> ` + cyan(`${process.platform} ${process.arch}`));
		console.info('');
	}

	public showWarn(message: string | Error): void {
		console.warn(yellow(ConsoleMessage.WARN) + message);
	}

	public showError(message: string | Error): void {
		console.error(red(ConsoleMessage.ERROR) + message);
	}

	public showSuccess(message: string): void {
		console.log(green(ConsoleMessage.SUCCESS) + message + this.newLine);
	}

	public showInfo(message: string): void {
		console.info(cyan(ConsoleMessage.INFO) + message + this.newLine);
	}

	public showCreated(fileName: string): void {
		console.log(green(ConsoleMessage.CREATED) + `${fileName}`);
	}

	public showUpdate(fileName: string, filePath: string): void {
		filePath
			? console.log(green(ConsoleMessage.UPDATED) + `${fileName} in ${filePath}`)
			: console.log(green(ConsoleMessage.UPDATED) + `${fileName}`);
	}
}