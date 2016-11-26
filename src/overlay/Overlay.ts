///<reference path='../utils/Utils.ts'/>

namespace overlay
{

	import OverlayIconDef = overlay.OverlayIcons.OverlayIconDef;

	/*
	 * Icons export using the Ai2Canvas plugin; see http://blog.mikeswanson.com/ai2canvas
	 */
	export namespace OverlayIcons
	{
		export type OverlayIconDef = {
			width:number, height:number,
			render:(ctx:CanvasRenderingContext2D) => void
		}

		export var Info:OverlayIconDef = {
			width: 24, height:24,
			render: (ctx:CanvasRenderingContext2D) => {
				// layer1/Compound Path
				ctx.save();
				ctx.beginPath();

				// layer1/Compound Path/Path
				ctx.moveTo(11.9, 8.2);
				ctx.bezierCurveTo(11.0, 8.2, 10.4, 7.6, 10.4, 6.8);
				ctx.bezierCurveTo(10.4, 6.0, 11.0, 5.4, 11.9, 5.4);
				ctx.bezierCurveTo(12.8, 5.4, 13.4, 6.0, 13.4, 6.8);
				ctx.bezierCurveTo(13.4, 7.6, 12.8, 8.2, 11.9, 8.2);
				ctx.closePath();

				// layer1/Compound Path/Path
				ctx.moveTo(13.4, 17.1);
				ctx.bezierCurveTo(13.4, 17.9, 12.7, 18.6, 11.9, 18.6);
				ctx.bezierCurveTo(11.0, 18.6, 10.3, 17.9, 10.3, 17.1);
				ctx.lineTo(10.3, 10.9);
				ctx.bezierCurveTo(10.3, 10.0, 11.0, 9.3, 11.9, 9.3);
				ctx.bezierCurveTo(12.7, 9.3, 13.4, 10.0, 13.4, 10.9);
				ctx.lineTo(13.4, 17.1);
				ctx.closePath();

				// layer1/Compound Path/Path
				ctx.moveTo(20.3, 3.5);
				ctx.bezierCurveTo(15.7, -1.2, 8.1, -1.2, 3.5, 3.5);
				ctx.bezierCurveTo(-1.2, 8.1, -1.2, 15.7, 3.5, 20.3);
				ctx.bezierCurveTo(8.1, 24.9, 15.7, 24.9, 20.3, 20.3);
				ctx.bezierCurveTo(24.9, 15.7, 24.9, 8.1, 20.3, 3.5);
				ctx.closePath();
				ctx.fillStyle = "rgb(73, 135, 203)";
				ctx.fill();
				ctx.restore();
			}
		};

