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

		loadDemoBasic:() => void;
		loadDemoStress:() => void;
		loadDemoConstraints:() => void;
		loadDemoRagdolls:() => void;

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

		protected pinBody(body:b2Body, pinned?:Boolean):b2Body
		{
			if (pinned) {
				var jointDef:b2RevoluteJointDef = new b2RevoluteJointDef();
				jointDef.Initialize(this.world.GetGroundBody(), body, body.GetWorldCenter());
				this.world.CreateJoint(jointDef);
			}

			return body;
		}
		protected createBody(x:number, y:number, shape:any, pinned?:boolean):b2Body
		{
			var bodyDef:b2BodyDef = new b2BodyDef();
			var fixDef:b2FixtureDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.density = 1.0;
			fixDef.friction = 0.3;

			bodyDef.position.Set(x, y);
			var body:b2Body = this.world.CreateBody(bodyDef);
			fixDef.shape = shape;
			body.CreateFixture(fixDef);

			return this.pinBody(body, pinned);
		}
		protected createBox(x:number, y:number, width:number, height:number, pinned?:boolean):b2Body
		{
			width *= 2 * 0.5;
			height *= 2 * 0.5;
			return this.createBody(x, y, b2PolygonShape.AsBox(width, height), pinned);
		}
		protected createCircle(x:number, y:number, radius:number, pinned?:boolean):b2Body
		{
			return this.createBody(x, y, new b2CircleShape(radius), pinned);
		}

		protected createFromData(x:number, y:number, data:any)
		{
			const WORLD_SCALE = this.worldScale;
			const DEG2RAD = 1 / (180 / Math.PI);

			const bodiesData = data.bodies;
			const jointsData = data.joints;
			const bodyRegistry:{[id:string]:b2Body} = {};

			const bodyDef:b2BodyDef = new b2BodyDef();

			x *= WORLD_SCALE;
			y *= WORLD_SCALE;

			if(bodiesData)
			for(let bodyData of bodiesData)
			{
				if(bodyData.type === undefined || bodyData.type === 'dynamic')
					bodyDef.type = b2Body.b2_dynamicBody;
				else if(bodyData.type === 'static')
					bodyDef.type = b2Body.b2_staticBody;
				else if(bodyData.type === 'kinematic')
					bodyDef.type = b2Body.b2_kinematicBody;

				bodyDef.position.Set(x + bodyData.x * WORLD_SCALE, y + bodyData.y * WORLD_SCALE);

				var body:b2Body = this.world.CreateBody(bodyDef);
				if(bodyData.id !== undefined)
				{
					bodyRegistry[bodyData.id] = body;
				}

				if(bodyData.shape)
				{
					const shapeData = bodyData.shape;
					const shapeType = shapeData.type;
					var fixtureDef:b2FixtureDef = new b2FixtureDef();

					if(shapeType === 'box')
						fixtureDef.shape = b2PolygonShape.AsBox(shapeData.width * 0.5 * WORLD_SCALE, shapeData.height * 0.5 * WORLD_SCALE);
					else if(shapeType === 'circle')
						fixtureDef.shape = new b2CircleShape(shapeData.radius * WORLD_SCALE);
					else
						console.error(`Unsupported shape type "${shapeType}"`);

					if(shapeData.density !== undefined)
						fixtureDef.density = shapeData.density;
					if(shapeData.friction !== undefined)
						fixtureDef.friction = shapeData.friction;
					if(shapeData.restitution !== undefined)
						fixtureDef.restitution = shapeData.restitution;

					body.CreateFixture(fixtureDef);
				}

				if(bodyData.impulse)
				{
					let impulse:b2Vec2;

					if(bodyData.impulse instanceof b2Vec2)
					{
						impulse = bodyData.impulse;
					}
					else if(bodyData.impulse instanceof Function)
					{
						let impulseData = bodyData.impulse();
						impulse = new b2Vec2(impulseData[0], impulseData[1]);
					}

					if(impulse)
						body.ApplyImpulse(impulse, body.GetWorldCenter());
				}
			}

			if(jointsData)
			for(let jointData of jointsData)
			{
				const type = jointData.type;
				const body1 = bodyRegistry[jointData.body1];
				const body2 = bodyRegistry[jointData.body2];

				if(!body1 || !body2)
				{
					console.error(`Cannot find body with id "${!body1 ? jointData.body1 : jointData.body2}"`);
					continue;
				}

				if(type == 'revolute')
				{
					let jointDef:b2RevoluteJointDef = new b2RevoluteJointDef();

					if(jointData.lowerLimit != undefined || jointData.upperLimit != undefined)
					{
						jointDef.enableLimit = true;
						if(jointData.lowerLimit != undefined)
							jointDef.lowerAngle = jointData.lowerLimit * DEG2RAD;
						if(jointData.upperLimit != undefined)
							jointDef.upperAngle = jointData.upperLimit * DEG2RAD;
					}

					jointDef.Initialize(body1, body2, new b2Vec2(x + jointData.worldAnchorX * WORLD_SCALE, y + jointData.worldAnchorY * WORLD_SCALE));
					this.world.CreateJoint(jointDef);
				}
				else
				{
					console.error(`Unsupported joint type "${type}"`);
				}
			}
		}

		/*
		 *** Events
		 */

		onMouseDown()
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
				this.mouseAction = MouseAction.Handled;
			}
		}

		onMouseUp()
		{
			if(this.mouseJoint)
			{
				this.world.DestroyJoint(this.mouseJoint);
				this.mouseJoint = null;
			}
		}

	}

}