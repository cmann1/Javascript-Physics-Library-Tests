///<reference path='../overlay/Overlay.ts'/>
var engines;
(function (engines) {
    var Overlay = overlay.Overlay;
    var OverlayIcons = overlay.OverlayIcons;
    (function (VertFormat) {
        VertFormat[VertFormat["Array"] = 0] = "Array";
        VertFormat[VertFormat["Vector"] = 1] = "Vector";
    })(engines.VertFormat || (engines.VertFormat = {}));
    var VertFormat = engines.VertFormat;
    (function (MouseAction) {
        MouseAction[MouseAction["Idle"] = 0] = "Idle";
        MouseAction[MouseAction["Handled"] = 1] = "Handled";
    })(engines.MouseAction || (engines.MouseAction = {}));
    var MouseAction = engines.MouseAction;
    var DemoEngineBase = (function () {
        function DemoEngineBase(canvas, frameRate) {
            var _this = this;
            this.name = 'INVALID';
            this._velocityIterations = 10;
            this._positionIterations = 10;
            this.mouseX = 0;
            this.mouseY = 0;
            /**
             * The scale used when rendering to convert from world coordinates to pixels.
             * Do not modify directly, instead use setDrawScale()
             * @type {number}
             */
            this.drawScale = 1;
            /**
             * Used to convert from pixels to world coordinates.
             * It's useful when creating demos for multiple engines to specify all units in pixels multiplied by worldScale so that the same values
             * can be used for all engines.
             * Automatically calculated during setWorldScale(). Equals 1 / drawScale.
             * @type {number}
             */
            this.worldScale = 1;
            this._enableDrawing = true;
            this.autoClearCanvas = false;
            this.mousePressed = false;
            /**
             * Runs this demo. Demos must not override this method and use runInternal instead.
             * @param deltaTime
             * @param timestamp
             */
            this.run = function (deltaTime, timestamp) {
                _this.runInternal(deltaTime, timestamp);
                if (_this._enableDrawing) {
                    _this.renderOverlays();
                }
            };
            this.canvas = canvas;
            this.context = this.canvas.getContext('2d');
            this.stageWidth = canvas.width;
            this.stageHeight = canvas.height;
            this.frameRate = frameRate;
            this.frameRateInterval = 1 / frameRate;
            Overlay.bounds.set(0, 0, this.stageWidth, this.stageHeight);
            this.setup();
        }
        /**
         * super.clear() is required for all Demos overriding this method
         */
        DemoEngineBase.prototype.clear = function () {
            this.overlays = [];
            this.demoMouseDownHook = null;
        };
        DemoEngineBase.prototype.clearCanvas = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        DemoEngineBase.prototype.loadDemo = function (name) {
            this.clear();
            var demoFunc = this['loadDemo' + name];
            if (demoFunc) {
                demoFunc.call(this);
            }
            else {
                this.addWarning(this.stageWidth / 2, 20, "Cannot find \"" + name + "\" demo for \"" + this.name + "\" engine");
            }
        };
        DemoEngineBase.prototype.renderOverlays = function () {
            var context = this.context;
            for (var _i = 0, _a = this.overlays; _i < _a.length; _i++) {
                var overlay_1 = _a[_i];
                overlay_1.render(context);
            }
        };
        DemoEngineBase.prototype.setDrawScale = function (newScale) {
            this.drawScale = newScale;
            this.worldScale = 1 / newScale;
        };
        Object.defineProperty(DemoEngineBase.prototype, "enableDrawing", {
            /*
             *** Getters, Setters
             */
            get: function () {
                return this._enableDrawing;
            },
            set: function (value) {
                this._enableDrawing = value;
                if (!value) {
                    if (this.autoClearCanvas) {
                        this.clearCanvas();
                    }
                    this.onDisableDrawing();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DemoEngineBase.prototype, "positionIterations", {
            get: function () {
                return this._positionIterations;
            },
            set: function (value) {
                if (this._positionIterations == value)
                    return;
                this._positionIterations = value;
                this.onPositionIterationsUpdate(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DemoEngineBase.prototype, "velocityIterations", {
            get: function () {
                return this._velocityIterations;
            },
            set: function (value) {
                if (this._velocityIterations == value)
                    return;
                this._velocityIterations = value;
                this.onVelocityIterationsUpdate(value);
            },
            enumerable: true,
            configurable: true
        });
        /*
         *** Utility Methods
         */
        DemoEngineBase.prototype.addOverlay = function (x, y, message, icon, options) {
            if (icon === void 0) { icon = null; }
            this.overlays.push(new Overlay(x, y, message, icon, options));
            return this.overlays[this.overlays.length - 1];
        };
        DemoEngineBase.prototype.addWarning = function (x, y, message, options) {
            this.overlays.push(new Overlay(x, y, message, OverlayIcons.Warning, options));
            return this.overlays[this.overlays.length - 1];
        };
        DemoEngineBase.prototype.addInfo = function (x, y, message, options) {
            this.overlays.push(new Overlay(x, y, message, OverlayIcons.Info, options));
            return this.overlays[this.overlays.length - 1];
        };
        DemoEngineBase.Box = function (x, y, w, h, format, VertexClass) {
            if (format === void 0) { format = VertFormat.Array; }
            if (VertexClass === void 0) { VertexClass = null; }
            var vertices = [];
            var useArray = format == VertFormat.Array;
            var hw = w / 2;
            var hh = h / 2;
            var boxVertices = [
                x + hw, y + hh,
                x - hw, y + hh,
                x - hw, y - hh,
                x + hw, y - hh
            ];
            for (var a = 0; a < 8; a += 2) {
                var x_1 = boxVertices[a];
                var y_1 = boxVertices[a + 1];
                if (VertexClass)
                    vertices.push(new VertexClass(x_1, y_1));
                else
                    vertices.push(useArray ? [x_1, y_1] : { x: x_1, y: y_1 });
            }
            return vertices;
        };
        DemoEngineBase.Regular = function (xRadius, yRadius, edgeCount, angleOffset, format, VertexClass) {
            if (angleOffset === void 0) { angleOffset = 0; }
            if (format === void 0) { format = VertFormat.Array; }
            if (VertexClass === void 0) { VertexClass = null; }
            var vertices = [];
            var useArray = format == VertFormat.Array;
            for (var a = 0; a < edgeCount; a++) {
                var x = xRadius * Math.cos(angleOffset + 2 * Math.PI * (a / edgeCount));
                var y = yRadius * Math.sin(angleOffset + 2 * Math.PI * (a / edgeCount));
                if (VertexClass)
                    vertices.push(new VertexClass(x, y));
                else
                    vertices.push(useArray ? [x, y] : { x: x, y: y });
            }
            return vertices;
        };
        DemoEngineBase.drawCircle = function (context, x, y, radius) {
            context.moveTo(x, y);
            context.arc(x, y, radius, 0, 2 * Math.PI, false);
        };
        /*
         *** Events
         */
        DemoEngineBase.prototype.onDisableDrawing = function () { };
        DemoEngineBase.prototype.onPositionIterationsUpdate = function (iterations) { };
        DemoEngineBase.prototype.onVelocityIterationsUpdate = function (iterations) { };
        DemoEngineBase.prototype.handleMouseDown = function (event) {
            this.mousePressed = true;
            this.onMouseDown();
            if (this.demoMouseDownHook && this.mouseAction == MouseAction.Idle)
                this.demoMouseDownHook();
        };
        DemoEngineBase.prototype.handleMouseUp = function (event) {
            this.mousePressed = false;
            this.onMouseUp();
            if (this.demoMouseUpHook && this.mouseAction == MouseAction.Idle)
                this.demoMouseUpHook();
            this.mouseAction = MouseAction.Idle;
        };
        DemoEngineBase.prototype.onMouseDown = function () { };
        DemoEngineBase.prototype.onMouseUp = function () { };
        return DemoEngineBase;
    }());
    engines.DemoEngineBase = DemoEngineBase;
})(engines || (engines = {}));
//# sourceMappingURL=DemoEngineBase.js.map