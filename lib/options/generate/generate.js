"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generate = void 0;
var tslib_1 = require("tslib");
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var inversify_1 = require("inversify");
var cli_1 = require("../../cli");
var generate_types_enum_1 = require("./generate-types.enum");
var Generate = exports.Generate = /** @class */ (function () {
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
            var answer, generate;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.question()];
                    case 1:
                        answer = _a.sent();
                        switch (answer.value) {
                            case generate_types_enum_1.GenerateTypes.PAGE:
                                generate = cli_1.CLI.inject('PageGenerate');
                                break;
                            case generate_types_enum_1.GenerateTypes.DIALOG:
                                generate = cli_1.CLI.inject('DialogGenerate');
                                break;
                            case generate_types_enum_1.GenerateTypes.DIRECTIVE:
                                generate = cli_1.CLI.inject('DirectiveGenerate');
                                break;
                            case generate_types_enum_1.GenerateTypes.SERVICE:
                                generate = cli_1.CLI.inject('ServiceGenerate');
                                break;
                            case generate_types_enum_1.GenerateTypes.GUARD:
                                generate = cli_1.CLI.inject('GuardGenerate');
                                break;
                        }
                        return [4 /*yield*/, (generate === null || generate === void 0 ? void 0 : generate.execute())];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Generate.prototype.question = function () {
        return inquirer_1.default.prompt([{
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
        (0, inversify_1.injectable)(),
        tslib_1.__param(0, (0, inversify_1.inject)('Logger'))
    ], Generate);
    return Generate;
}());
//# sourceMappingURL=generate.js.map