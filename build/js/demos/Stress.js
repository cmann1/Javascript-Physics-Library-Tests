///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>
var demos;
(function (demos) {
    var VELOCITY_ITERATIONS = 35;
    var POSITION_ITERATIONS = 10;
    var napeDemo;
    (function (napeDemo) {
        var Body = nape.phys.Body;
        var Polygon = nape.shape.Polygon;
        engines.NapeDemo.prototype.loadDemoStress = function () {
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.space.gravity.setxy(0, 600);
            var boxWidth = 10;
            var boxHeight = 14;
            var pyramidHeight = 40; //820 blocks
            for (var y = 1; y <= pyramidHeight; y++) {
                for (var x = 0; x < y; x++) {
                    var block = new Body();
                    // We initialise the blocks to be slightly overlapping so that
                    // all contact points will be created in very first step before the blocks
                    // begin to fall.
                    block.position.x = (this.stageWidth / 2) - boxWidth * ((y - 1) / 2 - x) * 0.99;
                    block.position.y = this.stageHeight - boxHeight * (pyramidHeight - y + 0.5) * 0.99;
                    block.shapes.add(new Polygon(Polygon.box(boxWidth, boxHeight)));
                    block.space = this.space;
                }
            }
        };
    })(napeDemo || (napeDemo = {}));
    var box2dWebDemo;
    (function (box2dWebDemo) {
        var b2Body = Box2D.Dynamics.b2Body;
        var b2Vec2 = Box2D.Common.Math.b2Vec2;
        var b2BodyDef = Box2D.Dynamics.b2BodyDef;
        var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        engines.Box2dWebDemo.prototype.loadDemoStress = function () {
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.SetGravity(new b2Vec2(0, 9.82));
            var sw = this.stageWidth;
            var sh = this.stageHeight;
            var boxWidth = 10;
            var boxHeight = 14;
            var bw = boxWidth * WORLD_SCALE * 0.5;
            var bh = boxHeight * WORLD_SCALE * 0.5;
            var pyramidHeight = 40; //820 blocks
            var bodyDef = new b2BodyDef();
            var fixDef = new b2FixtureDef();
            bodyDef.type = b2Body.b2_dynamicBody;
            fixDef.density = 1.0;
            fixDef.friction = 0.9;
            for (var y = 1; y <= pyramidHeight; y++) {
                for (var x = 0; x < y; x++) {
                    // We initialise the blocks to be slightly overlapping so that
                    // all contact points will be created in very first step before the blocks
                    // begin to fall.
                    bodyDef.position.Set(((sw / 2) - boxWidth * ((y - 1) / 2 - x) * 0.99) * WORLD_SCALE, (sh - boxHeight * (pyramidHeight - y + 0.5) * 0.99) * WORLD_SCALE);
                    var body = this.world.CreateBody(bodyDef);
                    fixDef.shape = b2PolygonShape.AsBox(bw, bh);
                    body.CreateFixture(fixDef);
                }
            }
        };
    })(box2dWebDemo || (box2dWebDemo = {}));
    var p2JsDemo;
    (function (p2JsDemo) {
        var Body = p2.Body;
        var Box = p2.Box;
        engines.P2JsDemo.prototype.loadDemoStress = function () {
            var WORLD_SCALE = this.worldScale;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.gravity = [0, 100 * WORLD_SCALE];
            var sw = this.stageWidth;
            var sh = this.stageHeight;
            var boxWidth = 10;
            var boxHeight = 14;
            var bw = boxWidth * WORLD_SCALE;
            var bh = boxHeight * WORLD_SCALE;
            var pyramidHeight = 40; //820 blocks
            for (var y = 1; y <= pyramidHeight; y++) {
                for (var x = 0; x < y; x++) {
                    var block = new Body({ mass: 1 });
                    // We initialise the blocks to be slightly overlapping so that
                    // all contact points will be created in very first step before the blocks
                    // begin to fall.
                    block.position[0] = ((sw / 2) - boxWidth * ((y - 1) / 2 - x) * 0.99) * WORLD_SCALE;
                    block.position[1] = (sh - boxHeight * (pyramidHeight - y + 0.5) * 0.99) * WORLD_SCALE;
                    block.addShape(new Box({ width: bw, height: bh }));
                    this.world.addBody(block);
                }
            }
        };
    })(p2JsDemo || (p2JsDemo = {}));
    var matterDemo;
    (function (matterDemo) {
        var Bodies = Matter.Bodies;
        var World = Matter.World;
        engines.MatterDemo.prototype.loadDemoStress = function () {
            this.engine.enableSleeping = false;
            this.velocityIterations = VELOCITY_ITERATIONS;
            this.positionIterations = POSITION_ITERATIONS;
            this.world.gravity.x = 0;
            this.world.gravity.y = 0.5;
            var boxWidth = 10;
            var boxHeight = 14;
            var pyramidHeight = 40; //820 blocks
            for (var y = 1; y <= pyramidHeight; y++) {
                for (var x = 0; x < y; x++) {
                    // We initialise the blocks to be slightly overlapping so that
                    // all contact points will be created in very first step before the blocks
                    // begin to fall.
                    var block = Bodies.rectangle((this.stageWidth / 2) - boxWidth * ((y - 1) / 2 - x) * 0.99, this.stageHeight - boxHeight * (pyramidHeight - y + 0.5) * 0.99, boxWidth, boxHeight);
                    World.add(this.world, block);
                }
            }
        };
    })(matterDemo || (matterDemo = {}));
    var physicsJsDemo;
    (function (physicsJsDemo) {
        engines.PhysicsJsDemo.prototype.loadDemoStress = function () {
            this.gravity.setAcceleration({ x: 0, y: 0.0004 });
            var bodies = this.bodies;
            var boxWidth = 10;
            var boxHeight = 14;
            var pyramidHeight = 24; // < Cannot handle more
            for (var y = 1; y <= pyramidHeight; y++) {
                for (var x = 0; x < y; x++) {
                    // We initialise the blocks to be slightly overlapping so that
                    // all contact points will be created in very first step before the blocks
                    // begin to fall.
                    bodies.push(Physics.body('rectangle', {
                        x: (this.stageWidth / 2) - boxWidth * ((y - 1) / 2 - x) * 0.99,
                        y: this.stageHeight - boxHeight * (pyramidHeight - y + 0.5) * 0.99,
                        width: boxWidth,
                        height: boxHeight,
                        restitution: 0.3
                    }));
                }
            }
            this.world.add(this.bodies);
            this.addWarning(this.stageWidth / 2, 20, 'Fewer bodies added due\nto poor performance');
        };
    })(physicsJsDemo || (physicsJsDemo = {}));
})(demos || (demos = {}));
//# sourceMappingURL=Stress.js.map