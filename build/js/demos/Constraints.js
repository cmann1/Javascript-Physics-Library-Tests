///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>
var demos;
(function (demos) {
    var DemoEngineBase = engines.DemoEngineBase;
    var VertFormat = engines.VertFormat;
    var Overlay = overlay.Overlay;
    var OverlayIcons = overlay.OverlayIcons;
    var ConstraintSupport;
    (function (ConstraintSupport) {
        ConstraintSupport[ConstraintSupport["Supported"] = 0] = "Supported";
        ConstraintSupport[ConstraintSupport["NotSupported"] = 1] = "NotSupported";
    })(ConstraintSupport || (ConstraintSupport = {}));
    var VELOCITY_ITERATIONS = 10;
    var POSITION_ITERATIONS = 10;
    // Constraint settings.
    var frequency = 20.0;
    var damping = 1.0;
    // Cell sizes
    var cellWcnt = 3;
    var cellHcnt = 3;
    // Each demo must set these values to stageWidth or stageWidth/cellWcnt and stageHeight/cellHcnt
    var cellWidth = 1;
    var cellHeight = 1;
    // Should be multiplied by worldScale before use
    var shapeSize = 22;
    // Environment for each cell.
    function withCell(i, j, title, f) {
        var _this = this;
        var result = f(function (x) { return (x + (i * cellWidth)) * _this.worldScale; }, function (y) { return (y + (j * cellHeight)) * _this.worldScale; });
        this.overlays.push(new Overlay(i * cellWidth + cellWidth * 0.5, j * cellHeight + 5, result === ConstraintSupport.NotSupported ? title + " not supported" : title, result === ConstraintSupport.NotSupported ? OverlayIcons.Warning : null, { valign: 'top' }));
    }
    var napeDemo;
    (function (napeDemo) {
        var Body = nape.phys.Body;
        var BodyType = nape.phys.BodyType;
        var Polygon = nape.shape.Polygon;
        var Vec2 = nape.geom.Vec2;
        var AngleJoint = nape.constraint.AngleJoint;
        var LineJoint = nape.constraint.LineJoint;
        var MotorJoint = nape.constraint.MotorJoint;
        var PulleyJoint = nape.constraint.PulleyJoint;
        var PivotJoint = nape.constraint.PivotJoint;
        var DistanceJoint = nape.constraint.DistanceJoint;
        var WeldJoint = nape.constraint.WeldJoint;
        engines.NapeDemo.prototype.loadDemoConstraints = function () {
            var _this = this;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.space.gravity.setxy(0, 600);
            var size = shapeSize;
            var w = this.stageWidth;
            var h = this.stageHeight;
            cellWidth = w / cellWcnt;
            cellHeight = h / cellHcnt;
            // Create regions for each constraint demo
            var regions = new Body(BodyType.STATIC);
            var i;
            for (i = 1; i < cellWcnt; i++) {
                regions.shapes.add(new Polygon(Polygon.rect(i * cellWidth - 0.5, 0, 1, h)));
            }
            for (i = 1; i < cellHcnt; i++) {
                regions.shapes.add(new Polygon(Polygon.rect(0, i * cellHeight - 0.5, w, 1)));
            }
            regions.space = this.space;
            // Common formatting of constraints.
            var format = function (c) {
                c.stiff = false;
                c.frequency = frequency;
                c.damping = damping;
                c.space = _this.space;
            };
            withCell.call(this, 1, 0, "PivotJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var pivotPoint = Vec2.get(x(cellWidth / 2), y(cellHeight / 2));
                format(new PivotJoint(b1, b2, b1.worldPointToLocal(pivotPoint, true), b2.worldPointToLocal(pivotPoint, true)));
                pivotPoint.dispose();
            });
            withCell.call(this, 2, 0, "WeldJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var weldPoint = Vec2.get(x(cellWidth / 2), y(cellHeight / 2));
                format(new WeldJoint(b1, b2, b1.worldPointToLocal(weldPoint, true), b2.worldPointToLocal(weldPoint, true), 
                /*phase*/ Math.PI / 4 /*45 degrees*/));
                weldPoint.dispose();
            });
            withCell.call(this, 0, 1, "DistanceJoint", function (x, y) {
                var b1 = _this.createBox(x(1.25 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(1.75 * cellWidth / 3), y(cellHeight / 2), size, size);
                format(new DistanceJoint(b1, b2, Vec2.weak(0, -size), Vec2.weak(0, -size), 
                /*jointMin*/ cellWidth / 3 * 0.75, 
                /*jointMax*/ cellWidth / 3 * 1.25));
            });
            withCell.call(this, 1, 1, "LineJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var anchorPoint = Vec2.get(x(cellWidth / 2), y(cellHeight / 2));
                format(new LineJoint(b1, b2, b1.worldPointToLocal(anchorPoint, true), b2.worldPointToLocal(anchorPoint, true), 
                /*direction*/ Vec2.weak(0, 1), 
                /*jointMin*/ -size, 
                /*jointMax*/ size));
                anchorPoint.dispose();
            });
            withCell.call(this, 2, 1, "PulleyJoint", function (x, y) {
                var b1 = _this.createBox(x(cellWidth / 2), y(size), size / 2, size / 2, true);
                b1.scaleShapes(4, 1);
                var b2 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size / 2, size / 2);
                var b3 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                format(new PulleyJoint(b1, b2, b1, b3, Vec2.weak(-size * 2, 0), Vec2.weak(0, -size / 2), Vec2.weak(size * 2, 0), Vec2.weak(0, -size), 
                /*jointMin*/ cellHeight * 0.75, 
                /*jointMax*/ cellHeight * 0.75, 
                /*ratio*/ 2.5));
            });
            withCell.call(this, 0, 2, "AngleJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size, true);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size, true);
                format(new AngleJoint(b1, b2, 
                /*jointMin*/ -Math.PI * 1.5, 
                /*jointMax*/ Math.PI * 1.5, 
                /*ratio*/ 2));
            });
            withCell.call(this, 1, 2, "MotorJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size, true);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size, true);
                format(new MotorJoint(b1, b2, 
                /*rate*/ 10, 
                /*ratio*/ 3));
            });
            withCell.call(this, 2, 2, "PrismaticJoint\n(LineJoint + AngleJoint)", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var anchorPoint = Vec2.get(x(cellWidth / 2), y(cellHeight / 2));
                format(new LineJoint(b1, b2, b1.worldPointToLocal(anchorPoint, true), b2.worldPointToLocal(anchorPoint, true), 
                /*direction*/ Vec2.weak(0, 1), 
                /*jointMin*/ -25, 
                /*jointMax*/ 75));
                anchorPoint.dispose();
                format(new AngleJoint(b1, b2, 
                /*jointMin*/ 0, 
                /*jointMax*/ 0, 
                /*ratio*/ 1));
            });
        };
    })(napeDemo || (napeDemo = {}));
    var box2dWebDemo;
    (function (box2dWebDemo) {
        var b2Body = Box2D.Dynamics.b2Body;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
        var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
        var b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
        var b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;
        var b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;
        var b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
        var b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef;
        engines.Box2dWebDemo.prototype.loadDemoConstraints = function () {
            var _this = this;
            var DRAW_SCALE = this.drawScale;
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.SetGravity(new b2Vec2(0, 9.82));
            var size = shapeSize * WORLD_SCALE;
            var w = this.stageWidth;
            var h = this.stageHeight;
            cellWidth = w / cellWcnt;
            cellHeight = h / cellHcnt;
            var bodyDef = new b2BodyDef();
            var fixDef = new b2FixtureDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.density = 1.0;
            fixDef.friction = 0.3;
            // Create regions for each constraint demo
            var regionBodyDef = new b2BodyDef();
            var regionBody = this.world.CreateBody(regionBodyDef);
            var regionFixDef = new b2FixtureDef();
            var i;
            for (i = 1; i < cellWcnt; i++) {
                regionFixDef.shape = b2PolygonShape.AsVector(DemoEngineBase.Box((i * cellWidth - 0.5) * WORLD_SCALE, h / 2 * WORLD_SCALE, 1 * WORLD_SCALE, h * WORLD_SCALE, VertFormat.Vector, b2Vec2));
                regionBody.CreateFixture(regionFixDef);
            }
            for (i = 1; i < cellHcnt; i++) {
                regionFixDef.shape = b2PolygonShape.AsVector(DemoEngineBase.Box(w / 2 * WORLD_SCALE, (i * cellHeight - 0.5) * WORLD_SCALE, w * WORLD_SCALE, 1 * WORLD_SCALE, VertFormat.Vector, b2Vec2));
                regionBody.CreateFixture(regionFixDef);
            }
            var format = function (c) {
                c.collideConnected = true;
                return c;
            };
            withCell.call(this, 1, 0, "RevoluteJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var pivotPoint = new b2Vec2(x(cellWidth / 2), y(cellHeight / 2));
                var jointDef = format(new b2RevoluteJointDef());
                jointDef.Initialize(b1, b2, pivotPoint);
                _this.world.CreateJoint(jointDef);
            });
            withCell.call(this, 2, 0, "WeldJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var weldPoint = new b2Vec2(x(cellWidth / 2), y(cellHeight / 2));
                var jointDef = format(new b2WeldJointDef());
                jointDef.Initialize(b1, b2, weldPoint);
                jointDef.referenceAngle = Math.PI / 4 /*45 degrees*/;
                _this.world.CreateJoint(jointDef);
            });
            withCell.call(this, 0, 1, "DistanceJoint", function (x, y) {
                var b1 = _this.createBox(x(1.25 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(1.75 * cellWidth / 3), y(cellHeight / 2), size, size);
                var jointDef = format(new b2DistanceJointDef());
                var a1 = b1.GetWorldCenter().Copy();
                a1.Add(new b2Vec2(0, -size));
                var a2 = b2.GetWorldCenter().Copy();
                a2.Add(new b2Vec2(0, -size));
                jointDef.Initialize(b1, b2, a1, a2);
                jointDef.length = cellWidth / 3 * 0.75 * WORLD_SCALE;
                // 	/*jointMin*/ cellWidth/3*0.75 * SCALE,
                // 	/*jointMax*/ cellWidth/3*1.25 * SCALE
                _this.world.CreateJoint(jointDef);
                _this.addWarning(x(cellWidth / 2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Min/Max limits not supported', { valign: 'top' });
            });
            withCell.call(this, 1, 1, "LineJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var anchorPoint = new b2Vec2(x(cellWidth / 2), y(cellHeight / 2));
                var jointDef = format(new b2LineJointDef());
                jointDef.Initialize(b1, b2, anchorPoint, new b2Vec2(0, 1));
                jointDef.enableLimit = true;
                jointDef.lowerTranslation = -size;
                jointDef.upperTranslation = size;
                _this.world.CreateJoint(jointDef);
            });
            withCell.call(this, 2, 1, "PulleyJoint", function (x, y) {
                var b1x = x(cellWidth / 2);
                var b1y = y(size);
                var b2 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size / 2, size / 2);
                var b3 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var a2 = b2.GetWorldCenter().Copy();
                a2.Add(new b2Vec2(0, -size / 2));
                var a3 = b3.GetWorldCenter().Copy();
                a3.Add(new b2Vec2(0, -size));
                var jointDef = format(new b2PulleyJointDef());
                jointDef.Initialize(b2, b3, new b2Vec2(b1x - size * 2, b1y), new b2Vec2(b1x + size * 2, b1y), a2, a3, 2);
                _this.world.CreateJoint(jointDef);
                _this.addWarning(x(cellWidth / 2) * DRAW_SCALE, y(cellHeight) * DRAW_SCALE - 10, 'Dynamic anchor points not supported', { valign: 'bottom' });
            });
            withCell.call(this, 0, 2, "GearJoint", function (x, y) {
                var b1 = _this.createCircle(x(cellWidth / 2) - size, y(cellHeight / 2), size, true);
                var b2 = _this.createCircle(x(cellWidth / 2) + size * 2, y(cellHeight / 2), size * 2, true);
                var jointDef = new b2GearJointDef();
                jointDef.bodyA = b1;
                jointDef.bodyB = b2;
                jointDef.joint1 = b1.GetJointList().joint;
                jointDef.joint2 = b2.GetJointList().joint;
                jointDef.ratio = 2;
                _this.world.CreateJoint(jointDef);
            });
            withCell.call(this, 1, 2, "RevoluteJoint Motor", function (x, y) {
                var b2 = _this.createBox(x(cellWidth / 2), y(cellHeight / 2), size, size, true);
                var joint = b2.GetJointList().joint;
                joint.EnableMotor(true);
                joint.SetMaxMotorTorque(50);
                joint.SetMotorSpeed(1.5);
            });
            withCell.call(this, 2, 2, "PrismaticJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var jointDef = new b2PrismaticJointDef();
                jointDef.Initialize(b1, b2, b2.GetWorldCenter(), new b2Vec2(0, 1));
                jointDef.lowerTranslation = -25.0 * WORLD_SCALE;
                jointDef.upperTranslation = 75.0 * WORLD_SCALE;
                jointDef.enableLimit = true;
                _this.world.CreateJoint(jointDef);
            });
        };
    })(box2dWebDemo || (box2dWebDemo = {}));
    var p2JsDemo;
    (function (p2JsDemo) {
        var Body = p2.Body;
        var Box = p2.Box;
        var RevoluteConstraint = p2.RevoluteConstraint;
        var LockConstraint = p2.LockConstraint;
        var DistanceConstraint = p2.DistanceConstraint;
        var PrismaticConstraint = p2.PrismaticConstraint;
        var GearConstraint = p2.GearConstraint;
        engines.P2JsDemo.prototype.loadDemoConstraints = function () {
            var _this = this;
            var DRAW_SCALE = this.drawScale;
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.gravity = [0, 600 * WORLD_SCALE];
            var size = shapeSize * WORLD_SCALE;
            var w = this.stageWidth;
            var h = this.stageHeight;
            cellWidth = w / cellWcnt;
            cellHeight = h / cellHcnt;
            // Create regions for each constraint demo
            var i;
            for (i = 1; i < cellWcnt; i++) {
                var body = new Body();
                body.position = [(i * cellWidth - 0.5) * WORLD_SCALE, h / 2 * WORLD_SCALE];
                body.addShape(new Box({ width: 1 * WORLD_SCALE, height: h * WORLD_SCALE }));
                this.world.addBody(body);
            }
            for (i = 1; i < cellHcnt; i++) {
                var body = new Body();
                body.position = [w / 2 * WORLD_SCALE, (i * cellHeight - 0.5) * WORLD_SCALE];
                body.addShape(new Box({ width: w * WORLD_SCALE, height: 1 * WORLD_SCALE }));
                this.world.addBody(body);
            }
            withCell.call(this, 1, 0, "RevoluteJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var pivotPoint = [x(cellWidth / 2), y(cellHeight / 2)];
                var joint = new RevoluteConstraint(b1, b2, { worldPivot: pivotPoint });
                _this.world.addConstraint(joint);
            });
            withCell.call(this, 2, 0, "LockJoint", function (x, y) {
                var a = Math.PI / 4;
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                b1.angle = a * 1.5;
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                b2.angle = -Math.PI + a * 0.5;
                var weldPoint = [x(cellWidth / 2), y(cellHeight / 2)];
                b2.toLocalFrame(weldPoint, weldPoint);
                var joint = new LockConstraint(b1, b2);
                _this.world.addConstraint(joint);
            });
            withCell.call(this, 0, 1, "DistanceJoint", function (x, y) {
                var b1 = _this.createBox(x(1.25 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(1.75 * cellWidth / 3), y(cellHeight / 2), size, size);
                var joint = new DistanceConstraint(b1, b2, {
                    distance: cellWidth / 3 * 0.75 * WORLD_SCALE,
                    localAnchorA: [0, -size],
                    localAnchorB: [0, -size]
                });
                joint.lowerLimitEnabled = true;
                joint.upperLimitEnabled = true;
                joint.lowerLimit = cellWidth / 3 * 0.75 * WORLD_SCALE;
                joint.upperLimit = cellWidth / 3 * 1.25 * WORLD_SCALE;
                _this.world.addConstraint(joint);
            });
            withCell.call(this, 1, 1, "LineJoint\n(PrismaticJoint/disableRotationalLock)", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var anchorPoint = [x(cellWidth / 2), y(cellHeight / 2)];
                var localA = [];
                var localB = [];
                b1.toLocalFrame(localA, anchorPoint);
                b2.toLocalFrame(localB, anchorPoint);
                var joint = new PrismaticConstraint(b1, b2, {
                    localAxisA: [0, 1],
                    disableRotationalLock: true,
                    localAnchorA: localA,
                    localAnchorB: localB,
                    lowerLimit: -size,
                    upperLimit: size,
                });
                _this.world.addConstraint(joint);
            });
            withCell.call(this, 2, 1, "PulleyJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 0, 2, "GearJoint", function (x, y) {
                var b1 = _this.createCircle(x(cellWidth / 2) - size, y(cellHeight / 2), size, true);
                var b2 = _this.createCircle(x(cellWidth / 2) + size * 2, y(cellHeight / 2), size * 2, true);
                var joint = new GearConstraint(b2, b1, {
                    ratio: 2
                });
                _this.world.addConstraint(joint);
            });
            withCell.call(this, 1, 2, "RevoluteJoint Motor", function (x, y) {
                var b1 = _this.createBox(x(cellWidth / 2), y(cellHeight / 2), size, size, true);
                var joint = b1._pin;
                joint.enableMotor();
                joint.setMotorSpeed(1.5);
            });
            withCell.call(this, 2, 2, "PrismaticJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var anchorPoint = [x(cellWidth / 2), y(cellHeight / 2)];
                var localA = [];
                b1.toLocalFrame(localA, b2.position);
                var joint = new PrismaticConstraint(b1, b2, {
                    localAxisA: [0, 1],
                    localAnchorA: localA,
                    localAnchorB: [0, 0],
                    lowerLimit: -25.0 * WORLD_SCALE,
                    upperLimit: 75.0 * WORLD_SCALE,
                });
                _this.world.addConstraint(joint);
            });
        };
    })(p2JsDemo || (p2JsDemo = {}));
    var matterDemo;
    (function (matterDemo) {
        var Bodies = Matter.Bodies;
        var World = Matter.World;
        var Vector = Matter.Vector;
        var MatterDemo = engines.MatterDemo;
        var Constraint = Matter.Constraint;
        engines.MatterDemo.prototype.loadDemoConstraints = function () {
            var _this = this;
            var DRAW_SCALE = this.drawScale;
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.gravity.x = 0;
            this.world.gravity.y = 0.5;
            var size = shapeSize * WORLD_SCALE;
            var w = this.stageWidth;
            var h = this.stageHeight;
            cellWidth = w / cellWcnt;
            cellHeight = h / cellHcnt;
            // Create regions for each constraint demo
            var i;
            for (i = 1; i < cellWcnt; i++) {
                var body = Bodies.rectangle((i * cellWidth - 0.5) * WORLD_SCALE, h / 2 * WORLD_SCALE, 1 * WORLD_SCALE, h * WORLD_SCALE, { isStatic: true });
                World.add(this.world, body);
            }
            for (i = 1; i < cellHcnt; i++) {
                var body = Bodies.rectangle(w / 2 * WORLD_SCALE, (i * cellHeight - 0.5) * WORLD_SCALE, w * WORLD_SCALE, 1 * WORLD_SCALE, { isStatic: true });
                World.add(this.world, body);
            }
            withCell.call(this, 1, 0, "RevoluteJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var pivotPointA = Vector.create(x(cellWidth / 2 - 1), y(cellHeight / 2));
                var pivotPointB = Vector.create(x(cellWidth / 2 + 1), y(cellHeight / 2));
                var joint = Constraint.create({
                    bodyA: b1,
                    bodyB: b2,
                    pointA: MatterDemo.globalToLocal(b1, pivotPointA),
                    pointB: MatterDemo.globalToLocal(b2, pivotPointB),
                    stiffness: 0.1
                });
                World.add(_this.world, joint);
                _this.addWarning(x(cellWidth / 2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Revolute constraint not supported\n(Strange behaviour)', { valign: 'top' });
            });
            withCell.call(this, 2, 0, "WeldJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 0, 1, "DistanceJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                var joint = Constraint.create({
                    bodyA: b1,
                    bodyB: b2,
                    pointA: Vector.create(0, -size),
                    pointB: Vector.create(0, -size)
                });
                World.add(_this.world, joint);
                _this.addWarning(x(cellWidth / 2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Limits not supported', { valign: 'top' });
            });
            withCell.call(this, 1, 1, "LineJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 2, 1, "PulleyJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 0, 2, "GearJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 1, 2, "MotorJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 2, 2, "PrismaticJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
        };
    })(matterDemo || (matterDemo = {}));
    var physicsJsDemo;
    (function (physicsJsDemo) {
        engines.PhysicsJsDemo.prototype.loadDemoConstraints = function () {
            var _this = this;
            var DRAW_SCALE = this.drawScale;
            var WORLD_SCALE = this.worldScale;
            this.gravity.setAcceleration({ x: 0, y: 0.0004 });
            var bodies = this.bodies;
            var size = shapeSize * WORLD_SCALE;
            var w = this.stageWidth;
            var h = this.stageHeight;
            cellWidth = w / cellWcnt;
            cellHeight = h / cellHcnt;
            // Create regions for each constraint demo
            var i;
            for (i = 1; i < cellWcnt; i++) {
                bodies.push(Physics.body('rectangle', {
                    x: (i * cellWidth - 0.5) * WORLD_SCALE,
                    y: h / 2 * WORLD_SCALE,
                    width: 1 * WORLD_SCALE,
                    height: h * WORLD_SCALE,
                    restitution: 0.3,
                    treatment: 'static'
                }));
            }
            for (i = 1; i < cellHcnt; i++) {
                bodies.push(Physics.body('rectangle', {
                    x: w / 2 * WORLD_SCALE,
                    y: (i * cellHeight - 0.5) * WORLD_SCALE,
                    width: w * WORLD_SCALE,
                    height: 1 * WORLD_SCALE,
                    restitution: 0.3,
                    treatment: 'static'
                }));
            }
            withCell.call(this, 1, 0, "RevoluteJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 2, 0, "AngleJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 4), y(cellHeight / 3), size, size);
                var b2 = _this.createBox(x(3 * cellWidth / 4), y(cellHeight / 3), size, size);
                var b3 = _this.createBox(x(cellWidth / 2), y(cellHeight / 1.5), size, size);
                _this.constraints.angleConstraint(b1, b2, b3);
            });
            withCell.call(this, 0, 1, "DistanceJoint", function (x, y) {
                var b1 = _this.createBox(x(1 * cellWidth / 3), y(cellHeight / 2), size, size);
                var b2 = _this.createBox(x(2 * cellWidth / 3), y(cellHeight / 2), size, size);
                _this.constraints.distanceConstraint(b1, b2);
                _this.addWarning(x(cellWidth / 2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Anchors/Limits not supported', { valign: 'top' });
            });
            withCell.call(this, 1, 1, "LineJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 2, 1, "PulleyJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 0, 2, "GearJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 1, 2, "MotorJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            withCell.call(this, 2, 2, "PrismaticJoint", function (x, y) {
                return ConstraintSupport.NotSupported;
            });
            this.world.add(this.bodies);
        };
    })(physicsJsDemo || (physicsJsDemo = {}));
})(demos || (demos = {}));
//# sourceMappingURL=Constraints.js.map