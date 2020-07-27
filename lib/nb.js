"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var inquirer = require("inquirer");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var inversify_1 = require("inversify");
var initial_value_enum_1 = require("./initial-value.enum");
var cli_1 = require("./cli");
var NB = /** @class */ (function () {
    function NB(logger) {
        this.logger = logger;
        this.initialArgs = [];
        this.args = [];
        this.inNimbleProject = false;
        this.inNimbleProject = cli_1.CLI.isNimbleProject();
    }
    NB.prototype.setArgurments = function (args) {
        this.args = args;
        this.initialArgs = args;
    };
    NB.prototype.start = function () {
        if (this.hasArgs())
            this.processArgs();
        else
            this.execute();
    };
    NB.prototype.hasArgs = function () {
        return this.args.length > 0;
    };
    NB.prototype.processArgs = function () {
        var arg = this.args[0];
        this.args = this.args.slice(1);
        if (arg === '--version' || arg === '-v')
            return this.logger.showVersion();
        if (arg === 'serve' || arg === 'server' || arg === 's')
            return cli_1.CLI.inject('Serve').execute(this.args);
        if (arg === 'build' || arg === 'b')
            return cli_1.CLI.inject('Build').execute(this.args);
        if (arg === 'new') {
            return cli_1.CLI.inject('New');
        }
    };
    NB.prototype.execute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var answer, _a, enviroments, answer_1, answer;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.inNimbleProject) return [3 /*break*/, 9];
                        return [4 /*yield*/, inquirer.prompt([{
                                    name: 'value',
                                    type: 'list',
                                    message: 'Select what do you want:',
                                    choices: [
                                        { name: 'Generate', value: initial_value_enum_1.InitialValue.GENERATE },
                                        { name: 'Run server', value: initial_value_enum_1.InitialValue.SERVER },
                                        { name: 'Run build', value: initial_value_enum_1.InitialValue.BUILD },
                                        { name: 'Exit', value: '' },
                                    ]
                                }])];
                    case 1:
                        answer = _b.sent();
                        _a = answer.value;
                        switch (_a) {
                            case initial_value_enum_1.InitialValue.SERVER: return [3 /*break*/, 2];
                            case initial_value_enum_1.InitialValue.BUILD: return [3 /*break*/, 3];
                            case initial_value_enum_1.InitialValue.GENERATE: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 8];
                    case 2:
                        cli_1.CLI.inject('Serve').execute();
                        return [3 /*break*/, 8];
                    case 3:
                        enviroments = this.getAllExistingsEnviroments();
                        if (!(enviroments.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, inquirer.prompt([{
                                    name: 'value',
                                    type: 'list',
                                    message: 'Select the environment to be used:',
                                    choices: enviroments.map(function (env) { return ({
                                        name: env, value: env
                                    }); })
                                }])];
                    case 4:
                        answer_1 = _b.sent();
                        cli_1.CLI.inject('Build').execute(["--env=" + answer_1.value]);
                        return [3 /*break*/, 6];
                    case 5:
                        cli_1.CLI.inject('Build').execute();
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        cli_1.CLI.inject('Generate');
                        return [3 /*break*/, 8];
                    case 8: return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, inquirer.prompt([{
                                name: 'value',
                                type: 'confirm',
                                message: 'Do you want create new Nimble project?',
                            }])];
                    case 10:
                        answer = _b.sent();
                        if (answer.value) {
                            cli_1.CLI.inject('New');
                        }
                        _b.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    NB.prototype.getArgValueIfExists = function (args, name) {
        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
            var arg = args_1[_i];
            arg = arg.trim();
            var value = arg;
            if (arg.includes('=')) {
                var splitted = arg.split('=');
                value = splitted[splitted.length - 1];
                arg = splitted[0];
            }
            if (arg === name)
                return value === arg ? true : value;
        }
        return false;
    };
    NB.prototype.getAllExistingsEnviroments = function () {
        var envs = [];
        if (fs_extra_1.default.pathExistsSync(process.cwd() + "/src/environments")) {
            fs_extra_1.default.readdirSync(process.cwd() + "/src/environments").forEach(function (file) {
                if (/^(env\.).*[a-zA-Z0-9](\.js)$/g.test(file)) {
                    envs.push(file.replace(/^(env\.)|(\.js)$/g, ''));
                }
            });
        }
        return envs;
    };
    NB = tslib_1.__decorate([
        inversify_1.injectable(),
        tslib_1.__param(0, inversify_1.inject('Logger'))
    ], NB);
    return NB;
}());
exports.NB = NB;
//# sourceMappingURL=nb.js.map