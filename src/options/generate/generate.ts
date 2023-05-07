import inquirer from 'inquirer';
import { inject, injectable } from 'inversify';
import { CLI } from '../../cli';
import { QuestionAnswer } from '../../core/question-answer.model';
import { Logger } from '../../utils/logger.util';
import { BaseGenerate } from './base-generate';
import { DialogGenerate } from './dialog/dialog-generate';
import { DirectiveGenerate } from './directive/directive-generate';
import { GenerateTypes } from './generate-types.enum';
import { GuardGenerate } from './guard/guard-generate';
import { PageGenerate } from './page/page-generate';
import { ServiceGenerate } from './service/service-generate';

@injectable()
export class Generate {
    constructor(
        @inject('Logger')  private logger: Logger
    ) {
        if (CLI.isNimbleProject())
            this.execute();
        else {
            this.logger.showError('To continue you must be in a Nimble project.');
            process.exit(0);
        }
    }

    private async execute() {
		let answer: QuestionAnswer = await this.question();
		let generate: undefined | BaseGenerate;

        switch(answer.value) {
            case GenerateTypes.PAGE:
                generate = CLI.inject<PageGenerate>('PageGenerate');
                break;
            case GenerateTypes.DIALOG:
                generate = CLI.inject<DialogGenerate>('DialogGenerate');
                break;
            case GenerateTypes.DIRECTIVE:
                generate = CLI.inject<DirectiveGenerate>('DirectiveGenerate');
                break;
            case GenerateTypes.SERVICE:
                generate = CLI.inject<ServiceGenerate>('ServiceGenerate');
                break;
            case GenerateTypes.GUARD:
                generate = CLI.inject<GuardGenerate>('GuardGenerate');
                break;
		}
		
		await generate?.execute();
    }

    private question(): Promise<QuestionAnswer> {
        return inquirer.prompt([{ 
            name: 'value',
            type: 'list',
            message: 'Which what do you want to generate?',
            choices: Object.keys(GenerateTypes).map((key, index) => ({
                name: (GenerateTypes as any)[key],
                value: (GenerateTypes as any)[key],
            }))
        }]);
    };
}