///<reference path='DemoEngineBase.ts'/>
///<reference path='../../lib/matter-js/matter-js.d.ts'/>

namespace engines
{

	import Engine = Matter.Engine;
	import Render = Matter.Render;
	import World = Matter.World;
	import Bodies = Matter.Bodies;
	import Body = Matter.Body;
	import MouseConstraint = Matter.MouseConstraint;
	import Constraint = Matter.Constraint;
	import Composite = Matter.Composite;
	import Bounds = Matter.Bounds;
	import Detector = Matter.Detector;
	import Vertices = Matter.Vertices;
	import Sleeping = Matter.Sleeping;
	import Events = Matter.Events;
	import Mouse = Matter.Mouse;

	export class MatterDemo extends DemoEngineBase
	{

		public name:string = 'Matter';

		protected engine:Engine;
		protected world:World;
		protected render:Render;

		protected simulationTime:number = 0;
		protected elapsedTime:number = 0;
		protected frameRateIntervalMs:number;

		protected mouseConstraint:MouseConstraint;
		protected groundBody:Body;

		setup()
		{
			super.clear();

			this.engine = Engine.create({
				enableSleeping: true
			});
			this.world = this.engine.world;
			this.render = Render.create(<any>{
				canvas: this.canvas,
				engine: this.engine,
				options: {
					showAngleIndicator: true,
				}
			});

			const w = this.stageWidth;
			const h = this.stageHeight;
			const hw = w / 2;
			const hh = h / 2;
			const t = 200;
			const ht = t/2;

			var top = Bodies.rectangle(hw, -ht, w+t, t);
			var bot = Bodies.rectangle(hw, h+ht, w+t, t);
			var lef = Bodies.rectangle(-ht, hh, t, h+t);
			var rig = Bodies.rectangle(w+ht, hh, t, h+t);
			this.groundBody = Body.create({parts: [top, bot, lef, rig], isStatic: true});

			this.mouseConstraint = MouseConstraint.create(this.engine, {
				mouse: Mouse.create(this.canvas)
			});
			this.mouseConstraint.constraint.stiffness = 0.75;
			(this.mouseConstraint.constraint as any).angularStiffness = 0;

			this.frameRateIntervalMs = 1000 / this.frameRate;
			this.autoClearCanvas = true;
		}

		clear()
		{
			super.clear();

			this.simulationTime = 0;
			this.elapsedTime = 0;
			World.clear(this.world, false);
		}

		loadDemo(name:string)
		{
			super.loadDemo(name);

			World.add(this.world, this.groundBody);
			World.addConstraint(this.world, this.mouseConstraint.constraint);
		}

		loadDemoBasic:() => void;
		loadDemoStress:() => void;
		loadDemoConstraints:() => void;

		protected runInternal(deltaTime:number, timestamp:number)
		{
			if(deltaTime > 0.05)
			{
				deltaTime = 0.05;
			}

			this.simulationTime += deltaTime;

			// Keep on stepping forward by fixed time step until amount of time
			// needed has been simulated.
			while(this.elapsedTime < this.simulationTime)
			{
				Engine.update(this.engine, this.frameRateIntervalMs);
				this.elapsedTime += this.frameRateInterval;
			}

			Events.trigger(this.engine, 'tick', <any>{
				timestamp: this.simulationTime * 1000
			});

			if(this._enableDrawing)
			{
				Render.world(this.render);
			}
		};

		/*
		 *** Utility Methods
		 */

		protected createBody(x:number, y:number, shape:any, pinned?:boolean)
		{
			return null;
		}
		protected createBox(x:number, y:number, radius:number, pinned?:boolean)
		{
			return null;
		}
		protected createCircle(x:number, y:number, radius:number, pinned?:boolean)
		{
			return null;
		}

		/*
		 *** Events
		 */

		protected onPositionIterationsUpdate(iterations:number)
		{
			this.engine.positionIterations = iterations;
		}

		protected onVelocityIterationsUpdate(iterations:number)
		{
			this.engine.velocityIterations = iterations;
		}

	}

}