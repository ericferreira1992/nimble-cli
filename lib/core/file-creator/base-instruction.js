"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var BaseInstruction = /** @class */ (function () {
    function BaseInstruction(instruction) {
        Object.assign(this, instruction);
    }
    BaseInstruction.prototype.completePath = function () {
        var parents = this.getParents().reverse().map(function (x) { return x.name; });
        var path = parents.join('/') + '/' + this.name;
        path = path.replace(/\/\/\//g, '/').replace(/\/\//g, '/');
        return path;
    };
    BaseInstruction.prototype.getParents = function () {
        var parents = [];
        var parent = this.parent;
        while (!util_1.isNullOrUndefined(parent)) {
            parents.push(parent);
            parent = parent.parent;
        }
        return parents;
    };
    return BaseInstruction;
}());
exports.BaseInstruction = BaseInstruction;
//# sourceMappingURL=base-instruction.js.map