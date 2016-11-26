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

		loadDemoBasic:()=>void;

		loadDemoStress()
		{
			this.velocityIterations = 35;
			this.positionIterations = 15;
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
		}

		loadDemoConstraints()
		{
			this.velocityIterations = 10;
			this.positionIterations = 10;
			this.space.gravity.setxy(0, 600);

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
			const size:number = 22;

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
					(x:number):number => { return x + (i * cellWidth); },
					(y:number):number => { return y + (j * cellHeight); }
				);
			};
			// Box utility.
			var box = (x:number, y:number, radius:number, pinned:boolean=false):Body =>
			{
				var body:Body = new Body();
				body.position.setxy(x, y);
				body.shapes.add(new Polygon(Polygon.box(radius*2, radius*2)));
				body.space = this.space;
				if (pinned) {
					var pin:PivotJoint = new PivotJoint(
						this.space.world, body,
						body.position,
						Vec2.weak(0,0)
					);
					pin.space = this.space;
				}
				return body;
			};

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

			withCell(1, 0, "PivotJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var pivotPoint:Vec2 = Vec2.get(x(cellWidth/2),y(cellHeight/2));
				format(new PivotJoint(
					b1, b2,
					b1.worldPointToLocal(pivotPoint, true),
					b2.worldPointToLocal(pivotPoint, true)
				));
				pivotPoint.dispose();
			});

			withCell(2, 0, "WeldJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var weldPoint:Vec2 = Vec2.get(x(cellWidth/2),y(cellHeight/2));
				format(new WeldJoint(
					b1, b2,
					b1.worldPointToLocal(weldPoint, true),
					b2.worldPointToLocal(weldPoint, true),
					/*phase*/ Math.PI/4 /*45 degrees*/
				));
				weldPoint.dispose();
			});

			withCell(0, 1, "DistanceJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(1.25*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(1.75*cellWidth/3),y(cellHeight/2),size);

				format(new DistanceJoint(
					b1, b2,
					Vec2.weak(0, -size),
					Vec2.weak(0, -size),
					/*jointMin*/ cellWidth/3*0.75,
					/*jointMax*/ cellWidth/3*1.25
				));
			});

			withCell(1, 1, "LineJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

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

			withCell(2, 1, "PulleyJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(cellWidth/2),y(size),size/2, true);
				b1.scaleShapes(4, 1);

				var b2:Body = box(x(1*cellWidth/3),y(cellHeight/2),size/2);
				var b3:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

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

			withCell(0, 2, "AngleJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size, true);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size, true);

				format(new AngleJoint(
					b1, b2,
					/*jointMin*/ -Math.PI*1.5,
					/*jointMax*/ Math.PI*1.5,
					/*ratio*/ 2
				));
			});

			withCell(1, 2, "MotorJoint", function (x:Function, y:Function):void {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size, true);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size, true);

				format(new MotorJoint(
					b1, b2,
					/*rate*/ 10,
					/*ratio*/ 3
				));
			});

			withCell(2, 2, "PrismaticJoint\n(LineJoint + AngleJoint)", function (x:Function, y:Function):void {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

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
		}

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