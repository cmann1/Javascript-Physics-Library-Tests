///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/p2js/p2.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engines;
(function (engines) {
    var World = p2.World;
    var Body = p2.Body;
    var Box = p2.Box;
    var Shape = p2.Shape;
    var Circle = p2.Circle;
    var RevoluteConstraint = p2.RevoluteConstraint;
    var Constraint = p2.Constraint;
    var vec2 = p2.vec2;
    var P2JsDemo = (function (_super) {
        __extends(P2JsDemo, _super);
        function P2JsDemo() {
            _super.apply(this, arguments);
            this.name = 'P2Js';
            this.maxSubSteps = 10;
            this.pickPrecision = 5;
        }
        P2JsDemo.prototype.setup = function () {
            this.drawScaleVec2 = [1, 1];
            this.setDrawScale(100);
            this.world = new World();
            if (!this.nullBody) {
                this.nullBody = new Body();
            }
            this.autoClearCanvas = true;
        };
        P2JsDemo.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.world.clear();
        };
        P2JsDemo.prototype.loadDemo = function (name) {
            var WORLD_SCALE = this.worldScale;
            _super.prototype.loadDemo.call(this, name);
            this.world.sleepMode = World.ISLAND_SLEEPING;
            this.world.islandSplit = true;
            this.world.addBody(this.nullBody);
            var w = this.stageWidth * WORLD_SCALE;
            var h = this.stageHeight * WORLD_SCALE;
            var hw = w / 2;
            var hh = h / 2;
            var t = 200 * WORLD_SCALE;
            var ht = t / 2;
            var groundBody = new Body({ mass: 0 }); // Setting mass to 0 makes it static
            groundBody.addShape(new Box({ width: w, height: t }), [hw, 0 - ht]);
            groundBody.addShape(new Box({ width: w, height: t }), [hw, h + ht]);
            groundBody.addShape(new Box({ width: t, height: h }), [0 - ht, hh]);
            groundBody.addShape(new Box({ width: t, height: h }), [w + ht, hh]);
            this.world.addBody(groundBody);
        };
        P2JsDemo.prototype.runInternal = function (deltaTime, timestamp) {
            if (this.handJoint) {
                this.handJoint.pivotA[0] = this.mouseX * this.worldScale;
                this.handJoint.pivotA[1] = this.mouseY * this.worldScale;
                this.handJoint.bodyA.wakeUp();
                this.handJoint.bodyB.wakeUp();
            }
            this.world.step(this.frameRateInterval, deltaTime, this.maxSubSteps);
            if (this._enableDrawing) {
                this.render();
            }
        };
        ;
        P2JsDemo.prototype.setDrawScale = function (newScale) {
            _super.prototype.setDrawScale.call(this, newScale);
            this.drawScaleVec2[0] = this.drawScaleVec2[1] = newScale;
        };
        /*
         *** Rendering Methods
         */
        P2JsDemo.prototype.render = function () {
            var context = this.context;
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderBodies(this.world, context);
            this.renderConstraints(this.world, context);
        };
        //noinspection JSMethodCanBeStatic
        P2JsDemo.prototype.renderBodies = function (world, context) {
            var DRAW_SCALE = this.drawScale;
            var bodies = world.bodies;
            for (var _i = 0, bodies_1 = bodies; _i < bodies_1.length; _i++) {
                var body = bodies_1[_i];
                var shapes = body.shapes;
                var bodyAngle = body.interpolatedAngle;
                var bodyX = body.interpolatedPosition[0];
                var bodyY = body.interpolatedPosition[1];
                var sleep = body.sleepState == Body.SLEEPING;
                for (var _a = 0, shapes_1 = shapes; _a < shapes_1.length; _a++) {
                    var shape = shapes_1[_a];
                    var x = (bodyX + shape.position[0]) * DRAW_SCALE;
                    var y = (bodyY + shape.position[1]) * DRAW_SCALE;
                    var angle = bodyAngle + shape.angle;
                    var type = shape.type;
                    context.beginPath();
                    switch (type) {
                        case Shape.CIRCLE:
                            context.moveTo(x, y);
                            context.arc(x, y, shape.radius * DRAW_SCALE, angle, angle + 2 * Math.PI, false);
                            break;
                        case Shape.BOX:
                        case Shape.CONVEX:
                            var angleSin = Math.sin(angle);
                            var angleCos = Math.cos(angle);
                            var vertices = shape.vertices;
                            var vx = void 0, vy = void 0;
                            for (var a in vertices) {
                                var vert = vertices[a];
                                var localX = vert[0] * DRAW_SCALE;
                                var localY = vert[1] * DRAW_SCALE;
                                vx = localX * angleCos - localY * angleSin;
                                vy = localX * angleSin + localY * angleCos;
                                context.lineTo(x + vx, y + vy);
                            }
                            context.closePath();
                            context.moveTo(x, y);
                            context.lineTo(x + vx, y + vy);
                            break;
                    }
                    context.strokeStyle = P2JsDemo.Colour(shape.id, sleep);
                    context.stroke();
                }
            }
        };
        //noinspection JSMethodCanBeStatic
        P2JsDemo.prototype.renderConstraints = function (world, context) {
            var constraints = world.constraints;
            for (var _i = 0, constraints_1 = constraints; _i < constraints_1.length; _i++) {
                var constraint = constraints_1[_i];
                switch (constraint.type) {
                    case Constraint.REVOLUTE:
                        this.renderRevoluteConstraint(context, constraint);
                        break;
                    case Constraint.LOCK:
                        this.renderLockConstraint(context, constraint);
                        break;
                    case Constraint.DISTANCE:
                        this.renderDistanceConstraint(context, constraint);
                        break;
                    case Constraint.PRISMATIC:
                        this.renderPrismaticConstraint(context, constraint);
                        break;
                }
            }
        };
        //noinspection JSMethodCanBeStatic
        P2JsDemo.prototype.renderRevoluteConstraint = function (context, joint) {
            var pivotA = [];
            var pivotB = [];
            joint.bodyA.toWorldFrame(pivotA, joint.pivotA);
            joint.bodyB.toWorldFrame(pivotB, joint.pivotB);
            vec2.multiply(pivotA, pivotA, this.drawScaleVec2);
            vec2.multiply(pivotB, pivotB, this.drawScaleVec2);
            context.beginPath();
            context.moveTo(pivotA[0], pivotA[1]);
            context.lineTo(pivotB[0], pivotB[1]);
            context.strokeStyle = '#F0F';
            context.stroke();
            context.beginPath();
            engines.DemoEngineBase.drawCircle(context, pivotA[0], pivotA[1], 2);
            engines.DemoEngineBase.drawCircle(context, pivotB[0], pivotB[1], 2);
            context.fillStyle = '#F00';
            context.fill();
        };
        //noinspection JSMethodCanBeStatic
        P2JsDemo.prototype.renderLockConstraint = function (context, joint) {
            var pivotA = [];
            var pivotB = [];
            vec2.multiply(pivotA, joint.bodyA.position, this.drawScaleVec2);
            vec2.multiply(pivotB, joint.bodyB.position, this.drawScaleVec2);
            context.beginPath();
            context.moveTo(pivotA[0], pivotA[1]);
            context.lineTo(pivotB[0], pivotB[1]);
            context.strokeStyle = '#0FF';
            context.stroke();
            context.beginPath();
            engines.DemoEngineBase.drawCircle(context, pivotA[0], pivotA[1], 2);
            context.fillStyle = '#F00';
            context.fill();
        };
        //noinspection JSMethodCanBeStatic
        P2JsDemo.prototype.renderDistanceConstraint = function (context, joint) {
            var pivotA = [];
            var pivotB = [];
            joint.bodyA.toWorldFrame(pivotA, joint.localAnchorA);
            joint.bodyB.toWorldFrame(pivotB, joint.localAnchorB);
            vec2.multiply(pivotA, pivotA, this.drawScaleVec2);
            vec2.multiply(pivotB, pivotB, this.drawScaleVec2);
            var x1 = pivotA[0];
            var y1 = pivotA[1];
            var x2 = pivotB[0];
            var y2 = pivotB[1];
            var dx = x2 - x1;
            var dy = y2 - y1;
            var length = Math.sqrt(dx * dx + dy * dy);
            var mx = x1 + dx * 0.5;
            var my = y1 + dy * 0.5;
            var ndx = dx / length;
            var ndy = dy / length;
            var minLength = joint.lowerLimitEnabled ? joint.lowerLimit * this.drawScale : 0;
            var maxLength = joint.upperLimitEnabled ? joint.upperLimit * this.drawScale : length;
            var lx1 = mx - ndx * minLength * 0.5;
            var ly1 = my - ndy * minLength * 0.5;
            var lx2 = mx + ndx * minLength * 0.5;
            var ly2 = my + ndy * minLength * 0.5;
            var ux1 = mx - ndx * maxLength * 0.5;
            var uy1 = my - ndy * maxLength * 0.5;
            var ux2 = mx + ndx * maxLength * 0.5;
            var uy2 = my + ndy * maxLength * 0.5;
            context.beginPath();
            context.moveTo(ux1, uy1);
            context.lineTo(lx1, ly1);
            context.moveTo(lx2, ly2);
            context.lineTo(ux2, uy2);
            context.strokeStyle = '#0FF';
            context.stroke();
            if (joint.lowerLimitEnabled) {
                context.beginPath();
                context.moveTo(lx1, ly1);
                context.lineTo(lx2, ly2);
                context.strokeStyle = '#FF0';
                context.stroke();
            }
            context.beginPath();
            engines.DemoEngineBase.drawCircle(context, x1, y1, 2);
            context.fillStyle = '#F00';
            context.fill();
            context.beginPath();
            engines.DemoEngineBase.drawCircle(context, x2, y2, 2);
            context.fillStyle = '#00F';
            context.fill();
        };
        //noinspection JSMethodCanBeStatic
        P2JsDemo.prototype.renderPrismaticConstraint = function (context, joint) {
            var pivotA = [];
            var pivotB = [];
            var localAxis = [];
            joint.bodyA.toWorldFrame(pivotA, joint.localAnchorA);
            joint.bodyB.toWorldFrame(pivotB, joint.localAnchorB);
            vec2.rotate(localAxis, joint.localAxisA, joint.bodyA.angle);
            vec2.multiply(pivotA, pivotA, this.drawScaleVec2);
            vec2.multiply(pivotB, pivotB, this.drawScaleVec2);
            vec2.normalize(localAxis, localAxis);
            var x1 = pivotA[0];
            var y1 = pivotA[1];
            var x2 = pivotB[0];
            var y2 = pivotB[1];
            var dx = localAxis[0];
            var dy = localAxis[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            var ndx = dx / length;
            var ndy = dy / length;
            var minLength = joint.lowerLimitEnabled ? joint.lowerLimit * this.drawScale : 0;
            var maxLength = joint.upperLimitEnabled ? joint.upperLimit * this.drawScale : length;
            var lx = x1 + ndx * minLength;
            var ly = y1 + ndy * minLength;
            var ux = x1 + ndx * maxLength;
            var uy = y1 + ndy * maxLength;
            context.beginPath();
            context.moveTo(lx, ly);
            context.lineTo(x2, y2);
            context.strokeStyle = '#FF0';
            context.stroke();
            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(ux, uy);
            context.strokeStyle = '#0FF';
            context.stroke();
            context.beginPath();
            engines.DemoEngineBase.drawCircle(context, x1, y1, 2);
            context.fillStyle = '#F00';
            context.fill();
            context.beginPath();
            engines.DemoEngineBase.drawCircle(context, x2, y2, 2);
            context.fillStyle = '#00F';
            context.fill();
        };
        /*
         *** Utility Methods
         */
        P2JsDemo.prototype.pinBody = function (body, pinned) {
            if (pinned) {
                var pin = new RevoluteConstraint(body, this.nullBody, {
                    worldPivot: body.position
                });
                this.world.addConstraint(pin);
                body._pin = pin;
            }
            return body;
        };
        P2JsDemo.prototype.createBody = function (x, y, shape, pinned) {
            var body = new Body({ mass: 1 });
            body.position = [x, y];
            body.addShape(shape);
            this.world.addBody(body);
            return this.pinBody(body, pinned);
        };
        P2JsDemo.prototype.createBox = function (x, y, width, height, pinned) {
            return this.createBody(x, y, new Box({ width: width * 2, height: height * 2 }), pinned);
        };
        P2JsDemo.prototype.createCircle = function (x, y, radius, pinned) {
            return this.createBody(x, y, new Circle({ radius: radius }), pinned);
        };
        P2JsDemo.prototype.createFromData = function (x, y, data) {
            var WORLD_SCALE = this.worldScale;
            var DEG2RAD = 1 / (180 / Math.PI);
            var bodiesData = data.bodies;
            var jointsData = data.joints;
            var bodyRegistry = {};
            x *= WORLD_SCALE;
            y *= WORLD_SCALE;
            if (bodiesData)
                for (var _i = 0, bodiesData_1 = bodiesData; _i < bodiesData_1.length; _i++) {
                    var bodyData = bodiesData_1[_i];
                    var body = new Body({
                        position: [x + bodyData.x * WORLD_SCALE, y + bodyData.y * WORLD_SCALE],
                        mass: 1
                    });
                    if (bodyData.type === undefined || bodyData.type === 'dynamic')
                        body.type = Body.DYNAMIC;
                    else if (bodyData.type === 'static')
                        body.type = Body.STATIC;
                    else if (bodyData.type === 'kinematic')
                        body.type = Body.KINEMATIC;
                    this.world.addBody(body);
                    if (bodyData.id !== undefined) {
                        bodyRegistry[bodyData.id] = body;
                    }
                    if (bodyData.shape) {
                        var shapeData = bodyData.shape;
                        var shapeType = shapeData.type;
                        if (shapeType === 'box')
                            body.addShape(new Box({ width: shapeData.width * WORLD_SCALE, height: shapeData.height * WORLD_SCALE }));
                        else if (shapeType === 'circle')
                            body.addShape(new Circle({ radius: shapeData.radius * WORLD_SCALE }));
                        else
                            console.error("Unsupported shape type \"" + shapeType + "\"");
                    }
                    if (bodyData.impulse) {
                        var impulse = void 0;
                        if (bodyData.impulse instanceof Array) {
                            impulse = bodyData.impulse;
                        }
                        else if (bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y')) {
                            impulse = [bodyData.impulse.x, bodyData.impulse.y];
                        }
                        else if (bodyData.impulse instanceof Function) {
                            var impulseData = bodyData.impulse();
                            impulse = [impulseData[0], impulseData[1]];
                        }
                        if (impulse)
                            body.applyImpulse([impulse[0] * WORLD_SCALE, impulse[1] * WORLD_SCALE]);
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
                        var worldAnchor = [x + jointData.worldAnchorX * WORLD_SCALE, y + jointData.worldAnchorY * WORLD_SCALE];
                        var joint = new RevoluteConstraint(body1, body2, { worldPivot: worldAnchor });
                        this.world.addConstraint(joint);
                        if (jointData.lowerLimit != undefined) {
                            joint.lowerLimitEnabled = true;
                            joint.lowerLimit = jointData.lowerLimit * DEG2RAD;
                        }
                        if (jointData.upperLimit != undefined) {
                            joint.upperLimitEnabled = true;
                            joint.upperLimit = jointData.upperLimit * DEG2RAD;
                        }
                        joint.collideConnected = jointData.collideConnected != undefined ? jointData.collideConnected : false;
                    }
                    else {
                        console.error("Unsupported joint type \"" + type + "\"");
                    }
                }
        };
        /*
         *** Events
         */
        P2JsDemo.prototype.onVelocityIterationsUpdate = function (iterations) {
            this.world.solver.iterations = iterations;
        };
        P2JsDemo.prototype.onMouseDown = function () {
            var p = [this.mouseX * this.worldScale, this.mouseY * this.worldScale];
            var result = this.world.hitTest(p, this.world.bodies, this.pickPrecision);
            var pickedBody;
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var body = result_1[_i];
                if (body.type !== Body.STATIC) {
                    pickedBody = body;
                    break;
                }
            }
            if (pickedBody) {
                var localPoint = p2.vec2.create();
                pickedBody.toLocalFrame(localPoint, p);
                this.handJoint = new RevoluteConstraint(this.nullBody, pickedBody, {
                    localPivotA: p,
                    localPivotB: localPoint,
                    maxForce: 2500
                });
                this.world.addConstraint(this.handJoint);
                this.mouseAction = engines.MouseAction.Handled;
            }
        };
        P2JsDemo.prototype.onMouseUp = function () {
            if (this.handJoint) {
                this.world.removeConstraint(this.handJoint);
                this.handJoint = null;
            }
        };
        /*
         *** Utility Methods
         */
        P2JsDemo.Colour = function (id, sleep) {
            var idc = Math.floor(0xffffff * Math.exp(-(id % 500) / 1500));
            var r = ((idc & 0xff0000) >> 16);
            var g = ((idc & 0xff00) >> 8);
            var b = idc & 0xff;
            var a = sleep ? 0.6 : 1;
            return "rgba(" + r + "," + g + "," + b + "," + a + ")";
        };
        return P2JsDemo;
    }(engines.DemoEngineBase));
    engines.P2JsDemo = P2JsDemo;
})(engines || (engines = {}));
//# sourceMappingURL=P2JsDemo.js.map