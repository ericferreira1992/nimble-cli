"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var file_instruction_1 = require("./file-instruction");
var directory_instruction_1 = require("./directory-instruction");
var FileCreator = /** @class */ (function () {
    function FileCreator() {
        this.filesInstruction = [];
    }
    FileCreator.prototype.initialize = function (filesInstruction) {
        this.filesInstruction = this.prepareFilesInstructions(filesInstruction);
    };
    FileCreator.prototype.startCreateFiles = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.callbackOnCreateFile = callback;
                        if (!(this.filesInstruction.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createFilesInstruction(this.filesInstruction)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    FileCreator.prototype.prepareFilesInstructions = function (filesInstruction, parent) {
        var _this = this;
        return filesInstruction.map(function (x) {
            var instruction = ('content' in x || 'from' in x) ? new file_instruction_1.FileInstruction(x) : new directory_instruction_1.DirectoryInstruction(x);
            instruction.parent = parent;
            if (instruction instanceof directory_instruction_1.DirectoryInstruction)
                instruction.children = _this.prepareFilesInstructions(instruction.children, instruction);
            return instruction;
        });
    };
    FileCreator.prototype.createFilesInstruction = function (files) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _i, files_1, file, worksPath, filePath, e_1, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 15];
                        file = files_1[_i];
                        worksPath = process.cwd();
                        filePath = worksPath + '/' + file.completePath();
                        if (!(file instanceof directory_instruction_1.DirectoryInstruction)) return [3 /*break*/, 8];
                        if (!!worksPath.endsWith(file.completePath())) return [3 /*break*/, 5];
                        if (!!fs_extra_1.default.existsSync(filePath)) return [3 /*break*/, 5];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs_extra_1.default.mkdir(filePath)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        if (this.callbackOnCreateFile)
                            this.callbackOnCreateFile({ fileInstruction: file, error: e_1 });
                        return [3 /*break*/, 5];
                    case 5:
                        if (!(file.children && file.children.length > 0)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.createFilesInstruction(file.children)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        if (!(file instanceof file_instruction_1.FileInstruction)) return [3 /*break*/, 14];
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 13, , 14]);
                        if (!file.content) return [3 /*break*/, 11];
                        return [4 /*yield*/, fs_extra_1.default.writeFile(filePath, file.content)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        if (file.from)
                            fs_extra_1.default.copyFile(file.from, filePath);
                        _a.label = 12;
                    case 12:
                        if (this.callbackOnCreateFile)
                            this.callbackOnCreateFile({ fileInstruction: file });
                        return [3 /*break*/, 14];
                    case 13:
                        e_2 = _a.sent();
                        if (this.callbackOnCreateFile)
                            this.callbackOnCreateFile({ fileInstruction: file, error: e_2 });
                        return [3 /*break*/, 14];
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return FileCreator;
}());
exports.FileCreator = FileCreator;
//# sourceMappingURL=file-creator.js.map