		export var Warning:OverlayIconDef = {
			width: 24, height:22,
			render: (ctx:CanvasRenderingContext2D) => {
				// layer1/Compound Path
				ctx.save();
				ctx.beginPath();

				// layer1/Compound Path/Path
				ctx.moveTo(13.7, 13.2);
				ctx.bezierCurveTo(13.7, 13.3, 13.6, 13.4, 13.6, 13.4);
				ctx.bezierCurveTo(13.5, 13.5, 13.4, 13.5, 13.2, 13.5);
				ctx.lineTo(10.8, 13.5);
				ctx.bezierCurveTo(10.6, 13.5, 10.5, 13.5, 10.4, 13.4);
				ctx.bezierCurveTo(10.4, 13.4, 10.3, 13.3, 10.3, 13.2);
				ctx.lineTo(10.1, 7.2);
				ctx.bezierCurveTo(10.1, 7.0, 10.1, 7.0, 10.2, 6.9);
				ctx.bezierCurveTo(10.3, 6.8, 10.4, 6.7, 10.5, 6.7);
				ctx.lineTo(13.5, 6.7);
				ctx.bezierCurveTo(13.6, 6.7, 13.7, 6.8, 13.8, 6.9);
				ctx.bezierCurveTo(13.9, 7.0, 13.9, 7.0, 13.9, 7.1);
				ctx.lineTo(13.7, 13.2);
				ctx.closePath();

				// layer1/Compound Path/Path
				ctx.moveTo(13.7, 18.1);
				ctx.bezierCurveTo(13.7, 18.2, 13.7, 18.3, 13.6, 18.4);
				ctx.bezierCurveTo(13.5, 18.5, 13.4, 18.6, 13.3, 18.6);
				ctx.lineTo(10.7, 18.6);
				ctx.bezierCurveTo(10.6, 18.6, 10.5, 18.5, 10.4, 18.4);
				ctx.bezierCurveTo(10.3, 18.3, 10.3, 18.2, 10.3, 18.1);
				ctx.lineTo(10.3, 15.6);
				ctx.bezierCurveTo(10.3, 15.5, 10.3, 15.4, 10.4, 15.3);
				ctx.bezierCurveTo(10.5, 15.2, 10.6, 15.2, 10.7, 15.2);
				ctx.lineTo(13.3, 15.2);
				ctx.bezierCurveTo(13.4, 15.2, 13.5, 15.2, 13.6, 15.3);
				ctx.bezierCurveTo(13.7, 15.4, 13.7, 15.5, 13.7, 15.6);
				ctx.lineTo(13.7, 18.1);
				ctx.closePath();

				// layer1/Compound Path/Path
				ctx.moveTo(23.8, 19.4);
				ctx.lineTo(13.5, 0.9);
				ctx.bezierCurveTo(13.4, 0.6, 13.2, 0.4, 12.9, 0.2);
				ctx.bezierCurveTo(12.6, 0.1, 12.3, 0.0, 12.0, 0.0);
				ctx.bezierCurveTo(11.7, 0.0, 11.4, 0.1, 11.1, 0.2);
				ctx.bezierCurveTo(10.9, 0.4, 10.7, 0.6, 10.5, 0.9);
				ctx.lineTo(0.2, 19.4);
				ctx.bezierCurveTo(-0.1, 20.0, -0.1, 20.5, 0.3, 21.1);
				ctx.bezierCurveTo(0.4, 21.4, 0.6, 21.6, 0.9, 21.7);
				ctx.bezierCurveTo(1.1, 21.9, 1.4, 21.9, 1.7, 21.9);
				ctx.lineTo(22.3, 21.9);
				ctx.bezierCurveTo(22.6, 21.9, 22.9, 21.9, 23.2, 21.7);
				ctx.bezierCurveTo(23.4, 21.6, 23.6, 21.4, 23.8, 21.1);
				ctx.bezierCurveTo(24.1, 20.5, 24.1, 20.0, 23.8, 19.4);
				ctx.closePath();
				ctx.fillStyle = "rgb(205, 78, 72)";
				ctx.fill();
				ctx.restore();
			}
		};
	}

	export type OverlayOptions = {
		fontSize?:number,
		fontFamily?:string,
		textColour?:string,
		textAlign?:'left'|'centre'|'right',
		lineHeight?:number,

		iconScale?:number,
		iconPadding?:number,

		bounds?:OverlayBounds,
		halign?:'left'|'centre'|'right',
		valign?:'top'|'middle'|'bottom'
	}

	export class OverlayBounds
	{
		x1:number;
		y1:number;
		x2:number;
		y2:number;

		constructor(x1:number = 0, y1:number = 0, x2:number = 0, y2:number = 0)
		{
			this.set(x1, y1, x2, y2);
		}

		set(x1:number = 0, y1:number = 0, x2:number = 0, y2:number = 0)
		{
			this.x1 = x1;
			this.y1 = y1;
			this.x2 = x2;
			this.y2 = y2;
		}
	}

	/**
	 * Renders an optional icon and text into a canvas
	 */
	export class Overlay
	{
		public static readonly bounds:OverlayBounds = new OverlayBounds();

		protected options:OverlayOptions;

		protected x:number;
		protected y:number;
		protected _text:string;
		public icon:OverlayIconDef;

		protected lines:string[] = [];
		protected textWidth:number;
		protected lineWidths:number[] = null;

		constructor(x:number, y:number, text:string = null, icon:OverlayIconDef = null, options?:OverlayOptions)
		{
			this.x = isNaN(x) ? 0 : x;
			this.y = isNaN(y) ? 0 : y;
			this.text = text;
			this.icon = icon;

			this.options = utils.applyDefaults<OverlayOptions>(options || <OverlayOptions>{}, <OverlayOptions>{
				fontSize: 12,
				fontFamily: 'sans-serif',
				textColour: '#FFF',
				textAlign: 'centre',
				lineHeight: 14,
				iconScale: 1,
				iconPadding: 5,
				bounds: Overlay.bounds,
				halign:'centre',
				valign:'middle'
			});
		}

