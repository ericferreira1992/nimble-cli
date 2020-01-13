"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("../cli");
var ArgsResolver = /** @class */ (function () {
    function ArgsResolver(args) {
        this.args = [];
        this.logger = cli_1.CLI.inject('Logger');
        this.resolveArgs(args);
    }
    ArgsResolver.prototype.resolveArgs = function (args) {
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg.startsWith('--')) {
                arg = arg.substr(2);
                if (arg.split('=').length > 1) {
                    this.args.push({ name: arg.split('=')[0], value: arg.split('=').slice(1).join('') });
                }
                else
                    this.args.push({ name: arg, value: true });
            }
            else if (arg.startsWith('-')) {
                arg = arg.substr(1);
                if ((i + 1) < args.length) {
                    i++;
                    this.args.push({ name: arg, value: args[i] });
                }
                else
                    this.args.push({ name: arg, value: true });
            }
            else if (arg)
                this.args.push({ name: arg, value: true });
        }
    };
    ArgsResolver.prototype.getValue = function (argName, defaultValue) {
        if (defaultValue === void 0) { defaultValue = ''; }
        var arg = this.get(argName);
        return arg ? (arg.value || defaultValue) : defaultValue;
    };
    ArgsResolver.prototype.has = function (argName) {
        return this.args.some(function (x) { return x.name === argName; });
    };
    ArgsResolver.prototype.get = function (argName) {
        return this.args.find(function (x) { return x.name === argName; });
    };
    return ArgsResolver;
}());
exports.ArgsResolver = ArgsResolver;
//# sourceMappingURL=args-resolver.js.map