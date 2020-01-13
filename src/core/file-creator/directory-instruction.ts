import { FileInstruction } from './file-instruction';
import { BaseInstruction } from './base-instruction';

export class DirectoryInstruction extends BaseInstruction{
    public children: Partial<(FileInstruction | DirectoryInstruction)>[] = [];

    constructor(instruction: Partial<DirectoryInstruction>) {
        super(instruction);
        Object.assign(this, instruction);
    }
}