///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/physicsjs/physicsjs.d.ts'/>

namespace engines
{

	export class PhysicsJsDemo extends DemoEngineBase
	{

		public name:string = 'PhysicsJs';

		world:PhysicsWorld;
		gravity;
		renderer:CanvasRenderer;
		bodies:PhysicsBody[];
		constraints:PhysicsVerletConstraintsBehavior;

		setup()
		{
			super.clear();

			this.autoClearCanvas = true;
			this.bodies = [];

			Physics(
				{
					timestep: this.frameRateInterval * 1000
				},
				(world:PhysicsWorld) =>
				{
					this.world = world;
					this.renderer = Physics.renderer('canvas', {
						el: 'renderCanvas', // id of the canvas element
						autoResize: false,
						width: this.canvas.width,
						height: this.canvas.height
					});
					this.gravity = Physics.behavior('constant-acceleration');

					world.add([
						this.renderer,
						this.gravity,
						Physics.behavior('body-impulse-response'),
						Physics.behavior('body-collision-detection'),
						Physics.behavior('sweep-prune'),
						Physics.behavior('interactive', { el: this.canvas }),
						Physics.behavior('edge-collision-detection', {
							aabb: Physics.aabb(0, 0, this.stageWidth, this.stageHeight),
							restitution: 0.05
						}),
						this.constraints = <PhysicsVerletConstraintsBehavior> Physics.behavior('verlet-constraints', {
							iterations: 3
						})
					]);

					world.on('interact:grab', this.onBodyGrab.bind(this));
				}
			);
		}

		clear()
		{
			super.clear();
			this.clearCanvas();

			if(this.bodies.length)
			{
				this.world.remove(this.bodies);
				this.bodies = [];
			}

			this.constraints.drop();
		}

		loadDemo(name:string)
		{
			super.loadDemo(name);
		}

		protected runInternal(deltaTime:number, timestamp:number)
		{
			this.world.step(timestamp);

			if(this._enableDrawing)
			{
				this.world.render();
			}
		};

		/*
		 *** Utility Methods
		 */

		protected pinBody(body:PhysicsBody, pinned?:Boolean):PhysicsBody
		{
			return body;
		}
		protected createBody(x:number, y:number, shape:any, pinned?:boolean)
		{
			throw new Error('PhysicsJs does not have the concept of shapes. createBody method not supported.');
		}
		protected createBox(x:number, y:number, width:number, height:number, pinned?:boolean)
		{
			var body = this.pinBody(Physics.body('rectangle', {
				x: x,
				y: y,
				width: width * 2,
				height: height * 2,
				restitution: 0.3
			}), pinned);
			this.bodies.push(body);

			return body;
		}
		protected createCircle(x:number, y:number, radius:number, pinned?:boolean)
		{
			var body = this.pinBody(Physics.body('circle', {
				x: x,
				y: y,
				radius: radius,
				restitution: 0.3
			}), pinned);
			this.bodies.push(body);

			return body;
		}

		protected createFromData(x:number, y:number, data:any)
		{
			const WORLD_SCALE = this.worldScale;
			const DEG2RAD = 1 / (180 / Math.PI);

			const bodiesData = data.bodies;
			const jointsData = data.joints;
			const bodyRegistry:{[id:string]:PhysicsBody} = {};
			const bodies = [];

			x *= WORLD_SCALE;
			y *= WORLD_SCALE;

			if(bodiesData)
			for(let bodyData of bodiesData)
			{
				if(!bodyData.shape)
				{
					continue;
				}

				let bodyType:string;
				let options:any = {
					x: x + bodyData.x * WORLD_SCALE,
					y: y + bodyData.y * WORLD_SCALE
				};

				if(bodyData.type === undefined || bodyData.type === 'dynamic')
					options.treatment = 'dynamic';
				else if(bodyData.type === 'static')
					options.treatment = 'static';
				else if(bodyData.type === 'kinematic')
					options.treatment = 'kinematic';

				const shapeData = bodyData.shape;
				const shapeType = shapeData.type;

				if(shapeType === 'box')
				{
					bodyType = 'rectangle';
					options.width = shapeData.width * WORLD_SCALE;
					options.height = shapeData.height * WORLD_SCALE;
				}
				else if(shapeType === 'circle')
				{
					bodyType = 'circle';
					options.radius = shapeData.radius * WORLD_SCALE;
				}
				else
					console.error(`Unsupported shape type "${shapeType}"`);

				// if(shapeData.density !== undefined)
				// 	options.density = shapeData.density;
				if(shapeData.friction !== undefined)
					options.cof = shapeData.friction;
				if(shapeData.restitution !== undefined)
					options.restitution = shapeData.restitution;

				var body:PhysicsBody = Physics.body(bodyType, options);
				this.bodies.push(body);
				bodies.push(body);
				if(bodyData.id !== undefined)
				{
					bodyRegistry[bodyData.id] = body;
				}

				if(bodyData.impulse)
				{
					let impulse:{x,y};

					if(bodyData.impulse.hasOwnProperty('x') && bodyData.impulse.hasOwnProperty('y'))
					{
						impulse = bodyData.impulse;
					}
					else if(bodyData.impulse instanceof Array)
					{
						impulse = {x: bodyData.impulse[0], y: bodyData.impulse[1]};
					}
					else if(bodyData.impulse instanceof Function)
					{
						let impulseData = bodyData.impulse();
						impulse = {x: impulseData[0], y: impulseData[1]};
					}

					if(impulse)
						body.applyForce({x: impulse.x / 10000 * WORLD_SCALE, y: impulse.y / 10000 * WORLD_SCALE});
				}
			}

			this.world.add(bodies);

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
					this.constraints.distanceConstraint(body1, body2);
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

		protected onBodyGrab(data)
		{
			this.mouseAction = MouseAction.Handled;
		}

	}

}