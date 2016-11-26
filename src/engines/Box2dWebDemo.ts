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
	import b2AABB = Box2D.Collision.b2AABB;

	import b2MouseJoint = Box2D.Dynamics.Joints.b2MouseJoint;
	import b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
	import b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
	import b2JointDef = Box2D.Dynamics.Joints.b2JointDef;
	import b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;

	import Overlay = overlay.Overlay;
	import b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
	import b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;
	import b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;
	import b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef;
	import b2Settings = Box2D.Common.b2Settings;
	import b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
	import b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

	export class Box2dWebDemo extends DemoEngineBase
	{

		public name:string = 'Box2DWeb';

		protected world:b2World;
		protected debugDraw:b2DebugDraw;
		protected mouseJoint:b2MouseJoint;
		protected groundBody:b2Body;

		protected simulationTime:number = 0;
		protected elapsedTime:number = 0;

		setup()
		{
			this.autoClearCanvas = true;
			this.world = new b2World(new b2Vec2(), true);
			this.setDrawScale(30);

			const DRAW_SCALE = this.drawScale;
			const WORLD_SCALE = this.worldScale;

			// Borders
			{
				const w = this.stageWidth * WORLD_SCALE;
				const h = this.stageHeight * WORLD_SCALE;
				const hw = w / 2;
				const hh = h / 2;
				const t = 200 * WORLD_SCALE;
				const ht = t / 2;

				let borderBodyDef:b2BodyDef = new b2BodyDef();
				let borderBody:b2Body;

				borderBodyDef.position.Set(hw, 0 - ht);
				borderBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(hw + t, ht), 0);
				(<any>borderBody).doNotClear = true;

				borderBodyDef.position.Set(hw, h + ht);
				borderBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(hw + t, ht), 0);
				(<any>borderBody).doNotClear = true;

				borderBodyDef.position.Set(0 - ht, hh);
				borderBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(ht, hh + t), 0);
				(<any>borderBody).doNotClear = true;

				borderBodyDef.position.Set(w + ht, hh);
				borderBody = this.groundBody = this.world.CreateBody(borderBodyDef);
				borderBody.CreateFixture2(b2PolygonShape.AsBox(ht, hh + t), 0);
				(<any>borderBody).doNotClear = true;
			}

			var debugDraw = this.debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(this.context);
			debugDraw.SetDrawScale(DRAW_SCALE);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			this.world.SetDebugDraw(debugDraw);
		}

		clear()
		{
			super.clear();

			this.simulationTime = 0;
			this.elapsedTime = 0;

			var bodies = this.world.GetBodyList();
			while(bodies)
			{
				let nextBody = bodies.GetNext();

				if(!(<any>bodies).doNotClear)
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
			const WORLD_SCALE = this.worldScale;

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
				bodyDef.position.Set(Math.random() * this.stageWidth * WORLD_SCALE, Math.random() * this.stageHeight * WORLD_SCALE);

				let body:b2Body = this.world.CreateBody(bodyDef);

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
		}

		loadDemoStress()
		{
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = 35;
			this.positionIterations = 15;
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
		}

		loadDemoConstraints()
		{
			const DRAW_SCALE = this.drawScale;
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = 10;
			this.positionIterations = 10;
			this.world.SetGravity(new b2Vec2(0, 9.82));

			const w:number = this.stageWidth;
			const h:number = this.stageHeight;

			// Constraint settings.
			const frequency:number = 20.0;
			const damping:number = 1.0;

			// Cell sizes
			const cellWcnt:number = 3;
			const cellHcnt:number = 3;
			const cellWidth:number = w / cellWcnt;
			const cellHeight:number = h / cellHcnt;
			const size:number = 22 * WORLD_SCALE;

			var bodyDef:b2BodyDef = new b2BodyDef();
			var fixDef:b2FixtureDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.density = 1.0;
			fixDef.friction = 0.3;

			// Environment for each cell.
			var withCell = (i:number, j:number, title:string, f:Function) =>
			{
				this.overlays.push(
					new Overlay(
						i * cellWidth + cellWidth * 0.5, j * cellHeight + 5,
						title, null,
						{valign: 'top'}
					)
				);

				f(
					(x:number):number => { return (x + (i * cellWidth)) * WORLD_SCALE; },
					(y:number):number => { return (y + (j * cellHeight)) * WORLD_SCALE; }
				);
			};
			// Box utility.
			var box = (x:number, y:number, radius:number, pinned:boolean=false):b2Body =>
			{
				bodyDef.position.Set(x, y);
				var body:b2Body = this.world.CreateBody(bodyDef);
				fixDef.shape = b2PolygonShape.AsBox(radius * 2 * 0.5, radius * 2 * 0.5);
				body.CreateFixture(fixDef);
				if (pinned) {
					var jointDef:b2RevoluteJointDef = new b2RevoluteJointDef();
					jointDef.Initialize(this.world.GetGroundBody(), body, body.GetWorldCenter());
					this.world.CreateJoint(jointDef);
				}
				return body;
			};
			// Circle utility.
			var circle = (x:number, y:number, radius:number, pinned:boolean=false):b2Body =>
			{
				bodyDef.position.Set(x, y);
				var body:b2Body = this.world.CreateBody(bodyDef);
				fixDef.shape = new b2CircleShape(radius);
				body.CreateFixture(fixDef);
				if (pinned) {
					var jointDef:b2RevoluteJointDef = new b2RevoluteJointDef();
					jointDef.Initialize(this.world.GetGroundBody(), body, body.GetWorldCenter());
					this.world.CreateJoint(jointDef);
				}
				return body;
			};

			// Create regions for each constraint demo
			var regionBodyDef:b2BodyDef = new b2BodyDef();
			var regionBody:b2Body = this.world.CreateBody(regionBodyDef);
			var regionFixDef:b2FixtureDef = new b2FixtureDef();
			var i:number;
			for (i = 1; i < cellWcnt; i++) {
				regionFixDef.shape = b2PolygonShape.AsVector(DemoEngineBase.Box((i*cellWidth-0.5) * WORLD_SCALE, h / 2 * WORLD_SCALE, 1 * WORLD_SCALE, h * WORLD_SCALE, VertFormat.Vector, b2Vec2));
				regionBody.CreateFixture(regionFixDef);
			}
			for (i = 1; i < cellHcnt; i++) {
				regionFixDef.shape = b2PolygonShape.AsVector(DemoEngineBase.Box(w / 2 * WORLD_SCALE, (i*cellHeight-0.5) * WORLD_SCALE, w * WORLD_SCALE, 1 * WORLD_SCALE, VertFormat.Vector, b2Vec2));
				regionBody.CreateFixture(regionFixDef);
			}

			var format = (c:any) => {
				c.collideConnected = true;
				return c;
			};

			withCell(1, 0, "RevoluteJoint", (x:Function, y:Function):void => {
				var b1:b2Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var pivotPoint:b2Vec2 = new b2Vec2(x(cellWidth/2),y(cellHeight/2));
				var jointDef:b2RevoluteJointDef = format(new b2RevoluteJointDef());
				jointDef.Initialize(b1, b2, pivotPoint);
				this.world.CreateJoint(jointDef);
			});

			withCell(2, 0, "WeldJoint", (x:Function, y:Function):void => {
				var b1:b2Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var weldPoint:b2Vec2 = new b2Vec2(x(cellWidth/2),y(cellHeight/2));
				var jointDef:b2WeldJointDef = format(new b2WeldJointDef());
				jointDef.Initialize(b1, b2, weldPoint);
				jointDef.referenceAngle = /*phase*/ Math.PI/4 /*45 degrees*/;
				this.world.CreateJoint(jointDef);
			});

			withCell(0, 1, "DistanceJoint", (x:Function, y:Function):void => {
				var b1:b2Body = box(x(1.25*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = box(x(1.75*cellWidth/3),y(cellHeight/2),size);

				var jointDef:b2DistanceJointDef = format(new b2DistanceJointDef());
				var a1:b2Vec2 = b1.GetWorldCenter().Copy();
				a1.Add(new b2Vec2(0, -size));
				var a2:b2Vec2 = b2.GetWorldCenter().Copy();
				a2.Add(new b2Vec2(0, -size));
				jointDef.Initialize(b1, b2, a1, a2);
				jointDef.length = cellWidth/3*0.75 * WORLD_SCALE;
				// 	/*jointMin*/ cellWidth/3*0.75 * SCALE,
				// 	/*jointMax*/ cellWidth/3*1.25 * SCALE
				this.world.CreateJoint(jointDef);

				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Min/Max limits not supported', {valign: 'top'});
			});

			withCell(1, 1, "LineJoint", (x:Function, y:Function):void => {
				var b1:b2Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var anchorPoint:b2Vec2 = new b2Vec2(x(cellWidth/2),y(cellHeight/2));
				var jointDef:b2LineJointDef = format(new b2LineJointDef());
				jointDef.Initialize(b1, b2, anchorPoint, new b2Vec2(0, 1));
				jointDef.enableLimit = true;
				jointDef.lowerTranslation = -size;
				jointDef.upperTranslation = size;
				this.world.CreateJoint(jointDef);
			});

			withCell(2, 1, "PulleyJoint", (x:Function, y:Function):void => {
				var b1x = x(cellWidth/2);
				var b1y = y(size);

				var b2:b2Body = box(x(1*cellWidth/3),y(cellHeight/2),size/2);
				var b3:b2Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var a2:b2Vec2 = b2.GetWorldCenter().Copy();
				a2.Add(new b2Vec2(0, -size/2));
				var a3:b2Vec2 = b3.GetWorldCenter().Copy();
				a3.Add(new b2Vec2(0, -size));

				var jointDef:b2PulleyJointDef = format(new b2PulleyJointDef());
				jointDef.Initialize(b2, b3, new b2Vec2(b1x-size*2, b1y), new b2Vec2(b1x+size*2, b1y), a2, a3, 2);
				this.world.CreateJoint(jointDef);

				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(cellHeight) * DRAW_SCALE - 10, 'Dynamic anchor points not supported', {valign: 'bottom'});
			});

			withCell(0, 2, "GearJoint", (x:Function, y:Function):void => {
				var b1:b2Body = circle(x(cellWidth/2)-size,y(cellHeight/2),size, true);
				var b2:b2Body = circle(x(cellWidth/2)+size*2,y(cellHeight/2),size * 2, true);

				var jointDef:b2GearJointDef = new b2GearJointDef();
				jointDef.bodyA = b1;
				jointDef.bodyB = b2;
				jointDef.joint1 = b1.GetJointList().joint;
				jointDef.joint2 = b2.GetJointList().joint;
				jointDef.ratio = 2;
				this.world.CreateJoint(jointDef);
			});

			withCell(1, 2, "RevoluteJoint Motor", (x:Function, y:Function):void => {
				var b2:b2Body = box(x(cellWidth/2),y(cellHeight/2),size, true);
				var joint:b2RevoluteJoint = <b2RevoluteJoint> b2.GetJointList().joint;
				joint.EnableMotor(true);
				joint.SetMaxMotorTorque(50);
				joint.SetMotorSpeed(1.5);
			});

			withCell(2, 2, "PrismaticJoint", (x:Function, y:Function):void => {
				var b1:b2Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var jointDef:b2PrismaticJointDef = new b2PrismaticJointDef();
				jointDef.Initialize(b1, b2, b2.GetWorldCenter(), new b2Vec2(0,1));
				jointDef.lowerTranslation = -25.0 * WORLD_SCALE;
				jointDef.upperTranslation = 75.0 * WORLD_SCALE;
				jointDef.enableLimit = true;

				this.world.CreateJoint(jointDef);
			});
		}

		protected runInternal(deltaTime:number, timestamp:number)
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
			const mouseX = this.mouseX * this.worldScale;
			const mouseY = this.mouseY * this.worldScale;
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
			return new b2Vec2(this.mouseX * this.worldScale, this.mouseY * this.worldScale);
		}

	}

}