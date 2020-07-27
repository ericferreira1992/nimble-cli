import inquirer = require('inquirer');
import fs from 'fs-extra';
import { injectable, inject } from 'inversify';
import { Logger } from './utils/logger.util';
import { InitialValue } from './initial-value.enum';
import { QuestionAnswer } from './core/question-answer.model';
import { CLI } from './cli';
import { New } from './options/new/new';
import { Generate } from './options/generate/generate';
import { Serve } from './commands/serve/serve';
import { Build } from './commands/build/build';

@injectable()
export class NB {

    public initialArgs: string[] = [];
    public args: string[] = [];
    private inNimbleProject: boolean = false;

    constructor(
        @inject('Logger') private logger: Logger
    )
    {
        this.inNimbleProject = CLI.isNimbleProject();
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
        if (arg === 'serve' || arg === 'server' || arg === 's')
            return CLI.inject<Serve>('Serve').execute(this.args);
        if (arg === 'build' || arg === 'b')
            return CLI.inject<Build>('Build').execute(this.args);
        if (arg === 'new') {
            return CLI.inject<New>('New');
        }
    }

    private async execute() {
        if (this.inNimbleProject) {
            let answer: QuestionAnswer = await inquirer.prompt([{ 
                name: 'value',
                type: 'list',
                message: 'Select what do you want:',
                choices: [
                    {name: 'Generate', value: InitialValue.GENERATE},
                    {name: 'Run server', value: InitialValue.SERVER},
                    {name: 'Run build', value: InitialValue.BUILD},
                    {name: 'Exit', value: ''},
                ]
            }]);
    
            switch(answer.value) {
                case InitialValue.SERVER:
                    CLI.inject<Serve>('Serve').execute();
                    break;
                case InitialValue.BUILD:
					let enviroments = this.getAllExistingsEnviroments();

					if (enviroments.length > 0) {
						let answer: QuestionAnswer = await inquirer.prompt([{ 
							name: 'value',
							type: 'list',
							message: 'Select the environment to be used:',
							choices: enviroments.map(env => ({
								name: env, value: env
							}))
						}]);
	
						CLI.inject<Build>('Build').execute([`--env=${answer.value}`]);
					}
					else {
						CLI.inject<Build>('Build').execute();
					}
                    break;
                case InitialValue.GENERATE:
                    CLI.inject<Generate>('Generate');
                    break;
            }
        }
        else {
            let answer: QuestionAnswer = await inquirer.prompt([{ 
                name: 'value',
                type: 'confirm',
                message: 'Do you want create new Nimble project?',
            }]);

            if (answer.value) {
                CLI.inject<New>('New');
            }
        }
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
	
	private getAllExistingsEnviroments() {
		let envs: string[] = [];
		if (fs.pathExistsSync(`${process.cwd()}/src/environments`)) {
			fs.readdirSync(`${process.cwd()}/src/environments`).forEach(file => {
				if (/^(env\.).*[a-zA-Z0-9](\.js)$/g.test(file)) {
					envs.push(file.replace(/^(env\.)|(\.js)$/g, ''));
				}
			});
		}
		return envs;
	}
}