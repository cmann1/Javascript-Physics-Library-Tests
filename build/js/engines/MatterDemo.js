///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/matter-js/matter-js.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engines;
(function (engines) {
    var Engine = Matter.Engine;
    var Render = Matter.Render;
    var World = Matter.World;
    var Bodies = Matter.Bodies;
    var Body = Matter.Body;
    var MouseConstraint = Matter.MouseConstraint;
    var Constraint = Matter.Constraint;
    var Events = Matter.Events;
    var Mouse = Matter.Mouse;
    var Vector = Matter.Vector;
    var MatterDemo = (function (_super) {
        __extends(MatterDemo, _super);
        function MatterDemo() {
            _super.apply(this, arguments);
            this.name = 'Matter';
            this.simulationTime = 0;
            this.elapsedTime = 0;
            this.mousePressed = false;
        }
        MatterDemo.prototype.setup = function () {
            _super.prototype.clear.call(this);
            this.engine = Engine.create({
                enableSleeping: true
            });
            this.world = this.engine.world;
            this.render = Render.create({
                canvas: this.canvas,
                engine: this.engine,
                options: {
                    showAngleIndicator: true,
                }
            });
            var w = this.stageWidth;
            var h = this.stageHeight;
            var hw = w / 2;
            var hh = h / 2;
            var t = 200;
            var ht = t / 2;
            var top = Bodies.rectangle(hw, -ht, w + t, t);
            var bot = Bodies.rectangle(hw, h + ht, w + t, t);
            var lef = Bodies.rectangle(-ht, hh, t, h + t);
            var rig = Bodies.rectangle(w + ht, hh, t, h + t);
            this.groundBody = Body.create({ parts: [top, bot, lef, rig], isStatic: true });
            this.mouseConstraint = MouseConstraint.create(this.engine, {
                mouse: Mouse.create(this.canvas)
            });
            this.mouseConstraint.constraint.stiffness = 0.75;
            this.mouseConstraint.constraint.angularStiffness = 0;
            this.frameRateIntervalMs = 1000 / this.frameRate;
            this.autoClearCanvas = true;
        };
        MatterDemo.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.simulationTime = 0;
            this.elapsedTime = 0;
            this.engine.enableSleeping = true;
            World.clear(this.world, false);
        };
        MatterDemo.prototype.loadDemo = function (name) {
            _super.prototype.loadDemo.call(this, name);
            World.add(this.world, this.groundBody);
            World.addConstraint(this.world, this.mouseConstraint.constraint);
        };
        MatterDemo.prototype.runInternal = function (deltaTime, timestamp) {
            if (deltaTime > 0.05) {
                deltaTime = 0.05;
            }
            this.simulationTime += deltaTime;
            if (this.mousePressed) {
                if (this.mouseConstraint.body) {
                    this.mouseAction = engines.MouseAction.Handled;
                }
            }
            // Keep on stepping forward by fixed time step until amount of time
            // needed has been simulated.
            while (this.elapsedTime < this.simulationTime) {
                Engine.update(this.engine, this.frameRateIntervalMs);
                this.elapsedTime += this.frameRateInterval;
            }
            Events.trigger(this.engine, 'tick', {
                timestamp: this.simulationTime * 1000
            });
            if (this._enableDrawing) {
                Render.world(this.render);
            }
        };
        ;
        /*
         *** Utility Methods
         */
        MatterDemo.prototype.pinBody = function (body, pinned) {
            if (pinned) {
                var joint = Constraint.create({
                    bodyB: body,
                    // pointA: Vector.create(0,0),
                    pointA: Vector.clone(body.position),
                });
                World.add(this.world, joint);
            }
            return body;
        };
        MatterDemo.prototype.createBody = function (x, y, shape, pinned) {
            throw new Error('MatterJs does not have the concept of shapes. createBody method not supported.');
        };
        MatterDemo.prototype.createBox = function (x, y, width, height, pinned) {
            var body = this.pinBody(Bodies.rectangle(x, y, width * 2, height * 2), pinned);
            World.add(this.world, body);
            return body;
        };
        MatterDemo.prototype.createCircle = function (x, y, radius, pinned) {
            var body = this.pinBody(Bodies.circle(x, y, radius), pinned);
            World.add(this.world, body);
            return body;
        };
        MatterDemo.prototype.createFromData = function (x, y, data) {
            var WORLD_SCALE = this.worldScale;
            var DEG2RAD = 1 / (180 / Math.PI);
            var bodiesData = data.bodies;
            var jointsData = data.joints;
            var bodyRegistry = {};
            // x *= WORLD_SCALE;
            // y *= WORLD_SCALE;
            if (bodiesData)
                for (var _i = 0, bodiesData_1 = bodiesData; _i < bodiesData_1.length; _i++) {
                    var bodyData = bodiesData_1[_i];
                    var isStatic = void 0;
                    var px = x + bodyData.x;
                    var py = y + bodyData.y;
                    var body = void 0;
                    if (!bodyData.shape)
                        continue;
                    if (bodyData.type === undefined || bodyData.type === 'dynamic')
                        isStatic = false;
                    else if (bodyData.type === 'static')
                        isStatic = true;
                    else if (bodyData.type === 'kinematic')
                        isStatic = false;
                    var shapeData = bodyData.shape;
                    var shapeType = shapeData.type;
                    var options = { isStatic: isStatic };
                    if (shapeType === 'box')
                        body = Bodies.rectangle(px, py, shapeData.width, shapeData.height, options);
                    else if (shapeType === 'circle')
                        body = Bodies.circle(px, py, shapeData.radius, options);
                    else
                        console.error("Unsupported shape type \"" + shapeType + "\"");
                    if (shapeData.density !== undefined)
                        body.density = shapeData.density;
                    if (shapeData.friction !== undefined)
                        body.friction = shapeData.friction;
                    if (shapeData.restitution !== undefined)
                        body.restitution = shapeData.restitution;
                    World.add(this.world, body);
                    if (bodyData.id !== undefined) {
                        bodyRegistry[bodyData.id] = body;
                    }
                    if (bodyData.impulse) {
                        var impulse = void 0;
                        if (bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y')) {
                            impulse = bodyData.impulse;
                        }
                        else if (bodyData.impulse instanceof Array) {
                            impulse = Vector.create(bodyData.impulse[0], bodyData.impulse[1]);
                        }
                        else if (bodyData.impulse instanceof Function) {
                            var impulseData = bodyData.impulse();
                            impulse = Vector.create(impulseData[0], impulseData[1]);
                        }
                        if (impulse)
                            Body.applyForce(body, Vector.create(px, py), Vector.create(impulse.x / 10000, impulse.y / 10000));
                    }
                }
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
                        var worldPivot = Vector.create(x + jointData.worldAnchorX, y + jointData.worldAnchorY);
                        var joint = Constraint.create({
                            bodyA: body1,
                            bodyB: body2,
                            pointA: MatterDemo.globalToLocal(body1, worldPivot),
                            pointB: MatterDemo.globalToLocal(body2, worldPivot),
                            stiffness: 0.1,
                            length: 2
                        });
                        World.add(this.world, joint);
                    }
                    else {
                        console.error("Unsupported joint type \"" + type + "\"");
                    }
                }
        };
        MatterDemo.globalToLocal = function (body, worldPoint, out) {
            if (out === void 0) { out = null; }
            if (!out) {
                out = Vector.create();
            }
            var sin = Math.sin(-body.angle);
            var cos = Math.cos(-body.angle);
            var x = worldPoint.x - body.position.x;
            var y = worldPoint.y - body.position.y;
            out.x = (x * cos - y * sin);
            out.y = (x * sin + y * cos);
            return out;
        };
        /*
         *** Events
         */
        MatterDemo.prototype.onPositionIterationsUpdate = function (iterations) {
            this.engine.positionIterations = iterations;
        };
        MatterDemo.prototype.onVelocityIterationsUpdate = function (iterations) {
            this.engine.velocityIterations = iterations;
        };
        return MatterDemo;
    }(engines.DemoEngineBase));
    engines.MatterDemo = MatterDemo;
})(engines || (engines = {}));
//# sourceMappingURL=MatterDemo.js.map