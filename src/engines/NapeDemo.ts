///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/easeljs.d.ts'/>
///<reference path='../../lib/nape/nape.d.ts'/>
///<reference path='../../lib/nape/debugDraw/nape-debug-draw.d.ts'/>

namespace engines
{
	import Vec2 = nape.geom.Vec2;
	import Space = nape.space.Space;
	import Stage = createjs.Stage;
	import ShapeDebug = nape.util.ShapeDebug;
	import Body = nape.phys.Body;
	import BodyType = nape.phys.BodyType;
	import Polygon = nape.shape.Polygon;
	import Circle = nape.shape.Circle;
	import BodyList = nape.phys.BodyList;

	import Constraint = nape.constraint.Constraint;
	import PivotJoint = nape.constraint.PivotJoint;
	import WeldJoint = nape.constraint.WeldJoint;
	import DistanceJoint = nape.constraint.DistanceJoint;
	import LineJoint = nape.constraint.LineJoint;
	import PulleyJoint = nape.constraint.PulleyJoint;
	import AngleJoint = nape.constraint.AngleJoint;
	import MotorJoint = nape.constraint.MotorJoint;

	import Overlay = overlay.Overlay;
	import Material = nape.phys.Material;

	export class NapeDemo extends DemoEngineBase
	{
		public name:string = 'Nape';

		protected stage:Stage;
		protected space:Space;
		protected debug:ShapeDebug;

		protected simulationTime:number = 0;

		protected handJoint:PivotJoint;

		setup()
		{
			this.space = new Space();

			var debug = this.debug = new ShapeDebug(2000, 2000);
			debug.thickness = 1;
			debug.drawBodies = true;
			debug.drawConstraints = true;

			this.stage = new Stage(this.canvas);
			this.stage.addChild(this.debug.display);
		}

		clear()
		{
			super.clear();

			this.simulationTime = 0;
			this.handJoint = null;
			this.space.clear();
			this.debug.clear();
			this.stage.update();
		}

		loadDemo(name:string)
		{
			super.loadDemo(name);

			const t = 200;
			const t2 = t * 2;
			var border:Body = new Body(BodyType.STATIC);
			border.shapes.add(new Polygon(Polygon.rect(-t, -t, this.stageWidth + t2, t)));
			border.shapes.add(new Polygon(Polygon.rect(-t, this.stageHeight, this.stageWidth + t2, t)));
			border.shapes.add(new Polygon(Polygon.rect(-t, -t, t, this.stageHeight + t2)));
			border.shapes.add(new Polygon(Polygon.rect(this.stageWidth, -t, t, this.stageHeight + t2)));
			border.space = this.space;

			this.handJoint = new PivotJoint(this.space.world, null, Vec2.weak(0,0), Vec2.weak(0,0));
			this.handJoint.space = this.space;
			this.handJoint.active = false;
			this.handJoint.stiff = false;
		}

		loadDemoBasic:() => void;
		loadDemoConstraints:() => void;
		loadDemoStress:() => void;
		loadDemoRagdolls:() => void;

		protected runInternal(deltaTime:number, timestamp:number)
		{
			if(deltaTime > 0.05)
			{
				deltaTime = 0.05;
			}

			this.simulationTime += deltaTime;

			if(this.handJoint.active)
			{
				this.handJoint.anchor1.setxy(this.mouseX, this.mouseY);
			}

			// Keep on stepping forward by fixed time step until amount of time
			// needed has been simulated.
			while(this.space.elapsedTime < this.simulationTime)
			{
				this.space.step(this.frameRateInterval, this._velocityIterations, this._positionIterations);
			}

			if(this._enableDrawing)
			{
				this.debug.clear();
				this.debug.draw(this.space);
				this.debug.flush();
				this.stage.update();
			}
		};

		/*
		 *** Utility Methods
		 */

