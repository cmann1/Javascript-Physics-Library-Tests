/// <reference path="../nape.d.ts" />
/// <reference path="../../easeljs.d.ts" />
declare namespace nape {
    namespace util {
        import Vec2 = nape.geom.Vec2;
        import AABB = nape.geom.AABB;
        import ZPP_ShapeDebug = zpp_nape.util.ZPP_ShapeDebug;
        /**
         * Implementation of nape debug draw using flash/openfl||nme graphics API.
         * <br/><br/>
         * This debug draw is slower than BitmapDebug which is available in flash10+
         * however the BitmapDebug draw makes use of Alchemy opcodes so you may wish
         * not to use it if you are also using Stage3D and do not wish to be subject
         * to Adobe licensing.
         */
        class ShapeDebug extends Debug {
            /**
             * @private
             */
            zpp_inner_zn: ZPP_ShapeDebug;
            /**
             * Thickness to draw lines with.
             * @default 0.1
             */
            thickness: number;
            /**
             * Construct new ShapeDebug with given viewport size and backgruond.
             * <br/><br/>
             * Background colour does not have much weight for a ShapeDebug which
             * always has a transparent background, but serves to bias the colours
             * chosen for drawing objects.
             *
             * @param width The width of Debug draw viewport.
             * @param height The height of Debug draw viewport.
             * @param bgColour the background colour for debug draw. (default 0x333333)
             * @return The constructed ShapeDebug.
             * @throws # If width or height are not strictly positive.
             */
            constructor(width: number, height: number, bgColour?: number);
            /**
             * @inheritDoc
             */
            clear(): void;
            /**
             * @inheritDoc
             */
            drawLine(start: Vec2, end: Vec2, colour: number): void;
            /**
             * @inheritDoc
             */
            drawCurve(start: Vec2, control: Vec2, end: Vec2, colour: number): void;
            /**
             * @inheritDoc
             */
            drawCircle(position: Vec2, radius: number, colour: number): void;
            /**
             * @inheritDoc
             */
            drawAABB(aabb: AABB, colour: number): void;
            /**
             * @inheritDoc
             */
            drawFilledTriangle(p0: Vec2, p1: Vec2, p2: Vec2, colour: number): void;
            /**
             * @inheritDoc
             */
            drawFilledCircle(position: Vec2, radius: number, colour: number): void;
            /**
             * @inheritDoc
             */
            drawPolygon(polygon: any, colour: number): void;
            /**
             * @inheritDoc
             */
            drawFilledPolygon(polygon: any, colour: number): void;
            /**
             * @inheritDoc
             */
            draw(object: any): void;
            /**
             * @inheritDoc
             */
            drawSpring(start: Vec2, end: Vec2, colour: number, coils?: number, radius?: number): void;
            rgba(colour: any, alpha?: number): string;
        }
    }
}
declare namespace zpp_nape {
    namespace util {
        import ZPP_Compound = zpp_nape.phys.ZPP_Compound;
        import ZPP_Mat23 = zpp_nape.geom.ZPP_Mat23;
        import ShapeList = nape.shape.ShapeList;
        import BodyList = nape.phys.BodyList;
        import ZPP_Space = zpp_nape.space.ZPP_Space;
        import ZPP_Body = zpp_nape.phys.ZPP_Body;
        import ZPP_Shape = zpp_nape.shape.ZPP_Shape;
        import ZPP_Arbiter = zpp_nape.dynamics.ZPP_Arbiter;
        import ShapeDebug = nape.util.ShapeDebug;
        class ZPP_ShapeDebug extends ZPP_Debug {
            outer_zn: ShapeDebug;
            shape: createjs.Shape;
            graphics: createjs.Graphics;
            constructor(width: number, height: number);
            setbg(bgColor: number): void;
            compoundstack: ZNPList_ZPP_Compound;
            draw_compound(compound: ZPP_Compound, xform: ZPP_Mat23, xdet: number, xnull: boolean): void;
            shapeList: ShapeList;
            bodyList: BodyList;
            draw_space(space: ZPP_Space, xform: ZPP_Mat23, xdet: number, xnull: boolean): void;
            draw_body(body: ZPP_Body, xform: ZPP_Mat23, xdet: number, xnull: boolean): void;
            draw_shape(shape: ZPP_Shape, xform: ZPP_Mat23, xdet: number, xnull: boolean): void;
            draw_arbiter(arb: ZPP_Arbiter, xform: ZPP_Mat23, xdet: number, xnull: boolean): void;
            lineStyle(thickness: any, colour: any, alpha?: number): void;
            AABB(body: any, xnull: any, xform: any, aabb: any): void;
        }
    }
}
declare namespace zpp_nape {
    namespace util {
        import ZPP_AABB = zpp_nape.geom.ZPP_AABB;
        import ZPP_Mat23 = zpp_nape.geom.ZPP_Mat23;
        import Debug = nape.util.Debug;
        class ZPP_Debug {
            static internal: boolean;
            outer: Debug;
            isbmp: boolean;
            d_shape: ZPP_ShapeDebug;
            bg_r: number;
            bg_g: number;
            bg_b: number;
            bg_col: number;
            xform: ZPP_Mat23;
            xnull: boolean;
            xdet: number;
            width: number;
            height: number;
            viewport: ZPP_AABB;
            iport: ZPP_AABB;
            constructor(width: number, height: number);
            private xform_invalidate();
            setform(): void;
            tmpab: ZPP_AABB;
            cull(aabb: ZPP_AABB): boolean;
            sup_setbg(bgcol: number): void;
            colour(id: any, sleep: any): number;
            tint(__col: any, __ncol: any, __f: any): number;
        }
    }
}
declare namespace nape {
    namespace util {
        import Space = nape.space.Space;
        import Body = nape.phys.Body;
        import Mat23 = nape.geom.Mat23;
        import Vec2 = nape.geom.Vec2;
        import AABB = nape.geom.AABB;
        import ZPP_Debug = zpp_nape.util.ZPP_Debug;
        /**
         * Debug class providing general utilities
         * <br/><br/>
         * Also serves as the base type for Debug draws.
         */
        class Debug {
            /**
             * Query Nape version
             */
            static version(): string;
            /**
             * Force clear all object pools, both internal and public.
             */
            static clearObjectPools(): void;
            static ltime: number;
            static TIMES(space: Space): string;
            static ACNT: number;
            static AACNT: number;
            static CCNT: number;
            static ACCNT: number;
            static FOR: number;
            static PRE: number;
            static VEL: number;
            static POS: number;
            static BROAD: number;
            static NARROW: number;
            static DRAW: number;
            static VALID: number;
            static SORT: number;
            static HASH: number;
            static HASHT: number;
            static BROADCLASH: number;
            static BROADTOTAL: number;
            static createGraphic(body: Body): createjs.Shape;
            /**
             * @private
             */
            zpp_inner: ZPP_Debug;
            /**
             * If true, a representation of contact patches will be drawn.
             * <br/><br/>
             * Only active arbiters are drawn.
             * @default false
             */
            drawCollisionArbiters: boolean;
            /**
             * If true, a representation of centres of buoyancy and overlap will be drawn.
             * <br/><br/>
             * Only active arbiters are drawn.
             * @default false
             */
            drawFluidArbiters: boolean;
            /**
             * If true, a representation of sensor interactions will be drawn.
             * <br/><br/>
             * Only active arbiters are drawn.
             * @default false
             */
            drawSensorArbiters: boolean;
            /**
             * If true, then all bodies in the space (whether active or not) will be drawn.
             * @default true
             */
            drawBodies: boolean;
            /**
             * If true, then things like the body centre of mass, and bouncing box will be drawn.
             * <br/><br/>
             * This will only have an effect if drawBodies is true.
             * @default false
             */
            drawBodyDetail: boolean;
            /**
             * If true, then things like shape centre of mass and bounding box will be drawn.
             * <br/><br/>
             * This will only have an effect if drawBodies is true.
             * @default false
             */
            drawShapeDetail: boolean;
            /**
             * If true, then indicators of the shapes rotation will be drawn.
             * <br/><br/>
             * This will only have an effect if drawBodies is true.
             * @default true
             */
            drawShapeAngleIndicators: boolean;
            /**
             * If true, then representations of the active constraints will be drawn.
             * @default false
             */
            drawConstraints: boolean;
            /**
             * Background colour for debug draw display.
             * <br/><br/>
             * This value does not have much use for ShapeDebug, or for
             * a transparent BitmapDebug but will still be used in tinting
             * object colours to better fit an idealised background colour.
             */
            bgColour: number;
            /**
             * User defined colour picking.
             * <br/><br/>
             * When not null, this method will be called to decide which colour
             * to use for an object with argument being the id of that object.
             * <br/><br/>
             * The return value should be an RGB value.
             *
             * @default null
             */
            colour: (number) => number;
            /**
             * @private
             */
            constructor();
            /**
             * The flash/openfl||nme native display object representing debug draw.
             * <br/><br/>
             * When using debug drawer, you should add this to your display list.
             */
            display: createjs.DisplayObject;
            /**
             * When true, objects outside the debug draw screen will not be drawn.
             * <br/><br/>
             * The debug draw screen is defined as the rectangle (0,0) -> (width,height).
             * To 'move' the debug draw screen in your world, you should modify the transform
             * property.
             * <br/><br/>
             * This culling has a cost, so is not worth enabling if everything is always on
             * screen anyways.
             *
             * @default false
             */
            cullingEnabled: boolean;
            /**
             * Transformation to apply to all debug draw operations.
             * <br/><br/>
             * This transform can be used to 'move' the debug draw screen through your
             * world as well as rotating and zooming in etc.
             * <br/><br/>
             * This transform effects 'all' debug draw operations and optimisation is in
             * place to not perform any transformation if matrix is the identity matrix.
             *
             * @default new Mat23()
             */
            transform: Mat23;
            /**
             * Clear the debug view.
             */
            clear(): void;
            /**
             * Flush any pending draw operations to debug view.
             * <br/><br/>
             * This operation is not needed for ShapeDebug at present.
             */
            flush(): void;
            /**
             * Draw a Nape object to debug draw.
             * <br/><br/>
             * Possible argument types are: <code>Space, Compound, Body, Shape, Constraint</code>
             * <br/><br/>
             * To draw a Shape it must be part of a Body.
             * <br/><br/>
             * Debug draw settings like 'drawBodies' are overriden by a direct call to draw
             * with a Body or Shape. Equally even if drawConstraints is false, should
             * you call draw with a Constraint object directly it will be drawn regardless.
             *
             * @param object The object to draw.
             * @throws # If object is null or not of the expected Type.
             */
            draw(object: any): void;
            /**
             * Draw a line segment.
             * <br/><br/>
             * This line will be drawn with no thickness.
             *
             * @param start The start point of line segment.
             * @param end   The end point of line segment.
             * @param colour The colour of line in RGB.
             * @throws # If either start or end are null or disposed of.
             */
            drawLine(start: Vec2, end: Vec2, colour: number): void;
            /**
             * Draw quadratic bezier curve.
             * <br/><br/>
             * This curve will be drawn with no thickness.
             *
             * @param start The start point of curve.
             * @param control The control point for curve.
             * @param end The end point of curve.
             * @param colour The colour of curve in RGB.
             * @throws # If any Vec2 argument is null or disposed of.
             */
            drawCurve(start: Vec2, control: Vec2, end: Vec2, colour: number): void;
            /**
             * Draw circle.
             * <br/><br/>
             * This circle will be drawn with no thickness or fill.
             *
             * @param position The position of circle centre.
             * @param radius The radius of the circle.
             * @param colour The colour of circle in RGB.
             * @throws # If position is null or disposed of.
             * @throws # If radius is negative.
             * @throws # If transform is not equiorthogonal.
             */
            drawCircle(position: Vec2, radius: number, colour: number): void;
            /**
             * Draw AABB.
             * <br/><br/>
             * This AABB will be drawn with no thickness or fill.
             *
             * @param aabb The AABB to draw.
             * @param colour The colour to draw AABB with in RGB.
             * @throws # If AABB is null.
             */
            drawAABB(aabb: AABB, colour: number): void;
            /**
             * Draw filled triangle.
             * <br/><br/>
             * This triangle will be drawn with no edges, only a solid fill.
             *
             * @param p0 The first point in triangle.
             * @param p1 The second point in triangle.
             * @param p2 The third point in triangle.
             * @param colour The colour to draw triangle with in RGB.
             * @throws # If any point argument is null or disposed of.
             */
            drawFilledTriangle(p0: Vec2, p1: Vec2, p2: Vec2, colour: number): void;
            /**
             * Draw filled circle.
             * <br/><br/>
             * This circle will be drawn with no edges, only a solid fill.
             *
             * @param position The position of centre of circle.
             * @param radius The radius of circle.
             * @param colour The colour to draw circle with in RGB.
             * @throws # If position is null or disposed of.
             * @throws # If radius is negative.
             * @throws # If transform is not equiorthogonal.
             */
            drawFilledCircle(position: Vec2, radius: number, colour: number): void;
            /**
             * Draw polygon.
             * <br/><br/>
             * This polygon will be drawn with no thickness or fill.
             * <br/><br/>
             * The polygon argument is typed Dynamic and may be one of:
             * <code>Array&lt;Vec2&gt;, flash.Vector&lt;Vec2&gt;, Vec2List, GeomPoly</code>
             *
             * @param polygon The polygon to draw.
             * @param colour The colour to draw polygon with in RGB.
             * @throws # If polygon is null, or not of expected type.
             * @throws # If polygon contains disposed Vec2.
             */
            drawPolygon(polygon: any, colour: number): void;
            /**
             * Draw filled polygon.
             * <br/><br/>
             * This polygon will be drawn no edges, only a solid fill.
             * <br/><br/>
             * The polygon argument is typed Dynamic and may be one of:
             * <code>Array&lt;Vec2&gt;, flash.Vector&lt;Vec2&gt;, Vec2List, GeomPoly</code>
             *
             * @param polygon The polygon to draw.
             * @param colour The colour to draw polygon with in RGB.
             * @throws # If polygon is null, or not of expected type.
             * @throws # If polygon contains disposed Vec2.
             */
            drawFilledPolygon(polygon: any, colour: number): void;
            /**
             * Draw linear spring.
             * <br/><br/>
             * This spring will be drawn with no thickness.
             *
             * @param start The start point of spring.
             * @param end The end point of spring.
             * @param colour The colour of spring in RGB.
             * @param coils The number of coils in spring. (default 3)
             * @param radius The radius of spring. (default 3.0)
             * @throws # If start or end are either null or disposed of.
             * @throws # If number of coils is negative.
             */
            drawSpring(start: Vec2, end: Vec2, colour: number, coils?: number, radius?: number): void;
            static lineStyle(graphics: any, thickness: any, colour: any, alpha?: number): void;
            protected static WEAK(v: Vec2): boolean;
            static PolyWeak(polygon: any): void;
            static PolyIter(polygon: any, callback: (p: Vec2) => void): void;
            static debug_draw(context: any, obj: any): void;
            static debug_spring(context: any, start: any, end: any, colour: any, coils: any, radius: any): void;
        }
    }
}
declare namespace zpp_nape {
    namespace constraint {
        import Vec2 = nape.geom.Vec2;
        class ZPP_AngleDraw {
            static indicator(g: nape.util.Debug, c: Vec2, ang: number, rad: number, col: number): void;
            protected static maxarc: number;
            static drawSpiralSpring(g: nape.util.Debug, c: Vec2, a0: number, a1: number, r0: number, r1: number, col: number, coils?: number): void;
            static drawSpiral(g: nape.util.Debug, c: Vec2, a0: number, a1: number, r0: number, r1: number, col: number): void;
        }
    }
}
declare namespace nape_DebugDraw {
}
