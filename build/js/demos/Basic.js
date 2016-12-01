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
    var VELOCITY_ITERATIONS = 10;
    var POSITION_ITERATIONS = 10;
    var napeDemo;
    (function (napeDemo) {
        var Body = nape.phys.Body;
        var Circle = nape.shape.Circle;
        var Polygon = nape.shape.Polygon;
        engines.NapeDemo.prototype.loadDemoBasic = function () {
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.space.gravity.setxy(0, 0);
            // Generate some random objects!
            for (var i = 0; i < 100; i++) {
                var body = new Body();
                // Add random one of either a Circle, Box or Pentagon.
                if (Math.random() < 0.33) {
                    body.shapes.add(new Circle(20));
                }
                else if (Math.random() < 0.5) {
                    body.shapes.add(new Polygon(Polygon.box(40, 40)));
                }
                else {
                    body.shapes.add(new Polygon(Polygon.regular(20, 20, 5)));
                }
                // Set to random position on stage and add to Space.
                body.position.setxy(Math.random() * this.stageWidth, Math.random() * this.stageHeight);
                body.space = this.space;
            }
        };
    })(napeDemo || (napeDemo = {}));
    var box2dWebDemo;
    (function (box2dWebDemo) {
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2Body = Box2D.Dynamics.b2Body;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        engines.Box2dWebDemo.prototype.loadDemoBasic = function () {
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.SetGravity(new b2Vec2(0, 0));
            var bodyDef = new b2BodyDef();
            var fixDef = new b2FixtureDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.density = 1.0;
            fixDef.friction = 0.3;
            // Generate some random objects!
            for (var i = 0; i < 100; i++) {
                bodyDef.position.Set(Math.random() * this.stageWidth * WORLD_SCALE, Math.random() * this.stageHeight * WORLD_SCALE);
                var body = this.world.CreateBody(bodyDef);
                // Add random one of either a Circle, Box or Pentagon.
                if (Math.random() < 0.33) {
                    fixDef.shape = new b2CircleShape(20 * WORLD_SCALE);
                }
                else if (Math.random() < 0.5) {
                    fixDef.shape = b2PolygonShape.AsBox(40 * WORLD_SCALE * 0.5, 40 * WORLD_SCALE * 0.5);
                }
                else {
                    fixDef.shape = b2PolygonShape.AsVector(DemoEngineBase.Regular(20 * WORLD_SCALE, 20 * WORLD_SCALE, 5, 0, VertFormat.Vector, b2Vec2));
                }
                body.CreateFixture(fixDef);
            }
        };
    })(box2dWebDemo || (box2dWebDemo = {}));
    var p2JsDemo;
    (function (p2JsDemo) {
        var Body = p2.Body;
        var Circle = p2.Circle;
        var Box = p2.Box;
        var Convex = p2.Convex;
        engines.P2JsDemo.prototype.loadDemoBasic = function () {
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.gravity = [0, 0];
            // Generate some random objects!
            for (var i = 0; i < 100; i++) {
                var body = new Body({ mass: 1 });
                // Add random one of either a Circle, Box or Pentagon.
                if (Math.random() < 0.33) {
                    body.addShape(new Circle({ radius: 20 * WORLD_SCALE }));
                }
                else if (Math.random() < 0.5) {
                    body.addShape(new Box({ width: 40 * WORLD_SCALE, height: 40 * WORLD_SCALE }));
                }
                else {
                    body.addShape(new Convex({ vertices: DemoEngineBase.Regular(20 * WORLD_SCALE, 20 * WORLD_SCALE, 5) }));
                }
                // Set to random position on stage and add to Space.
                body.position = [Math.random() * this.stageWidth * WORLD_SCALE, Math.random() * this.stageHeight * WORLD_SCALE];
                this.world.addBody(body);
            }
        };
    })(p2JsDemo || (p2JsDemo = {}));
    var matterDemo;
    (function (matterDemo) {
        var Bodies = Matter.Bodies;
        var World = Matter.World;
        engines.MatterDemo.prototype.loadDemoBasic = function () {
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.gravity.x = 0;
            this.world.gravity.y = 0;
            // Generate some random objects!
            for (var i = 0; i < 100; i++) {
                var body;
                var x = Math.random() * this.stageWidth, y = Math.random() * this.stageHeight;
                // Add random one of either a Circle, Box or Pentagon.
                if (Math.random() < 0.33) {
                    body = Bodies.circle(x, y, 20);
                }
                else if (Math.random() < 0.5) {
                    body = Bodies.rectangle(x, y, 40, 40);
                }
                else {
                    body = Bodies.polygon(x, y, 5, 20);
                }
                World.add(this.world, body);
            }
        };
    })(matterDemo || (matterDemo = {}));
    var physicsJsDemo;
    (function (physicsJsDemo) {
        engines.PhysicsJsDemo.prototype.loadDemoBasic = function () {
            this.gravity.setAcceleration({ x: 0, y: 0 });
            var bodies = this.bodies;
            // Generate some random objects!
            for (var i = 0; i < 100; i++) {
                var body;
                var x = Math.random() * this.stageWidth, y = Math.random() * this.stageHeight;
                // Add random one of either a Circle, Box or Pentagon.
                if (Math.random() < 0.33) {
                    bodies.push(Physics.body('circle', {
                        x: x,
                        y: y,
                        radius: 20
                    }));
                }
                else if (Math.random() < 0.5) {
                    bodies.push(Physics.body('rectangle', {
                        x: x,
                        y: y,
                        width: 40,
                        height: 40
                    }));
                }
                else {
                    bodies.push(Physics.body('convex-polygon', {
                        x: x,
                        y: y,
                        vertices: DemoEngineBase.Regular(20, 20, 5, 0, VertFormat.Vector)
                    }));
                }
            }
            this.world.add(this.bodies);
        };
    })(physicsJsDemo || (physicsJsDemo = {}));
})(demos || (demos = {}));
//# sourceMappingURL=Basic.js.map