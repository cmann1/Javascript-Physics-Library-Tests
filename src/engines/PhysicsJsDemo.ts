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

		}

		/*
		 *** Events
		 */

	}

}