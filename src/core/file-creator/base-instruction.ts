import { DirectoryInstruction } from './directory-instruction';
import { isNullOrUndefined } from 'util';

export class BaseInstruction {
    public name!: string;
    public parent?: DirectoryInstruction;

    constructor(instruction: Partial<BaseInstruction>) {
        Object.assign(this, instruction);
    }

    public completePath() {
        let parents = this.getParents().reverse().map(x => x.name);
        let path = parents.join('/') + '/' + this.name;
        path = path.replace(/\/\/\//g, '/').replace(/\/\//g, '/');
        return path;
    }

    private getParents(): DirectoryInstruction[] {
        let parents: DirectoryInstruction[] = [];
        let parent = this.parent;

        while(!isNullOrUndefined(parent)) {
            parents.push(parent);
            parent = parent.parent;
        }

        return parents;
    }
}