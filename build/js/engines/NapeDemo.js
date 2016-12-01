///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/easeljs.d.ts'/>
///<reference path='../../lib/nape/nape.d.ts'/>
///<reference path='../../lib/nape/debugDraw/nape-debug-draw.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engines;
(function (engines) {
    var Vec2 = nape.geom.Vec2;
    var Space = nape.space.Space;
    var Stage = createjs.Stage;
    var ShapeDebug = nape.util.ShapeDebug;
    var Body = nape.phys.Body;
    var BodyType = nape.phys.BodyType;
    var Polygon = nape.shape.Polygon;
    var Circle = nape.shape.Circle;
    var PivotJoint = nape.constraint.PivotJoint;
    var AngleJoint = nape.constraint.AngleJoint;
    var Material = nape.phys.Material;
    var NapeDemo = (function (_super) {
        __extends(NapeDemo, _super);
        function NapeDemo() {
            _super.apply(this, arguments);
            this.name = 'Nape';
            this.simulationTime = 0;
        }
        NapeDemo.prototype.setup = function () {
            this.space = new Space();
            var debug = this.debug = new ShapeDebug(2000, 2000);
            debug.thickness = 1;
            debug.drawBodies = true;
            debug.drawConstraints = true;
            this.stage = new Stage(this.canvas);
            this.stage.addChild(this.debug.display);
        };
        NapeDemo.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.simulationTime = 0;
            this.handJoint = null;
            this.space.clear();
            this.debug.clear();
            this.stage.update();
        };
        NapeDemo.prototype.loadDemo = function (name) {
            _super.prototype.loadDemo.call(this, name);
            var t = 200;
            var t2 = t * 2;
            var border = new Body(BodyType.STATIC);
            border.shapes.add(new Polygon(Polygon.rect(-t, -t, this.stageWidth + t2, t)));
            border.shapes.add(new Polygon(Polygon.rect(-t, this.stageHeight, this.stageWidth + t2, t)));
            border.shapes.add(new Polygon(Polygon.rect(-t, -t, t, this.stageHeight + t2)));
            border.shapes.add(new Polygon(Polygon.rect(this.stageWidth, -t, t, this.stageHeight + t2)));
            border.space = this.space;
            this.handJoint = new PivotJoint(this.space.world, null, Vec2.weak(0, 0), Vec2.weak(0, 0));
            this.handJoint.space = this.space;
            this.handJoint.active = false;
            this.handJoint.stiff = false;
        };
        NapeDemo.prototype.runInternal = function (deltaTime, timestamp) {
            if (deltaTime > 0.05) {
                deltaTime = 0.05;
            }
            this.simulationTime += deltaTime;
            if (this.handJoint.active) {
                this.handJoint.anchor1.setxy(this.mouseX, this.mouseY);
            }
            // Keep on stepping forward by fixed time step until amount of time
            // needed has been simulated.
            while (this.space.elapsedTime < this.simulationTime) {
                this.space.step(this.frameRateInterval, this._velocityIterations, this._positionIterations);
            }
            if (this._enableDrawing) {
                this.debug.clear();
                this.debug.draw(this.space);
                this.debug.flush();
                this.stage.update();
            }
        };
        ;
        /*
         *** Utility Methods
         */
        NapeDemo.prototype.pinBody = function (body, pinned) {
            if (pinned) {
                var pin = new PivotJoint(this.space.world, body, body.position, Vec2.weak(0, 0));
                pin.space = this.space;
            }
            return body;
        };
        NapeDemo.prototype.createBody = function (x, y, shape, pinned) {
            var body = new Body();
            body.position.setxy(x, y);
            body.shapes.add(shape);
            body.space = this.space;
            return this.pinBody(body, pinned);
        };
        NapeDemo.prototype.createBox = function (x, y, width, height, pinned) {
            return this.createBody(x, y, new Polygon(Polygon.box(width * 2, height * 2)), pinned);
        };
        NapeDemo.prototype.createCircle = function (x, y, radius, pinned) {
            return this.createBody(x, y, new Circle(radius), pinned);
        };
        NapeDemo.prototype.createFromData = function (x, y, data) {
            var DEG2RAD = 1 / (180 / Math.PI);
            var bodiesData = data.bodies;
            var jointsData = data.joints;
            var bodyRegistry = {};
            if (bodiesData)
                for (var _i = 0, bodiesData_1 = bodiesData; _i < bodiesData_1.length; _i++) {
                    var bodyData = bodiesData_1[_i];
                    var body = void 0;
                    if (bodyData.type === undefined || bodyData.type === 'dynamic')
                        body = new Body(BodyType.DYNAMIC);
                    else if (bodyData.type === 'static')
                        body = new Body(BodyType.STATIC);
                    else if (bodyData.type === 'kinematic')
                        body = new Body(BodyType.KINEMATIC);
                    if (bodyData.shape) {
                        var shapeData = bodyData.shape;
                        var shapeType = shapeData.type;
                        if (shapeType === 'box')
                            body.shapes.add(new Polygon(Polygon.box(shapeData.width, shapeData.height)));
                        else if (shapeType === 'circle')
                            body.shapes.add(new Circle(shapeData.radius));
                        else
                            console.error("Unsupported shape type \"" + shapeType + "\"");
                        var mat = new Material();
                        if (shapeData.density !== undefined)
                            mat.density = shapeData.density;
                        if (shapeData.friction !== undefined)
                            mat.dynamicFriction = shapeData.friction;
                        if (shapeData.restitution !== undefined)
                            mat.elasticity = shapeData.restitution;
                    }
                    body.position.setxy(x + bodyData.x, y + bodyData.y);
                    body.space = this.space;
                    if (bodyData.id !== undefined) {
                        bodyRegistry[bodyData.id] = body;
                    }
                    if (bodyData.impulse) {
                        var impulse = void 0;
                        if (bodyData.impulse instanceof Vec2) {
                            impulse = bodyData.impulse;
                        }
                        if (bodyData.impulse instanceof Array) {
                            impulse = bodyData.impulse;
                        }
                        else if (bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y')) {
                            impulse = Vec2.weak(bodyData.impulse.x, bodyData.impulse.y);
                        }
                        else if (bodyData.impulse instanceof Function) {
                            var impulseData = bodyData.impulse();
                            impulse = Vec2.weak(impulseData[0], impulseData[1]);
                        }
                        if (impulse)
                            body.applyImpulse(impulse);
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
                        var pivotPoint = Vec2.get(x + jointData.worldAnchorX, y + jointData.worldAnchorY);
                        var pivotJoint = new PivotJoint(body1, body2, body1.worldPointToLocal(pivotPoint, true), body2.worldPointToLocal(pivotPoint, true));
                        pivotJoint.ignore = jointData.collideConnected != undefined ? jointData.collideConnected : true;
                        pivotJoint.space = this.space;
                        if (jointData.lowerLimit != undefined || jointData.upperLimit != undefined) {
                            var angleJoint = new AngleJoint(body1, body2, jointData.lowerLimit != undefined ? jointData.lowerLimit * DEG2RAD : -Number.MAX_VALUE, jointData.upperLimit != undefined ? jointData.upperLimit * DEG2RAD : Number.MAX_VALUE);
                            angleJoint.debugDraw = false;
                            angleJoint.space = this.space;
                        }
                        pivotPoint.dispose();
                    }
                    else {
                        console.error("Unsupported joint type \"" + type + "\"");
                    }
                }
        };
        /*
         *** Events
         */
        NapeDemo.prototype.onDisableDrawing = function () {
            this.debug.clear();
            this.stage.update();
        };
        NapeDemo.prototype.onMouseDown = function () {
            // Allocate a Vec2 from object pool.
            var mousePoint = Vec2.get(this.mouseX, this.mouseY, false);
            // Determine the set of Body's which are intersecting mouse point.
            // And search for any 'dynamic' type Body to begin dragging.
            var bodies = this.space.bodiesUnderPoint(mousePoint);
            for (var i = 0; i < bodies.length; i++) {
                var body = bodies.at(i);
                if (!body.isDynamic()) {
                    continue;
                }
                // Configure hand joint to drag this body.
                //   We initialise the anchor point on this body so that
                //   constraint is satisfied.
                //
                //   The second argument of worldPointToLocal means we get back
                //   a 'weak' Vec2 which will be automatically sent back to object
                //   pool when setting the handJoint's anchor2 property.
                this.handJoint.body2 = body;
                this.handJoint.anchor2.set(body.worldPointToLocal(mousePoint, true));
                // Enable hand joint!
                this.handJoint.active = true;
                this.mouseAction = engines.MouseAction.Handled;
                break;
            }
            // Release Vec2 back to object pool.
            mousePoint.dispose();
        };
        ;
        NapeDemo.prototype.onMouseUp = function () {
            // Disable hand joint (if not already disabled).
            this.handJoint.active = false;
        };
        ;
        return NapeDemo;
    }(engines.DemoEngineBase));
    engines.NapeDemo = NapeDemo;
})(engines || (engines = {}));
//# sourceMappingURL=NapeDemo.js.map