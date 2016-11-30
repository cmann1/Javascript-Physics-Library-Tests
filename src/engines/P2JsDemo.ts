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
			DemoEngineBase.drawCircle(context, pivotA[0], pivotA[1], 2);
			DemoEngineBase.drawCircle(context, pivotB[0], pivotB[1], 2);
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
			DemoEngineBase.drawCircle(context, pivotA[0], pivotA[1], 2);
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
			DemoEngineBase.drawCircle(context, x1, y1, 2);
			context.fillStyle = '#F00';
			context.fill();
			context.beginPath();
			DemoEngineBase.drawCircle(context, x2, y2, 2);
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
			DemoEngineBase.drawCircle(context, x1, y1, 2);
			context.fillStyle = '#F00';
			context.fill();
			context.beginPath();
			DemoEngineBase.drawCircle(context, x2, y2, 2);
			context.fillStyle = '#00F';
			context.fill();
		}

		/*
		 *** Utility Methods
		 */

		protected pinBody(body:Body, pinned?:Boolean):Body
		{
			if (pinned) {
				var pin:RevoluteConstraint = new RevoluteConstraint(body, this.nullBody, {
					worldPivot: body.position
				});
				this.world.addConstraint(pin);
				(<any>body)._pin = pin;
			}

			return body;
		}
		protected createBody(x:number, y:number, shape:any, pinned?:boolean):Body
		{
			var body:Body = new Body({ mass: 1});
			body.position = [x, y];
			body.addShape(shape);
			this.world.addBody(body);

			return this.pinBody(body, pinned);
		}
		protected createBox(x:number, y:number, width:number, height:number, pinned?:boolean):Body
		{
			return this.createBody(x, y, new Box(<any>{width: width*2, height: height*2}), pinned);
		}
		protected createCircle(x:number, y:number, radius:number, pinned?:boolean):Body
		{
			return this.createBody(x, y, new Circle({radius: radius}), pinned);
		}

		protected createFromData(x:number, y:number, data:any)
		{
			const WORLD_SCALE = this.worldScale;
			const DEG2RAD = 1 / (180 / Math.PI);

			const bodiesData = data.bodies;
			const jointsData = data.joints;
			const bodyRegistry:{[id:string]:Body} = {};

			x *= WORLD_SCALE;
			y *= WORLD_SCALE;

			if(bodiesData)
			for(let bodyData of bodiesData)
			{
				var body:Body = new Body({
					position: [x + bodyData.x * WORLD_SCALE, y + bodyData.y * WORLD_SCALE],
					mass: 1
				});

				if(bodyData.type === undefined || bodyData.type === 'dynamic')
					body.type = Body.DYNAMIC;
				else if(bodyData.type === 'static')
					body.type = Body.STATIC;
				else if(bodyData.type === 'kinematic')
					body.type = Body.KINEMATIC;

				this.world.addBody(body);
				if(bodyData.id !== undefined)
				{
					bodyRegistry[bodyData.id] = body;
				}

				if(bodyData.shape)
				{
					const shapeData = bodyData.shape;
					const shapeType = shapeData.type;

					if(shapeType === 'box')
						body.addShape(new Box(<any>{width: shapeData.width * WORLD_SCALE, height: shapeData.height * WORLD_SCALE}));
					else if(shapeType === 'circle')
						body.addShape(new Circle({radius: shapeData.radius * WORLD_SCALE}));
					else
						console.error(`Unsupported shape type "${shapeType}"`);

					//
					// Creating materials is a pain so I haven't bothered
					//
					// if(shapeData.density !== undefined)
					// 	fixtureDef.density = shapeData.density;
					// if(shapeData.friction !== undefined)
					// 	fixtureDef.friction = shapeData.friction;
					// if(shapeData.restitution !== undefined)
					// 	fixtureDef.restitution = shapeData.restitution;
				}

				if(bodyData.impulse)
				{
					let impulse:number[];

					if(bodyData.impulse instanceof Array)
					{
						impulse = bodyData.impulse;
					}
					else if(bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y'))
					{
						impulse = [bodyData.impulse.x, bodyData.impulse.y];
					}
					else if(bodyData.impulse instanceof Function)
					{
						let impulseData = bodyData.impulse();
						impulse = [impulseData[0], impulseData[1]];
					}

					if(impulse)
						body.applyImpulse([impulse[0] * WORLD_SCALE, impulse[1] * WORLD_SCALE]);
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
					var worldAnchor = [x + jointData.worldAnchorX * WORLD_SCALE, y + jointData.worldAnchorY * WORLD_SCALE];
					var joint:RevoluteConstraint = new RevoluteConstraint(body1, body2, { worldPivot: worldAnchor});
					this.world.addConstraint(joint);
					if(jointData.lowerLimit != undefined)
					{
						joint.lowerLimitEnabled = true;
						joint.lowerLimit = jointData.lowerLimit * DEG2RAD;
					}
					if(jointData.upperLimit != undefined)
					{
						joint.upperLimitEnabled = true;
						joint.upperLimit = jointData.upperLimit * DEG2RAD;
					}
					joint.collideConnected = jointData.collideConnected != undefined ? jointData.collideConnected : false;
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

		protected onVelocityIterationsUpdate(iterations:number)
		{
			(this.world.solver as GSSolver).iterations = iterations;
		}

		onMouseDown ()
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
				this.mouseAction = MouseAction.Handled;
			}
		}

		onMouseUp()
		{
			if(this.handJoint)
			{
				this.world.removeConstraint(this.handJoint);
				this.handJoint = null;
			}
		}

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