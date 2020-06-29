import { red, green, cyan, yellow } from 'kleur';
import * as figlet from 'figlet';

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
        console.log(cyan(figlet.textSync(ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
        console.info(ConsoleMessage.ABOUT);
        console.info('Version: ' + cyan(CLI.version));
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