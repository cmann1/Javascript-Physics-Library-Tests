///<reference path='../../lib/jquery.d.ts'/>
///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>

/**
 * Ragdoll demo copied from Box2DFlash:
 *      http://www.box2dflash.org/
 *      https://sourceforge.net/p/box2dflash/code/HEAD/tree/Examples/TestBed/TestRagdoll.as#l171
 */

namespace demos
{

	import DemoEngineBase = engines.DemoEngineBase;
	import VertFormat = engines.VertFormat;

	const VELOCITY_ITERATIONS = 10;
	const POSITION_ITERATIONS = 10;

	function ragdollImpulse()
	{
		const MAX_FORCE = 500;
		return [Math.random() * MAX_FORCE * 2 - MAX_FORCE, Math.random() * MAX_FORCE * 2 - MAX_FORCE];
	}

	const RAGDOLL_DATA:any = {
		bodies: [
			{id: 'Head',
				x: 0, y: -75,
				shape: {
					type: 'circle',
					radius: 12.5,
					density: 1.0,
					friction: 0.4,
					restitution: 0.3
				},
				impulse: ragdollImpulse
			},
			{id: 'Torso1',
				x: 0, y: -47,
				shape: {
					type: 'box',
					width: 30, height: 20,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'Torso2',
				x: 0, y: -32,
				shape: {
					type: 'box',
					width: 30, height: 20,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'Torso3',
				x: 0, y: -17,
				shape: {
					type: 'box',
					width: 30, height: 20,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},


			{id: 'UpperArmL',
				x: -30, y: -55,
				shape: {
					type: 'box',
					width: 36, height: 13,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'UpperArmR',
				x: 30, y: -55,
				shape: {
					type: 'box',
					width: 36, height: 13,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'LowerArmL',
				x: -57, y: -55,
				shape: {
					type: 'box',
					width: 34, height: 12,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'LowerArmR',
				x: 57, y: -55,
				shape: {
					type: 'box',
					width: 34, height: 12,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},

			{id: 'UpperLegL',
				x: -8, y: 10,
				shape: {
					type: 'box',
					width: 15, height: 44,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'UpperLegR',
				x: 8, y: 10,
				shape: {
					type: 'box',
					width: 15, height: 44,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'LowerLegL',
				x: -8, y: 45,
				shape: {
					type: 'box',
					width: 12, height: 40,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
			{id: 'LowerLegR',
				x: 8, y: 45,
				shape: {
					type: 'box',
					width: 12, height: 40,
					density: 1.0,
					friction: 0.4,
					restitution: 0.1
				}
			},
		],
		joints: [
			{id: 'HeadToShoulders',
				type: 'revolute',
				body1: 'Torso1',
				body2: 'Head',
				worldAnchorX: 0,
				worldAnchorY: -60,
				lowerLimit: -40,
				upperLimit: 40
			},
			{id: 'ShouldersStomach',
				type: 'revolute',
				body1: 'Torso1',
				body2: 'Torso2',
				worldAnchorX: 0,
				worldAnchorY: -40,
				lowerLimit: -15,
				upperLimit: 15
			},
			{id: 'StomachHips',
				type: 'revolute',
				body1: 'Torso2',
				body2: 'Torso3',
				worldAnchorX: 0,
				worldAnchorY: -25,
				lowerLimit: -15,
				upperLimit: 15
			},

			{id: 'UpperArmToShouldersL',
				type: 'revolute',
				body1: 'Torso1',
				body2: 'UpperArmL',
				worldAnchorX: -18,
				worldAnchorY: -55,
				lowerLimit: -85,
				upperLimit: 130
			},
			{id: 'UpperArmToShouldersR',
				type: 'revolute',
				body1: 'Torso1',
				body2: 'UpperArmR',
				worldAnchorX: 18,
				worldAnchorY: -55,
				lowerLimit: -130,
				upperLimit: 85
			},
			{id: 'LowerArmToUpperArmL',
				type: 'revolute',
				body1: 'UpperArmL',
				body2: 'LowerArmL',
				worldAnchorX: -45,
				worldAnchorY: -55,
				lowerLimit: -130,
				upperLimit: 10
			},
			{id: 'LowerArmToUpperArmR',
				type: 'revolute',
				body1: 'UpperArmR',
				body2: 'LowerArmR',
				worldAnchorX: 45,
				worldAnchorY: -55,
				lowerLimit: -10,
				upperLimit: 130
			},

			{id: 'TorsoToUpperLegL',
				type: 'revolute',
				body1: 'Torso3',
				body2: 'UpperLegL',
				worldAnchorX: -8,
				worldAnchorY: -3,
				lowerLimit: -25,
				upperLimit: 45
			},
			{id: 'TorsoToUpperLegR',
				type: 'revolute',
				body1: 'Torso3',
				body2: 'UpperLegR',
				worldAnchorX: 8,
				worldAnchorY: -3,
				lowerLimit: -45,
				upperLimit: 25
			},
			{id: 'UpperLegToLowerLegL',
				type: 'revolute',
				body1: 'UpperLegL',
				body2: 'LowerLegL',
				worldAnchorX: -8,
				worldAnchorY: 30,
				lowerLimit: -25,
				upperLimit: 115
			},
			{id: 'UpperLegToLowerLegR',
				type: 'revolute',
				body1: 'UpperLegR',
				body2: 'LowerLegR',
				worldAnchorX: 8,
				worldAnchorY: 30,
				lowerLimit: -115,
				upperLimit: 25
			},
		]
	};
	var STAIR_DATA = null;

	var ragdollCount;
	var ragdollCountOverlay;
	const RAGDOLL_COUNT_TEXT = 'Ragdolls: $N';
	function showInfo(engine:DemoEngineBase, width)
	{
		engine.addInfo(width / 2, 5, 'Left click to add more ragdolls', {valign: 'top'});
		ragdollCountOverlay = engine.addOverlay(width - 5, 5, RAGDOLL_COUNT_TEXT.replace(/\$N/g, '0'), null, {valign: 'top', halign: 'right'});
	}

	function createStairData(stageWidth:number, stageHeight:number):any
	{
		if(STAIR_DATA)
		{
			return STAIR_DATA;
		}

		STAIR_DATA = {};
		const bodies = STAIR_DATA.bodies = [];

		var template = {id: 'Stair',
			x: 10, y: 0,
			type: 'static',
			shape: {
				type: 'box',
				width: 20, height: 20,
				density: 0.0,
				friction: 0.4,
				restitution: 0.3
			}
		};

		const stairCount = 10;
		for(let a = 1; a <= stairCount; a++)
		{
			var stair = $.extend(true, {}, template);
			stair.x *= a;
			stair.y = stageHeight - stair.shape.height / 2 - (stairCount * stair.shape.height) + (stair.shape.height * a);
			stair.shape.width *= a;
			bodies.push(stair);

			stair = $.extend(true, {}, stair);
			stair.x = stageWidth - stair.x;
			bodies.push(stair);
		}

		return STAIR_DATA;
	}

	namespace napeDemo
	{
		engines.DemoEngineBase.prototype.loadDemoCommon = function()
		{
			this.velocityIterations = VELOCITY_ITERATIONS;
			this.positionIterations = POSITION_ITERATIONS;

			showInfo(this, this.stageWidth);
			this.createFromData(this.stageWidth / 4, 100, RAGDOLL_DATA);
			this.createFromData(this.stageWidth / 4 * 3, 100, RAGDOLL_DATA);
			this.createFromData(0, 0, createStairData(this.stageWidth, this.stageHeight));

			ragdollCount = 2;
			ragdollCountOverlay.text = RAGDOLL_COUNT_TEXT.replace(/\$N/g, ragdollCount);

			this.demoMouseDownHook = () =>
			{
				this.createFromData(this.mouseX, this.mouseY, RAGDOLL_DATA);
				ragdollCount++;
				ragdollCountOverlay.text = RAGDOLL_COUNT_TEXT.replace(/\$N/g, ragdollCount);
			}
		}
	}

	namespace napeDemo
	{
		import Body = nape.phys.Body;

		engines.NapeDemo.prototype.loadDemoRagdolls = function()
		{
			this.space.gravity.setxy(0, 600);
			this.loadDemoCommon(0, 600);
		};
	}

	namespace box2dWebDemo
	{
		import b2Body = Box2D.Dynamics.b2Body;
		import b2Vec2 = Box2D.Common.Math.b2Vec2;
		import b2BodyDef = Box2D.Dynamics.b2BodyDef;
		import b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
		import b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
		import b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

		engines.Box2dWebDemo.prototype.loadDemoRagdolls = function()
		{
			this.world.SetGravity(new b2Vec2(0, 9.82));
			this.loadDemoCommon();
		};
	}

	namespace p2JsDemo
	{
		import Body = p2.Body;

		engines.P2JsDemo.prototype.loadDemoRagdolls = function()
		{
			const WORLD_SCALE = this.worldScale;

			this.world.gravity = [0, 100 * WORLD_SCALE];
			this.loadDemoCommon();
		};
	}

	namespace matterDemo
	{
		import Body = Matter.Body;

		engines.MatterDemo.prototype.loadDemoRagdolls = function()
		{

		};
	}

	namespace physicsJsDemo
	{
		// engines.PhysicsJsDemo.prototype.loadDemoRagdolls = function()
		// {
		//
		// };
	}

}