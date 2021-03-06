"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES_TS = void 0;
exports.ROUTES_TS = "import { RouteBase } from '@nimble-ts/core/route';\n\nexport const ROUTES: RouteBase[] = [\n\t{\n\t\tpath: '',\n\t\tpage: () => import('./pages/root/root.page').then(x => x.RootPage),\n\t\tchildren: [\n\t\t\t{\n\t\t\t\tpath: '',\n\t\t\t\tpage: () => import('./pages/first/first.page').then(x => x.FirstPage)\n\t\t\t},\n\t\t\t{\n\t\t\t\tpath: 'second',\n\t\t\t\tpage: () => import('./pages/second/second.page').then(x => x.SecondPage)\n\t\t\t},\n\t\t\t{\n\t\t\t\tpath: 'third',\n\t\t\t\tpage: () => import('./pages/third/third.page').then(x => x.ThirdPage)\n\t\t\t}   \n\t\t]\n\t}\n];";
//# sourceMappingURL=app-directory.js.map