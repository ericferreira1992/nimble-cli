"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageGenerate = void 0;
var tslib_1 = require("tslib");
var inversify_1 = require("inversify");
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var file_creator_1 = require("../../../core/file-creator/file-creator");
var page_generate_template_1 = require("./page-generate-template");
var base_generate_1 = require("../base-generate");
var PageGenerate = exports.PageGenerate = /** @class */ (function (_super) {
    tslib_1.__extends(PageGenerate, _super);
    function PageGenerate(logger) {
        var _this = _super.call(this) || this;
        _this.logger = logger;
        return _this;
    }
    PageGenerate.prototype.execute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var answer, name;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.question()];
                    case 1:
                        answer = _a.sent();
                        name = answer.value.trim().toLowerCase();
                        if (!this.isValid(name)) return [3 /*break*/, 3];
                        this.name = name;
                        if (this.name.startsWith('/'))
                            this.name = this.name.substr(1);
                        if (this.name.endsWith('/'))
                            this.name = this.name.substr(0, this.name.length - 1);
                        return [4 /*yield*/, this.startCreatePage()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.execute()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    PageGenerate.prototype.question = function () {
        return inquirer_1.default.prompt([{
                name: 'value',
                type: 'input',
                message: 'What is path and name? (ex.: pages/home)',
            }]);
    };
    ;
    PageGenerate.prototype.isValid = function (name) {
        if (name === '') {
            this.logger.showError('Cannot be empty.');
            return false;
        }
        if (name.includes(' ')) {
            this.logger.showError('Cannot contains whitespace.');
            return false;
        }
        if (/[!$%^&*()+|~=`{}\[\]:";'<>?,.]/.test(name)) {
            this.logger.showError('Cannot have the following symbols: !$%^&*()+|~=`{}\[\]:";\'<>?,.');
            return false;
        }
        return true;
    };
    PageGenerate.prototype.startCreatePage = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var creator, fileInstructions, lastDirectory, fileDirInstruction;
            var _a;
            var _this = this;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        creator = new file_creator_1.FileCreator();
                        fileInstructions = (_a = this.getBaseFileInstructions(), _a.fileInstructions), lastDirectory = _a.lastDirectory;
                        fileDirInstruction = {
                            name: this.fileName,
                            children: [
                                { name: "".concat(this.fileName, ".page.html"), content: this.replaceVariablesInContentFile(page_generate_template_1.PAGE_HTML) },
                                { name: "".concat(this.fileName, ".page.scss"), content: this.replaceVariablesInContentFile(page_generate_template_1.PAGE_SCSS) },
                                { name: "".concat(this.fileName, ".page.ts"), content: this.replaceVariablesInContentFile(page_generate_template_1.PAGE_TS) },
                            ]
                        };
                        if (lastDirectory)
                            lastDirectory.children.push(fileDirInstruction);
                        else
                            fileInstructions.push(fileDirInstruction);
                        creator.initialize(fileInstructions);
                        return [4 /*yield*/, creator.startCreateFiles(function (response) {
                                if (!response.error) {
                                    _this.logger.showCreated(response.fileInstruction.completePath());
                                }
                                else {
                                    _this.logger.showError(response.error);
                                }
                            })];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    PageGenerate.prototype.getValueByName = function (name) {
        switch (name) {
            case 'Name':
                return this.fileName;
            case 'FriendlyName':
                return this.fileFriendlyName;
        }
        return '';
    };
    PageGenerate = tslib_1.__decorate([
        (0, inversify_1.injectable)(),
        tslib_1.__param(0, (0, inversify_1.inject)('Logger'))
    ], PageGenerate);
    return PageGenerate;
}(base_generate_1.BaseGenerate));
//# sourceMappingURL=page-generate.js.map