const spawn = require('cross-spawn');
import inquirer = require('inquirer');
import * as cp from 'child_process';
import { inject, injectable } from 'inversify';
import { QuestionAnswer } from '../../core/question-answer.model';
import { Logger } from '../../utils/logger.util';
import { FileCreator } from '../../core/file-creator/file-creator';

import { INDEX_HTML } from './templates/public-directory';
import { NIMBLE_JSON, GITIGNORE, PACKAGE_JSON, README, TSCONFIG } from './templates/project-directory';
import { CLI } from '../../cli';
import { STYLE_SCSS, MAIN_TS } from './templates/src-directory';
import { RESET_SCSS, VARIABLES_SCSS } from './templates/scss-directory';
import { DEV_ENV, LOCAL_ENV, PROD_ENV } from './templates/environments-directory';
import { ROUTES_TS } from './templates/app-directory';
import { ROOT_HTML, ROOT_SCSS, ROOT_TS } from './templates/pages/root-page-directory';
import { FIRST_HTML, FIRST_SCSS, FIRST_TS } from './templates/pages/first-page-directory';
import { SECOND_HTML, SECOND_SCSS, SECOND_TS } from './templates/pages/second-page-directory';
import { THIRD_HTML, THIRD_SCSS, THIRD_TS } from './templates/pages/third-page-directory';
import { Readable } from 'stream';

@injectable()
export class New {
    private projectName!: string;

    private get projectFriendlyName() {
        let name = this.projectName;

        if (name.includes('-'))
            name = name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

        if (name.includes('_'))
            name = name.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

        name = name[0].toUpperCase() + name.substr(1);
        
        return name;
    }

    constructor(
        @inject('Logger') private logger: Logger
    ) {
        if (CLI.isNimbleProject()) {
            this.logger.showWarn('⚠️ Looks like you\'re already on a Nimble project.');
            process.exit(0);
        }

        this.execute();
    }

    private async execute() {
        let answer: QuestionAnswer = await this.question();

        let projectName = answer.value.trim().toLowerCase();

        if (this.isValid(projectName)) {
            this.projectName = projectName;
            this.startCreateProject();
        }
        else
            this.execute();
    }

    private question(): Promise<QuestionAnswer> {
        return inquirer.prompt([{ 
            name: 'value',
            type: 'input',
            message: 'What is name of the your project? (ex.: my-project)',
        }]);
    };

