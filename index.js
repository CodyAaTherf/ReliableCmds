"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var CommandHandler_1 = __importDefault(require("./CommandHandler"));
var ListenerHandler_1 = __importDefault(require("./ListenerHandler"));
var ReliableCmds = /** @class */ (function () {
    function ReliableCmds(client, commandsDir, listenerDir) {
        this._defualtPrefix = ">";
        this._commandsDir = 'commands';
        this._mongo = '';
        this._prefixes = {};
        if (!client) {
            throw new Error('No Discord.JS Client provided');
        }
        if (!commandsDir) {
            console.warn("No commands directory provided , defaulting to ".concat(this._commandsDir));
        }
        if (module && module.parent) {
            // @ts-ignore
            var path = module.parent.path;
            if (path) {
                commandsDir = "".concat(path, "/").concat(this._commandsDir);
                if (listenerDir) {
                    listenerDir = "".concat(path, "/").concat(listenerDir);
                }
            }
        }
        this._commandsDir = commandsDir || this._commandsDir;
        this._listenerDir = listenerDir || this._listenerDir;
        this._commandHandler = new CommandHandler_1.default(this, client, this._commandsDir);
        if (this._listenerDir) {
            new ListenerHandler_1.default(client, this._listenerDir);
        }
    }
    Object.defineProperty(ReliableCmds.prototype, "mongoPath", {
        get: function () {
            return this._mongo;
        },
        enumerable: false,
        configurable: true
    });
    ReliableCmds.prototype.setMongoPath = function (mongoPath) {
        this._mongo = mongoPath;
        return this;
    };
    Object.defineProperty(ReliableCmds.prototype, "prefixes", {
        get: function () {
            return this._prefixes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReliableCmds.prototype, "defaultPrefix", {
        get: function () {
            return this._defualtPrefix;
        },
        enumerable: false,
        configurable: true
    });
    ReliableCmds.prototype.setDefaultPrefix = function (prefix) {
        this._defualtPrefix = prefix;
        return this;
    };
    ReliableCmds.prototype.getPrefix = function (guild) {
        return this._prefixes[guild ? guild.id : ''] || this._defualtPrefix;
    };
    Object.defineProperty(ReliableCmds.prototype, "commands", {
        get: function () {
            return this._commandHandler.commands;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReliableCmds.prototype, "CommandAmount", {
        get: function () {
            return this.commands.length;
        },
        enumerable: false,
        configurable: true
    });
    return ReliableCmds;
}());
module.exports = ReliableCmds;