		public render(context:CanvasRenderingContext2D)
		{
			const options = this.options;

			var
				iconWidth = 0,
				textWidth = 0,
				totalWidth:number,
				iconHeight = 0,
				textHeight = 0,
				totalHeight:number,
				lineWidths;

			context.save();

			// First calculate the widths of the icon and text
			//

			if(this.icon)
			{
				iconWidth = (this.icon.width * options.iconScale);
				iconHeight = this.icon.height * options.iconScale;

				if(this._text != null)
				{
					iconWidth += options.iconPadding;
				}
			}

			if(this._text != null)
			{
				context.font = `${options.fontSize}px ${options.fontFamily}`;
				context.textBaseline = 'top';

				if(!this.lineWidths)
				{
					this.lineWidths = lineWidths = [];

					for(let line of this.lines)
					{
						const width = context.measureText(line).width;
						lineWidths.push(width);
						if(width > textWidth)
						{
							textWidth = width;
						}
					}

					this.textWidth = textWidth;
				}
				else
				{
					lineWidths = this.lineWidths;
					textWidth = this.textWidth;
				}

				textHeight = lineWidths.length * this.options.lineHeight;
			}

			totalWidth = iconWidth + textWidth;
			totalHeight = Math.max(iconHeight, textHeight);

			// Render the icon and text centred on x, y
			//

			const bounds = this.options.bounds;
			var originX = options.halign == 'left'
				? this.x
				: (options.halign == 'right'
					? this.x - totalWidth
					: this.x - totalWidth / 2);
			var originY = options.valign == 'top'
				? this.y
                : (options.valign == 'bottom'
					? this.y - totalHeight
					: this.y - totalHeight / 2);

			if(originX + totalWidth > bounds.x2)
			{
				originX = bounds.x2 - totalWidth;
			}
			if(originY + totalHeight > bounds.y2)
			{
				originY = bounds.y2 - totalHeight;
			}
			if(originX < bounds.x1)
			{
				originX = bounds.x1;
			}
			if(originY < bounds.y1)
			{
				originY = bounds.y1;
			}

			if(this._text != null)
			{
				context.save();

				let drawX = originX + iconWidth;
				let drawY = originY + (totalHeight - textHeight) / 2;

				context.fillStyle = options.textColour;

				for(let a = 0, length = this.lines.length; a < length; a++)
				{
					let line = this.lines[a];
					let width = lineWidths[a];
					let x = options.textAlign == 'right'
						? textWidth - width
					    : (options.textAlign == 'centre'
					    	? (textWidth - width) * 0.5
							: 0);
					context.fillText(line, drawX + x, drawY, textWidth);
					drawY += options.lineHeight;
				}

				context.restore();
			}

			if(this.icon)
			{
				context.save();

				context.translate(originX, originY + (totalHeight - iconHeight) / 2);
				context.scale(options.iconScale, options.iconScale);
				this.icon.render(context);

				context.restore();
			}

			// Debugging:
			// if(this.icon)
			// {
			// 	context.strokeStyle = '#0F0';
			// 	context.strokeRect(originX, originY + (totalHeight - iconHeight) / 2, this.icon.width * options.iconScale + 1, this.icon.height * options.iconScale + 1);
			// }
			// if(this._text != null)
			// {
			// 	context.strokeStyle = '#F00';
			// 	context.strokeRect(originX, originY, totalWidth + 1, totalHeight + 1);
			// }

			context.restore();
		}

		/*
		 *** Getters, Setters
		 */

		get text():string
		{
			return this._text;
		}

		set text(value:string)
		{
			if(this._text == value)
			{
				return;
			}

			if(typeof value !== 'string')
			{
				value = null;
			}

			if(value == null)
			{
				this.textWidth  = 0;
				this.lineWidths = null;
			}

			this._text = value;
			this.lines = value != null
				? value.split(/[\n\r]/)
				: [];
		}

	}

}