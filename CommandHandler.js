"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var Command_1 = __importDefault(require("./Command"));
var CommandHandler = /** @class */ (function () {
    function CommandHandler(instance, client, dir) {
        this._commands = new Map();
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                var files = fs_1.default
                    .readdirSync(dir)
                    .filter(function (file) { return file.endsWith('.js'); });
                var amount = files.length;
                if (amount > 0) {
                    console.log("Found and Loaded ".concat(amount, " command(s)"));
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        var configuration = require("".concat(dir, "/").concat(file));
                        var aliases = configuration.aliases, callback = configuration.callback;
                        if (aliases && aliases.length && callback) {
                            var command = new Command_1.default(instance, client, configuration);
                            for (var _a = 0, aliases_1 = aliases; _a < aliases_1.length; _a++) {
                                var alias = aliases_1[_a];
                                this._commands.set(alias.toLowerCase(), command);
                            }
                        }
                    }
                    client.on('message', function (message) {
                        var guild = message.guild;
                        var content = message.content;
                        var prefix = instance.getPrefix(guild);
                    });
                }
            }
        }
    }
    return CommandHandler;
}());
module.exports = CommandHandler;
