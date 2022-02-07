"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var Command_1 = __importDefault(require("./Command"));
var get_all_files_1 = __importDefault(require("./get-all-files"));
var CommandHandler = /** @class */ (function () {
    function CommandHandler(instance, client, dir) {
        var _this = this;
        this._commands = new Map();
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                var files = (0, get_all_files_1.default)(dir);
                console.log('Command files: ', files);
                var amount = files.length;
                if (amount > 0) {
                    console.log("Found and Loaded ".concat(amount, " command(s)"));
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var _a = files_1[_i], file = _a[0], fileName = _a[1];
                        this.registerCommand(instance, client, file, fileName);
                    }
                    client.on('message', function (message) {
                        var guild = message.guild;
                        var content = message.content;
                        var prefix = instance.getPrefix(guild);
                        if (content.startsWith(prefix)) {
                            content = content.substring(prefix.length);
                            var args = content.split(/ /g);
                            var firstElement = args.shift();
                            if (firstElement) {
                                var name_1 = firstElement.toLowerCase();
                                var command = _this._commands.get(name_1);
                                if (command) {
                                    var minArgs = command.minArgs, maxArgs = command.maxArgs, expectedArgs = command.expectedArgs;
                                    var _a = command.syntaxError, syntaxError = _a === void 0 ? instance.syntaxError : _a;
                                    if ((minArgs !== undefined && args.length < minArgs) ||
                                        (maxArgs !== undefined &&
                                            maxArgs !== -1 &&
                                            args.length > maxArgs)) {
                                        if (syntaxError) {
                                            syntaxError = syntaxError.replace('{PERFIX}', prefix);
                                        }
                                        syntaxError = syntaxError.replace(/{COMMAND}/g, name_1);
                                        syntaxError = syntaxError.replace(/ {ARGUMENTS}/g, expectedArgs ? " ".concat(expectedArgs) : '');
                                        message.reply(syntaxError);
                                        return;
                                    }
                                    command.execute(message, args);
                                }
                            }
                        }
                    });
                }
            }
            else {
                throw new Error("Command directory ".concat(dir, " does not exist"));
            }
        }
    }
    CommandHandler.prototype.registerCommand = function (instance, client, file, fileName) {
        var configuation = require(file);
        var _a = configuation.name, name = _a === void 0 ? fileName : _a, commands = configuation.commands, aliases = configuation.aliases, callback = configuation.callback, execute = configuation.execute, description = configuation.description;
        if (callback && execute) {
            throw new Error("Command ".concat(fileName, " has both a callback and an execute function."));
        }
        var names = commands || aliases || [];
        if (!name && (!names || names.length === 0)) {
            throw new Error("Command ".concat(fileName, " does not have a name or aliases."));
        }
        if (typeof names === 'string') {
            names = [names];
        }
        if (name && !names.includes(name.toLowerCase())) {
            names.unshift(name);
        }
        if (!description) {
            console.warn("Command ".concat(fileName, " does not have a description."));
        }
        var hasCallBack = callback || execute;
        if (hasCallBack) {
            var command = new Command_1.default(instance, client, name, callback || execute, configuation);
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_2 = names_1[_i];
                this._commands.set(name_2.toLowerCase(), command);
            }
        }
    };
    Object.defineProperty(CommandHandler.prototype, "commands", {
        get: function () {
            var results = new Map();
            this._commands.forEach(function (_a) {
                var names = _a.names, _b = _a.description, description = _b === void 0 ? '' : _b;
                results.set(names[0], {
                    names: names,
                    description: description
                });
            });
            return Array.from(results.values());
        },
        enumerable: false,
        configurable: true
    });
    return CommandHandler;
}());
module.exports = CommandHandler;
