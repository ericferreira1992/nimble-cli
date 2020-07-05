export const DIRECTIVE_TS = 
`import { Directive, PrepareDirective, IScope, Listener } from '@nimble-ts/core';

@PrepareDirective({
    selector: ['[[Name]]']
})
export class [[FriendlyName]]Directive extends Directive {

    constructor(
        private listener: Listener
    ){
        super();
    }

    public resolve(selector: string, value: any): void {
        // Implement here
    }

    public onDestroy(selector: string) {
		// If needed, implement here
    }

}`;