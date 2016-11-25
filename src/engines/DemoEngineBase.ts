namespace engines
{

	export enum VertFormat
	{
		Array,
		Vector
	}

	export interface IVertex
	{
		new (x:number, y:number);
	}

	export abstract class DemoEngineBase
	{
		protected canvas:HTMLCanvasElement;
		protected context:CanvasRenderingContext2D;
		protected stageWidth:number;
		protected stageHeight:number;
		protected frameRate:number;
		protected frameRateInterval:number;

		protected _velocityIterations = 10;
		protected _positionIterations = 10;

		public mouseX:number = 0;
		public mouseY:number = 0;

		protected _enableDrawing:boolean = true;
		protected autoClearCanvas = false;

		constructor(canvas:HTMLCanvasElement, frameRate:number)
		{
			this.canvas = canvas;
			this.context = this.canvas.getContext('2d');
			this.stageWidth = canvas.width;
			this.stageHeight = canvas.height;

			this.frameRate = frameRate;
			this.frameRateInterval = 1 / frameRate;

			this.setup();
		}

		abstract setup();

		abstract clear();

		loadDemo(name:string)
		{
			this.clear();

			let demoFunc = this['loadDemo' + name];
			if(demoFunc)
			{
				demoFunc.call(this);
			}
			else
			{
				console.log(`Cannot find demo: ${name}`);
			}
		}

		abstract run:(deltaTime:number, timestamp:number) => void;

		public get enableDrawing():boolean
		{
			return this._enableDrawing;
		}

		public set enableDrawing(value:boolean)
		{
			this._enableDrawing = value;

			if(this.autoClearCanvas && !value)
			{
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			}
		}

		public clearCanvas()
		{
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		get positionIterations():number
		{
			return this._positionIterations;
		}
		set positionIterations(value:number)
		{
			if(this._positionIterations == value)
				return;

			this._positionIterations = value;
			this.onPositionIterationsUpdate(value);
		}

		get velocityIterations():number
		{
			return this._velocityIterations;
		}
		set velocityIterations(value:number)
		{
			if(this._velocityIterations == value)
				return;

			this._velocityIterations = value;
			this.onVelocityIterationsUpdate(value);
		}

		/*
		 *** Events
		 */

		abstract onMouseDown;

		abstract onMouseUp;

		protected onPositionIterationsUpdate(iterations:number) { }

		protected onVelocityIterationsUpdate(iterations:number) { }

		/*
		 *** Utility Methods
		 */

		static Regular(xRadius, yRadius, edgeCount, angleOffset = 0, format:VertFormat = VertFormat.Array, VertexClass:IVertex = null):Array<Array<number>|{x:number, y:number}|any>
		{
			var vertices = [];
			const useArray = format == VertFormat.Array;

			for(let a = 0; a < edgeCount; a++)
			{
				let x = xRadius * Math.cos(angleOffset + 2 * Math.PI * (a / edgeCount));
				let y = yRadius * Math.sin(angleOffset + 2 * Math.PI * (a / edgeCount));

				if(VertexClass)
					vertices.push(new VertexClass(x, y));
				else
					vertices.push(useArray ? [x, y] : {x: x, y:y});
			}

			return vertices;
		}

	}

}