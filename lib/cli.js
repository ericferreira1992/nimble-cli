"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
var tslib_1 = require("tslib");
require("reflect-metadata");
var fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
var path_1 = tslib_1.__importDefault(require("path"));
var cp = tslib_1.__importStar(require("child_process"));
var semver = tslib_1.__importStar(require("semver"));
var inversify_1 = require("inversify");
var dependency_register_1 = require("./dependency-register");
var CLI = /** @class */ (function () {
    function CLI() {
    }
    Object.defineProperty(CLI, "nimbleVersion", {
        get: function () {
            if (!this._nimbleVersion) {
                var prefix = 'npm show @nimble-ts/core';
                var stable = cp.execSync(prefix + " version").toString('utf8').replace(/(\r\n|\n|\r)/gm, '');
                var beta = cp.execSync(prefix + " dist-tags.beta").toString('utf8').replace(/(\r\n|\n|\r)/gm, '');
                var alpha = cp.execSync(prefix + " dist-tags.alpha").toString('utf8').replace(/(\r\n|\n|\r)/gm, '');
                var equalOrGreater = function (v1, v2) {
                    v1 = v1.split('-')[0];
                    v2 = v2.split('-')[0];
                    return v1 === v2 || semver.gt(v1, v2);
                };
                if (alpha && equalOrGreater(alpha, stable) && (!beta || equalOrGreater(alpha, beta))) {
                    this._nimbleVersion = alpha;
                }
                else if (beta && equalOrGreater(beta, stable) && (!alpha || equalOrGreater(beta, alpha))) {
                    this._nimbleVersion = beta;
                }
                else {
                    this._nimbleVersion = stable;
                }
            }
            return this._nimbleVersion;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLI, "version", {
        get: function () { return this.package ? this.package.version : '1.0.0'; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLI, "globalVersion", {
        get: function () {
            if (this.workingInLocalProject()) {
                try {
                    if (process.mainModule) {
                        var globalPath = path_1.default.join(process.mainModule['path'], '../package.json');
                        if (fs_extra_1.default.existsSync(globalPath)) {
                            var packgeJson = JSON.parse(fs_extra_1.default.readFileSync(globalPath, 'utf8'));
                            return packgeJson ? packgeJson.version : this.version;
                        }
                    }
                }
                catch (_a) {
                    return this.version;
                }
            }
            return this.version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CLI, "worksPath", {
        get: function () { return process.cwd(); },
        enumerable: false,
        configurable: true
    });
    CLI.start = function () {
        this.nimbleVersion;
        this.getInformation();
        dependency_register_1.DependencyRegister.register(this.container);
        this.nb = this.container.get('NB');
        this.nb.setArgurments(process.argv.slice(2));
        this.nb.start();
    };
    CLI.inject = function (type) {
        return this.container.get(type);
    };
    CLI.hasGlobalInstalled = function () {
        if (this.workingInLocalProject()) {
            try {
                var packgeJson = require("../package.json");
                return true;
            }
            catch (_a) {
                return false;
            }
        }
        return true;
    };
    CLI.workingInLocalProject = function () {
        var projectRootPath = path_1.default.join(__dirname, '../../../../');
        return fs_extra_1.default.existsSync(projectRootPath + "/nimble.json");
    };
    CLI.worksPathIsRootProject = function (path) {
        if (!path)
            path = this.worksPath;
        if (!path.endsWith('/'))
            path += '/';
        if (!fs_extra_1.default.pathExistsSync(path + "src") || !fs_extra_1.default.existsSync(path + "package.json")) {
            return false;
        }
        if (!fs_extra_1.default.existsSync(path + "nimble.json")) {
            return false;
        }
        var packageFile = null;
        try {
            packageFile = require(path + "package.json");
        }
        catch (_a) { }
        if (!packageFile || !packageFile['dependencies'] || !packageFile['dependencies']['@nimble-ts/core'])
            return false;
        return true;
    };
    CLI.worksPathIsSourceDir = function () {
        var dirName = this.worksPath.split(path_1.default.sep).pop();
        return dirName === 'src';
    };
    CLI.isNimbleProject = function () {
        var parent = this.worksPath;
        var rootPath = path_1.default.parse(parent).root;
        while (parent && parent !== rootPath) {
            if (this.worksPathIsRootProject(parent))
                return true;
            parent = this.getParentPath(parent);
        }
        return false;
    };
    CLI.getNimbleProjectRootPath = function () {
        var parent = this.worksPath;
        var rootPath = path_1.default.parse(parent).root;
        while (parent && parent !== rootPath) {
            if (this.worksPathIsRootProject(parent))
                return parent;
            parent = this.getParentPath(parent);
        }
        return parent;
    };
    CLI.getParentPath = function (completePath) {
        var parentPath = path_1.default.join(completePath + '/..');
        return parentPath;
    };
    CLI.getInformation = function () {
        try {
            this.package = require('package.json');
        }
        catch (_a) {
            this.package = require('../package.json');
        }
    };
    CLI.container = new inversify_1.Container();
    return CLI;
}());
exports.CLI = CLI;
CLI.start();
//# sourceMappingURL=cli.js.map