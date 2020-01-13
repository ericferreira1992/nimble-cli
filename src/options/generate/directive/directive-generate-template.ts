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

    public resolve(selector: string, value: any, element: HTMLElement, scope: IScope): void {

    }

    public onDestroy(selector: string, scope: IScope) {
    }

}`;