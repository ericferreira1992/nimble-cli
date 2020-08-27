"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUARD_TS = void 0;
exports.GUARD_TS = "import { RouteGuard, Route } from '@nimble-ts/core/route';\nimport { Injectable } from '@nimble-ts/core/inject';\n\n@Injectable()\nexport class [[FriendlyName]]Guard extends RouteGuard {\n\n    constructor(){\n        super();\n    }\n\n    public doActivate(currentPath: string, nextPath: string, route: Route): boolean {\n\t\t// Code your restrict logic\n        return true;\n    }\n}";
//# sourceMappingURL=guard-generate-template.js.map