import { inject, injectable } from 'inversify';
import inquirer = require('inquirer');
import { CLI } from '../../cli';
import { QuestionAnswer } from '../../core/question-answer.model';
import { Logger } from '../../utils/logger.util';
import { GenerateTypes } from './generate-types.enum';
import { PageGenerate } from './page/page-generate';
import { ServiceGenerate } from './service/service-generate';
import { DialogGenerate } from './dialog/dialog-generate';
import { DirectiveGenerate } from './directive/directive-generate';

@injectable()
export class Generate {
    constructor(
        @inject('Logger') private logger: Logger
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

        switch(answer.value) {
            case GenerateTypes.PAGE:
                await CLI.inject<PageGenerate>('PageGenerate');
                break;
            case GenerateTypes.DIALOG:
                await CLI.inject<DialogGenerate>('DialogGenerate');
                break;
            case GenerateTypes.DIRECTIVE:
                await CLI.inject<DirectiveGenerate>('DirectiveGenerate');
                break;
            case GenerateTypes.SERVICE:
                await CLI.inject<ServiceGenerate>('ServiceGenerate');
                break;
        }
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