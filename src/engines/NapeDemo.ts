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

			var border:Body = new Body(BodyType.STATIC);
			border.shapes.add(new Polygon(Polygon.rect(0, 0, this.stageWidth, -1)));
			border.shapes.add(new Polygon(Polygon.rect(0, this.stageHeight, this.stageWidth, 1)));
			border.shapes.add(new Polygon(Polygon.rect(0, 0, -1, this.stageHeight)));
			border.shapes.add(new Polygon(Polygon.rect(this.stageWidth, 0, 1, this.stageHeight)));
			border.space = this.space;

			this.handJoint = new PivotJoint(this.space.world, null, Vec2.weak(0,0), Vec2.weak(0,0));
			this.handJoint.space = this.space;
			this.handJoint.active = false;
			this.handJoint.stiff = false;
		}

		loadDemoBasic:() => void;
		loadDemoConstraints:() => void;
		loadDemoStress:() => void;

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
		protected createBox(x:number, y:number, radius:number, pinned?:boolean):Body
		{
			return this.createBody(x, y, new Polygon(Polygon.box(radius*2, radius*2)), pinned);
		}
		protected createCircle(x:number, y:number, radius:number, pinned?:boolean):Body
		{
			return this.createBody(x, y, new Circle(radius), pinned);
		}

		/*
		 *** Events
		 */

		protected onDisableDrawing()
		{
			this.debug.clear();
			this.stage.update();
		}

		onMouseDown = (event) =>
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

				break;
			}

			// Release Vec2 back to object pool.
			mousePoint.dispose();
		};

		onMouseUp = (event) =>
		{
			// Disable hand joint (if not already disabled).
			this.handJoint.active = false;
		};

	}
}