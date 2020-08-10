"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGenerate = void 0;
var tslib_1 = require("tslib");
var cli_1 = require("../../cli");
var inversify_1 = require("inversify");
var BaseGenerate = /** @class */ (function () {
    function BaseGenerate() {
    }
    Object.defineProperty(BaseGenerate.prototype, "fileName", {
        get: function () {
            if (this.name.includes('/')) {
                var splitted = this.name.split('/');
                return splitted[splitted.length - 1];
            }
            return this.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseGenerate.prototype, "fileFriendlyName", {
        get: function () {
            var name = this.fileName;
            if (name.includes('-'))
                name = name.split('-').map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); }).join('');
            if (name.includes('_'))
                name = name.split('_').map(function (part) { return +part.slice(1); }).join('');
            name = name[0].toUpperCase() + name.substr(1);
            return name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseGenerate.prototype, "directories", {
        get: function () {
            if (this.name.includes('/')) {
                var splitted = this.name.split('/');
                return splitted.slice(0, splitted.length - 1);
            }
            return [];
        },
        enumerable: false,
        configurable: true
    });
    BaseGenerate.prototype.getBaseFileInstructions = function () {
        var fileInstructions = [];
        var lastDirectory = null;
        if (cli_1.CLI.worksPathIsRootProject()) {
            fileInstructions.push({
                name: 'src',
                children: [
                    {
                        name: 'app',
                        children: []
                    }
                ]
            });
            lastDirectory = fileInstructions[0].children[0];
        }
        else if (cli_1.CLI.worksPathIsSourceDir()) {
            fileInstructions.push({ name: 'app', children: [] });
            lastDirectory = fileInstructions[0];
        }
        for (var _i = 0, _a = this.directories; _i < _a.length; _i++) {
            var dirName = _a[_i];
            var dir = { name: dirName, children: [] };
            if (lastDirectory)
                lastDirectory.children.push(dir);
            else
                fileInstructions.push(dir);
            lastDirectory = dir;
        }
        return { fileInstructions: fileInstructions, lastDirectory: lastDirectory };
    };
    BaseGenerate.prototype.replaceVariablesInContentFile = function (content) {
        var _this = this;
        var regex = /\[\[(.|\n)*?\]\]/g;
        if (regex.test(content)) {
            content = content.replace(regex, function (name) {
                name = name.replace(/(^\[\[)|(\]\]$)/g, '');
                if (name !== '')
                    return _this.getValueByName(name);
                return '';
            });
        }
        return content;
    };
    BaseGenerate = tslib_1.__decorate([
        inversify_1.injectable()
    ], BaseGenerate);
    return BaseGenerate;
}());
exports.BaseGenerate = BaseGenerate;
//# sourceMappingURL=base-generate.js.map