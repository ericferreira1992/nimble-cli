"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var inversify_1 = require("inversify");
var Build = /** @class */ (function () {
    function Build(logger) {
        this.logger = logger;
        this.DEFAULT_ENV = 'prod';
    }
    Object.defineProperty(Build.prototype, "env", {
        get: function () { return this.args.getValue('env', this.DEFAULT_ENV); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Build.prototype, "isProdMode", {
        get: function () { return this.args.getValue('prod', true); },
        enumerable: true,
        configurable: true
    });
    Build.prototype.execute = function (args) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Build = tslib_1.__decorate([
        inversify_1.injectable(),
        tslib_1.__param(0, inversify_1.inject('Logger'))
    ], Build);
    return Build;
}());
exports.Build = Build;
//# sourceMappingURL=build.js.map