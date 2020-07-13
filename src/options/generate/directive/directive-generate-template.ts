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

    public onResolve(selector: string, value: any): void {
        // Implement here
    }

    public onDestroy() {
		// If needed, implement here
    }

}`;