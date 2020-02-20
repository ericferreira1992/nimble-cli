"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGE_HTML = "<div  class=\"[[Name]]-page\">\n    [[Name]] works!\n</div>";
exports.PAGE_SCSS = ".[[Name]]-page {\n}";
exports.PAGE_TS = "import { Page, PreparePage } from '@nimble-ts/core';\n\n@PreparePage({\n    template: require('./[[Name]].page.html'),\n    style: require('./[[Name]].page.scss'),\n    title: '[[FriendlyName]]'\n})\nexport class [[FriendlyName]]Page extends Page {\n\n    constructor() {\n        super();\n    }\n\n    onEnter() {\n    }\n\n    onExit() {\n    }\n}";
//# sourceMappingURL=page-generate-template.js.map