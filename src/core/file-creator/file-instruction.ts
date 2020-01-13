import { BaseInstruction } from './base-instruction';

export class FileInstruction extends BaseInstruction{
    public content?: string;
    public from?: string;

    constructor(instruction: Partial<FileInstruction>) {
        super(instruction);
        Object.assign(this, instruction);
    }
}