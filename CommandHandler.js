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
                        var file = files_1[_i];
                        var fileName = file
                            .replace(/\\/g, '/')
                            .split('/');
                        fileName = fileName[fileName.length - 1];
                        fileName = fileName.split('.')[0].toLowerCase();
                        var configuration = require(file);
                        var name_1 = configuration.name, commands = configuration.commands, aliases = configuration.aliases, callback = configuration.callback, execute = configuration.execute, description = configuration.description;
                        if (callback && execute) {
                            throw new Error("Command ".concat(fileName, " has both callback and execute , please use one or the other"));
                        }
                        var names = commands || aliases;
                        if (!name_1 && (!names || names.length === 0)) {
                            throw new Error("Command ".concat(fileName, " has no name or aliases."));
                        }
                        if (typeof names === 'string') {
                            names = [names];
                        }
                        if (name_1 && !names.includes(name_1.toLowerCase())) {
                            names.unshift(name_1.toLowerCase());
                        }
                        if (!names.includes(fileName)) {
                            name_1.unshift(fileName);
                        }
                        if (!description) {
                            console.warn("Command ".concat(fileName, " has no description property."));
                        }
                        var hasCallback = callback || execute;
                        if (hasCallback) {
                            var command = new Command_1.default(instance, client, names, callback || execute, configuration);
                            for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
                                var name_2 = names_1[_a];
                                this._commands.set(name_2, command);
                            }
                        }
                    }
                    client.on('message', function (message) {
                        var guild = message.guild;
                        var content = message.content;
                        var prefix = instance.getPrefix(guild);
                        if (content.startsWith(prefix)) {
                            content = content.substring(prefix.length);
                            var words = content.split(/ /g);
                            var firstElement = words.shift();
                            if (firstElement) {
                                var alias = firstElement.toLowerCase();
                                var command = _this._commands.get(alias);
                                if (command) {
                                    command.execute(message, words);
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
