"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var tslib_1 = require("tslib");
var kleur_1 = require("kleur");
var figlet = tslib_1.__importStar(require("figlet"));
var semver = tslib_1.__importStar(require("semver"));
var inversify_1 = require("inversify");
var console_message_1 = require("./console-message");
var cli_1 = require("../cli");
var Logger = exports.Logger = /** @class */ (function () {
    function Logger() {
        this.newLine = '\n';
    }
    Logger.prototype.breakLine = function () {
        console.log('');
    };
    Logger.prototype.showVersion = function () {
        var inLocalProject = cli_1.CLI.workingInLocalProject();
        console.log((0, kleur_1.cyan)(figlet.textSync(console_message_1.ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
        if (inLocalProject && cli_1.CLI.hasGlobalInstalled()) {
            var version = cli_1.CLI.version;
            var globalVersion = cli_1.CLI.globalVersion;
            if (semver.gt(globalVersion, version)) {
                console.info((0, kleur_1.yellow)("\u26A0\uFE0F Your global Nimble CLI version (".concat(globalVersion, ") is greater than your local version (").concat(version, "). The local Nimble CLI version is used.")));
                console.info('');
            }
        }
        console.info('Versions:');
        console.info(" \u2022 ".concat((0, kleur_1.bold)('Nimble CLI'), "\t -> ") + (0, kleur_1.cyan)(cli_1.CLI.version) + (0, kleur_1.yellow)(" (Using ".concat(inLocalProject ? 'local version of this project' : 'global', ")")));
        console.info(" \u2022 ".concat((0, kleur_1.bold)('Node'), "\t\t -> ") + (0, kleur_1.cyan)(process.versions.node));
        console.info(" \u2022 ".concat((0, kleur_1.bold)('OS'), "\t\t -> ") + (0, kleur_1.cyan)("".concat(process.platform, " ").concat(process.arch)));
        console.info('');
    };
    Logger.prototype.showWarn = function (message) {
        console.warn((0, kleur_1.yellow)(console_message_1.ConsoleMessage.WARN) + message);
    };
    Logger.prototype.showError = function (message) {
        console.error((0, kleur_1.red)(console_message_1.ConsoleMessage.ERROR) + message);
    };
    Logger.prototype.showSuccess = function (message) {
        console.log((0, kleur_1.green)(console_message_1.ConsoleMessage.SUCCESS) + message + this.newLine);
    };
    Logger.prototype.showInfo = function (message) {
        console.info((0, kleur_1.cyan)(console_message_1.ConsoleMessage.INFO) + message + this.newLine);
    };
    Logger.prototype.showCreated = function (fileName) {
        console.log((0, kleur_1.green)(console_message_1.ConsoleMessage.CREATED) + "".concat(fileName));
    };
    Logger.prototype.showUpdate = function (fileName, filePath) {
        filePath
            ? console.log((0, kleur_1.green)(console_message_1.ConsoleMessage.UPDATED) + "".concat(fileName, " in ").concat(filePath))
            : console.log((0, kleur_1.green)(console_message_1.ConsoleMessage.UPDATED) + "".concat(fileName));
    };
    Logger = tslib_1.__decorate([
        (0, inversify_1.injectable)()
    ], Logger);
    return Logger;
}());
//# sourceMappingURL=logger.util.js.map