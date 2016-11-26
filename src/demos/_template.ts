///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>

namespace demos
{

	const VELOCITY_ITERATIONS = 10;
	const POSITION_ITERATIONS = 10;

	namespace napeDemo
	{
		import Body = nape.phys.Body;

		engines.NapeDemo.prototype.loadDemoXX = function()
		{

		};
	}

	namespace box2dWebDemo
	{
		import b2Body = Box2D.Dynamics.b2Body;

		engines.Box2dWebDemo.prototype.loadDemoXX = function()
		{

		};
	}

	namespace p2JsDemo
	{
		import Body = p2.Body;

		engines.P2JsDemo.prototype.loadDemoXX = function()
		{

		};
	}

	namespace matterDemo
	{
		import Body = Matter.Body;

		engines.MatterDemo.prototype.loadDemoXX = function()
		{

		};
	}

	namespace physicsJsDemo
	{
		engines.PhysicsJsDemo.prototype.loadDemoXX = function()
		{

		};
	}

}