import inquirer = require('inquirer');
import * as cp from 'child_process';
import { injectable, inject } from 'inversify';
import { Logger } from './utils/logger.util';
import { InitialValue } from './initial-value.enum';
import { QuestionAnswer } from './core/question-answer.model';
import { CLI } from './cli';
import { New } from './options/new/new';
import { Generate } from './options/generate/generate';
import { Readable } from 'stream';
import { Serve } from './commands/serve/serve';

@injectable()
export class NB {

    public initialArgs: string[] = [];
    public args: string[] = [];

    constructor(
        @inject('Logger') private logger: Logger
    )
    {
    }

    public setArgurments(args: string[]) {
        this.args = args;
        this.initialArgs = args;
    }

    public start() {
        if(this.hasArgs())
            this.processArgs();
        else
            this.execute();
    }

    private hasArgs() {
        return this.args.length > 0;
    }

    private processArgs() {
        let arg = this.args[0];
        this.args = this.args.slice(1);
        if (arg === '--version' || arg === '-v')
            return this.logger.showVersion();
        if (arg === 'serve' || arg === 's')
            return CLI.inject<Serve>('Serve').execute(this.args);
            // return this.runServe();
        if (arg === 'build' || arg === 'b')
            return this.runBuild();
    }

    private async execute() {
        let answer: QuestionAnswer = await inquirer.prompt([{ 
            name: 'value',
            type: 'list',
            message: 'Select what do you want:',
            choices: [
                {name: 'Generate', value: InitialValue.GENERATE},
                {name: 'Create a project', value: InitialValue.NEW},
            ]
        }]);

        switch(answer.value) {
            case InitialValue.NEW:
                CLI.inject<New>('New');
                break;
            case InitialValue.GENERATE:
                CLI.inject<Generate>('Generate');
                break;
        }
    }

    private async runServe() {
        let nexts = this.args.slice(1);
        let env = this.getArgValueIfExists(nexts, '--env');
        let childProcess = cp.exec(`webpack-dev-server --env=${env ? env : 'local'} --devtool source-map --colors`);
        (childProcess.stdout as Readable).on('data', (data) => {
            console.log(data);
        });
        (childProcess.stderr as Readable).on('data', (data) => {
            console.log(data);
        });
    }

    private async runBuild() {
        let nexts = this.args.slice(1);
        let env = this.getArgValueIfExists(nexts, '--env');
        let childProcess = cp.exec(`webpack --env=${env ? env : 'prod'} --colors`);
        (childProcess.stdout as Readable).on('data', (data) => {
            console.log(data);
        });
        (childProcess.stderr as Readable).on('data', (data) => {
            console.log(data);
        });
    }

    private getArgValueIfExists(args: string[], name: string): string | boolean {
        for(let arg of args) {
            arg = arg.trim();
            let value = arg;
            if (arg.includes('=')) {
                let splitted = arg.split('=');
                value = splitted[splitted.length - 1];
                arg = splitted[0];
            }
            
            if (arg === name)
                return value === arg ? true : value;
        }
        return false;
    }
}