export const DIALOG_HTML = 
`<div  class="[[Name]]-dialog">
    <h3>[[FriendlyName]]</h3>
    [[Name]]-dialog works!
</div>`;

export const DIALOG_SCSS = 
`.[[Name]]-dialog {
}`;

export const DIALOG_TS = 
`import { Dialog, PrepareDialog, Inject, DIALOG_REF, DialogRef } from '@nimble-ts/core';

@PrepareDialog({
    template: require('./[[Name]].dialog.html'),
    style: require('./[[Name]].dialog.scss')
})
export class [[FriendlyName]]Dialog extends Dialog {

    constructor(
        @Inject(DIALOG_REF) public dialogRef: DialogRef<[[FriendlyName]]Dialog>
    ) {
        super();
    }

    onOpen() {
    }

    onClose() {
    }
}`;