"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryInstruction = void 0;
var tslib_1 = require("tslib");
var base_instruction_1 = require("./base-instruction");
var DirectoryInstruction = /** @class */ (function (_super) {
    tslib_1.__extends(DirectoryInstruction, _super);
    function DirectoryInstruction(instruction) {
        var _this = _super.call(this, instruction) || this;
        _this.children = [];
        Object.assign(_this, instruction);
        return _this;
    }
    return DirectoryInstruction;
}(base_instruction_1.BaseInstruction));
exports.DirectoryInstruction = DirectoryInstruction;
//# sourceMappingURL=directory-instruction.js.map