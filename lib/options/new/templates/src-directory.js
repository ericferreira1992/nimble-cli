"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NIMBLE_JSON = "{\n    \"pre-render\": {\n        \"enabled\": true,\n        \"routes\": [\n        ]\n    },\n    \"vendors\": {\n        \"js\": [],\n        \"css\": [\n            \"src/style.scss\"\n        ]\n    }\n}";
exports.MAIN_TS = "import { NimbleApp } from '@nimble-ts/core';\nimport { ROUTES } from './app/routes';\n\nNimbleApp.config({\n    routes: ROUTES,\n    directives: [],\n    providers: []\n}).start();";
exports.STYLE_SCSS = "@import '~@nimble-ts/core/style.scss';\n@include nimble-core();\n\n@import 'scss/reset';\n";
//# sourceMappingURL=src-directory.js.map