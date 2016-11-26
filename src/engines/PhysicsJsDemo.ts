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
		bodies:any[];

		setup()
		{
			super.clear();

			this.autoClearCanvas = true;

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
						})
					]);
				}
			);
		}

		clear()
		{
			super.clear();
			this.clearCanvas();

			if(this.bodies)
			{
				this.world.remove(this.bodies);
				this.bodies = null;
			}
		}

		loadDemo(name:string)
		{
			super.loadDemo(name);
		}

		loadDemoBasic:()=>void;
		loadDemoStress:() => void;

		protected runInternal(deltaTime:number, timestamp:number)
		{
			this.world.step(timestamp);

			if(this._enableDrawing)
			{
				this.world.render();
			}
		};

		/*
		 *** Events
		 */

	}

}