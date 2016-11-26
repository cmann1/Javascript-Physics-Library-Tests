///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>

namespace demos
{
	import DemoEngineBase = engines.DemoEngineBase;
	import VertFormat = engines.VertFormat;
	import Overlay = overlay.Overlay;

	const VELOCITY_ITERATIONS = 10;
	const POSITION_ITERATIONS = 10;

	// Constraint settings.
	const frequency:number = 20.0;
	const damping:number = 1.0;

	// Cell sizes
	const cellWcnt:number = 3;
	const cellHcnt:number = 3;
	// Each demo must set these values to stageWidth or stageWidth/cellWcnt and stageHeight/cellHcnt
	var cellWidth:number = 1;
	var cellHeight:number = 1;
	// Should be multiplied by worldScale before use
	const shapeSize:number = 22;

	// Environment for each cell.
	function withCell(i:number, j:number, title:string, f:Function)
	{
		this.overlays.push(
			new Overlay(
				i * cellWidth + cellWidth * 0.5, j * cellHeight + 5,
				title, null,
				{valign: 'top'}
			)
		);

		f(
			(x:number):number => { return (x + (i * cellWidth)) * this.worldScale; },
			(y:number):number => { return (y + (j * cellHeight)) * this.worldScale; }
		);
	}

	namespace napeDemo
	{
		import Body = nape.phys.Body;
		import BodyType = nape.phys.BodyType;
		import Polygon = nape.shape.Polygon;
		import Constraint = nape.constraint.Constraint;
		import Vec2 = nape.geom.Vec2;
		import AngleJoint = nape.constraint.AngleJoint;
		import LineJoint = nape.constraint.LineJoint;
		import MotorJoint = nape.constraint.MotorJoint;
		import PulleyJoint = nape.constraint.PulleyJoint;
		import PivotJoint = nape.constraint.PivotJoint;
		import DistanceJoint = nape.constraint.DistanceJoint;
		import WeldJoint = nape.constraint.WeldJoint;

		engines.NapeDemo.prototype.loadDemoConstraints = function()
		{
			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.space.gravity.setxy(0, 600);

			const size = shapeSize;
			const w:number = this.stageWidth;
			const h:number = this.stageHeight;
			cellWidth = w / cellWcnt;
			cellHeight = h / cellHcnt;

			// Create regions for each constraint demo
			var regions:Body = new Body(BodyType.STATIC);
			var i:number;
			for (i = 1; i < cellWcnt; i++) {
				regions.shapes.add(new Polygon(Polygon.rect(i*cellWidth-0.5,0,1,h)));
			}
			for (i = 1; i < cellHcnt; i++) {
				regions.shapes.add(new Polygon(Polygon.rect(0,i*cellHeight-0.5,w,1)));
			}
			regions.space = this.space;

			// Common formatting of constraints.
			var format = (c:Constraint) => {
				c.stiff = false;
				c.frequency = frequency;
				c.damping = damping;
				c.space = this.space;
			};

			withCell.call(this, 1, 0, "PivotJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var pivotPoint:Vec2 = Vec2.get(x(cellWidth/2),y(cellHeight/2));
				format(new PivotJoint(
					b1, b2,
					b1.worldPointToLocal(pivotPoint, true),
					b2.worldPointToLocal(pivotPoint, true)
				));
				pivotPoint.dispose();
			});

			withCell.call(this, 2, 0, "WeldJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var weldPoint:Vec2 = Vec2.get(x(cellWidth/2),y(cellHeight/2));
				format(new WeldJoint(
					b1, b2,
					b1.worldPointToLocal(weldPoint, true),
					b2.worldPointToLocal(weldPoint, true),
					/*phase*/ Math.PI/4 /*45 degrees*/
				));
				weldPoint.dispose();
			});

