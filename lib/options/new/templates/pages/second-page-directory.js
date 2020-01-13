"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECOND_HTML = "<div  class=\"second-page\">\n    <span>\uD83E\uDD2A</span><br>\n    Second page rendered!\n</div>";
exports.SECOND_SCSS = ".second-page {\n    padding: 15px;\n    text-align: center;\n\n    > span  {\n        font-size: 50px;\n    }\n}";
exports.SECOND_TS = "import { Page, PreparePage } from '@nimble-ts/core';\n\n@PreparePage({\n    template: require('./second.page.html'),\n    style: require('./second.page.scss'),\n    title: 'Nimble - First Page'\n})\nexport default class SecondPage extends Page {\n\n}";
//# sourceMappingURL=second-page-directory.js.map