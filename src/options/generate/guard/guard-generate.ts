import { inject, injectable } from 'inversify';
import inquirer from 'inquirer';
import { QuestionAnswer } from '../../../core/question-answer.model';
import { Logger } from '../../../utils/logger.util';
import { FileCreator } from '../../../core/file-creator/file-creator';
import { GUARD_TS } from './guard-generate-template';
import { BaseGenerate } from '../base-generate';

@injectable()
export class GuardGenerate extends BaseGenerate {

    constructor(
        @inject('Logger')  private logger: Logger
    ) {
        super();
    }

    public async execute() {
        let answer: QuestionAnswer = await this.question();
        let name = answer.value.trim().toLowerCase();

        if (this.isValid(name)) {
            this.name = name;

            if (this.name.startsWith('/'))
                this.name = this.name.substr(1);
            if (this.name.endsWith('/'))
                this.name = this.name.substr(0, this.name.length - 1);

            await this.startCreateSerivce();
        }
        else
            await this.execute();
    }

    public question(): Promise<QuestionAnswer> {
        return inquirer.prompt([{ 
            name: 'value',
            type: 'input',
            message: 'What is path and name? (ex.: route-guards/auth)',
        }]);
    };

    public isValid(name: string): boolean {
        if(name === '') {
            this.logger.showError('Cannot be empty.');
            return false;
        }
        if(name.includes(' ')) {
            this.logger.showError('Cannot contains whitespace.');
            return false;
        }
        if(/[!$%^&*()+|~=`{}\[\]:";'<>?,.]/.test(name)) {
            this.logger.showError('Cannot have the following symbols: !$%^&*()+|~=`{}\[\]:";\'<>?,.');
            return false;
        }

        return true;
    }

    private async startCreateSerivce() {
        let creator = new FileCreator();
        let { fileInstructions, lastDirectory } = this.getBaseFileInstructions();

        if (lastDirectory)
            lastDirectory.children.push({
                name: `${this.fileName}.guard.ts`,
                content: this.replaceVariablesInContentFile(GUARD_TS)
            });
        else
            fileInstructions.push({
                name: this.fileName,
                content: this.replaceVariablesInContentFile(GUARD_TS)
            });

        creator.initialize(fileInstructions);

        await creator.startCreateFiles((response) => {
            if (!response.error) {
                this.logger.showCreated(response.fileInstruction.completePath());
            }
            else {
                this.logger.showError(response.error);
            }
        });
    }

    public getValueByName(name: string){
        switch(name) {
            case 'Name':
                return this.fileName;
            case 'FriendlyName':
                return this.fileFriendlyName;
        }
        return '';
    }
}