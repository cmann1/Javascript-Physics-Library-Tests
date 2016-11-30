///<reference path='../../lib/jquery.d.ts'/>
///<reference path='../../lib/dat-gui.d.ts'/>
///<reference path='FpsDisplay.ts'/>
///<reference path='Ticker.ts'/>
///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>

namespace app
{

	import Ticker = app.ticker.Ticker;
	import DemoEngineBase = engines.DemoEngineBase;
	import NapeDemo = engines.NapeDemo;
	import P2JsDemo = engines.P2JsDemo;
	import MatterDemo = engines.MatterDemo;
	import PhysicsJsDemo = engines.PhysicsJsDemo;
	import Box2dWebDemo = engines.Box2dWebDemo;

	import GUIController = dat.GUIController;

	export class Main
	{
		private static readonly CANVAS_WIDTH = 800;
		private static readonly CANVAS_HEIGHT = 600;

		private static readonly DEMO_NAMES = [
			'Basic',
			'Constraints',
			'Ragdolls',
			'Stress',
		];

		private $canvas:JQuery;
		private canvas:HTMLCanvasElement;
		private fpsDisplay:Fps.Display;

		private $engineDisplay;
		private $engineText;
		private $demoText;
		private engines:DemoEngineBase[] = [];
		private engineIndex = -1;
		private currentEngine:DemoEngineBase;
		private currentDemo:number = 2;

		private ticker:Ticker;

		private mouseX:number = 0;
		private mouseY:number = 0;
		private canvasRightMouseDown = false;

		private _enableDrawing:boolean = true;
		private velocityIterations = 10;
		private positionIterations = 10;

		velIterations:GUIController;
		posIterations:GUIController;

		constructor()
		{
			window.addEventListener('DOMContentLoaded', this.onWindowLoad);
			this.ticker = new Ticker();
		}

		private initGui()
		{
			var buttons = [];

			var gui = new dat.GUI();
			var prevEngine = <any> gui.add(this, 'prevEngine');
			var nextEngine = <any> gui.add(this, 'nextEngine');
			var prevDemo = <any> gui.add(this, 'prevDemo');
			var nextDemo = <any> gui.add(this, 'nextDemo');
			buttons.push(gui.add(this, 'restart'));
			gui.add(this, 'enableDrawing');

			prevEngine.name('◀ prevEngine');
			nextEngine.name('nextEngine ▶');
			prevDemo.name('◀ prevDemo');
			nextDemo.name('nextDemo ▶');

			this.velIterations = gui.add(this, 'velocityIterations', 1, 50);
			this.posIterations = gui.add(this, 'positionIterations', 1, 50);
			this.velIterations.onFinishChange(this.onVelIterationsChange);
			this.posIterations.onFinishChange(this.onPosIterationsChange);

			$([
				prevEngine.domElement.parentNode.parentNode,
				nextEngine.domElement.parentNode.parentNode,
				prevDemo.domElement.parentNode.parentNode,
				nextDemo.domElement.parentNode.parentNode
			])
				.addClass('dgui-two-column-btn dg-button-row');

			for(let button of buttons)
			{
				$(button.domElement.parentNode.parentNode).addClass('dg-button-row');
			}
		}

		private loadEngine(index)
		{
			if(index < 0)
				index = this.engines.length - 1;
			else if(index >= this.engines.length)
				index = 0;

			if(index == this.engineIndex)
			{
				return;
			}

			if(this.currentEngine)
			{
				this.currentEngine.clear();
				this.ticker.tickCallback = null;
			}

			this.engineIndex = index;
			this.currentEngine = this.engines[index];

			this.currentEngine.mouseX = this.mouseX;
			this.currentEngine.mouseY = this.mouseY;

			this.currentEngine.enableDrawing = this.enableDrawing;
			this.currentEngine.loadDemo(Main.DEMO_NAMES[this.currentDemo]);
			this.ticker.tickCallback = this.currentEngine.run;

			this.updateEngineDisplay();
			this.updateIterations();
		}

		private loadDemo(index)
		{
			if(index >= Main.DEMO_NAMES.length)
				index = 0;
			else if(index < 0)
				index = Main.DEMO_NAMES.length - 1;

			this.currentDemo = index;
			this.currentEngine.loadDemo(Main.DEMO_NAMES[this.currentDemo]);

			this.updateEngineDisplay();
			this.updateIterations();
		}