		protected pinBody(body:Body, pinned?:Boolean):Body
		{
			if (pinned) {
				var pin:PivotJoint = new PivotJoint(
					this.space.world, body,
					body.position,
					Vec2.weak(0,0)
				);
				pin.space = this.space;
			}

			return body;
		}
		protected createBody(x:number, y:number, shape:any, pinned?:boolean):Body
		{
			var body:Body = new Body();
			body.position.setxy(x, y);
			body.shapes.add(shape);
			body.space = this.space;

			return this.pinBody(body, pinned);
		}
		protected createBox(x:number, y:number, width:number, height:number, pinned?:boolean):Body
		{
			return this.createBody(x, y, new Polygon(Polygon.box(width*2, height*2)), pinned);
		}
		protected createCircle(x:number, y:number, radius:number, pinned?:boolean):Body
		{
			return this.createBody(x, y, new Circle(radius), pinned);
		}

		protected createFromData(x:number, y:number, data:any)
		{
			const DEG2RAD = 1 / (180 / Math.PI);

			const bodiesData = data.bodies;
			const jointsData = data.joints;
			const bodyRegistry:{[id:string]:Body} = {};

			if(bodiesData)
			for(let bodyData of bodiesData)
			{
				let body:Body;

				if(bodyData.type === undefined || bodyData.type === 'dynamic')
					body = new Body(BodyType.DYNAMIC);
				else if(bodyData.type === 'static')
					body = new Body(BodyType.STATIC);
				else if(bodyData.type === 'kinematic')
					body = new Body(BodyType.KINEMATIC);

				if(bodyData.shape)
				{
					const shapeData = bodyData.shape;
					const shapeType = shapeData.type;

					if(shapeType === 'box')
						body.shapes.add(new Polygon(Polygon.box(shapeData.width, shapeData.height)));
					else if(shapeType === 'circle')
						body.shapes.add(new Circle(shapeData.radius));
					else
						console.error(`Unsupported shape type "${shapeType}"`);

					let mat = new Material();

					if(shapeData.density !== undefined)
						mat.density = shapeData.density;
					if(shapeData.friction !== undefined)
						mat.dynamicFriction = shapeData.friction;
					if(shapeData.restitution !== undefined)
						mat.elasticity = shapeData.restitution;
				}

				body.position.setxy(x + bodyData.x, y + bodyData.y);
				body.space = this.space;
				if(bodyData.id !== undefined)
				{
					bodyRegistry[bodyData.id] = body;
				}

				if(bodyData.impulse)
				{
					let impulse:Vec2;

					if(bodyData.impulse instanceof Vec2)
					{
						impulse = bodyData.impulse;
					}
					else if(bodyData.impulse instanceof Function)
					{
						let impulseData = bodyData.impulse();
						impulse = Vec2.weak(impulseData[0], impulseData[1]);
					}

					if(impulse)
						body.applyImpulse(impulse);
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
					var pivotPoint:Vec2 = Vec2.get(x + jointData.worldAnchorX, y + jointData.worldAnchorY);
					var pivotJoint = new PivotJoint(
						body1, body2,
						body1.worldPointToLocal(pivotPoint, true),
						body2.worldPointToLocal(pivotPoint, true)
					);

					pivotJoint.ignore = jointData.collideConnected != undefined ? jointData.collideConnected : true;
					pivotJoint.space = this.space;

					if(jointData.lowerLimit != undefined || jointData.upperLimit != undefined)
					{
						let angleJoint = new AngleJoint(body1, body2,
							jointData.lowerLimit != undefined ? jointData.lowerLimit * DEG2RAD : -Number.MAX_VALUE,
							jointData.upperLimit != undefined ? jointData.upperLimit * DEG2RAD :  Number.MAX_VALUE);
						angleJoint.debugDraw = false;
						angleJoint.space = this.space;
					}

					pivotPoint.dispose();
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

		protected onDisableDrawing()
		{
			this.debug.clear();
			this.stage.update();
		}

		onMouseDown()
		{
			// Allocate a Vec2 from object pool.
			var mousePoint:Vec2 = Vec2.get(this.mouseX, this.mouseY, false);

			// Determine the set of Body's which are intersecting mouse point.
			// And search for any 'dynamic' type Body to begin dragging.
			var bodies:BodyList = this.space.bodiesUnderPoint(mousePoint);
			for (var i:number = 0; i < bodies.length; i++) {
				var body:Body = bodies.at(i);

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
				this.mouseAction = MouseAction.Handled;

				break;
			}

			// Release Vec2 back to object pool.
			mousePoint.dispose();
		};

		onMouseUp()
		{
			// Disable hand joint (if not already disabled).
			this.handJoint.active = false;
		};

	}
}