export const DIRECTIVE_TS = 
`import { Directive, PrepareDirective } from '@nimble-ts/core/page';
import { ElementListener } from '@nimble-ts/core/render';

@PrepareDirective({
    selector: ['[[Name]]'],
    inputs: [],
    outputs: []
})
export class [[FriendlyName]]Directive extends Directive {

    constructor(
        private listener: ElementListener
    ){
        super();
    }

    public onRender(): void {
        // Implement here first render
    }

    public onChange(): void {
        // Implement here when re-renders
    }

    public onDestroy() {
		// If needed, implement here
    }

}`;