///<reference path='../../lib/jquery.d.ts'/>
///<reference path='../../lib/dat-gui.d.ts'/>
///<reference path='FpsDisplay.ts'/>
///<reference path='Ticker.ts'/>
///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>
var app;
(function (app) {
    var Ticker = app.ticker.Ticker;
    var NapeDemo = engines.NapeDemo;
    var P2JsDemo = engines.P2JsDemo;
    var MatterDemo = engines.MatterDemo;
    var PhysicsJsDemo = engines.PhysicsJsDemo;
    var Box2dWebDemo = engines.Box2dWebDemo;
    var Main = (function () {
        function Main() {
            var _this = this;
            this.engines = [];
            this.engineIndex = -1;
            this.currentDemo = 2;
            this.mouseX = 0;
            this.mouseY = 0;
            this.canvasRightMouseDown = false;
            this._enableDrawing = true;
            this.velocityIterations = 10;
            this.positionIterations = 10;
            /*
             *** Events
             */
            this.onVelIterationsChange = function (value) {
                _this.currentEngine.velocityIterations = _this.velocityIterations = value;
            };
            this.onPosIterationsChange = function (value) {
                _this.currentEngine.positionIterations = _this.positionIterations = value;
            };
            this.onCanvasMouseDown = function (event) {
                _this.currentEngine.handleMouseDown(event);
                if (event.button == 2) {
                    _this.canvasRightMouseDown = true;
                }
            };
            this.onCanvasMouseUp = function (event) {
                _this.currentEngine.handleMouseUp(event);
            };
            this.onWindowBlur = function () {
                _this.ticker.stop();
            };
            this.onWindowFocus = function () {
                _this.ticker.start();
            };
            this.onWindowContextMenu = function (event) {
                if (_this.canvasRightMouseDown || event.target == _this.canvas) {
                    _this.canvasRightMouseDown = false;
                    event.preventDefault();
                    return false;
                }
            };
            this.onWindowLoad = function () {
                _this.$canvas = $('#renderCanvas');
                _this.canvas = _this.$canvas[0];
                _this.$canvas.on('mousedown', _this.onCanvasMouseDown);
                _this.canvas.width = Main.CANVAS_WIDTH;
                _this.canvas.height = Main.CANVAS_HEIGHT;
                _this.fpsDisplay = new app.Fps.Display(_this.ticker.getFps);
                _this.initGui();
                _this.$engineDisplay = $('#engine-display');
                _this.$engineText = _this.$engineDisplay.find('.engine');
                _this.$demoText = _this.$engineDisplay.find('.demo');
                var frameRate = 60;
                _this.engines.push(new NapeDemo(_this.canvas, frameRate));
                _this.engines.push(new Box2dWebDemo(_this.canvas, frameRate));
                _this.engines.push(new P2JsDemo(_this.canvas, frameRate));
                _this.engines.push(new MatterDemo(_this.canvas, frameRate));
                _this.engines.push(new PhysicsJsDemo(_this.canvas, frameRate));
                _this.loadEngine(4);
                // this.loadEngine(this.engines.length - 1);
                $(window)
                    .on('focus', _this.onWindowFocus)
                    .on('blur', _this.onWindowBlur)
                    .on('mousemove', _this.onWindowMouseMove)
                    .on('mouseup', _this.onCanvasMouseUp)
                    .on('contextmenu', _this.onWindowContextMenu)
                    .focus();
                _this.ticker.start();
            };
            this.onWindowMouseMove = function (event) {
                var offset = _this.$canvas.offset();
                _this.mouseX = _this.currentEngine.mouseX = event.pageX - offset.left;
                _this.mouseY = _this.currentEngine.mouseY = event.pageY - offset.top;
            };
            window.addEventListener('DOMContentLoaded', this.onWindowLoad);
            this.ticker = new Ticker();
        }
        Main.prototype.initGui = function () {
            var buttons = [];
            var gui = new dat.GUI();
            var prevEngine = gui.add(this, 'prevEngine');
            var nextEngine = gui.add(this, 'nextEngine');
            var prevDemo = gui.add(this, 'prevDemo');
            var nextDemo = gui.add(this, 'nextDemo');
            buttons.push(gui.add(this, 'restart'));
            gui.add(this, 'enableDrawing');
            prevEngine.name('◀ prevEngine');
            nextEngine.name('nextEngine ▶');
            prevDemo.name('◀ prevDemo');
            nextDemo.name('nextDemo ▶');
            this.velIterations = gui.add(this, 'velocityIterations', 1, 50);
            this.posIterations = gui.add(this, 'positionIterations', 1, 50);
            this.velIterations.onFinishChange(this.onVelIterationsChange);
            this.posIterations.onFinishChange(this.onPosIterationsChange);
            $([
                prevEngine.domElement.parentNode.parentNode,
                nextEngine.domElement.parentNode.parentNode,
                prevDemo.domElement.parentNode.parentNode,
                nextDemo.domElement.parentNode.parentNode
            ])
                .addClass('dgui-two-column-btn dg-button-row');
            for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
                var button = buttons_1[_i];
                $(button.domElement.parentNode.parentNode).addClass('dg-button-row');
            }
        };
        Main.prototype.loadEngine = function (index) {
            if (index < 0)
                index = this.engines.length - 1;
            else if (index >= this.engines.length)
                index = 0;
            if (index == this.engineIndex) {
                return;
            }
            if (this.currentEngine) {
                this.currentEngine.clear();
                this.ticker.tickCallback = null;
            }
            this.engineIndex = index;
            this.currentEngine = this.engines[index];
            this.currentEngine.mouseX = this.mouseX;
            this.currentEngine.mouseY = this.mouseY;
            this.currentEngine.enableDrawing = this.enableDrawing;
            this.currentEngine.loadDemo(Main.DEMO_NAMES[this.currentDemo]);
            this.ticker.tickCallback = this.currentEngine.run;
            this.updateEngineDisplay();
            this.updateIterations();
        };
        Main.prototype.loadDemo = function (index) {
            if (index >= Main.DEMO_NAMES.length)
                index = 0;
            else if (index < 0)
                index = Main.DEMO_NAMES.length - 1;
            this.currentDemo = index;
            this.currentEngine.loadDemo(Main.DEMO_NAMES[this.currentDemo]);
            this.updateEngineDisplay();
            this.updateIterations();
        };
        Main.prototype.prevEngine = function () {
            this.loadEngine(this.engineIndex - 1);
        };
        Main.prototype.nextEngine = function () {
            this.loadEngine(this.engineIndex + 1);
        };
        Main.prototype.prevDemo = function () {
            this.loadDemo(this.currentDemo - 1);
        };
        Main.prototype.nextDemo = function () {
            this.loadDemo(this.currentDemo + 1);
        };
        Object.defineProperty(Main.prototype, "enableDrawing", {
            get: function () {
                return this._enableDrawing;
            },
            set: function (value) {
                this._enableDrawing = value;
                this.currentEngine.enableDrawing = value;
            },
            enumerable: true,
            configurable: true
        });
        Main.prototype.restart = function () {
            this.loadDemo(this.currentDemo);
        };
        Main.prototype.updateEngineDisplay = function () {
            var engineName = this.currentEngine.name;
            this.$engineText.text(engineName + " (" + (this.engineIndex + 1) + "/" + this.engines.length + ")");
            this.$demoText.text(Main.DEMO_NAMES[this.currentDemo] + " (" + (this.currentDemo + 1) + "/" + Main.DEMO_NAMES.length + ")");
            // this.$engineDisplay.stop(true).show().css('opacity', 1).delay(2000).animate(
            // 	{ opacity: 0},
            // 	{ delay: 250, complete: () => {this.$engineDisplay.hide()}});
        };
        Main.prototype.updateIterations = function () {
            this.velocityIterations = this.currentEngine.velocityIterations;
            this.positionIterations = this.currentEngine.positionIterations;
            this.velIterations.updateDisplay();
            this.posIterations.updateDisplay();
        };
        Main.CANVAS_WIDTH = 800;
        Main.CANVAS_HEIGHT = 600;
        Main.DEMO_NAMES = [
            'Basic',
            'Constraints',
            'Ragdolls',
            'Stress',
        ];
        return Main;
    }());
    app.Main = Main;
    //noinspection JSUnusedLocalSymbols
    app.main = new Main();
})(app || (app = {}));
//# sourceMappingURL=Main.js.map