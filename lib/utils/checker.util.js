"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var inversify_1 = require("inversify");
var Checker = /** @class */ (function () {
    function Checker(logger) {
        this.logger = logger;
    }
    Checker.prototype.checkName = function (name) {
        if (name === true) {
            this.logger.showError('Invalid command: No name found after the command');
            process.exit(1);
        }
    };
    ;
    Checker.prototype.checkExistence = function (path) {
        return fs_1.default.existsSync(process.cwd() + path);
    };
    ;
    Checker.prototype.checkIfDirExistElseMakeDir = function (path) {
        var dir = this.checkExistence(path);
        if (!dir) {
            fs_1.default.mkdirSync(process.cwd() + path, { recursive: true });
        }
    };
    Checker = tslib_1.__decorate([
        inversify_1.injectable(),
        tslib_1.__param(0, inversify_1.inject('Logger'))
    ], Checker);
    return Checker;
}());
exports.Checker = Checker;
//# sourceMappingURL=checker.util.js.map