			withCell.call(this, 0, 1, "DistanceJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1.25*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(1.75*cellWidth/3),y(cellHeight/2),size);

				format(new DistanceJoint(
					b1, b2,
					Vec2.weak(0, -size),
					Vec2.weak(0, -size),
					/*jointMin*/ cellWidth/3*0.75,
					/*jointMax*/ cellWidth/3*1.25
				));
			});

			withCell.call(this, 1, 1, "LineJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var anchorPoint:Vec2 = Vec2.get(x(cellWidth/2),y(cellHeight/2));
				format(new LineJoint(
					b1, b2,
					b1.worldPointToLocal(anchorPoint, true),
					b2.worldPointToLocal(anchorPoint, true),
					/*direction*/ Vec2.weak(0, 1),
					/*jointMin*/ -size,
					/*jointMax*/ size
				));
				anchorPoint.dispose();
			});

			withCell.call(this, 2, 1, "PulleyJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(cellWidth/2),y(size),size/2, true);
				b1.scaleShapes(4, 1);

				var b2:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size/2);
				var b3:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				format(new PulleyJoint(
					b1, b2,
					b1, b3,
					Vec2.weak(-size*2, 0), Vec2.weak(0, -size/2),
					Vec2.weak( size*2, 0), Vec2.weak(0, -size),
					/*jointMin*/ cellHeight*0.75,
					/*jointMax*/ cellHeight*0.75,
					/*ratio*/ 2.5
				));
			});

			withCell.call(this, 0, 2, "AngleJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size, true);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size, true);

				format(new AngleJoint(
					b1, b2,
					/*jointMin*/ -Math.PI*1.5,
					/*jointMax*/ Math.PI*1.5,
					/*ratio*/ 2
				));
			});

			withCell.call(this, 1, 2, "MotorJoint", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size, true);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size, true);

				format(new MotorJoint(
					b1, b2,
					/*rate*/ 10,
					/*ratio*/ 3
				));
			});

			withCell.call(this, 2, 2, "PrismaticJoint\n(LineJoint + AngleJoint)", (x:Function, y:Function) => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var anchorPoint:Vec2 = Vec2.get(x(cellWidth/2),y(cellHeight/2));
				format(new LineJoint(
					b1, b2,
					b1.worldPointToLocal(anchorPoint, true),
					b2.worldPointToLocal(anchorPoint, true),
					/*direction*/ Vec2.weak(0, 1),
					/*jointMin*/ -25,
					/*jointMax*/ 75
				));
				anchorPoint.dispose();

				format(new AngleJoint(
					b1, b2,
					/*jointMin*/ 0,
					/*jointMax*/ 0,
					/*ratio*/ 1
				));
			});
		};
	}

	namespace box2dWebDemo
	{
		import b2Body = Box2D.Dynamics.b2Body;
		import b2Vec2 = Box2D.Common.Math.b2Vec2;
		import b2BodyDef = Box2D.Dynamics.b2BodyDef;
		import b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		import b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		import b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
		import b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
		import b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
		import b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;
		import b2PulleyJointDef = Box2D.Dynamics.Joints.b2PulleyJointDef;
		import b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;
		import b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
		import b2GearJointDef = Box2D.Dynamics.Joints.b2GearJointDef;

		engines.Box2dWebDemo.prototype.loadDemoConstraints = function()
		{
			const DRAW_SCALE = this.drawScale;
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.world.SetGravity(new b2Vec2(0, 9.82));

			const size = shapeSize * WORLD_SCALE;
			const w:number = this.stageWidth;
			const h:number = this.stageHeight;
			cellWidth = w / cellWcnt;
			cellHeight = h / cellHcnt;

			var bodyDef:b2BodyDef = new b2BodyDef();
			var fixDef:b2FixtureDef = new b2FixtureDef();

			bodyDef.type = b2Body.b2_dynamicBody;
			fixDef.density = 1.0;
			fixDef.friction = 0.3;

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

			withCell.call(this, 1, 0, "RevoluteJoint", (x:Function, y:Function):void => {
				var b1:b2Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var pivotPoint:b2Vec2 = new b2Vec2(x(cellWidth/2),y(cellHeight/2));
				var jointDef:b2RevoluteJointDef = format(new b2RevoluteJointDef());
				jointDef.Initialize(b1, b2, pivotPoint);
				this.world.CreateJoint(jointDef);
			});

			withCell.call(this, 2, 0, "WeldJoint", (x:Function, y:Function):void => {
				var b1:b2Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var weldPoint:b2Vec2 = new b2Vec2(x(cellWidth/2),y(cellHeight/2));
				var jointDef:b2WeldJointDef = format(new b2WeldJointDef());
				jointDef.Initialize(b1, b2, weldPoint);
				jointDef.referenceAngle = /*phase*/ Math.PI/4 /*45 degrees*/;
				this.world.CreateJoint(jointDef);
			});

			withCell.call(this, 0, 1, "DistanceJoint", (x:Function, y:Function):void => {
				var b1:b2Body = this.createBox(x(1.25*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = this.createBox(x(1.75*cellWidth/3),y(cellHeight/2),size);

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

			withCell.call(this, 1, 1, "LineJoint", (x:Function, y:Function):void => {
				var b1:b2Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var anchorPoint:b2Vec2 = new b2Vec2(x(cellWidth/2),y(cellHeight/2));
				var jointDef:b2LineJointDef = format(new b2LineJointDef());
				jointDef.Initialize(b1, b2, anchorPoint, new b2Vec2(0, 1));
				jointDef.enableLimit = true;
				jointDef.lowerTranslation = -size;
				jointDef.upperTranslation = size;
				this.world.CreateJoint(jointDef);
			});

			withCell.call(this, 2, 1, "PulleyJoint", (x:Function, y:Function):void => {
				var b1x = x(cellWidth/2);
				var b1y = y(size);

				var b2:b2Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size/2);
				var b3:b2Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var a2:b2Vec2 = b2.GetWorldCenter().Copy();
				a2.Add(new b2Vec2(0, -size/2));
				var a3:b2Vec2 = b3.GetWorldCenter().Copy();
				a3.Add(new b2Vec2(0, -size));

				var jointDef:b2PulleyJointDef = format(new b2PulleyJointDef());
				jointDef.Initialize(b2, b3, new b2Vec2(b1x-size*2, b1y), new b2Vec2(b1x+size*2, b1y), a2, a3, 2);
				this.world.CreateJoint(jointDef);

				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(cellHeight) * DRAW_SCALE - 10, 'Dynamic anchor points not supported', {valign: 'bottom'});
			});

			withCell.call(this, 0, 2, "GearJoint", (x:Function, y:Function):void => {
				var b1:b2Body = this.createCircle(x(cellWidth/2)-size,y(cellHeight/2),size, true);
				var b2:b2Body = this.createCircle(x(cellWidth/2)+size*2,y(cellHeight/2),size * 2, true);

				var jointDef:b2GearJointDef = new b2GearJointDef();
				jointDef.bodyA = b1;
				jointDef.bodyB = b2;
				jointDef.joint1 = b1.GetJointList().joint;
				jointDef.joint2 = b2.GetJointList().joint;
				jointDef.ratio = 2;
				this.world.CreateJoint(jointDef);
			});

			withCell.call(this, 1, 2, "RevoluteJoint Motor", (x:Function, y:Function):void => {
				var b2:b2Body = this.createBox(x(cellWidth/2),y(cellHeight/2),size, true);
				var joint:b2RevoluteJoint = <b2RevoluteJoint> b2.GetJointList().joint;
				joint.EnableMotor(true);
				joint.SetMaxMotorTorque(50);
				joint.SetMotorSpeed(1.5);
			});

			withCell.call(this, 2, 2, "PrismaticJoint", (x:Function, y:Function):void => {
				var b1:b2Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:b2Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var jointDef:b2PrismaticJointDef = new b2PrismaticJointDef();
				jointDef.Initialize(b1, b2, b2.GetWorldCenter(), new b2Vec2(0,1));
				jointDef.lowerTranslation = -25.0 * WORLD_SCALE;
				jointDef.upperTranslation = 75.0 * WORLD_SCALE;
				jointDef.enableLimit = true;

				this.world.CreateJoint(jointDef);
			});
		};
	}

	namespace p2JsDemo
	{
		import Body = p2.Body;
		import Box = p2.Box;
		import RevoluteConstraint = p2.RevoluteConstraint;
		import LockConstraint = p2.LockConstraint;
		import DistanceConstraint = p2.DistanceConstraint;
		import PrismaticConstraint = p2.PrismaticConstraint;
		import GearConstraint = p2.GearConstraint;

		engines.P2JsDemo.prototype.loadDemoConstraints = function()
		{
			const DRAW_SCALE = this.drawScale;
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.world.gravity = [0, 600 * WORLD_SCALE];

			const size = shapeSize * WORLD_SCALE;
			const w:number = this.stageWidth;
			const h:number = this.stageHeight;
			cellWidth = w / cellWcnt;
			cellHeight = h / cellHcnt;

			// Create regions for each constraint demo
			var i:number;
			for (i = 1; i < cellWcnt; i++) {
				let body:Body = new Body();
				body.position = [(i*cellWidth-0.5) * WORLD_SCALE, h / 2 * WORLD_SCALE];
				body.addShape(new Box(<any>{width: 1 * WORLD_SCALE, height: h * WORLD_SCALE}));
				this.world.addBody(body);
			}
			for (i = 1; i < cellHcnt; i++) {
				let body:Body = new Body();
				body.position = [w / 2 * WORLD_SCALE, (i*cellHeight-0.5) * WORLD_SCALE];
				body.addShape(new Box(<any>{width: w * WORLD_SCALE, height: 1 * WORLD_SCALE}));
				this.world.addBody(body);
			}

			withCell.call(this, 1, 0, "RevoluteJoint", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var pivotPoint = [x(cellWidth/2),y(cellHeight/2)];
				var joint:RevoluteConstraint = new RevoluteConstraint(b1, b2, {worldPivot: pivotPoint});
				this.world.addConstraint(joint);
			});

			withCell.call(this, 2, 0, "LockJoint", (x:Function, y:Function):void => {
				const a = Math.PI/4;
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				b1.angle = a * 1.5;
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);
				b2.angle = -Math.PI + a * 0.5;

				var weldPoint = [x(cellWidth/2),y(cellHeight/2)];
				b2.toLocalFrame(weldPoint, weldPoint);
				var joint:LockConstraint = new LockConstraint(b1, b2);
				this.world.addConstraint(joint);
			});

			withCell.call(this, 0, 1, "DistanceJoint", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(1.25*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(1.75*cellWidth/3),y(cellHeight/2),size);

				var joint = new DistanceConstraint(b1, b2, {
					distance: cellWidth/3*0.75 * WORLD_SCALE,
					localAnchorA: [0, -size],
					localAnchorB: [0, -size]
				});
				joint.lowerLimitEnabled = true;
				joint.upperLimitEnabled = true;
				joint.lowerLimit = cellWidth/3*0.75 * WORLD_SCALE;
				joint.upperLimit = cellWidth/3*1.25 * WORLD_SCALE;
				this.world.addConstraint(joint);
			});

			withCell.call(this, 1, 1, "LineJoint\n(PrismaticJoint/disableRotationalLock)", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var anchorPoint = [x(cellWidth/2),y(cellHeight/2)];
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
				this.world.addConstraint(joint);
			});

			withCell.call(this, 2, 1, "PulleyJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Pulley constraint not supported', {valign: 'top'});
			});

			withCell.call(this, 0, 2, "GearJoint", (x:Function, y:Function):void => {
				var b1:Body = this.createCircle(x(cellWidth/2)-size,y(cellHeight/2),size, true);
				var b2:Body = this.createCircle(x(cellWidth/2)+size*2,y(cellHeight/2),size * 2, true);

				var joint = new GearConstraint(b2, b1, {
					ratio: 2
				});
				this.world.addConstraint(joint);

			});

			withCell.call(this, 1, 2, "RevoluteJoint Motor", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(cellWidth/2),y(cellHeight/2),size, true);

				var joint:RevoluteConstraint = (<any>b1)._pin;
				joint.enableMotor();
				joint.setMotorSpeed(1.5);
			});

			withCell.call(this, 2, 2, "PrismaticJoint", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				var anchorPoint = [x(cellWidth/2),y(cellHeight/2)];
				var localA = [];
				b1.toLocalFrame(localA, b2.position);
				var joint = new PrismaticConstraint(b1, b2, {
					localAxisA: [0, 1],
					localAnchorA: localA,
					localAnchorB: [0, 0],
					lowerLimit: -25.0 * WORLD_SCALE,
					upperLimit: 75.0 * WORLD_SCALE,
				});
				this.world.addConstraint(joint);
			});
		};
	}

	namespace matterDemo
	{
		import Body = Matter.Body;
		import Bodies = Matter.Bodies;
		import World = Matter.World;
		import Vector = Matter.Vector;
		import MatterDemo = engines.MatterDemo;
		import Constraint = Matter.Constraint;

		engines.MatterDemo.prototype.loadDemoConstraints = function()
		{
			const DRAW_SCALE = this.drawScale;
			const WORLD_SCALE = this.worldScale;

			this.engine.enableSleeping = true;
			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;
			this.world.gravity.x = 0;
			this.world.gravity.y = 0.5;

			const size = shapeSize * WORLD_SCALE;
			const w:number = this.stageWidth;
			const h:number = this.stageHeight;
			cellWidth = w / cellWcnt;
			cellHeight = h / cellHcnt;

			// Create regions for each constraint demo
			var i:number;
			for (i = 1; i < cellWcnt; i++) {
				let body:Body = Bodies.rectangle((i*cellWidth-0.5) * WORLD_SCALE, h / 2 * WORLD_SCALE, 1 * WORLD_SCALE, h * WORLD_SCALE, {isStatic: true});
				World.add(this.world, body);
			}
			for (i = 1; i < cellHcnt; i++) {
				let body:Body = Bodies.rectangle(w / 2 * WORLD_SCALE, (i*cellHeight-0.5) * WORLD_SCALE, w * WORLD_SCALE, 1 * WORLD_SCALE, {isStatic: true});
				World.add(this.world, body);
			}

			withCell.call(this, 1, 0, "RevoluteJoint", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				World.add(this.world, b1);
				World.add(this.world, b2);
				var pivotPointA = Vector.create(x(cellWidth/2 - 1),y(cellHeight/2));
				var pivotPointB = Vector.create(x(cellWidth/2 + 1),y(cellHeight/2));
				var joint = Constraint.create({
					bodyA: b1,
					bodyB: b2,
					pointA: MatterDemo.globalToLocal(b1, pivotPointA),
					pointB: MatterDemo.globalToLocal(b2, pivotPointB),
					stiffness: 0.1
				});
				World.add(this.world, joint);

				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Revolute constraint not supported\n(Strange behaviour)', {valign: 'top'});
			});

			withCell.call(this, 2, 0, "WeldJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Weld constraint not supported', {valign: 'top'});
			});

			withCell.call(this, 0, 1, "DistanceJoint", (x:Function, y:Function):void => {
				var b1:Body = this.createBox(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = this.createBox(x(2*cellWidth/3),y(cellHeight/2),size);

				World.add(this.world, b1);
				World.add(this.world, b2);
				var joint = Constraint.create({
					bodyA: b1,
					bodyB: b2,
					pointA: Vector.create(0, -size),
					pointB: Vector.create(0, -size)
				});
				World.add(this.world, joint);
			});

			withCell.call(this, 1, 1, "LineJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2), y(0) + 20, 'Line constraint not supported', {valign: 'top'});
			});

			withCell.call(this, 2, 1, "PulleyJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2), y(0) + 20, 'Pulley constraint not supported', {valign: 'top'});
			});

			withCell.call(this, 0, 2, "GearJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2), y(0) + 20, 'Gear constraint not supported', {valign: 'top'});
			});

			withCell.call(this, 1, 2, "MotorJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2), y(0) + 20, 'Motor constraint not supported', {valign: 'top'});
			});
		};
	}

	namespace physicsJsDemo
	{
		engines.PhysicsJsDemo.prototype.loadDemoConstraints = function()
		{

		};
	}

}