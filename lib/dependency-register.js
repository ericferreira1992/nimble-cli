"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyRegister = void 0;
var logger_util_1 = require("./utils/logger.util");
var checker_util_1 = require("./utils/checker.util");
var nb_1 = require("./nb");
var new_1 = require("./options/new/new");
var generate_1 = require("./options/generate/generate");
var page_generate_1 = require("./options/generate/page/page-generate");
var dialog_generate_1 = require("./options/generate/dialog/dialog-generate");
var service_generate_1 = require("./options/generate/service/service-generate");
var directive_generate_1 = require("./options/generate/directive/directive-generate");
var serve_1 = require("./commands/serve/serve");
var build_1 = require("./commands/build/build");
var DependencyRegister = /** @class */ (function () {
    function DependencyRegister() {
    }
    DependencyRegister.register = function (container) {
        // Utils
        container.bind('Logger').to(logger_util_1.Logger).inSingletonScope();
        container.bind('Checker').to(checker_util_1.Checker).inSingletonScope();
        // Options
        container.bind('New').to(new_1.New).inSingletonScope();
        container.bind('Generate').to(generate_1.Generate).inSingletonScope();
        container.bind('PageGenerate').to(page_generate_1.PageGenerate).inSingletonScope();
        container.bind('DialogGenerate').to(dialog_generate_1.DialogGenerate).inSingletonScope();
        container.bind('ServiceGenerate').to(service_generate_1.ServiceGenerate).inSingletonScope();
        container.bind('DirectiveGenerate').to(directive_generate_1.DirectiveGenerate).inSingletonScope();
        // Commands
        container.bind('Serve').to(serve_1.Serve).inSingletonScope();
        container.bind('Build').to(build_1.Build).inSingletonScope();
        container.bind('NB').to(nb_1.NB).inSingletonScope();
    };
    return DependencyRegister;
}());
exports.DependencyRegister = DependencyRegister;
//# sourceMappingURL=dependency-register.js.map