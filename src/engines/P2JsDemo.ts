///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/p2js/p2.d.ts'/>

namespace engines
{

	import World = p2.World;
	import Body = p2.Body;
	import Box = p2.Box;
	import GSSolver = p2.GSSolver;
	import Convex = p2.Convex;
	import Shape = p2.Shape;
	import Circle = p2.Circle;
	import Overlay = overlay.Overlay;

	import RevoluteConstraint = p2.RevoluteConstraint;
	import Constraint = p2.Constraint;
	import vec2 = p2.vec2;
	import LockConstraint = p2.LockConstraint;
	import DistanceConstraint = p2.DistanceConstraint;
	import PrismaticConstraint = p2.PrismaticConstraint;
	import GearConstraint = p2.GearConstraint;

	export class P2JsDemo extends DemoEngineBase
	{

		public name:string = 'P2Js';

		protected drawScaleVec2;

		protected readonly maxSubSteps = 10;
		protected readonly pickPrecision = 5;

		protected world:World;
		protected nullBody:Body;
		protected context:CanvasRenderingContext2D;

		protected handJoint:RevoluteConstraint;

		setup()
		{
			this.drawScaleVec2 = [1, 1];
			this.setDrawScale(100);
			this.world = new World();

			if(!this.nullBody)
			{
				this.nullBody = new Body();
			}

			this.autoClearCanvas = true;
		}

		clear()
		{
			super.clear();

			this.world.clear();
		}

		loadDemo(name:string)
		{
			const WORLD_SCALE = this.worldScale;

			super.loadDemo(name);

			this.world.sleepMode = World.ISLAND_SLEEPING;
			this.world.islandSplit = true;
			this.world.addBody(this.nullBody);

			const w = this.stageWidth * WORLD_SCALE;
			const h = this.stageHeight * WORLD_SCALE;
			const hw = w / 2;
			const hh = h / 2;
			const t = 200 * WORLD_SCALE;
			const ht = t / 2;

			var groundBody = new Body({ mass: 0}); // Setting mass to 0 makes it static
			groundBody.addShape(new Box(<any>{width: w, height: t}), [hw, 0 - ht]);
			groundBody.addShape(new Box(<any>{width: w, height: t}), [hw, h + ht]);
			groundBody.addShape(new Box(<any>{width: t, height: h}), [0 - ht, hh]);
			groundBody.addShape(new Box(<any>{width: t, height: h}), [w + ht, hh]);
			this.world.addBody(groundBody);
		}

		loadDemoBasic()
		{
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = 10;
			this.positionIterations = 10;
			this.world.gravity = [0, 0];

			// Generate some random objects!
			for (var i:number = 0; i < 100; i++) {
				var body:Body = new Body({ mass: 1});

				// Add random one of either a Circle, Box or Pentagon.
				if (Math.random() < 0.33) {
					body.addShape(new Circle({radius: 20 * WORLD_SCALE}));
				}
				else if (Math.random() < 0.5) {
					body.addShape(new Box(<any>{width: 40 * WORLD_SCALE, height: 40 * WORLD_SCALE}));
				}
				else {
					body.addShape(new Convex(<any>{vertices: DemoEngineBase.Regular(20 * WORLD_SCALE, 20 * WORLD_SCALE, 5)}));
				}

				// Set to random position on stage and add to Space.
				body.position = [Math.random() * this.stageWidth * WORLD_SCALE, Math.random() * this.stageHeight * WORLD_SCALE];
				this.world.addBody(body);
			}
		}

		loadDemoStress()
		{
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = 35;
			this.positionIterations = 15;
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
		}

