import { QuestionAnswer } from '../../core/question-answer.model';
import { CLI } from '../../cli';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseGenerate {
    protected name!: string;
    protected get fileName() {
        if (this.name.includes('/')) {
            let splitted = this.name.split('/');
            return splitted[splitted.length - 1];
        }
        return this.name;
    }
    protected get fileFriendlyName() {
        let name = this.fileName;

        if (name.includes('-'))
            name = name.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');

        if (name.includes('_'))
            name = name.split('_').map((part) =>  + part.slice(1)).join('');

        name = name[0].toUpperCase() + name.substr(1);
        
        return name;
    }
    protected get directories() {
        if (this.name.includes('/')) {
            let splitted = this.name.split('/');
            return splitted.slice(0, splitted.length - 1);
        }
        return [];
    }

    constructor() {
        this.execute();
    }

    protected getBaseFileInstructions() {
        let fileInstructions = [
        ] as any[];

        let lastDirectory = null as any;

        if (CLI.worksPathIsRootProject()) {
            fileInstructions.push({
                name: 'src',
                children: [
                    {
                        name: 'app',
                        children: [] as any[]
                    }
                ]
            });
            lastDirectory = fileInstructions[0].children[0];
        }
        else if (CLI.worksPathIsSourceDir()) {
            fileInstructions.push({ name: 'app', children: [] as any[] });
            lastDirectory = fileInstructions[0];
        }

        for(let dirName of this.directories) {
            let dir = { name: dirName, children: [] };

            if (lastDirectory)
                lastDirectory.children.push(dir);
            else
                fileInstructions.push(dir);

            lastDirectory = dir;
        }

        return { fileInstructions, lastDirectory };
    }

    protected replaceVariablesInContentFile(content: string) {
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

    abstract async execute(): Promise<void>;
    abstract question(): Promise<QuestionAnswer>;
    abstract isValid(fileName: string): boolean;
    abstract getValueByName(fname: string): string;
}