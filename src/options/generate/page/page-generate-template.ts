export const PAGE_HTML = 
`<div  class="[[Name]]-page">
    [[Name]] works!
</div>`;

export const PAGE_SCSS = 
`.[[Name]]-page {
}`;

export const PAGE_TS = 
`import { Page, PreparePage } from '@nimble-ts/core';

@PreparePage({
    template: require('./[[Name]].page.html'),
    style: require('./[[Name]].page.scss'),
    title: '[[FriendlyName]]'
})
export class [[FriendlyName]]Page extends Page {

    constructor() {
        super();
    }

    onEnter() {
    }

    onExit() {
    }
}`;