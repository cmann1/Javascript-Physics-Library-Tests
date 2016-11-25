namespace app.ticker
{

	export interface TickCallback{
		// The delta time in seconds
		(deltaTime:number, timestamp:number):void
	}

	export class Ticker
	{
		protected static EMPTY_RUNNER(deltatTime:number){};

		protected _tickCallback:TickCallback;
		protected _targetFps:number;
		// The required amount of time between frames in milliseconds
		protected fpsInterval;

		protected isRunning = false;
		protected previousTime;
		protected currentTime;

		protected measuredFps = 0;
		protected frameCount = 0;
		protected frameCountPrevTime = 0;

		constructor(runner:TickCallback = null, targetFps:number = 60)
		{
			this.targetFps = targetFps;
			this.tickCallback = runner;
		}

		get tickCallback():TickCallback
		{
			return this._tickCallback;
		}
		set tickCallback(callback:TickCallback)
		{
			if(!callback)
				callback = Ticker.EMPTY_RUNNER;

			this._tickCallback = callback;
		}

		get targetFps():number
		{
			return this._targetFps;
		}
		set targetFps(newTargetFps)
		{
			if(isNaN(newTargetFps))
				newTargetFps = 60;
			else if(newTargetFps < 0)
				newTargetFps = 0;

			this._targetFps = newTargetFps;
			this.fpsInterval = 1000 / newTargetFps;
		}

		getFps = ():number =>
		{
			return this.isRunning
				? (this.currentTime != this.frameCountPrevTime ? this.frameCount / ((this.currentTime - this.frameCountPrevTime) / 1000) : this.measuredFps)
				: 0;
		};

		start()
		{
			this.isRunning = true;

			this.frameCountPrevTime = 0;
			this.frameCount = 0;
			this.previousTime = this.frameCountPrevTime = performance.now();
			this.run(this.previousTime);
		}

		stop()
		{
			this.isRunning = false;
		}

		private run = (time) =>
		{
			if(!this.isRunning)
				return;

			requestAnimationFrame(this.run);

			this.currentTime = time;
			let elapsedTime = time - this.previousTime;

			if(elapsedTime > this.fpsInterval)
			{
				this.previousTime = time - (elapsedTime % this.fpsInterval);

				this._tickCallback(elapsedTime * 0.001, time);

				// Update/measure the fps every 1 second
				this.frameCount++;
				if(time - this.frameCountPrevTime >= 1000)
				{
					this.measuredFps = this.frameCount / ((this.currentTime - this.frameCountPrevTime) / 1000);
					this.frameCountPrevTime = time;
					this.frameCount = 0;
				}
			}
		}

	}

}