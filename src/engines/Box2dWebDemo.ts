///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/box2dweb/box2dweb.d.ts'/>

namespace engines
{
	import b2World = Box2D.Dynamics.b2World;
	import b2Vec2 = Box2D.Common.Math.b2Vec2;
	import b2BodyDef = Box2D.Dynamics.b2BodyDef;
	import b2Body = Box2D.Dynamics.b2Body;
	import b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	import b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	import b2Fixture = Box2D.Dynamics.b2Fixture;
	import b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	import b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	import b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint;
	import b2AABB = Box2D.Collision.b2AABB;
	import b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;

	const DRAW_SCALE = 30;
	const SCALE = 1 / DRAW_SCALE;

	export class Box2dWebDemo extends DemoEngineBase
	{
		private world:b2World;
		private debugDraw:b2DebugDraw;
		private mouseJoint:b2MouseJoint;
		private groundBody:b2Body;

		private simulationTime:number = 0;
		private elapsedTime:number = 0;

		setup()
		{
			this.autoClearCanvas = true;

			this.world = new b2World(new b2Vec2(), true);

			// Borders
			{
				const w = this.stageWidth * SCALE;
				const h = this.stageHeight * SCALE;
				const hw = w / 2;
				const hh = h / 2;
				const t = 200 * SCALE;
				const ht = t / 2;

				let borderBodyDef:b2BodyDef = new b2BodyDef();
				let borderBody:b2Body;

				borderBodyDef.position.Set(hw, 0 - ht);
				borderBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(hw + t, ht), 0);

				borderBodyDef.position.Set(hw, h + ht);
				borderBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(hw + t, ht), 0);

				borderBodyDef.position.Set(0 - ht, hh);
				borderBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(ht, hh + t), 0);

				borderBodyDef.position.Set(w + ht, hh);
				borderBody = this.groundBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(ht, hh + t), 0);
			}

			var debugDraw = this.debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(this.context);
			debugDraw.SetDrawScale(DRAW_SCALE);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(debugDraw);

			var bodyDef:b2BodyDef = new b2BodyDef();
			bodyDef.position.Set(0.0, 4.0);
			bodyDef.type = b2Body.b2_dynamicBody;
			var body:b2Body = this.world.CreateBody(bodyDef);
			var def:b2FixtureDef = new b2FixtureDef();
			def.shape = b2PolygonShape.AsBox(1,1);
			def.density = 1.0;
			def.friction = 0.3;
			body.CreateFixture(def);
		}

		clear()
		{
			this.simulationTime = 0;
			this.elapsedTime = 0;

			var bodies = this.world.GetBodyList();
			while(bodies)
			{
				let nextBody = bodies.GetNext();

				if(bodies.GetType() == b2Body.b2_dynamicBody)
				{
					this.world.DestroyBody(bodies);
				}

				bodies = nextBody;
			}

			var joints = this.world.GetJointList();
			while(joints)
			{
				let nextJoint = joints.GetNext();

				this.world.DestroyJoint(joints);

				joints = nextJoint;
			}
		}

		loadDemo(name:string)
		{
			super.loadDemo(name);
		}

		loadDemoBasic()
		{
			this.velocityIterations = 10;
			this.positionIterations = 10;
			this.world.SetGravity(new b2Vec2(0, 0));

			var bodyDef:b2BodyDef = new b2BodyDef();
			var fixDef:b2FixtureDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.density = 1.0;
			fixDef.friction = 0.3;

			// Generate some random objects!
			for (var i:number = 0; i < 100; i++) {
				bodyDef.position.Set(Math.random() * this.stageWidth * SCALE, Math.random() * this.stageHeight * SCALE);

				let body:b2Body = this.world.CreateBody(bodyDef);

				// Add random one of either a Circle, Box or Pentagon.
				if (Math.random() < 0.33) {
					fixDef.shape = new b2CircleShape(20 * SCALE);
				}
				else if (Math.random() < 0.5) {
					fixDef.shape = b2PolygonShape.AsBox(40 * SCALE * 0.5, 40 * SCALE * 0.5);
				}
				else {
					fixDef.shape = b2PolygonShape.AsVector(DemoEngineBase.Regular(20 * SCALE, 20 * SCALE, 5, 0, VertFormat.Vector, b2Vec2));
				}

				body.CreateFixture(fixDef);
			}
		}

		loadDemoStress()
		{
			this.velocityIterations = 35;
			this.positionIterations = 15;
			this.world.SetGravity(new b2Vec2(0, 9.82));

			const sw = this.stageWidth;
			const sh = this.stageHeight;
			const boxWidth:number = 10;
			const boxHeight:number = 14;
			const bw:number = boxWidth * SCALE * 0.5;
			const bh:number = boxHeight * SCALE * 0.5;
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
						((sw/2) - boxWidth*((y-1)/2 - x)*0.99) * SCALE,
						(sh - boxHeight*(pyramidHeight - y + 0.5)*0.99) * SCALE
					);

					let body:b2Body = this.world.CreateBody(bodyDef);
					fixDef.shape = b2PolygonShape.AsBox(bw, bh);
					body.CreateFixture(fixDef);
				}
			}
		}

		run = (deltaTime:number, timestamp:number) =>
		{
			if(deltaTime > 0.05)
			{
				deltaTime = 0.05;
			}

			this.simulationTime += deltaTime;

			if(this.mouseJoint)
			{
				this.mouseJoint.SetTarget(this.getWorldMouse());
			}

			// Keep on stepping forward by fixed time step until amount of time
			// needed has been simulated.
			while(this.elapsedTime < this.simulationTime)
			{
				this.world.Step(this.frameRateInterval, this._velocityIterations, this._positionIterations);
				this.elapsedTime += this.frameRateInterval;
			}

			if(this._enableDrawing)
			{
				this.world.DrawDebugData();
			}
		};

		/*
		 *** Events
		 */

		onMouseDown = () =>
		{
			var body = this.getBodyAtMouse();

			if(body)
			{
				//if joint exists then create
				var def = new b2MouseJointDef();

				def.bodyA = this.groundBody;
				def.bodyB = body;
				def.target = this.getWorldMouse();

				def.collideConnected = true;
				def.maxForce = 10000 * body.GetMass();
				def.dampingRatio = 0;

				this.mouseJoint = <b2MouseJoint> this.world.CreateJoint(def);

				body.SetAwake(true);
			}
		};

		onMouseUp = () =>
		{
			if(this.mouseJoint)
			{
				this.world.DestroyJoint(this.mouseJoint);
				this.mouseJoint = null;
			}
		};

		/*
		 *** Utility Methods
		 */

		getBodyAtMouse(includeStatic = false)
		{
			const mouseX = this.mouseX * SCALE;
			const mouseY = this.mouseY * SCALE;
			var mouse_p = new b2Vec2(mouseX, mouseY);

			var aabb = new b2AABB();
			aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
			aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);

			var body = null;

			// Query the world for overlapping shapes.
			function GetBodyCallback(fixture)
			{
				var shape = fixture.GetShape();

				if(fixture.GetBody().GetType() != b2Body.b2_staticBody || includeStatic)
				{
					var inside = shape.TestPoint(fixture.GetBody().GetTransform(), mouse_p);

					if(inside)
					{
						body = fixture.GetBody();
						return false;
					}
				}

				return true;
			}

			this.world.QueryAABB(GetBodyCallback, aabb);
			return body;
		}

		getWorldMouse():b2Vec2
		{
			return new b2Vec2(this.mouseX * SCALE, this.mouseY * SCALE);
		}

	}

}