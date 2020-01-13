import { CLI } from '../cli';
import { Logger } from '../utils/logger.util';

export class ArgsResolver {
    private args: { name: string, value: any }[] = [];
    private logger: Logger = CLI.inject<Logger>('Logger');

    constructor(args: string[]) {
        this.resolveArgs(args);
    }
    
    private resolveArgs(args: string[]) {
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (arg.startsWith('--')) {
                arg = arg.substr(2);
                if (arg.split('=').length > 1) {
                    this.args.push({ name: arg.split('=')[0], value: arg.split('=').slice(1).join('') });
                }
                else
                    this.args.push({ name: arg, value: true });
            }
            else if (arg.startsWith('-')) {
                arg = arg.substr(1);
                if ((i + 1) < args.length) {
                    i++;
                    this.args.push({ name: arg, value: args[i] });
                }
                else
                    this.args.push({ name: arg, value: true });
            }
            else if (arg)
                this.args.push({ name: arg, value: true });
        }
    }

    public getValue(argName: string, defaultValue: boolean | string = '') {
        let arg = this.get(argName);
        return arg ? (arg.value || defaultValue) : defaultValue;
    }

    public has(argName: string) {
        return this.args.some(x => x.name === argName);
    }

    public get(argName: string) {
        return this.args.find(x => x.name === argName);
    }
}