///<reference path='../../lib/jquery.d.ts'/>
var app;
(function (app) {
    var Fps;
    (function (Fps) {
        var CSS = "\n#fps-display{\n\tleft: 10px; top: 10px;\n\tpadding: 2px 4px;\n\tposition: absolute;\n\tz-index: 100;\n\n\tbackground-color: #999;\n\tborder-radius: 3px;\n\tcolor: #FFF;\n\tcursor: default;\n\tfont: bold 11px/14px 'Helvetica Neue', Helvetica, Arial, sans-serif;\n\ttext-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n\tvertical-align: baseline;\n\twhite-space: nowrap;\n\tuser-select: none;\n}";
        var Display = (function () {
            function Display(fpsCallback) {
                var _this = this;
                if (fpsCallback === void 0) { fpsCallback = null; }
                this.onTimer = function () {
                    if (_this.fpsCallback) {
                        _this.$fpsText.text(_this.fpsCallback().toFixed(1));
                    }
                };
                this.fpsCallback = fpsCallback;
                this.$fps = $('<div id="fps-display"><span class="text">00</span> fps</div>');
                this.$fpsText = this.$fps.find('.text');
                document.body.appendChild(this.$fps[0]);
                var head = document.head || document.getElementsByTagName('head')[0];
                var style = document.createElement('style');
                style.type = 'text/css';
                if (style.styleSheet) {
                    style.styleSheet.cssText = CSS;
                }
                else {
                    style.appendChild(document.createTextNode(CSS));
                }
                head.appendChild(style);
                setInterval(this.onTimer, 500);
            }
            return Display;
        }());
        Fps.Display = Display;
    })(Fps = app.Fps || (app.Fps = {}));
})(app || (app = {}));
//# sourceMappingURL=FpsDisplay.js.map