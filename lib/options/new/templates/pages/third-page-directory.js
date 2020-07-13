"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THIRD_HTML = "<div  class=\"third-page\">\n    <span>\u270C\uD83C\uDFFC</span><br>\n    Third page rendered!\n</div>";
exports.THIRD_SCSS = ".third-page {\n    padding: 15px;\n    text-align: center;\n\n    > span  {\n        font-size: 50px;\n    }\n}";
exports.THIRD_TS = "import { Page, PreparePage } from '@nimble-ts/core';\n\n@PreparePage({\n    template: require('./third.page.html'),\n    style: require('./third.page.scss'),\n    title: 'Nimble - Third Page'\n})\nexport class ThirdPage extends Page {\n\n\tconstructor() {\n\t\tsuper();\n\t}\n\n\tonInit() {\n\t}\n}";
//# sourceMappingURL=third-page-directory.js.map