		private prevEngine()
		{
			this.loadEngine(this.engineIndex - 1);
		}
		private nextEngine()
		{
			this.loadEngine(this.engineIndex + 1);
		}

		private prevDemo()
		{
			this.loadDemo(this.currentDemo - 1);
		}
		private nextDemo()
		{
			this.loadDemo(this.currentDemo + 1);
		}

		get enableDrawing():boolean
		{
			return this._enableDrawing;
		}
		set enableDrawing(value:boolean)
		{
			this._enableDrawing = value;
			this.currentEngine.enableDrawing = value;
		}

		private restart()
		{
			this.loadDemo(this.currentDemo);
		}

		private updateEngineDisplay()
		{
			var engineName = this.currentEngine.name;

			this.$engineText.text(`${engineName} (${this.engineIndex+1}/${this.engines.length})`);
			this.$demoText.text(`${Main.DEMO_NAMES[this.currentDemo]} (${this.currentDemo+1}/${Main.DEMO_NAMES.length})`);

			// this.$engineDisplay.stop(true).show().css('opacity', 1).delay(2000).animate(
			// 	{ opacity: 0},
			// 	{ delay: 250, complete: () => {this.$engineDisplay.hide()}});
		}

		private updateIterations()
		{
			this.velocityIterations = this.currentEngine.velocityIterations;
			this.positionIterations = this.currentEngine.positionIterations;
			this.velIterations.updateDisplay();
			this.posIterations.updateDisplay();
		}

		/*
		 *** Events
		 */

		private onVelIterationsChange = (value) =>
		{
			this.currentEngine.velocityIterations = this.velocityIterations = value;
		};

		private onPosIterationsChange = (value) =>
		{
			this.currentEngine.positionIterations = this.positionIterations = value;
		};

		private onCanvasMouseDown = (event) =>
		{
			this.currentEngine.handleMouseDown(event);

			if(event.button == 2)
			{
				this.canvasRightMouseDown = true;
			}
		};

		private onCanvasMouseUp = (event) =>
		{
			this.currentEngine.handleMouseUp(event);
		};

		private onWindowBlur = () =>
		{
			this.ticker.stop();
		};

		private onWindowFocus = () =>
		{
			this.ticker.start();
		};

		private onWindowContextMenu = (event) =>
		{
			if(this.canvasRightMouseDown || event.target == this.canvas)
			{
				this.canvasRightMouseDown = false;
				event.preventDefault();
				return false;
			}
		};

		private onWindowLoad = () =>
		{
			this.$canvas = $('#renderCanvas');
			this.canvas = <HTMLCanvasElement> this.$canvas[0];
			this.$canvas.on('mousedown', this.onCanvasMouseDown);
			this.canvas.width = Main.CANVAS_WIDTH;
			this.canvas.height = Main.CANVAS_HEIGHT;

			this.fpsDisplay = new Fps.Display(this.ticker.getFps);

			this.initGui();

			this.$engineDisplay = $('#engine-display');
			this.$engineText = this.$engineDisplay.find('.engine');
			this.$demoText = this.$engineDisplay.find('.demo');

			const frameRate = 60;
			this.engines.push(new NapeDemo(this.canvas, frameRate));
			this.engines.push(new Box2dWebDemo(this.canvas, frameRate));
			this.engines.push(new P2JsDemo(this.canvas, frameRate));
			this.engines.push(new MatterDemo(this.canvas, frameRate));
			this.engines.push(new PhysicsJsDemo(this.canvas, frameRate));
			this.loadEngine(1);
			// this.loadEngine(this.engines.length - 1);

			$(window)
				.on('focus', this.onWindowFocus)
				.on('blur', this.onWindowBlur)
				.on('mousemove', this.onWindowMouseMove)
				.on('mouseup', this.onCanvasMouseUp)
				.on('contextmenu', this.onWindowContextMenu)
				.focus();

			this.ticker.start();
		};

		private onWindowMouseMove = (event) =>
		{
			var offset = this.$canvas.offset();
			this.mouseX = this.currentEngine.mouseX = event.pageX - offset.left;
			this.mouseY = this.currentEngine.mouseY = event.pageY - offset.top;
		};

		/*
		 *** Utility Methods
		 */
	}

	//noinspection JSUnusedLocalSymbols
	export var main = new Main();

}