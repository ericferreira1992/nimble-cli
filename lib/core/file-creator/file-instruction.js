"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileInstruction = void 0;
var tslib_1 = require("tslib");
var base_instruction_1 = require("./base-instruction");
var FileInstruction = /** @class */ (function (_super) {
    tslib_1.__extends(FileInstruction, _super);
    function FileInstruction(instruction) {
        var _this = _super.call(this, instruction) || this;
        Object.assign(_this, instruction);
        return _this;
    }
    return FileInstruction;
}(base_instruction_1.BaseInstruction));
exports.FileInstruction = FileInstruction;
//# sourceMappingURL=file-instruction.js.map