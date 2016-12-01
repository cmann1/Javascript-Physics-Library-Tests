var utils;
(function (utils) {
    function applyDefaults(input, defaults) {
        for (var attr in defaults) {
            if (defaults.hasOwnProperty(attr) && !input.hasOwnProperty(attr))
                input[attr] = defaults[attr];
        }
        return input;
    }
    utils.applyDefaults = applyDefaults;
})(utils || (utils = {}));
//# sourceMappingURL=Utils.js.map