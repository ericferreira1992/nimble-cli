"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var inversify_1 = require("inversify");
var inquirer = require("inquirer");
var cli_1 = require("../../cli");
var generate_types_enum_1 = require("./generate-types.enum");
var Generate = /** @class */ (function () {
    function Generate(logger) {
        this.logger = logger;
        if (cli_1.CLI.isNimbleProject())
            this.execute();
        else {
            this.logger.showError('To continue you must be in a Nimble project.');
            process.exit(0);
        }
    }
    Generate.prototype.execute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var answer, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.question()];
                    case 1:
                        answer = _b.sent();
                        _a = answer.value;
                        switch (_a) {
                            case generate_types_enum_1.GenerateTypes.PAGE: return [3 /*break*/, 2];
                            case generate_types_enum_1.GenerateTypes.DIALOG: return [3 /*break*/, 4];
                            case generate_types_enum_1.GenerateTypes.DIRECTIVE: return [3 /*break*/, 6];
                            case generate_types_enum_1.GenerateTypes.SERVICE: return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, cli_1.CLI.inject('PageGenerate')];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 4: return [4 /*yield*/, cli_1.CLI.inject('DialogGenerate')];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 6: return [4 /*yield*/, cli_1.CLI.inject('DirectiveGenerate')];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, cli_1.CLI.inject('ServiceGenerate')];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Generate.prototype.question = function () {
        return inquirer.prompt([{
                name: 'value',
                type: 'list',
                message: 'Which what do you want to generate?',
                choices: Object.keys(generate_types_enum_1.GenerateTypes).map(function (key, index) { return ({
                    name: generate_types_enum_1.GenerateTypes[key],
                    value: generate_types_enum_1.GenerateTypes[key],
                }); })
            }]);
    };
    ;
    Generate = tslib_1.__decorate([
        inversify_1.injectable(),
        tslib_1.__param(0, inversify_1.inject('Logger'))
    ], Generate);
    return Generate;
}());
exports.Generate = Generate;
//# sourceMappingURL=generate.js.map