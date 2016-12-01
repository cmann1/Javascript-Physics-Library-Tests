var app;
(function (app) {
    var ticker;
    (function (ticker) {
        var Ticker = (function () {
            function Ticker(runner, targetFps) {
                var _this = this;
                if (runner === void 0) { runner = null; }
                if (targetFps === void 0) { targetFps = 60; }
                this.isRunning = false;
                this.measuredFps = 0;
                this.frameCount = 0;
                this.frameCountPrevTime = 0;
                this.getFps = function () {
                    return _this.isRunning
                        ? (_this.currentTime != _this.frameCountPrevTime ? _this.frameCount / ((_this.currentTime - _this.frameCountPrevTime) / 1000) : _this.measuredFps)
                        : 0;
                };
                this.run = function (time) {
                    if (!_this.isRunning)
                        return;
                    requestAnimationFrame(_this.run);
                    _this.currentTime = time;
                    var elapsedTime = time - _this.previousTime;
                    if (elapsedTime > _this.fpsInterval) {
                        _this.previousTime = time - (elapsedTime % _this.fpsInterval);
                        _this._tickCallback(elapsedTime * 0.001, time);
                        // Update/measure the fps every 1 second
                        _this.frameCount++;
                        if (time - _this.frameCountPrevTime >= 1000) {
                            _this.measuredFps = _this.frameCount / ((_this.currentTime - _this.frameCountPrevTime) / 1000);
                            _this.frameCountPrevTime = time;
                            _this.frameCount = 0;
                        }
                    }
                };
                this.targetFps = targetFps;
                this.tickCallback = runner;
            }
            Ticker.EMPTY_RUNNER = function (deltatTime) { };
            ;
            Object.defineProperty(Ticker.prototype, "tickCallback", {
                get: function () {
                    return this._tickCallback;
                },
                set: function (callback) {
                    if (!callback)
                        callback = Ticker.EMPTY_RUNNER;
                    this._tickCallback = callback;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Ticker.prototype, "targetFps", {
                get: function () {
                    return this._targetFps;
                },
                set: function (newTargetFps) {
                    if (isNaN(newTargetFps))
                        newTargetFps = 60;
                    else if (newTargetFps < 0)
                        newTargetFps = 0;
                    this._targetFps = newTargetFps;
                    this.fpsInterval = 1000 / newTargetFps;
                },
                enumerable: true,
                configurable: true
            });
            Ticker.prototype.start = function () {
                this.isRunning = true;
                this.frameCountPrevTime = 0;
                this.frameCount = 0;
                this.previousTime = this.frameCountPrevTime = performance.now();
                this.run(this.previousTime);
            };
            Ticker.prototype.stop = function () {
                this.isRunning = false;
            };
            return Ticker;
        }());
        ticker.Ticker = Ticker;
    })(ticker = app.ticker || (app.ticker = {}));
})(app || (app = {}));
//# sourceMappingURL=Ticker.js.map