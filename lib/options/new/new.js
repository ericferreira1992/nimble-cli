"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.New = void 0;
var tslib_1 = require("tslib");
var spawn = require('cross-spawn');
var inquirer_1 = tslib_1.__importDefault(require("inquirer"));
var cp = tslib_1.__importStar(require("child_process"));
var inversify_1 = require("inversify");
var file_creator_1 = require("../../core/file-creator/file-creator");
var public_directory_1 = require("./templates/public-directory");
var project_directory_1 = require("./templates/project-directory");
var cli_1 = require("../../cli");
var src_directory_1 = require("./templates/src-directory");
var scss_directory_1 = require("./templates/scss-directory");
var environments_directory_1 = require("./templates/environments-directory");
var app_directory_1 = require("./templates/app-directory");
var root_page_directory_1 = require("./templates/pages/root-page-directory");
var first_page_directory_1 = require("./templates/pages/first-page-directory");
var second_page_directory_1 = require("./templates/pages/second-page-directory");
var third_page_directory_1 = require("./templates/pages/third-page-directory");
var New = exports.New = /** @class */ (function () {
    function New(logger) {
        this.logger = logger;
        if (cli_1.CLI.isNimbleProject()) {
            this.logger.showWarn('⚠️ Looks like you\'re already on a Nimble project.');
            process.exit(0);
        }
        this.execute();
    }
    Object.defineProperty(New.prototype, "projectFriendlyName", {
        get: function () {
            var name = this.projectName;
            if (name.includes('-'))
                name = name.split('-').map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); }).join('');
            if (name.includes('_'))
                name = name.split('_').map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1); }).join('');
            name = name[0].toUpperCase() + name.substr(1);
            return name;
        },
        enumerable: false,
        configurable: true
    });
    New.prototype.execute = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var answer, projectName;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.question()];
                    case 1:
                        answer = _a.sent();
                        projectName = answer.value.trim().toLowerCase();
                        if (this.isValid(projectName)) {
                            this.projectName = projectName;
                            this.startCreateProject();
                        }
                        else
                            this.execute();
                        return [2 /*return*/];
                }
            });
        });
    };
    New.prototype.question = function () {
        return inquirer_1.default.prompt([{
                name: 'value',
                type: 'input',
                message: 'What is name of the your project? (ex.: my-project)',
            }]);
    };
    ;
    New.prototype.isValid = function (projectName) {
        if (projectName === '') {
            this.logger.showError('The name cannot be empty.');
            return false;
        }
        if (projectName.includes(' ')) {
            this.logger.showError('The name cannot constains whitespace.');
            return false;
        }
        if (/[!$%^&*()+|~=`{}\[\]:";'<>?,.\/]/.test(projectName)) {
            this.logger.showError('The name cannot have the following symbols: !$%^&*()+|~=`{}\[\]:";\'<>?,.\/');
            return false;
        }
        return true;
    };
    New.prototype.startCreateProject = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var creator, errorsMsg, childProcess;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        creator = new file_creator_1.FileCreator();
                        creator.initialize([
                            {
                                name: this.projectName,
                                children: [
                                    {
                                        name: 'public',
                                        children: [
                                            { name: 'index.html', content: this.replaceVariablesInContentFile(public_directory_1.INDEX_HTML) },
                                            { name: 'manifest.json', content: this.replaceVariablesInContentFile(public_directory_1.MANIFEST_JSON) },
                                            { name: 'favicon.ico', from: __dirname + '/templates/files/favicon.ico' },
                                            {
                                                name: 'assets',
                                                children: [
                                                    { name: 'css' },
                                                    { name: 'fonts' },
                                                    {
                                                        name: 'img',
                                                        children: [
                                                            { name: 'logo_white.png', from: __dirname + '/templates/files/logo_white.png' },
                                                            { name: 'icon_100x100.png', from: __dirname + '/templates/files/icon_100x100.png' },
                                                        ]
                                                    },
                                                    { name: 'js' }
                                                ]
                                            },
                                        ]
                                    },
                                    {
                                        name: 'src',
                                        children: [
                                            {
                                                name: 'app',
                                                children: [
                                                    { name: 'routes.ts', content: this.replaceVariablesInContentFile(app_directory_1.ROUTES_TS) },
                                                    {
                                                        name: 'pages',
                                                        children: [
                                                            {
                                                                name: 'root',
                                                                children: [
                                                                    { name: 'root.page.html', content: this.replaceVariablesInContentFile(root_page_directory_1.ROOT_HTML) },
                                                                    { name: 'root.page.scss', content: this.replaceVariablesInContentFile(root_page_directory_1.ROOT_SCSS) },
                                                                    { name: 'root.page.ts', content: this.replaceVariablesInContentFile(root_page_directory_1.ROOT_TS) },
                                                                ]
                                                            },
                                                            {
                                                                name: 'first',
                                                                children: [
                                                                    { name: 'first.page.html', content: this.replaceVariablesInContentFile(first_page_directory_1.FIRST_HTML) },
                                                                    { name: 'first.page.scss', content: this.replaceVariablesInContentFile(first_page_directory_1.FIRST_SCSS) },
                                                                    { name: 'first.page.ts', content: this.replaceVariablesInContentFile(first_page_directory_1.FIRST_TS) },
                                                                ]
                                                            },
                                                            {
                                                                name: 'second',
                                                                children: [
                                                                    { name: 'second.page.html', content: this.replaceVariablesInContentFile(second_page_directory_1.SECOND_HTML) },
                                                                    { name: 'second.page.scss', content: this.replaceVariablesInContentFile(second_page_directory_1.SECOND_SCSS) },
                                                                    { name: 'second.page.ts', content: this.replaceVariablesInContentFile(second_page_directory_1.SECOND_TS) },
                                                                ]
                                                            },
                                                            {
                                                                name: 'third',
                                                                children: [
                                                                    { name: 'third.page.html', content: this.replaceVariablesInContentFile(third_page_directory_1.THIRD_HTML) },
                                                                    { name: 'third.page.scss', content: this.replaceVariablesInContentFile(third_page_directory_1.THIRD_SCSS) },
                                                                    { name: 'third.page.ts', content: this.replaceVariablesInContentFile(third_page_directory_1.THIRD_TS) },
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                name: 'scss',
                                                children: [
                                                    { name: 'reset.scss', content: this.replaceVariablesInContentFile(scss_directory_1.RESET_SCSS) },
                                                    { name: 'variables.scss', content: this.replaceVariablesInContentFile(scss_directory_1.VARIABLES_SCSS) },
                                                ]
                                            },
                                            {
                                                name: 'environments',
                                                children: [
                                                    { name: 'env.local.js', content: this.replaceVariablesInContentFile(environments_directory_1.LOCAL_ENV) },
                                                    { name: 'env.dev.js', content: this.replaceVariablesInContentFile(environments_directory_1.DEV_ENV) },
                                                    { name: 'env.prod.js', content: this.replaceVariablesInContentFile(environments_directory_1.PROD_ENV) },
                                                ]
                                            },
                                            { name: 'style.scss', content: this.replaceVariablesInContentFile(src_directory_1.STYLE_SCSS) },
                                            { name: 'main.ts', content: this.replaceVariablesInContentFile(src_directory_1.MAIN_TS) },
                                        ]
                                    },
                                    { name: '.gitignore', content: this.replaceVariablesInContentFile(project_directory_1.GITIGNORE) },
                                    { name: 'nimble.json', content: this.replaceVariablesInContentFile(project_directory_1.NIMBLE_JSON) },
                                    {
                                        name: 'package.json',
                                        content: this.replaceVariablesInContentFile(project_directory_1.PACKAGE_JSON, function (name, value) {
                                            if (name === 'NimbleVersion' && (!value.includes('alpha') && !value.includes('beta'))) {
                                                return "^".concat(value);
                                            }
                                            return value;
                                        })
                                    },
                                    { name: 'README.md', content: this.replaceVariablesInContentFile(project_directory_1.README) },
                                    { name: 'tsconfig.json', content: this.replaceVariablesInContentFile(project_directory_1.TSCONFIG) }
                                ]
                            }
                        ]);
                        return [4 /*yield*/, creator.startCreateFiles(function (response) {
                                if (!response.error) {
                                    _this.logger.showCreated(response.fileInstruction.completePath());
                                }
                                else {
                                    _this.logger.showError(response.error);
                                }
                            })];
                    case 1:
                        _a.sent();
                        this.logger.breakLine();
                        this.logger.showInfo('Installing dependencies...');
                        console.log('(This may take a few minutes)');
                        errorsMsg = [];
                        childProcess = cp.exec("npm install --no-optional --colors", { cwd: this.projectName });
                        childProcess.stdout.on('data', function (data) {
                            console.log(data);
                        });
                        childProcess.stderr.on('data', function (data) {
                            console.log(data);
                            if (data)
                                errorsMsg.push(data.toString());
                        });
                        childProcess.addListener('close', function (code) {
                            if (!code)
                                _this.logger.showSuccess('Finished! Your project has been created!');
                            else if (errorsMsg.some(function (x) { return x.includes('permission'); }))
                                _this.logger.showSuccess('Finished! Your project has been created, but we had some permissions problems, see above. Maybe you need run "npm run initialize" inside project folder with administrator privileges.');
                            else
                                _this.logger.showSuccess('Finished! Your project has been created, but we had some problems, see above.');
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    New.prototype.replaceVariablesInContentFile = function (content, proccess) {
        var _this = this;
        var regex = /\[\[(.|\n)*?\]\]/g;
        if (regex.test(content)) {
            content = content.replace(regex, function (name) {
                name = name.replace(/(^\[\[)|(\]\]$)/g, '');
                var value = name !== '' ? _this.getValueByName(name) : '';
                return (proccess) ? proccess(name, value) : value;
            });
        }
        return content;
    };
    New.prototype.getValueByName = function (name) {
        switch (name) {
            case 'ProjectName':
                return this.projectName;
            case 'ProjectFriendlyName':
                return this.projectFriendlyName;
            case 'Version':
                return cli_1.CLI.version;
            case 'NimbleVersion':
                return cli_1.CLI.nimbleVersion;
        }
        return '';
    };
    New = tslib_1.__decorate([
        (0, inversify_1.injectable)(),
        tslib_1.__param(0, (0, inversify_1.inject)('Logger'))
    ], New);
    return New;
}());
//# sourceMappingURL=new.js.map