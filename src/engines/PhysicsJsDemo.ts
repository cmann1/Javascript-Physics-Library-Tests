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

		loadDemoBasic()
		{
			this.gravity.setAcceleration({x: 0, y: 0});
			var bodies = this.bodies = [];

			// Generate some random objects!
			for (var i:number = 0; i < 100; i++) {
				var body;
				var x = Math.random() * this.stageWidth, y = Math.random() * this.stageHeight;

				// Add random one of either a Circle, Box or Pentagon.
				if (Math.random() < 0.33) {
					bodies.push(Physics.body('circle', {
						x: x,
						y: y,
						radius: 20
					}));
				}
				else if (Math.random() < 0.5) {
					bodies.push(Physics.body('rectangle', {
						x: x,
						y: y,
						width: 40,
						height: 40
					}));
				}
				else {
					bodies.push(Physics.body('convex-polygon', {
						x: x,
						y: y,
						vertices: DemoEngineBase.Regular(20, 20, 5, 0, VertFormat.Vector)
					}));
				}
			}

			this.world.add(this.bodies);
		}

		loadDemoStress()
		{
			this.gravity.setAcceleration({x: 0, y: 0.0004});
			var bodies = this.bodies = [];

			var boxWidth:number = 10;
			var boxHeight:number = 14;
			var pyramidHeight:number = 24; // < Cannot handle more

			for (var y:number = 1; y <= pyramidHeight; y++) {
				for (var x:number = 0; x < y; x++) {
					// We initialise the blocks to be slightly overlapping so that
					// all contact points will be created in very first step before the blocks
					// begin to fall.
					bodies.push(Physics.body('rectangle', {
						x: (this.stageWidth/2) - boxWidth*((y-1)/2 - x)*0.99,
						y: this.stageHeight - boxHeight*(pyramidHeight - y + 0.5)*0.99,
						width: boxWidth,
						height: boxHeight
					}));
				}
			}

			this.world.add(this.bodies);

			this.addWarning(this.stageWidth / 2, 20, 'Fewer bodies added due\nto poor performance');
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
		 *** Events
		 */

	}

}