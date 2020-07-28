"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROD_ENV = exports.DEV_ENV = exports.LOCAL_ENV = void 0;
exports.LOCAL_ENV = "module.exports = {\n    production: false,\n    baseUrl: 'https://your-localhost-url.com.br'\n};";
exports.DEV_ENV = "module.exports = {\n    production: false,\n    baseUrl: 'https://your-dev-url.com.br'\n};;";
exports.PROD_ENV = "module.exports = {\n    production: true,\n    baseUrl: 'https://your-prod-url.com.br'\n};";
//# sourceMappingURL=environments-directory.js.map