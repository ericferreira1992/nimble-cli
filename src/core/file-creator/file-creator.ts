import fs from 'fs-extra';
import { FileInstruction } from './file-instruction';
import { DirectoryInstruction } from './directory-instruction';
import { BaseInstruction } from './base-instruction';

export class FileCreator {
    private filesInstruction: (FileInstruction | DirectoryInstruction)[] = [];

    private callbackOnCreateFile?: (reponse: { fileInstruction: FileInstruction | DirectoryInstruction, error?: any }) => void;

    public initialize(filesInstruction: Partial<(FileInstruction | DirectoryInstruction)>[]) {
        this.filesInstruction = this.prepareFilesInstructions(filesInstruction);
    }

    public async startCreateFiles(callback?: (reponse: { fileInstruction: FileInstruction | DirectoryInstruction, error?: Error }) => void) {
        this.callbackOnCreateFile = callback;
        if (this.filesInstruction.length > 0) {
            await this.createFilesInstruction(this.filesInstruction);
        }
    }

    private prepareFilesInstructions(filesInstruction: Partial<BaseInstruction>[], parent?: DirectoryInstruction) {
        return filesInstruction.map((x: Partial<BaseInstruction>) => {
            let instruction = ('content' in x || 'from' in x) ? new FileInstruction(x) : new DirectoryInstruction(x);
            instruction.parent = parent;
            
            if (instruction instanceof DirectoryInstruction)
                instruction.children = this.prepareFilesInstructions(instruction.children, instruction);

            return instruction;
        })
    }

    private async createFilesInstruction(files: BaseInstruction[]) {
        for (let file of files) {
            let worksPath = process.cwd(); 
            let filePath = worksPath + '/' + file.completePath();
            if (file instanceof DirectoryInstruction) {
                if (!worksPath.endsWith(file.completePath())) {
                    if (!fs.existsSync(filePath)) {
                        try {
                            await fs.mkdir(filePath);
                        }
                        catch(e) {
                            if (this.callbackOnCreateFile)
                                this.callbackOnCreateFile({ fileInstruction: file, error: e });
                        }
                    }
                }
                if (file.children && file.children.length > 0)
                    await this.createFilesInstruction(file.children as BaseInstruction[]);
            }
            else if (file instanceof FileInstruction){
                try {
                    if (file.content)
                        await fs.writeFile(filePath, file.content);
                    else if (file.from)
                        fs.copyFile(file.from!, filePath)

                    if (this.callbackOnCreateFile)
                        this.callbackOnCreateFile({ fileInstruction: file });
                }
                catch(e) {
                    if (this.callbackOnCreateFile)
                        this.callbackOnCreateFile({ fileInstruction: file, error: e });
                }
            }

        }
    }
}