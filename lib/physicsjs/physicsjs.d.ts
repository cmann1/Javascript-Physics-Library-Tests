/// <reference path="../pixi.js/pixi.js.d.ts"/>

type Vectorish = {x:number, y:number};
type AABB = {
	x: Number, // the x coord of the center point
	y: Number, // the y coord of the center point
	hw: Number, // the half-width
	hh: Number, // the half-height
};

interface PhysicsWorld
{
	add(things:any):PhysicsWorld;
	addBehavior(behavior:any):PhysicsWorld;
	addBody(body:any):PhysicsWorld;
	destroy():void;
	find(rules:any):any;
	findOne(rules:any):any;
	getBehaviors():any;
	getBodies():any;
	has(thing:any):boolean;
	integrator(integrator?:any):any;
	isPaused():boolean;
	options(cfg:Object):Object;
	pause():PhysicsWorld;
	remove(things:any):PhysicsWorld;
	removeBehavior(behavior:any):PhysicsWorld;
	removeBody(body:any):PhysicsWorld;
	render():PhysicsWorld;
	renderer(renderer?:any):any;
	step(now?:number):PhysicsWorld;
	timestep(dt?:number):any;
	unpause():PhysicsWorld;
	wakeUpAll():PhysicsWorld;
	warp(warp?:number):any;
	on(key:string, cb:Function);
}

interface PhysicsBody
{
	treatment:'dynamic'|'kinematic'|'static';
	addChild(body:PhysicsBody):PhysicsBody;
	applyForce(force:Vectorish, p?):PhysicsBody;
	clear():PhysicsBody;
}

interface PhysicsRenderer
{
	el:any;
	width:number;
	height:number;
	stage:Object;
}

interface CanvasRenderer extends PhysicsRenderer
{

}

interface PixiRenderer extends PhysicsRenderer
{
	attach(data:Object):PixiRenderer;
	centerAnchor(view:PIXI.DisplayObject):void;
	createCircle(x:number, y:number, r:number, styles:Object):PIXI.Graphics;
	createDisplay(type:string, options?:Object):PIXI.DisplayObject;
	createLine(from:number, to:number, styles:Object):PIXI.Graphics;
	createPolygon(verts:any, styles:Object):PIXI.Graphics;
	createRect(x:number, y:number, r:number, styles:Object):PIXI.Graphics;
	detach(data:PIXI.Graphics|Object):PixiRenderer;
	drawBody(body:PhysicsBody, view:PIXI.DisplayObject):void;
	loadSpriteSheets(assetsToLoad:any, callback:Function):PixiRenderer;
	setStyles(graphics:PIXI.Graphics, styles:Object):PIXI.Graphics;
	createView(geometry:any, styles:Object):any;
	drawBody(body:Object, view:Object):any;
	drawMeta(meta:any):void;
	render(bodies:any, meta:Object):PixiRenderer;
	resize(width?:number, height?:number):PixiRenderer;
	setWorld(world:PhysicsWorld):PixiRenderer;
}

interface PhysicsBehavior
{
	applyTo(object:any):any;
	setAcceleration(vec:any):void;
}

interface PhysicsVerletConstraintsBehavior extends PhysicsBehavior
{
	angleConstraint(bodyA:PhysicsBody, bodyB:PhysicsBody, bodyC:PhysicsBody, stiffness?:number, targetAngle?:number):any;
	distanceConstraint(bodyA:PhysicsBody, bodyB:PhysicsBody, stiffness?:number, targetLength?:number):any;
	drop():PhysicsVerletConstraintsBehavior;
	getConstraints():any;
	remove(constraintData:any):PhysicsVerletConstraintsBehavior;
	resolve():void;
	resolveAngleConstraints(coef:number):void;
	resolveDistanceConstraints(coef:number):void;
	shuffleConstraints():void;
}

interface PhysicsUtil
{
	ticker:{
		on:(cb:Function) => void
	};
}

interface PhysicsEngine
{
	util:PhysicsUtil;
	(cb:(world:PhysicsWorld) => void):any;
	(options:any, cb:(world:PhysicsWorld) => void):any;
	body(name:string, options?:Object):PhysicsBody;
	renderer(name:string, options?:Object):CanvasRenderer|PixiRenderer;
	behavior(name:string, options?:Object):PhysicsBehavior;
	vector(x:number, y:number);

	aabb(minX, minY, maxX, maxY):AABB;
	aabb(pt1:Vectorish, pt2:Vectorish):AABB;
	aabb(width, height, pt?:Vectorish):AABB;
}


declare var Physics:PhysicsEngine;
