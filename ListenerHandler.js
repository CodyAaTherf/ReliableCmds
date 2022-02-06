"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var fs_1 = __importDefault(require("fs"));
var get_all_files_1 = __importDefault(require("./get-all-files"));
var ListenerHandler = /** @class */ (function () {
    function ListenerHandler(client, dir) {
        if (dir) {
            if (fs_1.default.existsSync(dir)) {
                var files = (0, get_all_files_1.default)(dir);
                console.log('Listener files: ', files);
                var amount = files.length;
                if (amount > 0) {
                    console.log("Loading ".concat(amount, " listeners"));
                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                        var _a = files_1[_i], file = _a[0], fileName = _a[1];
                        var func = require(file);
                        var feature = func.feature;
                        if (!feature) {
                            throw new Error("Listener ".concat(fileName, " has no feature property."));
                        }
                        var name_1 = feature.name, canDisable = feature.canDisable, notFeature = feature.notFeature;
                        if (notFeature === true) {
                            continue;
                        }
                        if (name_1 === undefined || canDisable === undefined) {
                            throw new Error("Listener ".concat(fileName, " has no name or canDisable property."));
                        }
                        if (typeof func === 'function') {
                            func(client);
                        }
                    }
                }
            }
            else {
                throw new Error("Listener directory ".concat(dir, " does not exist"));
            }
        }
    }
    return ListenerHandler;
}());
module.exports = ListenerHandler;
