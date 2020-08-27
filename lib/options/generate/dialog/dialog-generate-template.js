"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIALOG_TS = exports.DIALOG_SCSS = exports.DIALOG_HTML = void 0;
exports.DIALOG_HTML = "<div  class=\"[[Name]]-dialog\">\n    <h3>[[FriendlyName]]</h3>\n    [[Name]]-dialog works!\n</div>";
exports.DIALOG_SCSS = ".[[Name]]-dialog {\n}";
exports.DIALOG_TS = "import { Dialog, PrepareDialog, DIALOG_REF, DialogRef } from '@nimble-ts/core/dialog';\nimport { Inject } from '@nimble-ts/core/inject';\n\n@PrepareDialog({\n    template: require('./[[Name]].dialog.html'),\n    style: require('./[[Name]].dialog.scss')\n})\nexport class [[FriendlyName]]Dialog extends Dialog {\n\n    constructor(\n        @Inject(DIALOG_REF) public dialogRef: DialogRef<[[FriendlyName]]Dialog>\n    ) {\n        super();\n    }\n\n    onOpen() {\n    }\n\n    onClose() {\n    }\n}";
//# sourceMappingURL=dialog-generate-template.js.map