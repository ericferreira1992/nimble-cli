"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STYLE_SCSS = exports.MAIN_TS = void 0;
exports.MAIN_TS = "import { NimbleApp } from '@nimble-ts/core';\nimport { ROUTES } from './app/routes';\n\nNimbleApp.config({\n    routes: ROUTES,\n    directives: [],\n    providers: []\n}).start();";
exports.STYLE_SCSS = "@import '~@nimble-ts/core/style.scss';\n@include nimble-core();\n\n@import 'scss/reset';\n";
//# sourceMappingURL=src-directory.js.map