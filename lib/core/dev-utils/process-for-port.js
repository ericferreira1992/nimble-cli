"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessForPort = void 0;
var tslib_1 = require("tslib");
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var child_process_1 = require("child_process");
var path_1 = tslib_1.__importDefault(require("path"));
var execOptions = {
    encoding: 'utf8',
    stdio: [
        'pipe',
        'pipe',
        'ignore',
    ],
};
function isProcessAReactApp(processCommand) {
    return /^node .*react-scripts\/scripts\/start\.js\s?$/.test(processCommand);
}
function getProcessIdOnPort(port) {
    return child_process_1.execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
        .split('\n')[0]
        .trim();
}
function getPackageNameInDirectory(directory) {
    var packagePath = path_1.default.join(directory.trim(), 'package.json');
    try {
        return require(packagePath).name;
    }
    catch (e) {
        return null;
    }
}
function getProcessCommand(processId, processDirectory) {
    var command = child_process_1.execSync('ps -o command -p ' + processId + ' | sed -n 2p', execOptions);
    command = command.replace(/\n$/, '');
    if (isProcessAReactApp(command)) {
        var packageName = getPackageNameInDirectory(processDirectory);
        return packageName ? packageName : command;
    }
    else {
        return command;
    }
}
function getDirectoryOfProcessById(processId) {
    return child_process_1.execSync('lsof -p ' + processId + ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'', execOptions).trim();
}
function getProcessForPort(port) {
    try {
        var processId = getProcessIdOnPort(port);
        var directory = getDirectoryOfProcessById(processId);
        var command = getProcessCommand(processId, directory);
        return (chalk_1.default.cyan(command) +
            chalk_1.default.grey(' (pid ' + processId + ')\n') +
            chalk_1.default.blue('  in ') +
            chalk_1.default.cyan(directory));
    }
    catch (e) {
        return null;
    }
}
exports.getProcessForPort = getProcessForPort;
//# sourceMappingURL=process-for-port.js.map