///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>

namespace demos
{

	const VELOCITY_ITERATIONS = 35;
	const POSITION_ITERATIONS = 10;

	namespace napeDemo
	{
		import Body = nape.phys.Body;
		import Polygon = nape.shape.Polygon;

		engines.NapeDemo.prototype.loadDemoStress = function()
		{
			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.space.gravity.setxy(0, 600);

			var boxWidth:number = 10;
			var boxHeight:number = 14;
			var pyramidHeight:number = 40; //820 blocks

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					var block:Body = new Body();
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					block.position.x = (this.stageWidth/2) - boxWidth*((y-1)/2 - x)*0.99;
					block.position.y = this.stageHeight - boxHeight*(pyramidHeight - y + 0.5)*0.99;
					block.shapes.add(new Polygon(Polygon.box(boxWidth, boxHeight)));
					block.space = this.space;
				}}
		};
	}

	namespace box2dWebDemo
	{
		import b2Body = Box2D.Dynamics.b2Body;
		import b2Vec2 = Box2D.Common.Math.b2Vec2;
		import b2BodyDef = Box2D.Dynamics.b2BodyDef;
		import b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		import b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

		engines.Box2dWebDemo.prototype.loadDemoStress = function()
		{
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.world.SetGravity(new b2Vec2(0, 9.82));

			const sw = this.stageWidth;
			const sh = this.stageHeight;
			const boxWidth:number = 10;
			const boxHeight:number = 14;
			const bw:number = boxWidth * WORLD_SCALE * 0.5;
			const bh:number = boxHeight * WORLD_SCALE * 0.5;
			var pyramidHeight:number = 40; //820 blocks

			var bodyDef:b2BodyDef = new b2BodyDef();
			var fixDef:b2FixtureDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.density = 1.0;
			fixDef.friction = 0.9;

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					bodyDef.position.Set(
						((sw/2) - boxWidth*((y-1)/2 - x)*0.99) * WORLD_SCALE,
						(sh - boxHeight*(pyramidHeight - y + 0.5)*0.99) * WORLD_SCALE
					);

					let body:b2Body = this.world.CreateBody(bodyDef);
					fixDef.shape = b2PolygonShape.AsBox(bw, bh);
					body.CreateFixture(fixDef);
				}
			}
		};
	}

	namespace p2JsDemo
	{
		import Body = p2.Body;
		import Box = p2.Box;

		engines.P2JsDemo.prototype.loadDemoStress = function()
		{
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.world.gravity = [0, 100 * WORLD_SCALE];

			const sw = this.stageWidth;
			const sh = this.stageHeight;
			const boxWidth:number = 10;
			const boxHeight:number = 14;
			const bw:number = boxWidth * WORLD_SCALE;
			const bh:number = boxHeight * WORLD_SCALE;
			var pyramidHeight:number = 40; //820 blocks

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					var block:Body = new Body({ mass: 1});
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					block.position[0] = ((sw/2) - boxWidth*((y-1)/2 - x)*0.99) * WORLD_SCALE;
					block.position[1] = (sh - boxHeight*(pyramidHeight - y + 0.5)*0.99) * WORLD_SCALE;
					block.addShape(new Box(<any>{width: bw, height: bh}));
					this.world.addBody(block);
				}}
		};
	}

	namespace matterDemo
	{
		import Body = Matter.Body;
		import Bodies = Matter.Bodies;
		import World = Matter.World;

		engines.MatterDemo.prototype.loadDemoStress = function()
		{
			this.engine.enableSleeping = false;
			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.world.gravity.x = 0;
			this.world.gravity.y = 0.5;

			var boxWidth:number = 10;
			var boxHeight:number = 14;
			var pyramidHeight:number = 40; //820 blocks

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					var block:Body = Bodies.rectangle(
						(this.stageWidth/2) - boxWidth*((y-1)/2 - x)*0.99,
						this.stageHeight - boxHeight*(pyramidHeight - y + 0.5)*0.99,
						boxWidth,
						boxHeight);
					World.add(this.world, block);
				}}
		};
	}

	namespace physicsJsDemo
	{
		engines.PhysicsJsDemo.prototype.loadDemoStress = function()
		{
			this.gravity.setAcceleration({x: 0, y: 0.0004});
			var bodies = this.bodies = [];

			var boxWidth:number = 10;
			var boxHeight:number = 14;
			var pyramidHeight:number = 24; // < Cannot handle more

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					bodies.push(Physics.body('rectangle', {
						x: (this.stageWidth/2) - boxWidth*((y-1)/2 - x)*0.99,
						y: this.stageHeight - boxHeight*(pyramidHeight - y + 0.5)*0.99,
						width: boxWidth,
						height: boxHeight
					}));
				}
			}

			this.world.add(this.bodies);

			this.addWarning(this.stageWidth / 2, 20, 'Fewer bodies added due\nto poor performance');
		};
	}

}