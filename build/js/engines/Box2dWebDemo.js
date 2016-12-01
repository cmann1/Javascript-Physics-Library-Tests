///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/box2dweb/box2dweb.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var engines;
(function (engines) {
    var b2World = Box2D.Dynamics.b2World;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2AABB = Box2D.Collision.b2AABB;
    var b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    var Box2dWebDemo = (function (_super) {
        __extends(Box2dWebDemo, _super);
        function Box2dWebDemo() {
            _super.apply(this, arguments);
            this.name = 'Box2DWeb';
            this.simulationTime = 0;
            this.elapsedTime = 0;
        }
        Box2dWebDemo.prototype.setup = function () {
            this.autoClearCanvas = true;
            this.world = new b2World(new b2Vec2(), true);
            this.setDrawScale(30);
            var DRAW_SCALE = this.drawScale;
            var WORLD_SCALE = this.worldScale;
            // Borders
            {
                var w = this.stageWidth * WORLD_SCALE;
                var h = this.stageHeight * WORLD_SCALE;
                var hw = w / 2;
                var hh = h / 2;
                var t = 200 * WORLD_SCALE;
                var ht = t / 2;
                var borderBodyDef = new b2BodyDef();
                var borderBody = void 0;
                borderBodyDef.position.Set(hw, 0 - ht);
                borderBody = this.world.CreateBody(borderBodyDef);
                borderBody.CreateFixture2(b2PolygonShape.AsBox(hw + t, ht), 0);
                borderBody.doNotClear = true;
                borderBodyDef.position.Set(hw, h + ht);
                borderBody = this.world.CreateBody(borderBodyDef);
                borderBody.CreateFixture2(b2PolygonShape.AsBox(hw + t, ht), 0);
                borderBody.doNotClear = true;
                borderBodyDef.position.Set(0 - ht, hh);
                borderBody = this.world.CreateBody(borderBodyDef);
                borderBody.CreateFixture2(b2PolygonShape.AsBox(ht, hh + t), 0);
                borderBody.doNotClear = true;
                borderBodyDef.position.Set(w + ht, hh);
                borderBody = this.groundBody = this.world.CreateBody(borderBodyDef);
                borderBody.CreateFixture2(b2PolygonShape.AsBox(ht, hh + t), 0);
                borderBody.doNotClear = true;
            }
            var debugDraw = this.debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(this.context);
            debugDraw.SetDrawScale(DRAW_SCALE);
            debugDraw.SetFillAlpha(0.3);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.world.SetDebugDraw(debugDraw);
        };
        Box2dWebDemo.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.simulationTime = 0;
            this.elapsedTime = 0;
            var bodies = this.world.GetBodyList();
            while (bodies) {
                var nextBody = bodies.GetNext();
                if (!bodies.doNotClear) {
                    this.world.DestroyBody(bodies);
                }
                bodies = nextBody;
            }
            var joints = this.world.GetJointList();
            while (joints) {
                var nextJoint = joints.GetNext();
                this.world.DestroyJoint(joints);
                joints = nextJoint;
            }
        };
        Box2dWebDemo.prototype.loadDemo = function (name) {
            _super.prototype.loadDemo.call(this, name);
        };
        Box2dWebDemo.prototype.runInternal = function (deltaTime, timestamp) {
            if (deltaTime > 0.05) {
                deltaTime = 0.05;
            }
            this.simulationTime += deltaTime;
            if (this.mouseJoint) {
                this.mouseJoint.SetTarget(this.getWorldMouse());
            }
            // Keep on stepping forward by fixed time step until amount of time
            // needed has been simulated.
            while (this.elapsedTime < this.simulationTime) {
                this.world.Step(this.frameRateInterval, this._velocityIterations, this._positionIterations);
                this.elapsedTime += this.frameRateInterval;
            }
            if (this._enableDrawing) {
                this.world.DrawDebugData();
            }
        };
        ;
        /*
         *** Utility Methods
         */
        Box2dWebDemo.prototype.getBodyAtMouse = function (includeStatic) {
            if (includeStatic === void 0) { includeStatic = false; }
            var mouseX = this.mouseX * this.worldScale;
            var mouseY = this.mouseY * this.worldScale;
            var mouse_p = new b2Vec2(mouseX, mouseY);
            var aabb = new b2AABB();
            aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
            aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
            var body = null;
            // Query the world for overlapping shapes.
            function GetBodyCallback(fixture) {
                var shape = fixture.GetShape();
                if (fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic) {
                    var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);
                    if (inside) {
                        body = fixture.GetBody();
                        return false;
                    }
                }
                return true;
            }
            this.world.QueryAABB(GetBodyCallback, aabb);
            return body;
        };
        Box2dWebDemo.prototype.getWorldMouse = function () {
            return new b2Vec2(this.mouseX * this.worldScale, this.mouseY * this.worldScale);
        };
        Box2dWebDemo.prototype.pinBody = function (body, pinned) {
            if (pinned) {
                var jointDef = new b2RevoluteJointDef();
                jointDef.Initialize(this.world.GetGroundBody(), body, body.GetWorldCenter());
                this.world.CreateJoint(jointDef);
            }
            return body;
        };
        Box2dWebDemo.prototype.createBody = function (x, y, shape, pinned) {
            var bodyDef = new b2BodyDef();
            var fixDef = new b2FixtureDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.density = 1.0;
            fixDef.friction = 0.3;
            bodyDef.position.Set(x, y);
            var body = this.world.CreateBody(bodyDef);
            fixDef.shape = shape;
            body.CreateFixture(fixDef);
            return this.pinBody(body, pinned);
        };
        Box2dWebDemo.prototype.createBox = function (x, y, width, height, pinned) {
            width *= 2 * 0.5;
            height *= 2 * 0.5;
            return this.createBody(x, y, b2PolygonShape.AsBox(width, height), pinned);
        };
        Box2dWebDemo.prototype.createCircle = function (x, y, radius, pinned) {
            return this.createBody(x, y, new b2CircleShape(radius), pinned);
        };
        Box2dWebDemo.prototype.createFromData = function (x, y, data) {
            var WORLD_SCALE = this.worldScale;
            var DEG2RAD = 1 / (180 / Math.PI);
            var bodiesData = data.bodies;
            var jointsData = data.joints;
            var bodyRegistry = {};
            var bodyDef = new b2BodyDef();
            x *= WORLD_SCALE;
            y *= WORLD_SCALE;
            if (bodiesData)
                for (var _i = 0, bodiesData_1 = bodiesData; _i < bodiesData_1.length; _i++) {
                    var bodyData = bodiesData_1[_i];
                    if (bodyData.type === undefined || bodyData.type === 'dynamic')
                        bodyDef.type = b2Body.b2_dynamicBody;
                    else if (bodyData.type === 'static')
                        bodyDef.type = b2Body.b2_staticBody;
                    else if (bodyData.type === 'kinematic')
                        bodyDef.type = b2Body.b2_kinematicBody;
                    bodyDef.position.Set(x + bodyData.x * WORLD_SCALE, y + bodyData.y * WORLD_SCALE);
                    var body = this.world.CreateBody(bodyDef);
                    if (bodyData.id !== undefined) {
                        bodyRegistry[bodyData.id] = body;
                    }
                    if (bodyData.shape) {
                        var shapeData = bodyData.shape;
                        var shapeType = shapeData.type;
                        var fixtureDef = new b2FixtureDef();
                        if (shapeType === 'box')
                            fixtureDef.shape = b2PolygonShape.AsBox(shapeData.width * 0.5 * WORLD_SCALE, shapeData.height * 0.5 * WORLD_SCALE);
                        else if (shapeType === 'circle')
                            fixtureDef.shape = new b2CircleShape(shapeData.radius * WORLD_SCALE);
                        else
                            console.error("Unsupported shape type \"" + shapeType + "\"");
                        if (shapeData.density !== undefined)
                            fixtureDef.density = shapeData.density;
                        if (shapeData.friction !== undefined)
                            fixtureDef.friction = shapeData.friction;
                        if (shapeData.restitution !== undefined)
                            fixtureDef.restitution = shapeData.restitution;
                        body.CreateFixture(fixtureDef);
                    }
                    if (bodyData.impulse) {
                        var impulse = void 0;
                        if (bodyData.impulse instanceof b2Vec2 || bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y')) {
                            impulse = bodyData.impulse;
                        }
                        else if (bodyData.impulse instanceof Array) {
                            impulse = new b2Vec2(bodyData.impulse[0], bodyData.impulse[1]);
                        }
                        else if (bodyData.impulse instanceof Function) {
                            var impulseData = bodyData.impulse();
                            impulse = new b2Vec2(impulseData[0], impulseData[1]);
                        }
                        if (impulse)
                            body.ApplyImpulse(new b2Vec2(impulse.x * WORLD_SCALE, impulse.y * WORLD_SCALE), body.GetWorldCenter());
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
                        var jointDef = new b2RevoluteJointDef();
                        if (jointData.lowerLimit != undefined || jointData.upperLimit != undefined) {
                            jointDef.enableLimit = true;
                            if (jointData.lowerLimit != undefined)
                                jointDef.lowerAngle = jointData.lowerLimit * DEG2RAD;
                            if (jointData.upperLimit != undefined)
                                jointDef.upperAngle = jointData.upperLimit * DEG2RAD;
                        }
                        jointDef.Initialize(body1, body2, new b2Vec2(x + jointData.worldAnchorX * WORLD_SCALE, y + jointData.worldAnchorY * WORLD_SCALE));
                        jointDef.collideConnected = jointData.collideConnected != undefined ? jointData.collideConnected : false;
                        this.world.CreateJoint(jointDef);
                    }
                    else {
                        console.error("Unsupported joint type \"" + type + "\"");
                    }
                }
        };
        /*
         *** Events
         */
        Box2dWebDemo.prototype.onMouseDown = function () {
            var body = this.getBodyAtMouse();
            if (body) {
                //if joint exists then create
                var def = new b2MouseJointDef();
                def.bodyA = this.groundBody;
                def.bodyB = body;
                def.target = this.getWorldMouse();
                def.collideConnected = true;
                def.maxForce = 10000 * body.GetMass();
                def.dampingRatio = 0;
                this.mouseJoint = this.world.CreateJoint(def);
                body.SetAwake(true);
                this.mouseAction = engines.MouseAction.Handled;
            }
        };
        Box2dWebDemo.prototype.onMouseUp = function () {
            if (this.mouseJoint) {
                this.world.DestroyJoint(this.mouseJoint);
                this.mouseJoint = null;
            }
        };
        return Box2dWebDemo;
    }(engines.DemoEngineBase));
    engines.Box2dWebDemo = Box2dWebDemo;
})(engines || (engines = {}));
//# sourceMappingURL=Box2dWebDemo.js.map