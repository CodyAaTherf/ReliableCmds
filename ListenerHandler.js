"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var ListenerHandler = /** @class */ (function () {
    function ListenerHandler(client, dir) {
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                var files = fs_1.default
                    .readdirSync(dir)
                    .filter(function (file) { return file.endsWith('.js'); });
                var amount = files.length;
                if (amount > 0) {
                    console.log("Loading ".concat(amount, " listeners"));
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var file = files_1[_i];
                        var path = "".concat(dir, "/").concat(file);
                        var func = require(path);
                        if (typeof func === 'function') {
                            func(client);
                        }
                    }
                }
            }
            else {
                throw new Error("Listner directory ".concat(dir, " does not exist"));
            }
        }
    }
    return ListenerHandler;
}());
module.exports = ListenerHandler;
