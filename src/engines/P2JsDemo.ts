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
	import RevoluteConstraint = p2.RevoluteConstraint;

	const SCALE = 0.01;
	const DRAW_SCALE = 1 / SCALE;

	export class P2JsDemo extends DemoEngineBase
	{

		readonly maxSubSteps = 10;
		readonly pickPrecision = 5;

		world:World;
		nullBody:Body;
		context:CanvasRenderingContext2D;

		handJoint:RevoluteConstraint;

		setup()
		{
			this.world = new World();

			if(!this.nullBody)
			{
				this.nullBody = new Body();
			}

			this.autoClearCanvas = true;
		}

		clear()
		{
			this.world.clear();
		}

		loadDemo(name:string)
		{
			super.loadDemo(name);

			this.world.sleepMode = World.ISLAND_SLEEPING;
			this.world.islandSplit = true;
			this.world.addBody(this.nullBody);

			const w = this.stageWidth * SCALE;
			const h = this.stageHeight * SCALE;
			const hw = w / 2;
			const hh = h / 2;
			const t = 200 * SCALE;
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
			this.velocityIterations = 10;
			this.positionIterations = 10;
			this.world.gravity = [0, 0];

			// Generate some random objects!
			for (var i:number = 0; i < 100; i++) {
				var body:Body = new Body({ mass: 1});

				// Add random one of either a Circle, Box or Pentagon.
				if (Math.random() < 0.33) {
					body.addShape(new Circle({radius: 20 * SCALE}));
				}
				else if (Math.random() < 0.5) {
					body.addShape(new Box(<any>{width: 40 * SCALE, height: 40 * SCALE}));
				}
				else {
					body.addShape(new Convex(<any>{vertices: DemoEngineBase.Regular(20 * SCALE, 20 * SCALE, 5)}));
				}

				// Set to random position on stage and add to Space.
				body.position = [Math.random() * this.stageWidth * SCALE, Math.random() * this.stageHeight * SCALE];
				this.world.addBody(body);
			}
		}

		loadDemoStress()
		{
			this.velocityIterations = 35;
			this.positionIterations = 15;
			this.world.gravity = [0, 100 * SCALE];

			const sw = this.stageWidth;
			const sh = this.stageHeight;
			const boxWidth:number = 10;
			const boxHeight:number = 14;
			const bw:number = boxWidth * SCALE;
			const bh:number = boxHeight * SCALE;
			var pyramidHeight:number = 40; //820 blocks

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					var block:Body = new Body({ mass: 1});
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					block.position[0] = ((sw/2) - boxWidth*((y-1)/2 - x)*0.99) * SCALE;
					block.position[1] = (sh - boxHeight*(pyramidHeight - y + 0.5)*0.99) * SCALE;
					block.addShape(new Box(<any>{width: bw, height: bh}));
					this.world.addBody(block);
				}}
		}

		run = (deltaTime:number, timestamp:number) =>
		{
			if(this.handJoint)
			{
				this.handJoint.pivotA[0] = this.mouseX * SCALE;
				this.handJoint.pivotA[1] = this.mouseY * SCALE;
				this.handJoint.bodyA.wakeUp();
				this.handJoint.bodyB.wakeUp();
			}

			this.world.step(this.frameRateInterval, deltaTime, this.maxSubSteps);

			if(this._enableDrawing)
			{
				this.render();
			}
		};

		render()
		{
			const context = this.context;
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			this.renderBodies(this.world, context);
		}

		//noinspection JSMethodCanBeStatic
		renderBodies(world:World, context:CanvasRenderingContext2D)
		{
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

		/*
		 *** Events
		 */

		protected onVelocityIterationsUpdate(iterations:number)
		{
			(this.world.solver as GSSolver).iterations = iterations;
		}

		onMouseDown = (event) =>
		{
			const p = [this.mouseX * SCALE, this.mouseY * SCALE];
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