export const DIRECTIVE_TS = 
`import { Directive, PrepareDirective } from '@nimble-ts/core/page';
import { ElementListener } from '@nimble-ts/core/render';

@PrepareDirective({
    selector: ['[[Name]]']
})
export class [[FriendlyName]]Directive extends Directive {

    constructor(
        private listener: ElementListener
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