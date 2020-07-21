import { inject, injectable } from 'inversify';
import inquirer = require('inquirer');
import { QuestionAnswer } from '../../../core/question-answer.model';
import { Logger } from '../../../utils/logger.util';
import { FileCreator } from '../../../core/file-creator/file-creator';
import { DIALOG_HTML, DIALOG_SCSS, DIALOG_TS } from './dialog-generate-template';
import { BaseGenerate } from '../base-generate';

@injectable()
export class DialogGenerate extends BaseGenerate {

    constructor(
        @inject('Logger') private logger: Logger
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

            await this.startCreateDialog();
        }
        else
            await this.execute();
    }

    public question(): Promise<QuestionAnswer> {
        return inquirer.prompt([{ 
            name: 'value',
            type: 'input',
            message: 'What is path and name? (ex.: dialogs/alert)',
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

    private async startCreateDialog() {
        let creator = new FileCreator();
        let { fileInstructions, lastDirectory } = this.getBaseFileInstructions();
        
        let fileDirInstruction = {
            name: this.fileName,
            children: [
                { name: `${this.fileName}.dialog.html`, content: this.replaceVariablesInContentFile(DIALOG_HTML) },
                { name: `${this.fileName}.dialog.scss`, content: this.replaceVariablesInContentFile(DIALOG_SCSS) },
                { name: `${this.fileName}.dialog.ts`, content: this.replaceVariablesInContentFile(DIALOG_TS) },
            ]
        };

        if (lastDirectory)
            lastDirectory.children.push(fileDirInstruction);
        else
            fileInstructions.push(fileDirInstruction);

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