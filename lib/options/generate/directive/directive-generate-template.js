"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIRECTIVE_TS = void 0;
exports.DIRECTIVE_TS = "import { Directive, PrepareDirective } from '@nimble-ts/core/page';\nimport { ElementListener } from '@nimble-ts/core/render';\n\n@PrepareDirective({\n    selector: ['[[Name]]'],\n    inputs: [],\n    outputs: []\n})\nexport class [[FriendlyName]]Directive extends Directive {\n\n    constructor(\n        private listener: ElementListener\n    ){\n        super();\n    }\n\n    public onRender(): void {\n        // Implement here first render\n    }\n\n    public onChange(): void {\n        // Implement here when re-renders\n    }\n\n    public onDestroy() {\n\t\t// If needed, implement here\n    }\n\n}";
//# sourceMappingURL=directive-generate-template.js.map