    private isValid(projectName: string): boolean {
        if(projectName === '') {
            this.logger.showError('The name cannot be empty.');
            return false;
        }
        if(projectName.includes(' ')) {
            this.logger.showError('The name cannot constains whitespace.');
            return false;
        }
        if(/[!$%^&*()+|~=`{}\[\]:";'<>?,.\/]/.test(projectName)) {
            this.logger.showError('The name cannot have the following symbols: !$%^&*()+|~=`{}\[\]:";\'<>?,.\/');
            return false;
        }

        return true;
    }

    private async startCreateProject() {
        let creator = new FileCreator();
        creator.initialize([
            {
                name: this.projectName,
                children: [
                    {
                        name: 'public',
                        children: [
                            { name: 'index.html', content: this.replaceVariablesInContentFile(INDEX_HTML) },
                            { name: 'favicon.ico', from: __dirname + '/templates/files/favicon.ico' },
                            {
                                name: 'assets',
                                children: [
									{ name: 'css' },
									{ name: 'fonts' },
									{
										name: 'img',
										children: [
											{ name: 'logo_white.png', from: __dirname + '/templates/files/logo_white.png'  }
										]
									},
									{ name: 'js' }
								]
                            },
                        ]
                    },
                    {
                        name: 'src',
                        children: [
                            {
                                name: 'app',
                                children: [
                                    { name: 'routes.ts', content: this.replaceVariablesInContentFile(ROUTES_TS) },
                                    {
                                        name: 'pages',
                                        children: [
                                            {
                                                name: 'root',
                                                children: [
                                                    { name: 'root.page.html', content: this.replaceVariablesInContentFile(ROOT_HTML) },
                                                    { name: 'root.page.scss', content: this.replaceVariablesInContentFile(ROOT_SCSS) },
                                                    { name: 'root.page.ts', content: this.replaceVariablesInContentFile(ROOT_TS) },
                                                ]
                                            },
                                            {
                                                name: 'first',
                                                children: [
                                                    { name: 'first.page.html', content: this.replaceVariablesInContentFile(FIRST_HTML) },
                                                    { name: 'first.page.scss', content: this.replaceVariablesInContentFile(FIRST_SCSS) },
                                                    { name: 'first.page.ts', content: this.replaceVariablesInContentFile(FIRST_TS) },
                                                ]
                                            },
                                            {
                                                name: 'second',
                                                children: [
                                                    { name: 'second.page.html', content: this.replaceVariablesInContentFile(SECOND_HTML) },
                                                    { name: 'second.page.scss', content: this.replaceVariablesInContentFile(SECOND_SCSS) },
                                                    { name: 'second.page.ts', content: this.replaceVariablesInContentFile(SECOND_TS) },
                                                ]
                                            },
                                            {
                                                name: 'third',
                                                children: [
                                                    { name: 'third.page.html', content: this.replaceVariablesInContentFile(THIRD_HTML) },
                                                    { name: 'third.page.scss', content: this.replaceVariablesInContentFile(THIRD_SCSS) },
                                                    { name: 'third.page.ts', content: this.replaceVariablesInContentFile(THIRD_TS) },
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                name: 'scss',
                                children: [
                                    { name: 'reset.scss', content: this.replaceVariablesInContentFile(RESET_SCSS) },
                                    { name: 'variables.scss', content: this.replaceVariablesInContentFile(VARIABLES_SCSS) },
                                ]
                            },
                            {
                                name: 'environments',
                                children: [
                                    { name: 'env.local.js', content: this.replaceVariablesInContentFile(LOCAL_ENV) },
                                    { name: 'env.dev.js', content: this.replaceVariablesInContentFile(DEV_ENV) },
                                    { name: 'env.prod.js', content: this.replaceVariablesInContentFile(PROD_ENV) },
                                ]
                            },
                            { name: 'style.scss', content: this.replaceVariablesInContentFile(STYLE_SCSS) },
                            { name: 'main.ts', content: this.replaceVariablesInContentFile(MAIN_TS) },
                        ]
                    },
                    { name: '.gitignore', content: this.replaceVariablesInContentFile(GITIGNORE) },
                    { name: 'nimble.json', content: this.replaceVariablesInContentFile(NIMBLE_JSON) },
                    { name: 'package.json', content: this.replaceVariablesInContentFile(PACKAGE_JSON) },
                    { name: 'README.md', content: this.replaceVariablesInContentFile(README) },
                    { name: 'tsconfig.json', content: this.replaceVariablesInContentFile(TSCONFIG) }
                ]
            }
        ]);
        await creator.startCreateFiles((response) => {
            if (!response.error) {
                this.logger.showCreated(response.fileInstruction.completePath());
            }
            else {
                this.logger.showError(response.error);
            }
        });

        this.logger.breakLine();
        this.logger.showInfo('Installing dependencies...');
        this.logger.showInfo('(This may take a few minutes)');

        let errorsMsg: string[] = [];
        let childProcess = cp.exec(`npm install --no-optional --colors`, { cwd: this.projectName });

        (childProcess.stdout as Readable).on('data', (data) => {
            console.log(data);
        });
        (childProcess.stderr as Readable).on('data', (data) => {
            console.log(data);
            if (data) errorsMsg.push(data.toString());
        });

        childProcess.addListener('close', (code) => {
            if (!code)
                this.logger.showSuccess('Finished! Your project has been created!');
            else if (errorsMsg.some(x => x.includes('permission')))
                this.logger.showSuccess('Finished! Your project has been created, but we had some permissions problems, see above. Maybe you need run "npm run initialize" inside project folder with administrator privileges.');
            else
                this.logger.showSuccess('Finished! Your project has been created, but we had some problems, see above.');
        });
    }

    private replaceVariablesInContentFile(content: string) {
        let regex = /\[\[(.|\n)*?\]\]/g;
        if (regex.test(content)) {
            content = content.replace(regex, (name) => {
                name = name.replace(/(^\[\[)|(\]\]$)/g, '');
                if (name !== '')
                    return this.getValueByName(name);

                return '';
            });
        }

        return content;
    }

    private getValueByName(name: string){
        switch(name) {
            case 'ProjectName':
                return this.projectName;
            case 'ProjectFriendlyName':
                return this.projectFriendlyName;
            case 'Version':
                return CLI.version;
            case 'NimbleVersion':
                return CLI.nimbleVersion;
        }
        return '';
    }
}