		loadDemoConstraints()
		{
			const DRAW_SCALE = this.drawScale;
			const WORLD_SCALE = this.worldScale;

			this.velocityIterations = 10;
			this.positionIterations = 10;
			this.world.gravity = [0, 600 * WORLD_SCALE];

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

			// Add a "null" body
			var groundBody = new Body();
			this.world.addBody(groundBody);

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
			var box = (x:number, y:number, radius:number, pinned:boolean=false):Body =>
			{
				var body:Body = new Body({ mass: 1});
				body.position = [x, y];
				body.addShape(new Box(<any>{width: radius*2, height: radius*2}));
				this.world.addBody(body);
				if (pinned) {
					var pin:RevoluteConstraint = new RevoluteConstraint(body, groundBody, {
						worldPivot: body.position
					});
					this.world.addConstraint(pin);
					(<any>body)._pin = pin;
				}
				return body;
			};
			// Circle utility.
			var circle = (x:number, y:number, radius:number, pinned:boolean=false):Body =>
			{
				var body:Body = new Body({ mass: 1});
				body.position = [x, y];
				body.addShape(new Circle({radius: radius}));
				this.world.addBody(body);
				if (pinned) {
					var pin:RevoluteConstraint = new RevoluteConstraint(body, groundBody, {
						worldPivot: body.position
					});
					this.world.addConstraint(pin);
				}
				return body;
			};

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

			withCell(1, 0, "RevoluteJoint", (x:Function, y:Function):void => {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

				var pivotPoint = [x(cellWidth/2),y(cellHeight/2)];
				var joint:RevoluteConstraint = new RevoluteConstraint(b1, b2, {worldPivot: pivotPoint});
				this.world.addConstraint(joint);
			});

			withCell(2, 0, "LockJoint", (x:Function, y:Function):void => {
				const a = Math.PI/4;
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				b1.angle = a * 1.5;
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);
				b2.angle = -Math.PI + a * 0.5;

				var weldPoint = [x(cellWidth/2),y(cellHeight/2)];
				b2.toLocalFrame(weldPoint, weldPoint);
				var joint:LockConstraint = new LockConstraint(b1, b2);
				this.world.addConstraint(joint);
			});

