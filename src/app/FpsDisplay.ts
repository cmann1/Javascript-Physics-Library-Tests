///<reference path='../../lib/jquery.d.ts'/>

namespace app.Fps
{
	const CSS = `
#fps-display{
	left: 10px; top: 10px;
	padding: 2px 4px;
	position: absolute;
	z-index: 100;

	background-color: #999;
	border-radius: 3px;
	color: #FFF;
	cursor: default;
	font: bold 11px/14px 'Helvetica Neue', Helvetica, Arial, sans-serif;
	text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
	vertical-align: baseline;
	white-space: nowrap;
	user-select: none;
}`;

	export class Display
	{
		private $fps:JQuery;
		private $fpsText:JQuery;

		public fpsCallback:() => number;

		constructor(fpsCallback:() => number = null)
		{
			this.fpsCallback = fpsCallback;
			this.$fps = $('<div id="fps-display"><span class="text">00</span> fps</div>');
			this.$fpsText = this.$fps.find('.text');
			document.body.appendChild(this.$fps[0]);

			var head = document.head || document.getElementsByTagName('head')[0];
			var style:any = document.createElement('style');
			style.type = 'text/css';

			if(style.styleSheet)
			{
				style.styleSheet.cssText = CSS;
			}
			else
			{
				style.appendChild(document.createTextNode(CSS));
			}

			head.appendChild(style);

			setInterval(this.onTimer, 500);
		}

		onTimer = () =>
		{
			if(this.fpsCallback)
			{
				this.$fpsText.text(this.fpsCallback().toFixed(1));
			}
		}

	}
}