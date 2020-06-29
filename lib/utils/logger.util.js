"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var kleur_1 = require("kleur");
var figlet = tslib_1.__importStar(require("figlet"));
var inversify_1 = require("inversify");
var console_message_1 = require("./console-message");
var cli_1 = require("../cli");
var Logger = /** @class */ (function () {
    function Logger() {
        this.newLine = '\n';
    }
    Logger.prototype.breakLine = function () {
        console.log('');
    };
    Logger.prototype.showVersion = function () {
        console.log(kleur_1.cyan(figlet.textSync(console_message_1.ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
        console.info(console_message_1.ConsoleMessage.ABOUT);
        console.info('Version: ' + kleur_1.cyan(cli_1.CLI.version));
    };
    Logger.prototype.showWarn = function (message) {
        console.warn(kleur_1.yellow(console_message_1.ConsoleMessage.WARN) + message);
    };
    Logger.prototype.showError = function (message) {
        console.error(kleur_1.red(console_message_1.ConsoleMessage.ERROR) + message);
    };
    Logger.prototype.showSuccess = function (message) {
        console.log(kleur_1.green(console_message_1.ConsoleMessage.SUCCESS) + message + this.newLine);
    };
    Logger.prototype.showInfo = function (message) {
        console.info(kleur_1.cyan(console_message_1.ConsoleMessage.INFO) + message + this.newLine);
    };
    Logger.prototype.showCreated = function (fileName) {
        console.log(kleur_1.green(console_message_1.ConsoleMessage.CREATED) + ("" + fileName));
    };
    Logger.prototype.showUpdate = function (fileName, filePath) {
        filePath
            ? console.log(kleur_1.green(console_message_1.ConsoleMessage.UPDATED) + (fileName + " in " + filePath))
            : console.log(kleur_1.green(console_message_1.ConsoleMessage.UPDATED) + ("" + fileName));
    };
    Logger = tslib_1.__decorate([
        inversify_1.injectable()
    ], Logger);
    return Logger;
}());
exports.Logger = Logger;
//# sourceMappingURL=logger.util.js.map