			withCell(0, 1, "DistanceJoint", (x:Function, y:Function):void => {
				var b1:Body = box(x(1.25*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(1.75*cellWidth/3),y(cellHeight/2),size);

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

			withCell(1, 1, "LineJoint\n(PrismaticJoint/disableRotationalLock)", (x:Function, y:Function):void => {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

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

			withCell(2, 1, "PulleyJoint", (x:Function, y:Function):void => {
				this.addWarning(x(cellWidth/2) * DRAW_SCALE, y(0) * DRAW_SCALE + 20, 'Pulley constraint not supported', {valign: 'top'});
			});

			withCell(0, 2, "GearJoint", (x:Function, y:Function):void => {
				var b1:Body = circle(x(cellWidth/2)-size,y(cellHeight/2),size, true);
				var b2:Body = circle(x(cellWidth/2)+size*2,y(cellHeight/2),size * 2, true);

				var joint = new GearConstraint(b2, b1, {
					ratio: 2
				});
				this.world.addConstraint(joint);

			});

			withCell(1, 2, "RevoluteJoint Motor", (x:Function, y:Function):void => {
				var b1:Body = box(x(cellWidth/2),y(cellHeight/2),size, true);

				var joint:RevoluteConstraint = (<any>b1)._pin;
				joint.enableMotor();
				joint.setMotorSpeed(1.5);
			});

			withCell(2, 2, "PrismaticJoint", (x:Function, y:Function):void => {
				var b1:Body = box(x(1*cellWidth/3),y(cellHeight/2),size);
				var b2:Body = box(x(2*cellWidth/3),y(cellHeight/2),size);

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
		}

		protected runInternal(deltaTime:number, timestamp:number)
		{
			if(this.handJoint)
			{
				this.handJoint.pivotA[0] = this.mouseX * this.worldScale;
				this.handJoint.pivotA[1] = this.mouseY * this.worldScale;
				this.handJoint.bodyA.wakeUp();
				this.handJoint.bodyB.wakeUp();
			}

			this.world.step(this.frameRateInterval, deltaTime, this.maxSubSteps);

			if(this._enableDrawing)
			{
				this.render();
			}
		};

		protected setDrawScale(newScale)
		{
			super.setDrawScale(newScale);
			this.drawScaleVec2[0] = this.drawScaleVec2[1] = newScale;
		}

		/*
		 *** Rendering Methods
		 */

		protected render()
		{
			const context = this.context;
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.renderBodies(this.world, context);
			this.renderConstraints(this.world, context);
		}

		//noinspection JSMethodCanBeStatic
		protected renderBodies(world:World, context:CanvasRenderingContext2D)
		{
			const DRAW_SCALE = this.drawScale;

			const bodies = world.bodies;

			for(let body of bodies)
			{
				const shapes = body.shapes;
				const bodyAngle = body.interpolatedAngle;
				const bodyX = body.interpolatedPosition[0];
				const bodyY = body.interpolatedPosition[1];
				const sleep = body.sleepState == Body.SLEEPING;

				for(let shape of shapes)
				{
					const x = (bodyX + shape.position[0]) * DRAW_SCALE;
					const y = (bodyY + shape.position[1]) * DRAW_SCALE;
					const angle = bodyAngle + shape.angle;
					const type = shape.type;

					context.beginPath();

					switch(type)
					{
						case Shape.CIRCLE:
							context.moveTo(x, y);
							context.arc(x, y, (shape as Circle).radius * DRAW_SCALE, angle, angle + 2 * Math.PI, false);
							break;
						case Shape.BOX:
						case Shape.CONVEX:
							const angleSin = Math.sin(angle);
							const angleCos = Math.cos(angle);
							const vertices = (shape as any).vertices;
							let vx, vy;

							for(let a in vertices)
							{
								const vert = vertices[a];
								let localX = vert[0] * DRAW_SCALE;
								let localY = vert[1] * DRAW_SCALE;
								vx = localX * angleCos - localY * angleSin;
								vy = localX * angleSin + localY * angleCos;
								context.lineTo(x + vx, y + vy);
							}
							context.closePath();
							context.moveTo(x, y);
							context.lineTo(x + vx, y + vy);

							break;
					}

					context.strokeStyle = P2JsDemo.Colour(shape.id, sleep);
					context.stroke();
				}
			}
		}

		//noinspection JSMethodCanBeStatic
		protected renderConstraints(world:World, context:CanvasRenderingContext2D)
		{
			const constraints = world.constraints;

			for(let constraint of constraints)
			{
				switch(constraint.type)
				{
					case Constraint.REVOLUTE:
						this.renderRevoluteConstraint(context, <RevoluteConstraint> constraint);
						break;
					case Constraint.LOCK:
						this.renderLockConstraint(context, <LockConstraint> constraint);
						break;
					case Constraint.DISTANCE:
						this.renderDistanceConstraint(context, <DistanceConstraint> constraint);
						break;
					case Constraint.PRISMATIC:
						this.renderPrismaticConstraint(context, <PrismaticConstraint> constraint);
						break;
				}
			}
		}

		//noinspection JSMethodCanBeStatic
		protected renderRevoluteConstraint(context:CanvasRenderingContext2D, joint:RevoluteConstraint)
		{
			var pivotA = [];
			var pivotB = [];
			joint.bodyA.toWorldFrame(pivotA, joint.pivotA);
			joint.bodyB.toWorldFrame(pivotB, joint.pivotB);
			vec2.multiply(pivotA, pivotA, this.drawScaleVec2);
			vec2.multiply(pivotB, pivotB, this.drawScaleVec2);

			context.beginPath();
			context.moveTo(pivotA[0], pivotA[1]);
			context.lineTo(pivotB[0], pivotB[1]);
			context.strokeStyle = '#F0F';
			context.stroke();

			context.beginPath();
			DemoEngineBase.circle(context, pivotA[0], pivotA[1], 2);
			DemoEngineBase.circle(context, pivotB[0], pivotB[1], 2);
			context.fillStyle = '#F00';
			context.fill();
		}

		//noinspection JSMethodCanBeStatic
		protected renderLockConstraint(context:CanvasRenderingContext2D, joint:LockConstraint)
		{
			var pivotA = [];
			var pivotB = [];
			vec2.multiply(pivotA, joint.bodyA.position, this.drawScaleVec2);
			vec2.multiply(pivotB, joint.bodyB.position, this.drawScaleVec2);

			context.beginPath();
			context.moveTo(pivotA[0], pivotA[1]);
			context.lineTo(pivotB[0], pivotB[1]);
			context.strokeStyle = '#0FF';
			context.stroke();

			context.beginPath();
			DemoEngineBase.circle(context, pivotA[0], pivotA[1], 2);
			context.fillStyle = '#F00';
			context.fill();
		}

		//noinspection JSMethodCanBeStatic
		protected renderDistanceConstraint(context:CanvasRenderingContext2D, joint:DistanceConstraint)
		{
			var pivotA = [];
			var pivotB = [];
			joint.bodyA.toWorldFrame(pivotA, joint.localAnchorA);
			joint.bodyB.toWorldFrame(pivotB, joint.localAnchorB);
			vec2.multiply(pivotA, pivotA, this.drawScaleVec2);
			vec2.multiply(pivotB, pivotB, this.drawScaleVec2);

			var x1 = pivotA[0];
			var y1 = pivotA[1];
			var x2 = pivotB[0];
			var y2 = pivotB[1];
			var dx = x2 - x1;
			var dy = y2 - y1;
			var length = Math.sqrt(dx * dx + dy * dy);
			var mx = x1 + dx * 0.5;
			var my = y1 + dy * 0.5;
			var ndx = dx / length;
			var ndy = dy / length;

			var minLength = joint.lowerLimitEnabled ? joint.lowerLimit * this.drawScale : 0;
			var maxLength = joint.upperLimitEnabled ? joint.upperLimit * this.drawScale : length;

			var lx1 = mx - ndx * minLength * 0.5;
			var ly1 = my - ndy * minLength * 0.5;
			var lx2 = mx + ndx * minLength * 0.5;
			var ly2 = my + ndy * minLength * 0.5;

			var ux1 = mx - ndx * maxLength * 0.5;
			var uy1 = my - ndy * maxLength * 0.5;
			var ux2 = mx + ndx * maxLength * 0.5;
			var uy2 = my + ndy * maxLength * 0.5;

			context.beginPath();
			context.moveTo(ux1, uy1);
			context.lineTo(lx1, ly1);
			context.moveTo(lx2, ly2);
			context.lineTo(ux2, uy2);
			context.strokeStyle = '#0FF';
			context.stroke();

			if(joint.lowerLimitEnabled)
			{
				context.beginPath();
				context.moveTo(lx1, ly1);
				context.lineTo(lx2, ly2);
				context.strokeStyle = '#FF0';
				context.stroke();
			}

			context.beginPath();
			DemoEngineBase.circle(context, x1, y1, 2);
			context.fillStyle = '#F00';
			context.fill();
			context.beginPath();
			DemoEngineBase.circle(context, x2, y2, 2);
			context.fillStyle = '#00F';
			context.fill();
		}

		//noinspection JSMethodCanBeStatic
		protected renderPrismaticConstraint(context:CanvasRenderingContext2D, joint:PrismaticConstraint)
		{
			var pivotA = [];
			var pivotB = [];
			var localAxis = [];
			joint.bodyA.toWorldFrame(pivotA, joint.localAnchorA);
			joint.bodyB.toWorldFrame(pivotB, joint.localAnchorB);
			vec2.rotate(localAxis, joint.localAxisA, joint.bodyA.angle);
			vec2.multiply(pivotA, pivotA, this.drawScaleVec2);
			vec2.multiply(pivotB, pivotB, this.drawScaleVec2);
			vec2.normalize(localAxis, localAxis);

			var x1 = pivotA[0];
			var y1 = pivotA[1];
			var x2 = pivotB[0];
			var y2 = pivotB[1];
			var dx = localAxis[0];
			var dy = localAxis[1];
			var length = Math.sqrt(dx * dx + dy * dy);
			var ndx = dx / length;
			var ndy = dy / length;

			var minLength = joint.lowerLimitEnabled ? joint.lowerLimit * this.drawScale : 0;
			var maxLength = joint.upperLimitEnabled ? joint.upperLimit * this.drawScale : length;

			var lx = x1 + ndx * minLength;
			var ly = y1 + ndy * minLength;
			var ux = x1 + ndx * maxLength;
			var uy = y1 + ndy * maxLength;

			context.beginPath();
			context.moveTo(lx, ly);
			context.lineTo(x2, y2);
			context.strokeStyle = '#FF0';
			context.stroke();

			context.beginPath();
			context.moveTo(x2, y2);
			context.lineTo(ux, uy);
			context.strokeStyle = '#0FF';
			context.stroke();


			context.beginPath();
			DemoEngineBase.circle(context, x1, y1, 2);
			context.fillStyle = '#F00';
			context.fill();
			context.beginPath();
			DemoEngineBase.circle(context, x2, y2, 2);
			context.fillStyle = '#00F';
			context.fill();
		}

		/*
		 *** Events
		 */

		protected onVelocityIterationsUpdate(iterations:number)
		{
			(this.world.solver as GSSolver).iterations = iterations;
		}

		onMouseDown = (event) =>
		{
			const p = [this.mouseX * this.worldScale, this.mouseY * this.worldScale];
			var result = this.world.hitTest(p, this.world.bodies, this.pickPrecision);

			let pickedBody;
			for(let body of result)
			{
				if(body.type !== Body.STATIC)
				{
					pickedBody = body;
					break;
				}
			}

			if(pickedBody)
			{
				var localPoint = p2.vec2.create();
				pickedBody.toLocalFrame(localPoint, p);

				this.handJoint = new RevoluteConstraint(this.nullBody, pickedBody, {
					localPivotA: p,
					localPivotB: localPoint,
					maxForce: 2500
				});
				this.world.addConstraint(this.handJoint);
			}
		};

		onMouseUp = (event) =>
		{
			if(this.handJoint)
			{
				this.world.removeConstraint(this.handJoint);
				this.handJoint = null;
			}
		};

		/*
		 *** Utility Methods
		 */

		static Colour(id, sleep)
		{
			var idc:number = Math.floor(0xffffff*Math.exp(-(id%500)/1500));
			var r = ((idc&0xff0000)>>16);
			var g = ((idc&0xff00)>>8);
			var b = idc&0xff;
			var a = sleep ? 0.6 : 1;

			return `rgba(${r},${g},${b},${a})`;
		}

	}
}