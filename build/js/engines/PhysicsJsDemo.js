///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/physicsjs/physicsjs.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engines;
(function (engines) {
    var PhysicsJsDemo = (function (_super) {
        __extends(PhysicsJsDemo, _super);
        function PhysicsJsDemo() {
            _super.apply(this, arguments);
            this.name = 'PhysicsJs';
        }
        PhysicsJsDemo.prototype.setup = function () {
            var _this = this;
            _super.prototype.clear.call(this);
            this.autoClearCanvas = true;
            this.bodies = [];
            Physics({
                timestep: this.frameRateInterval * 1000
            }, function (world) {
                _this.world = world;
                _this.renderer = Physics.renderer('canvas', {
                    el: 'renderCanvas',
                    autoResize: false,
                    width: _this.canvas.width,
                    height: _this.canvas.height
                });
                _this.gravity = Physics.behavior('constant-acceleration');
                world.add([
                    _this.renderer,
                    _this.gravity,
                    Physics.behavior('body-impulse-response'),
                    Physics.behavior('body-collision-detection'),
                    Physics.behavior('sweep-prune'),
                    Physics.behavior('interactive', { el: _this.canvas }),
                    Physics.behavior('edge-collision-detection', {
                        aabb: Physics.aabb(0, 0, _this.stageWidth, _this.stageHeight),
                        restitution: 0.05
                    }),
                    _this.constraints = Physics.behavior('verlet-constraints', {
                        iterations: 3
                    })
                ]);
                world.on('interact:grab', _this.onBodyGrab.bind(_this));
            });
        };
        PhysicsJsDemo.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.clearCanvas();
            if (this.bodies.length) {
                this.world.remove(this.bodies);
                this.bodies = [];
            }
            this.constraints.drop();
        };
        PhysicsJsDemo.prototype.loadDemo = function (name) {
            _super.prototype.loadDemo.call(this, name);
        };
        PhysicsJsDemo.prototype.runInternal = function (deltaTime, timestamp) {
            this.world.step(timestamp);
            if (this._enableDrawing) {
                this.world.render();
            }
        };
        ;
        /*
         *** Utility Methods
         */
        PhysicsJsDemo.prototype.pinBody = function (body, pinned) {
            return body;
        };
        PhysicsJsDemo.prototype.createBody = function (x, y, shape, pinned) {
            throw new Error('PhysicsJs does not have the concept of shapes. createBody method not supported.');
        };
        PhysicsJsDemo.prototype.createBox = function (x, y, width, height, pinned) {
            var body = this.pinBody(Physics.body('rectangle', {
                x: x,
                y: y,
                width: width * 2,
                height: height * 2,
                restitution: 0.3
            }), pinned);
            this.bodies.push(body);
            return body;
        };
        PhysicsJsDemo.prototype.createCircle = function (x, y, radius, pinned) {
            var body = this.pinBody(Physics.body('circle', {
                x: x,
                y: y,
                radius: radius,
                restitution: 0.3
            }), pinned);
            this.bodies.push(body);
            return body;
        };
        PhysicsJsDemo.prototype.createFromData = function (x, y, data) {
            var WORLD_SCALE = this.worldScale;
            var DEG2RAD = 1 / (180 / Math.PI);
            var bodiesData = data.bodies;
            var jointsData = data.joints;
            var bodyRegistry = {};
            var bodies = [];
            x *= WORLD_SCALE;
            y *= WORLD_SCALE;
            if (bodiesData)
                for (var _i = 0, bodiesData_1 = bodiesData; _i < bodiesData_1.length; _i++) {
                    var bodyData = bodiesData_1[_i];
                    if (!bodyData.shape) {
                        continue;
                    }
                    var bodyType = void 0;
                    var options = {
                        x: x + bodyData.x * WORLD_SCALE,
                        y: y + bodyData.y * WORLD_SCALE
                    };
                    if (bodyData.type === undefined || bodyData.type === 'dynamic')
                        options.treatment = 'dynamic';
                    else if (bodyData.type === 'static')
                        options.treatment = 'static';
                    else if (bodyData.type === 'kinematic')
                        options.treatment = 'kinematic';
                    var shapeData = bodyData.shape;
                    var shapeType = shapeData.type;
                    if (shapeType === 'box') {
                        bodyType = 'rectangle';
                        options.width = shapeData.width * WORLD_SCALE;
                        options.height = shapeData.height * WORLD_SCALE;
                    }
                    else if (shapeType === 'circle') {
                        bodyType = 'circle';
                        options.radius = shapeData.radius * WORLD_SCALE;
                    }
                    else
                        console.error("Unsupported shape type \"" + shapeType + "\"");
                    // if(shapeData.density !== undefined)
                    // 	options.density = shapeData.density;
                    if (shapeData.friction !== undefined)
                        options.cof = shapeData.friction;
                    if (shapeData.restitution !== undefined)
                        options.restitution = shapeData.restitution;
                    var body = Physics.body(bodyType, options);
                    this.bodies.push(body);
                    bodies.push(body);
                    if (bodyData.id !== undefined) {
                        bodyRegistry[bodyData.id] = body;
                    }
                    if (bodyData.impulse) {
                        var impulse = void 0;
                        if (bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y')) {
                            impulse = bodyData.impulse;
                        }
                        else if (bodyData.impulse instanceof Array) {
                            impulse = { x: bodyData.impulse[0], y: bodyData.impulse[1] };
                        }
                        else if (bodyData.impulse instanceof Function) {
                            var impulseData = bodyData.impulse();
                            impulse = { x: impulseData[0], y: impulseData[1] };
                        }
                        if (impulse)
                            body.applyForce({ x: impulse.x / 10000 * WORLD_SCALE, y: impulse.y / 10000 * WORLD_SCALE });
                    }
                }
            this.world.add(bodies);
            if (jointsData)
                for (var _a = 0, jointsData_1 = jointsData; _a < jointsData_1.length; _a++) {
                    var jointData = jointsData_1[_a];
                    var type = jointData.type;
                    var body1 = bodyRegistry[jointData.body1];
                    var body2 = bodyRegistry[jointData.body2];
                    if (!body1 || !body2) {
                        console.error("Cannot find body with id \"" + (!body1 ? jointData.body1 : jointData.body2) + "\"");
                        continue;
                    }
                    if (type == 'revolute') {
                        this.constraints.distanceConstraint(body1, body2);
                    }
                    else {
                        console.error("Unsupported joint type \"" + type + "\"");
                    }
                }
        };
        /*
         *** Events
         */
        PhysicsJsDemo.prototype.onBodyGrab = function (data) {
            this.mouseAction = engines.MouseAction.Handled;
        };
        return PhysicsJsDemo;
    }(engines.DemoEngineBase));
    engines.PhysicsJsDemo = PhysicsJsDemo;
})(engines || (engines = {}));
//# sourceMappingURL=PhysicsJsDemo.js.map