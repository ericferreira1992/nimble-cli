"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIRST_HTML = "<div  class=\"first-page\">\n    <span>\uD83D\uDE0E</span><br>\n    <div>\n        Wellcome to <strong>Nimble framework</strong>\n    </div>\n    First page rendered!\n</div>";
exports.FIRST_SCSS = ".first-page {\n    padding: 15px;\n    text-align: center;\n\n    > span  {\n        font-size: 50px;\n    }\n}";
exports.FIRST_TS = "import { Page, PreparePage } from '@nimble-ts/core';\n\n@PreparePage({\n    template: require('./first.page.html'),\n    style: require('./first.page.scss'),\n    title: 'Nimble - First Page'\n})\nexport default class FirstPage extends Page {\n\n}";
//# sourceMappingURL=first-page-directory.js.map