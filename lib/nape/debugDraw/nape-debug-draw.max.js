///<reference path='lib/nape.d.ts'/>
///<reference path='Debug.ts'/>
var zpp_nape;
(function (zpp_nape) {
    var constraint;
    (function (constraint) {
        var Vec2 = nape.geom.Vec2;
        var ZPP_AngleDraw = (function () {
            function ZPP_AngleDraw() {
            }
            ZPP_AngleDraw.indicator = function (g, c, ang, rad, col) {
                var dir = Vec2.get(Math.cos(ang), Math.sin(ang));
                g.drawFilledCircle(c.add(dir.mul(rad, true), true), 2, col);
                dir.dispose();
            };
            ZPP_AngleDraw.drawSpiralSpring = function (g, c, a0, a1, r0, r1, col, coils) {
                if (coils === void 0) { coils = 4; }
                if (a0 > a1) {
                    {
                        var t = a0;
                        a0 = a1;
                        a1 = t;
                    }
                    {
                        var t1 = r0;
                        r0 = r1;
                        r1 = t1;
                    }
                }
                if (a0 == a1)
                    return;
                var dr = r1 - r0;
                var da = a1 - a0;
                var x = 2 * Math.PI * dr / da;
                var Delta = ((x < 0) ? -x : x);
                var x1 = Math.ceil(da / zpp_nape.constraint.ZPP_AngleDraw.maxarc * 3);
                var y = 4 * coils;
                var dcnt = ((x1 > y) ? x1 : y);
                var dang = da / dcnt;
                var dtime = 1 / dcnt;
                var c0 = Math.cos(a0);
                var s0 = Math.sin(a0);
                var p = r0 + dr * 0;
                var R0 = p + 0.75 * Delta * Math.sin(2 * coils * Math.PI * 0);
                var p0 = Vec2.get(c.x + R0 * c0, c.y + R0 * s0);
                var DR = dr + 1.5 * coils * Delta * Math.PI * Math.cos(2 * coils * Math.PI * 0);
                var ux = DR * c0 - R0 * da * s0;
                var uy = DR * s0 + R0 * da * c0;
                var p1 = Vec2.get(0, 0, false);
                var ct = Vec2.get(0, 0, false);
                {
                    var _g1 = 0;
                    while (_g1 < dcnt) {
                        var i = _g1++;
                        var a11 = a0 + dang;
                        var c1 = Math.cos(a11);
                        var s1 = Math.sin(a11);
                        var p2 = r0 + dr * (i + 1) * dtime;
                        var R1 = p2 + 0.75 * Delta * Math.sin(2 * coils * Math.PI * (i + 1) * dtime);
                        p1.setxy(c.x + R1 * c1, c.y + R1 * s1);
                        var DR1 = dr + 1.5 * coils * Delta * Math.PI * Math.cos(2 * coils * Math.PI * (i + 1) * dtime);
                        var vx = DR1 * c1 - R1 * da * s1;
                        var vy = DR1 * s1 + R1 * da * c1;
                        var den = ux * vy - uy * vx;
                        if (den * den < nape.Config.epsilon || ux * vx + uy * vy <= 0 || ux * vx + uy * vy > 0.999)
                            g.drawLine(p0, p1, col);
                        else {
                            var t2 = ((p1.x - p0.x) * vy + (p0.y - p1.y) * vx) / den;
                            if (t2 <= 0)
                                g.drawLine(p0, p1, col);
                            else {
                                ct.x = p0.x + ux * t2;
                                ct.y = p0.y + uy * t2;
                                g.drawCurve(p0, ct, p1, col);
                            }
                        }
                        a0 = a11;
                        c0 = c1;
                        s0 = s1;
                        ux = vx;
                        uy = vy;
                        p0.set(p1);
                    }
                }
                p0.dispose();
                p1.dispose();
                ct.dispose();
            };
            ZPP_AngleDraw.drawSpiral = function (g, c, a0, a1, r0, r1, col) {
                if (a0 > a1) {
                    {
                        var t = a0;
                        a0 = a1;
                        a1 = t;
                    }
                    {
                        var t1 = r0;
                        r0 = r1;
                        r1 = t1;
                    }
                }
                if (a0 == a1)
                    return;
                var dr = r1 - r0;
                var da = a1 - a0;
                var dcnt = Math.ceil(da / zpp_nape.constraint.ZPP_AngleDraw.maxarc);
                var drad = dr / dcnt;
                var dang = da / dcnt;
                var c0 = Math.cos(a0);
                var s0 = Math.sin(a0);
                var p0 = Vec2.get(c.x + r0 * c0, c.y + r0 * s0);
                var ux = dr * c0 - r0 * da * s0;
                var uy = dr * s0 + r0 * da * c0;
                var p1 = Vec2.get(0, 0, false);
                var ct = Vec2.get(0, 0, false);
                {
                    var _g1 = 0;
                    while (_g1 < dcnt) {
                        ++_g1;
                        var r11 = r0 + drad;
                        var a11 = a0 + dang;
                        var c1 = Math.cos(a11);
                        var s1 = Math.sin(a11);
                        p1.setxy(c.x + r11 * c1, c.y + r11 * s1);
                        var vx = dr * c1 - r11 * da * s1;
                        var vy = dr * s1 + r11 * da * c1;
                        var den = ux * vy - uy * vx;
                        if (den * den < nape.Config.epsilon)
                            g.drawLine(p0, p1, col);
                        else {
                            var t2 = ((p1.x - p0.x) * vy + (p0.y - p1.y) * vx) / den;
                            if (t2 <= 0)
                                g.drawLine(p0, p1, col);
                            else {
                                ct.x = p0.x + ux * t2;
                                ct.y = p0.y + uy * t2;
                                g.drawCurve(p0, ct, p1, col);
                            }
                        }
                        r0 = r11;
                        a0 = a11;
                        c0 = c1;
                        s0 = s1;
                        ux = vx;
                        uy = vy;
                        p0.set(p1);
                    }
                }
                p0.dispose();
                p1.dispose();
                ct.dispose();
            };
            ZPP_AngleDraw.maxarc = Math.PI / 4;
            return ZPP_AngleDraw;
        })();
        constraint.ZPP_AngleDraw = ZPP_AngleDraw;
    })(constraint = zpp_nape.constraint || (zpp_nape.constraint = {}));
})(zpp_nape || (zpp_nape = {}));
var nape_DebugDraw;
(function (nape_DebugDraw) {
    var ZPP_AngleJoint = zpp_nape.constraint.ZPP_AngleJoint;
    var ZPP_PivotJoint = zpp_nape.constraint.ZPP_PivotJoint;
    var ZPP_AngleDraw = zpp_nape.constraint.ZPP_AngleDraw;
    var ZPP_DistanceJoint = zpp_nape.constraint.ZPP_DistanceJoint;
    var ZPP_LineJoint = zpp_nape.constraint.ZPP_LineJoint;
    var ZPP_PulleyJoint = zpp_nape.constraint.ZPP_PulleyJoint;
    var ZPP_UserConstraint = zpp_nape.constraint.ZPP_UserConstraint;
    var ZPP_WeldJoint = zpp_nape.constraint.ZPP_WeldJoint;
    ZPP_AngleJoint.prototype.draw = function (g) {
        var me = this.outer_zn;
        var delrad = 5 / Math.PI / 2;
        if (me.body1 != me.body1.space.world) {
            var min = me.ratio * me.body2.rotation - this.jointMin;
            var max = me.ratio * me.body2.rotation - this.jointMax;
            if (min > max) {
                var t = min;
                min = max;
                max = t;
            }
            if (me.body1.rotation > min) {
                var x = me.body1.rotation;
                var y = max;
                var dr = ((x < y) ? x : y);
                ZPP_AngleDraw.drawSpiral(g, me.body1.position, min, dr, 10 + (min - min) * delrad, 10 + (dr - min) * delrad, 16776960);
            }
            else if (!this.stiff && me.body1.rotation < min)
                ZPP_AngleDraw.drawSpiralSpring(g, me.body1.position, me.body1.rotation, min, 10 + (me.body1.rotation - min) * delrad, 10 + (min - min) * delrad, 16776960);
            if (me.body1.rotation < max) {
                var x1 = me.body1.rotation;
                var y1 = min;
                var dr1 = ((x1 > y1) ? x1 : y1);
                ZPP_AngleDraw.drawSpiral(g, me.body1.position, dr1, max, 10 + (dr1 - min) * delrad, 10 + (max - min) * delrad, 65535);
            }
            else if (!this.stiff && me.body1.rotation > max)
                ZPP_AngleDraw.drawSpiralSpring(g, me.body1.position, me.body1.rotation, max, 10 + (me.body1.rotation - min) * delrad, 10 + (max - min) * delrad, 65535);
            ZPP_AngleDraw.indicator(g, me.body1.position, me.body1.rotation, 10 + (me.body1.rotation - min) * delrad, 255);
        }
        if (me.body2 != me.body2.space.world) {
            var min1 = (this.jointMin + me.body1.rotation) / me.ratio;
            var max1 = (this.jointMax + me.body1.rotation) / me.ratio;
            if (min1 > max1) {
                var t1 = min1;
                min1 = max1;
                max1 = t1;
            }
            if (me.body2.rotation > min1) {
                var x2 = me.body2.rotation;
                var y2 = max1;
                var dr2 = ((x2 < y2) ? x2 : y2);
                ZPP_AngleDraw.drawSpiral(g, me.body2.position, min1, dr2, 10 + (min1 - min1) * delrad, 10 + (dr2 - min1) * delrad, 16776960);
            }
            else if (!this.stiff && me.body2.rotation < min1)
                ZPP_AngleDraw.drawSpiralSpring(g, me.body2.position, me.body2.rotation, min1, 10 + (me.body2.rotation - min1) * delrad, 10 + (min1 - min1) * delrad, 16776960);
            if (me.body2.rotation < max1) {
                var x3 = me.body2.rotation;
                var y3 = min1;
                var dr3 = ((x3 > y3) ? x3 : y3);
                ZPP_AngleDraw.drawSpiral(g, me.body2.position, dr3, max1, 10 + (dr3 - min1) * delrad, 10 + (max1 - min1) * delrad, 65535);
            }
            else if (!this.stiff && me.body2.rotation > max1)
                ZPP_AngleDraw.drawSpiralSpring(g, me.body2.position, me.body2.rotation, max1, 10 + (me.body2.rotation - min1) * delrad, 10 + (max1 - min1) * delrad, 65535);
            ZPP_AngleDraw.indicator(g, me.body2.position, me.body2.rotation, 10 + (me.body2.rotation - min1) * delrad, 16711680);
        }
    };
    ZPP_PivotJoint.prototype.draw = function (g) {
        var me = this.outer_zn;
        var tmp = me.anchor1;
        var a1 = me.body1.localPointToWorld(tmp);
        var tmp1 = me.anchor2;
        var a2 = me.body2.localPointToWorld(tmp1);
        if (!this.stiff) {
            var n = a2.sub(a1);
            var nl = n.length;
            if (nl != 0)
                g.drawSpring(a1, a2, 16711935);
            n.dispose();
        }
        g.drawFilledCircle(a1, 2, 255);
        g.drawFilledCircle(a2, 2, 16711680);
        a1.dispose();
        a2.dispose();
    };
    ZPP_DistanceJoint.prototype.draw = function (g) {
        var me = this.outer_zn;
        var tmp = me.anchor1;
        var a1 = me.body1.localPointToWorld(tmp);
        var tmp1 = me.anchor2;
        var a2 = me.body2.localPointToWorld(tmp1);
        var n = a2.sub(a1);
        var nl = n.length;
        if (nl != 0) {
            n.muleq(1 / nl);
            var mid = a1.add(a2).muleq(0.5);
            var min1 = mid.sub(n.mul(this.jointMin * 0.5, true));
            var min2 = mid.add(n.mul(this.jointMin * 0.5, true));
            var max1 = mid.sub(n.mul(this.jointMax * 0.5, true));
            var max2 = mid.add(n.mul(this.jointMax * 0.5, true));
            g.drawLine(min1, min2, 16776960);
            g.drawLine(max1, min1, 65535);
            g.drawLine(max2, min2, 65535);
            if (!this.stiff) {
                if (nl > this.jointMax) {
                    g.drawSpring(max1, a1, 65535);
                    g.drawSpring(max2, a2, 65535);
                }
                else if (nl < this.jointMin) {
                    g.drawSpring(min1, a1, 16776960);
                    g.drawSpring(min2, a2, 16776960);
                }
            }
            mid.dispose();
            min1.dispose();
            min2.dispose();
            max1.dispose();
            max2.dispose();
        }
        g.drawFilledCircle(a1, 2, 255);
        g.drawFilledCircle(a2, 2, 16711680);
        a1.dispose();
        a2.dispose();
        n.dispose();
    };
    ZPP_LineJoint.prototype.draw = function (g) {
        var me = this.outer_zn;
        var tmp = me.anchor1;
        var a1 = me.body1.localPointToWorld(tmp);
        var tmp1 = me.anchor2;
        var a2 = me.body2.localPointToWorld(tmp1);
        var tmp2 = me.direction;
        var dir = me.body1.localVectorToWorld(tmp2);
        dir.muleq(1 / dir.length);
        var min = me.jointMin;
        var max = me.jointMax;
        if (min <= zpp_nape.ZPP_Const.NEGINF())
            min = -1000;
        if (max >= zpp_nape.ZPP_Const.POSINF())
            max = 1000;
        var del = a2.sub(a1);
        var pn = del.dot(dir);
        del.dispose();
        var e1 = a1.add(dir.mul(min, true));
        var e2 = a1.add(dir.mul(max, true));
        if (pn > min) {
            var y = max;
            g.drawLine(e1, a1.add(dir.mul(((pn < y) ? pn : y), true), true), 16776960);
        }
        if (pn < max) {
            var y1 = min;
            g.drawLine(a1.add(dir.mul(((pn > y1) ? pn : y1), true), true), e2, 65535);
        }
        if (!this.stiff) {
            var anch = ((pn < this.jointMin) ? e1.copy() : ((pn > this.jointMax) ? e2.copy() : a1.add(dir.mul(pn, true))));
            g.drawSpring(anch, a2, 16711935);
            anch.dispose();
        }
        g.drawFilledCircle(a1, 2, 255);
        g.drawFilledCircle(a2, 2, 16711680);
        a1.dispose();
        a2.dispose();
        e1.dispose();
        e2.dispose();
    };
    ZPP_PulleyJoint.prototype.draw = function (g) {
        var me = this.outer_zn;
        var tmp = me.anchor1;
        var a1 = me.body1.localPointToWorld(tmp);
        var tmp1 = me.anchor2;
        var a2 = me.body2.localPointToWorld(tmp1);
        var tmp2 = me.anchor3;
        var a3 = me.body3.localPointToWorld(tmp2);
        var tmp3 = me.anchor4;
        var a4 = me.body4.localPointToWorld(tmp3);
        var n12 = a2.sub(a1);
        var n34 = a4.sub(a3);
        var nl12 = n12.length;
        var nl34 = n34.length;
        this.drawLink(g, a1, a2, n12, nl12, nl34 * this.ratio, 1.0, 16776960, 65535);
        this.drawLink(g, a3, a4, n34, nl34, nl12, 1 / this.ratio, 65535, 16711935);
        g.drawFilledCircle(a1, 2, 255);
        g.drawFilledCircle(a2, 2, 16711680);
        g.drawFilledCircle(a3, 2, 65280);
        g.drawFilledCircle(a4, 2, 16711935);
        a1.dispose();
        a2.dispose();
        a3.dispose();
        a4.dispose();
        n12.dispose();
        n34.dispose();
    };
    ZPP_PulleyJoint.prototype['drawLink'] = function (g, a1, a2, n, nl, bias, scale, ca, cb) {
        if (nl != 0) {
            n.muleq(1 / nl);
            var mid = a1.add(a2).muleq(0.5);
            var cmin = (this.jointMin - bias) * scale;
            if (cmin < 0)
                cmin = 0;
            var cmax = (this.jointMax - bias) * scale;
            if (cmax < 0)
                cmax = 0;
            var min1 = mid.sub(n.mul(cmin * 0.5, true));
            var min2 = mid.add(n.mul(cmin * 0.5, true));
            var max1 = mid.sub(n.mul(cmax * 0.5, true));
            var max2 = mid.add(n.mul(cmax * 0.5, true));
            g.drawLine(min1, min2, ca);
            g.drawLine(max1, min1, cb);
            g.drawLine(max2, min2, cb);
            if (!this.stiff) {
                if (nl > cmax) {
                    g.drawSpring(max1, a1, cb);
                    g.drawSpring(max2, a2, cb);
                }
                else if (nl < cmin) {
                    g.drawSpring(min1, a1, ca);
                    g.drawSpring(min2, a2, ca);
                }
            }
            ;
            mid.dispose();
            min1.dispose();
            min2.dispose();
            max1.dispose();
            max2.dispose();
        }
    };
    ZPP_UserConstraint.prototype.draw = function (g) {
        this.outer_zn.__draw(g);
    };
    ZPP_WeldJoint.prototype.draw = function (g) {
        var me = this.outer_zn;
        var tmp = me.anchor1;
        var a1 = me.body1.localPointToWorld(tmp);
        var tmp1 = me.anchor2;
        var a2 = me.body2.localPointToWorld(tmp1);
        if (!this.stiff) {
            var n = a2.sub(a1);
            var nl = n.length;
            if (nl != 0)
                g.drawSpring(a1, a2, 16711935);
            n.dispose();
            var delrad = 5 / Math.PI / 2;
            if (me.body1 != me.body1.space.world) {
                var max = me.body2.rotation - me.phase;
                var min = me.body1.rotation;
                if (min > max) {
                    var t = min;
                    min = max;
                    max = t;
                }
                ZPP_AngleDraw.drawSpiralSpring(g, me.body1.position, min, max, 10 + (min - min) * delrad, 10 + (max - min) * delrad, 16711808);
                ZPP_AngleDraw.indicator(g, me.body1.position, me.body1.rotation, 10 + (me.body1.rotation - min) * delrad, 16711808);
            }
            if (me.body2 != me.body2.space.world) {
                var max1 = me.phase + me.body1.rotation;
                var min1 = me.body2.rotation;
                if (min1 > max1) {
                    var t1 = min1;
                    min1 = max1;
                    max1 = t1;
                }
                ZPP_AngleDraw.drawSpiralSpring(g, me.body2.position, min1, max1, 10 + (min1 - min1) * delrad, 10 + (max1 - min1) * delrad, 8388863);
                ZPP_AngleDraw.indicator(g, me.body2.position, me.body2.rotation, 10 + (me.body2.rotation - min1) * delrad, 8388863);
            }
        }
        g.drawFilledCircle(a1, 2, 255);
        g.drawFilledCircle(a2, 2, 16711680);
        a1.dispose();
        a2.dispose();
    };
})(nape_DebugDraw || (nape_DebugDraw = {}));
///<reference path='lib/nape.d.ts'/>
///<reference path='ZPP_Debug.ts'/>
///<reference path='lib/easeljs.d.ts'/>
var nape;
(function (nape) {
    var util;
    (function (util) {
        var ConstraintIterator = nape.constraint.ConstraintIterator;
        var InteractorIterator = nape.phys.InteractorIterator;
        var BodyIterator = nape.phys.BodyIterator;
        var CompoundIterator = nape.phys.CompoundIterator;
        var ListenerIterator = nape.callbacks.ListenerIterator;
        var CbTypeIterator = nape.callbacks.CbTypeIterator;
        var ConvexResultIterator = nape.geom.ConvexResultIterator;
        var GeomPolyIterator = nape.geom.GeomPolyIterator;
        var RayResultIterator = nape.geom.RayResultIterator;
        var Vec2Iterator = nape.geom.Vec2Iterator;
        var ShapeIterator = nape.shape.ShapeIterator;
        var EdgeIterator = nape.shape.EdgeIterator;
        var ContactIterator = nape.dynamics.ContactIterator;
        var ArbiterIterator = nape.dynamics.ArbiterIterator;
        var InteractionGroupIterator = nape.dynamics.InteractionGroupIterator;
        var ZNPNode_ZPP_CbType = zpp_nape.util.ZNPNode_ZPP_CbType;
        var ZNPNode_ZPP_CallbackSet = zpp_nape.util.ZNPNode_ZPP_CallbackSet;
        var ZPP_Material = zpp_nape.phys.ZPP_Material;
        var ZNPNode_ZPP_Shape = zpp_nape.util.ZNPNode_ZPP_Shape;
        var ZPP_FluidProperties = zpp_nape.phys.ZPP_FluidProperties;
        var ZNPNode_ZPP_Body = zpp_nape.util.ZNPNode_ZPP_Body;
        var ZNPNode_ZPP_Constraint = zpp_nape.util.ZNPNode_ZPP_Constraint;
        var ZNPNode_ZPP_Compound = zpp_nape.util.ZNPNode_ZPP_Compound;
        var ZNPNode_ZPP_Arbiter = zpp_nape.util.ZNPNode_ZPP_Arbiter;
        var ZPP_Set_ZPP_Body = zpp_nape.util.ZPP_Set_ZPP_Body;
        var ZPP_CbSetPair = zpp_nape.callbacks.ZPP_CbSetPair;
        var ZNPNode_ZPP_InteractionListener = zpp_nape.util.ZNPNode_ZPP_InteractionListener;
        var ZNPNode_ZPP_CbSet = zpp_nape.util.ZNPNode_ZPP_CbSet;
        var ZNPNode_ZPP_Interactor = zpp_nape.util.ZNPNode_ZPP_Interactor;
        var ZNPNode_ZPP_BodyListener = zpp_nape.util.ZNPNode_ZPP_BodyListener;
        var ZPP_Callback = zpp_nape.callbacks.ZPP_Callback;
        var ZPP_CbSet = zpp_nape.callbacks.ZPP_CbSet;
        var ZNPNode_ZPP_CbSetPair = zpp_nape.util.ZNPNode_ZPP_CbSetPair;
        var ZNPNode_ZPP_ConstraintListener = zpp_nape.util.ZNPNode_ZPP_ConstraintListener;
        var ZPP_GeomVertexIterator = zpp_nape.geom.ZPP_GeomVertexIterator;
        var ZPP_GeomVert = zpp_nape.geom.ZPP_GeomVert;
        var ZPP_Mat23 = zpp_nape.geom.ZPP_Mat23;
        var ZPP_Set_ZPP_CbSetPair = zpp_nape.util.ZPP_Set_ZPP_CbSetPair;
        var ZPP_CutVert = zpp_nape.geom.ZPP_CutVert;
        var ZPP_CutInt = zpp_nape.geom.ZPP_CutInt;
        var ZNPNode_ZPP_CutInt = zpp_nape.util.ZNPNode_ZPP_CutInt;
        var ZNPNode_ZPP_CutVert = zpp_nape.util.ZNPNode_ZPP_CutVert;
        var ZPP_Vec2 = zpp_nape.geom.ZPP_Vec2;
        var ZNPNode_ZPP_PartitionVertex = zpp_nape.util.ZNPNode_ZPP_PartitionVertex;
        var ZPP_PartitionVertex = zpp_nape.geom.ZPP_PartitionVertex;
        var ZPP_Set_ZPP_PartitionVertex = zpp_nape.util.ZPP_Set_ZPP_PartitionVertex;
        var ZPP_SimplifyV = zpp_nape.geom.ZPP_SimplifyV;
        var ZPP_SimplifyP = zpp_nape.geom.ZPP_SimplifyP;
        var ZPP_PartitionedPoly = zpp_nape.geom.ZPP_PartitionedPoly;
        var ZNPNode_ZPP_SimplifyP = zpp_nape.util.ZNPNode_ZPP_SimplifyP;
        var ZNPNode_ZPP_PartitionedPoly = zpp_nape.util.ZNPNode_ZPP_PartitionedPoly;
        var ZPP_Set_ZPP_PartitionPair = zpp_nape.util.ZPP_Set_ZPP_PartitionPair;
        var ZNPNode_ZPP_GeomVert = zpp_nape.util.ZNPNode_ZPP_GeomVert;
        var ZPP_AABB = zpp_nape.geom.ZPP_AABB;
        var ZPP_Set_ZPP_SimpleVert = zpp_nape.util.ZPP_Set_ZPP_SimpleVert;
        var ZPP_PartitionPair = zpp_nape.geom.ZPP_PartitionPair;
        var ZPP_SimpleVert = zpp_nape.geom.ZPP_SimpleVert;
        var ZPP_SimpleSeg = zpp_nape.geom.ZPP_SimpleSeg;
        var ZPP_Set_ZPP_SimpleSeg = zpp_nape.util.ZPP_Set_ZPP_SimpleSeg;
        var ZPP_Set_ZPP_SimpleEvent = zpp_nape.util.ZPP_Set_ZPP_SimpleEvent;
        var ZPP_SimpleEvent = zpp_nape.geom.ZPP_SimpleEvent;
        var Hashable2_Boolfalse = zpp_nape.util.Hashable2_Boolfalse;
        var ZPP_ToiEvent = zpp_nape.geom.ZPP_ToiEvent;
        var ZNPNode_ZPP_SimpleVert = zpp_nape.util.ZNPNode_ZPP_SimpleVert;
        var ZNPNode_ZPP_SimpleEvent = zpp_nape.util.ZNPNode_ZPP_SimpleEvent;
        var ZPP_MarchSpan = zpp_nape.geom.ZPP_MarchSpan;
        var ZPP_MarchPair = zpp_nape.geom.ZPP_MarchPair;
        var ZNPNode_ZPP_Vec2 = zpp_nape.util.ZNPNode_ZPP_Vec2;
        var ZPP_Edge = zpp_nape.shape.ZPP_Edge;
        var ZNPNode_ZPP_AABBPair = zpp_nape.util.ZNPNode_ZPP_AABBPair;
        var ZNPNode_ZPP_Edge = zpp_nape.util.ZNPNode_ZPP_Edge;
        var ZPP_SweepData = zpp_nape.space.ZPP_SweepData;
        var ZPP_AABBNode = zpp_nape.space.ZPP_AABBNode;
        var ZPP_AABBPair = zpp_nape.space.ZPP_AABBPair;
        var ZNPNode_ZPP_AABBNode = zpp_nape.util.ZNPNode_ZPP_AABBNode;
        var ZPP_Contact = zpp_nape.dynamics.ZPP_Contact;
        var ZNPNode_ZPP_Component = zpp_nape.util.ZNPNode_ZPP_Component;
        var ZPP_Island = zpp_nape.space.ZPP_Island;
        var ZPP_Component = zpp_nape.space.ZPP_Component;
        var ZPP_CallbackSet = zpp_nape.space.ZPP_CallbackSet;
        var ZPP_Set_ZPP_CbSet = zpp_nape.util.ZPP_Set_ZPP_CbSet;
        var ZNPNode_ZPP_FluidArbiter = zpp_nape.util.ZNPNode_ZPP_FluidArbiter;
        var ZPP_ColArbiter = zpp_nape.dynamics.ZPP_ColArbiter;
        var ZNPNode_ZPP_SensorArbiter = zpp_nape.util.ZNPNode_ZPP_SensorArbiter;
        var ZNPNode_ZPP_Listener = zpp_nape.util.ZNPNode_ZPP_Listener;
        var ZNPNode_ZPP_ColArbiter = zpp_nape.util.ZNPNode_ZPP_ColArbiter;
        var ZNPNode_ZPP_InteractionGroup = zpp_nape.util.ZNPNode_ZPP_InteractionGroup;
        var ZNPNode_ZPP_ToiEvent = zpp_nape.util.ZNPNode_ZPP_ToiEvent;
        var ZPP_InteractionFilter = zpp_nape.dynamics.ZPP_InteractionFilter;
        var ZNPNode_ConvexResult = zpp_nape.util.ZNPNode_ConvexResult;
        var ZNPNode_ZPP_GeomPoly = zpp_nape.util.ZNPNode_ZPP_GeomPoly;
        var ZNPNode_RayResult = zpp_nape.util.ZNPNode_RayResult;
        var ZPP_PubPool = zpp_nape.util.ZPP_PubPool;
        var ZPP_SensorArbiter = zpp_nape.dynamics.ZPP_SensorArbiter;
        var ZPP_FluidArbiter = zpp_nape.dynamics.ZPP_FluidArbiter;
        var Space = nape.space.Space;
        var Body = nape.phys.Body;
        var Vec2 = nape.geom.Vec2;
        var Vec2List = nape.geom.Vec2List;
        var GeomPoly = nape.geom.GeomPoly;
        var Compound = nape.phys.Compound;
        var Shape = nape.shape.Shape;
        var Constraint = nape.constraint.Constraint;
        /**
         * Debug class providing general utilities
         * <br/><br/>
         * Also serves as the base type for Debug draws.
         */
        var Debug = (function () {
            /**
             * @private
             */
            function Debug() {
                /**
                 * @private
                 */
                this.zpp_inner = null;
                /**
                 * If true, a representation of contact patches will be drawn.
                 * <br/><br/>
                 * Only active arbiters are drawn.
                 * @default false
                 */
                this.drawCollisionArbiters = false;
                /**
                 * If true, a representation of centres of buoyancy and overlap will be drawn.
                 * <br/><br/>
                 * Only active arbiters are drawn.
                 * @default false
                 */
                this.drawFluidArbiters = false;
                /**
                 * If true, a representation of sensor interactions will be drawn.
                 * <br/><br/>
                 * Only active arbiters are drawn.
                 * @default false
                 */
                this.drawSensorArbiters = false;
                /**
                 * If true, then all bodies in the space (whether active or not) will be drawn.
                 * @default true
                 */
                this.drawBodies = false;
                /**
                 * If true, then things like the body centre of mass, and bouncing box will be drawn.
                 * <br/><br/>
                 * This will only have an effect if drawBodies is true.
                 * @default false
                 */
                this.drawBodyDetail = false;
                /**
                 * If true, then things like shape centre of mass and bounding box will be drawn.
                 * <br/><br/>
                 * This will only have an effect if drawBodies is true.
                 * @default false
                 */
                this.drawShapeDetail = false;
                /**
                 * If true, then indicators of the shapes rotation will be drawn.
                 * <br/><br/>
                 * This will only have an effect if drawBodies is true.
                 * @default true
                 */
                this.drawShapeAngleIndicators = false;
                /**
                 * If true, then representations of the active constraints will be drawn.
                 * @default false
                 */
                this.drawConstraints = false;
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
                this.cullingEnabled = false;
                this.drawCollisionArbiters = false;
                this.drawFluidArbiters = false;
                this.drawSensorArbiters = false;
                this.drawBodies = true;
                this.drawShapeAngleIndicators = true;
                this.drawBodyDetail = false;
                this.drawShapeDetail = false;
                this.drawConstraints = false;
                this.cullingEnabled = false;
                this.colour = null;
            }
            /**
             * Query Nape version
             */
            Debug.version = function () {
                return "Nape 2.0.19";
            };
            /**
             * Force clear all object pools, both internal and public.
             */
            Debug.clearObjectPools = function () {
                {
                    while (ConstraintIterator.zpp_pool != null) {
                        var nxt = ConstraintIterator.zpp_pool.zpp_next;
                        ConstraintIterator.zpp_pool.zpp_next = null;
                        ConstraintIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (InteractorIterator.zpp_pool != null) {
                        var nxt = InteractorIterator.zpp_pool.zpp_next;
                        InteractorIterator.zpp_pool.zpp_next = null;
                        InteractorIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (BodyIterator.zpp_pool != null) {
                        var nxt = BodyIterator.zpp_pool.zpp_next;
                        BodyIterator.zpp_pool.zpp_next = null;
                        BodyIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (CompoundIterator.zpp_pool != null) {
                        var nxt = CompoundIterator.zpp_pool.zpp_next;
                        CompoundIterator.zpp_pool.zpp_next = null;
                        CompoundIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ListenerIterator.zpp_pool != null) {
                        var nxt = ListenerIterator.zpp_pool.zpp_next;
                        ListenerIterator.zpp_pool.zpp_next = null;
                        ListenerIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (CbTypeIterator.zpp_pool != null) {
                        var nxt = CbTypeIterator.zpp_pool.zpp_next;
                        CbTypeIterator.zpp_pool.zpp_next = null;
                        CbTypeIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ConvexResultIterator.zpp_pool != null) {
                        var nxt = ConvexResultIterator.zpp_pool.zpp_next;
                        ConvexResultIterator.zpp_pool.zpp_next = null;
                        ConvexResultIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (GeomPolyIterator.zpp_pool != null) {
                        var nxt = GeomPolyIterator.zpp_pool.zpp_next;
                        GeomPolyIterator.zpp_pool.zpp_next = null;
                        GeomPolyIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (Vec2Iterator.zpp_pool != null) {
                        var nxt = Vec2Iterator.zpp_pool.zpp_next;
                        Vec2Iterator.zpp_pool.zpp_next = null;
                        Vec2Iterator.zpp_pool = nxt;
                    }
                }
                {
                    while (RayResultIterator.zpp_pool != null) {
                        var nxt = RayResultIterator.zpp_pool.zpp_next;
                        RayResultIterator.zpp_pool.zpp_next = null;
                        RayResultIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ShapeIterator.zpp_pool != null) {
                        var nxt = ShapeIterator.zpp_pool.zpp_next;
                        ShapeIterator.zpp_pool.zpp_next = null;
                        ShapeIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (EdgeIterator.zpp_pool != null) {
                        var nxt = EdgeIterator.zpp_pool.zpp_next;
                        EdgeIterator.zpp_pool.zpp_next = null;
                        EdgeIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ContactIterator.zpp_pool != null) {
                        var nxt = ContactIterator.zpp_pool.zpp_next;
                        ContactIterator.zpp_pool.zpp_next = null;
                        ContactIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ArbiterIterator.zpp_pool != null) {
                        var nxt = ArbiterIterator.zpp_pool.zpp_next;
                        ArbiterIterator.zpp_pool.zpp_next = null;
                        ArbiterIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (InteractionGroupIterator.zpp_pool != null) {
                        var nxt = InteractionGroupIterator.zpp_pool.zpp_next;
                        InteractionGroupIterator.zpp_pool.zpp_next = null;
                        InteractionGroupIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_CbType.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_CbType.zpp_pool.next;
                        ZNPNode_ZPP_CbType.zpp_pool.next = null;
                        ZNPNode_ZPP_CbType.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_CallbackSet.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_CallbackSet.zpp_pool.next;
                        ZNPNode_ZPP_CallbackSet.zpp_pool.next = null;
                        ZNPNode_ZPP_CallbackSet.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Material.zpp_pool != null) {
                        var nxt = ZPP_Material.zpp_pool.next;
                        ZPP_Material.zpp_pool.next = null;
                        ZPP_Material.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Shape.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Shape.zpp_pool.next;
                        ZNPNode_ZPP_Shape.zpp_pool.next = null;
                        ZNPNode_ZPP_Shape.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_FluidProperties.zpp_pool != null) {
                        var nxt = ZPP_FluidProperties.zpp_pool.next;
                        ZPP_FluidProperties.zpp_pool.next = null;
                        ZPP_FluidProperties.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Body.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Body.zpp_pool.next;
                        ZNPNode_ZPP_Body.zpp_pool.next = null;
                        ZNPNode_ZPP_Body.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Constraint.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Constraint.zpp_pool.next;
                        ZNPNode_ZPP_Constraint.zpp_pool.next = null;
                        ZNPNode_ZPP_Constraint.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Compound.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Compound.zpp_pool.next;
                        ZNPNode_ZPP_Compound.zpp_pool.next = null;
                        ZNPNode_ZPP_Compound.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Arbiter.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Arbiter.zpp_pool.next;
                        ZNPNode_ZPP_Arbiter.zpp_pool.next = null;
                        ZNPNode_ZPP_Arbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_Body.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_Body.zpp_pool.next;
                        ZPP_Set_ZPP_Body.zpp_pool.next = null;
                        ZPP_Set_ZPP_Body.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_CbSetPair.zpp_pool != null) {
                        var nxt = ZPP_CbSetPair.zpp_pool.next;
                        ZPP_CbSetPair.zpp_pool.next = null;
                        ZPP_CbSetPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_InteractionListener.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_InteractionListener.zpp_pool.next;
                        ZNPNode_ZPP_InteractionListener.zpp_pool.next = null;
                        ZNPNode_ZPP_InteractionListener.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_CbSet.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_CbSet.zpp_pool.next;
                        ZNPNode_ZPP_CbSet.zpp_pool.next = null;
                        ZNPNode_ZPP_CbSet.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Interactor.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Interactor.zpp_pool.next;
                        ZNPNode_ZPP_Interactor.zpp_pool.next = null;
                        ZNPNode_ZPP_Interactor.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_BodyListener.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_BodyListener.zpp_pool.next;
                        ZNPNode_ZPP_BodyListener.zpp_pool.next = null;
                        ZNPNode_ZPP_BodyListener.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Callback.zpp_pool != null) {
                        var nxt = ZPP_Callback.zpp_pool.next;
                        ZPP_Callback.zpp_pool.next = null;
                        ZPP_Callback.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_CbSet.zpp_pool != null) {
                        var nxt = ZPP_CbSet.zpp_pool.next;
                        ZPP_CbSet.zpp_pool.next = null;
                        ZPP_CbSet.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_CbSetPair.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_CbSetPair.zpp_pool.next;
                        ZNPNode_ZPP_CbSetPair.zpp_pool.next = null;
                        ZNPNode_ZPP_CbSetPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_ConstraintListener.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_ConstraintListener.zpp_pool.next;
                        ZNPNode_ZPP_ConstraintListener.zpp_pool.next = null;
                        ZNPNode_ZPP_ConstraintListener.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_GeomVert.zpp_pool != null) {
                        var nxt = ZPP_GeomVert.zpp_pool.next;
                        ZPP_GeomVert.zpp_pool.next = null;
                        ZPP_GeomVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_GeomVertexIterator.zpp_pool != null) {
                        var nxt = ZPP_GeomVertexIterator.zpp_pool.next;
                        ZPP_GeomVertexIterator.zpp_pool.next = null;
                        ZPP_GeomVertexIterator.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Mat23.zpp_pool != null) {
                        var nxt = ZPP_Mat23.zpp_pool.next;
                        ZPP_Mat23.zpp_pool.next = null;
                        ZPP_Mat23.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_CbSetPair.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_CbSetPair.zpp_pool.next;
                        ZPP_Set_ZPP_CbSetPair.zpp_pool.next = null;
                        ZPP_Set_ZPP_CbSetPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_CutVert.zpp_pool != null) {
                        var nxt = ZPP_CutVert.zpp_pool.next;
                        ZPP_CutVert.zpp_pool.next = null;
                        ZPP_CutVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_CutInt.zpp_pool != null) {
                        var nxt = ZPP_CutInt.zpp_pool.next;
                        ZPP_CutInt.zpp_pool.next = null;
                        ZPP_CutInt.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_CutInt.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_CutInt.zpp_pool.next;
                        ZNPNode_ZPP_CutInt.zpp_pool.next = null;
                        ZNPNode_ZPP_CutInt.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_CutVert.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_CutVert.zpp_pool.next;
                        ZNPNode_ZPP_CutVert.zpp_pool.next = null;
                        ZNPNode_ZPP_CutVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Vec2.zpp_pool != null) {
                        var nxt = ZPP_Vec2.zpp_pool.next;
                        ZPP_Vec2.zpp_pool.next = null;
                        ZPP_Vec2.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_PartitionVertex.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_PartitionVertex.zpp_pool.next;
                        ZNPNode_ZPP_PartitionVertex.zpp_pool.next = null;
                        ZNPNode_ZPP_PartitionVertex.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_PartitionVertex.zpp_pool != null) {
                        var nxt = ZPP_PartitionVertex.zpp_pool.next;
                        ZPP_PartitionVertex.zpp_pool.next = null;
                        ZPP_PartitionVertex.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_PartitionVertex.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_PartitionVertex.zpp_pool.next;
                        ZPP_Set_ZPP_PartitionVertex.zpp_pool.next = null;
                        ZPP_Set_ZPP_PartitionVertex.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SimplifyV.zpp_pool != null) {
                        var nxt = ZPP_SimplifyV.zpp_pool.next;
                        ZPP_SimplifyV.zpp_pool.next = null;
                        ZPP_SimplifyV.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SimplifyP.zpp_pool != null) {
                        var nxt = ZPP_SimplifyP.zpp_pool.next;
                        ZPP_SimplifyP.zpp_pool.next = null;
                        ZPP_SimplifyP.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_PartitionedPoly.zpp_pool != null) {
                        var nxt = ZPP_PartitionedPoly.zpp_pool.next;
                        ZPP_PartitionedPoly.zpp_pool.next = null;
                        ZPP_PartitionedPoly.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_SimplifyP.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_SimplifyP.zpp_pool.next;
                        ZNPNode_ZPP_SimplifyP.zpp_pool.next = null;
                        ZNPNode_ZPP_SimplifyP.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_PartitionedPoly.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_PartitionedPoly.zpp_pool.next;
                        ZNPNode_ZPP_PartitionedPoly.zpp_pool.next = null;
                        ZNPNode_ZPP_PartitionedPoly.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_PartitionPair.zpp_pool != null) {
                        var nxt = ZPP_PartitionPair.zpp_pool.next;
                        ZPP_PartitionPair.zpp_pool.next = null;
                        ZPP_PartitionPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_PartitionPair.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_PartitionPair.zpp_pool.next;
                        ZPP_Set_ZPP_PartitionPair.zpp_pool.next = null;
                        ZPP_Set_ZPP_PartitionPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_GeomVert.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_GeomVert.zpp_pool.next;
                        ZNPNode_ZPP_GeomVert.zpp_pool.next = null;
                        ZNPNode_ZPP_GeomVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_AABB.zpp_pool != null) {
                        var nxt = ZPP_AABB.zpp_pool.next;
                        ZPP_AABB.zpp_pool.next = null;
                        ZPP_AABB.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_SimpleVert.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_SimpleVert.zpp_pool.next;
                        ZPP_Set_ZPP_SimpleVert.zpp_pool.next = null;
                        ZPP_Set_ZPP_SimpleVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SimpleVert.zpp_pool != null) {
                        var nxt = ZPP_SimpleVert.zpp_pool.next;
                        ZPP_SimpleVert.zpp_pool.next = null;
                        ZPP_SimpleVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SimpleSeg.zpp_pool != null) {
                        var nxt = ZPP_SimpleSeg.zpp_pool.next;
                        ZPP_SimpleSeg.zpp_pool.next = null;
                        ZPP_SimpleSeg.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_SimpleSeg.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_SimpleSeg.zpp_pool.next;
                        ZPP_Set_ZPP_SimpleSeg.zpp_pool.next = null;
                        ZPP_Set_ZPP_SimpleSeg.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_SimpleEvent.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_SimpleEvent.zpp_pool.next;
                        ZPP_Set_ZPP_SimpleEvent.zpp_pool.next = null;
                        ZPP_Set_ZPP_SimpleEvent.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SimpleEvent.zpp_pool != null) {
                        var nxt = ZPP_SimpleEvent.zpp_pool.next;
                        ZPP_SimpleEvent.zpp_pool.next = null;
                        ZPP_SimpleEvent.zpp_pool = nxt;
                    }
                }
                {
                    while (Hashable2_Boolfalse.zpp_pool != null) {
                        var nxt = Hashable2_Boolfalse.zpp_pool.next;
                        Hashable2_Boolfalse.zpp_pool.next = null;
                        Hashable2_Boolfalse.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_ToiEvent.zpp_pool != null) {
                        var nxt = ZPP_ToiEvent.zpp_pool.next;
                        ZPP_ToiEvent.zpp_pool.next = null;
                        ZPP_ToiEvent.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_SimpleVert.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_SimpleVert.zpp_pool.next;
                        ZNPNode_ZPP_SimpleVert.zpp_pool.next = null;
                        ZNPNode_ZPP_SimpleVert.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_SimpleEvent.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_SimpleEvent.zpp_pool.next;
                        ZNPNode_ZPP_SimpleEvent.zpp_pool.next = null;
                        ZNPNode_ZPP_SimpleEvent.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_MarchSpan.zpp_pool != null) {
                        var nxt = ZPP_MarchSpan.zpp_pool.next;
                        ZPP_MarchSpan.zpp_pool.next = null;
                        ZPP_MarchSpan.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_MarchPair.zpp_pool != null) {
                        var nxt = ZPP_MarchPair.zpp_pool.next;
                        ZPP_MarchPair.zpp_pool.next = null;
                        ZPP_MarchPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Vec2.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Vec2.zpp_pool.next;
                        ZNPNode_ZPP_Vec2.zpp_pool.next = null;
                        ZNPNode_ZPP_Vec2.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Edge.zpp_pool != null) {
                        var nxt = ZPP_Edge.zpp_pool.next;
                        ZPP_Edge.zpp_pool.next = null;
                        ZPP_Edge.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_AABBPair.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_AABBPair.zpp_pool.next;
                        ZNPNode_ZPP_AABBPair.zpp_pool.next = null;
                        ZNPNode_ZPP_AABBPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Edge.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Edge.zpp_pool.next;
                        ZNPNode_ZPP_Edge.zpp_pool.next = null;
                        ZNPNode_ZPP_Edge.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SweepData.zpp_pool != null) {
                        var nxt = ZPP_SweepData.zpp_pool.next;
                        ZPP_SweepData.zpp_pool.next = null;
                        ZPP_SweepData.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_AABBNode.zpp_pool != null) {
                        var nxt = ZPP_AABBNode.zpp_pool.next;
                        ZPP_AABBNode.zpp_pool.next = null;
                        ZPP_AABBNode.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_AABBPair.zpp_pool != null) {
                        var nxt = ZPP_AABBPair.zpp_pool.next;
                        ZPP_AABBPair.zpp_pool.next = null;
                        ZPP_AABBPair.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_AABBNode.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_AABBNode.zpp_pool.next;
                        ZNPNode_ZPP_AABBNode.zpp_pool.next = null;
                        ZNPNode_ZPP_AABBNode.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Contact.zpp_pool != null) {
                        var nxt = ZPP_Contact.zpp_pool.next;
                        ZPP_Contact.zpp_pool.next = null;
                        ZPP_Contact.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Component.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Component.zpp_pool.next;
                        ZNPNode_ZPP_Component.zpp_pool.next = null;
                        ZNPNode_ZPP_Component.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Island.zpp_pool != null) {
                        var nxt = ZPP_Island.zpp_pool.next;
                        ZPP_Island.zpp_pool.next = null;
                        ZPP_Island.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Component.zpp_pool != null) {
                        var nxt = ZPP_Component.zpp_pool.next;
                        ZPP_Component.zpp_pool.next = null;
                        ZPP_Component.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_CallbackSet.zpp_pool != null) {
                        var nxt = ZPP_CallbackSet.zpp_pool.next;
                        ZPP_CallbackSet.zpp_pool.next = null;
                        ZPP_CallbackSet.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_SensorArbiter.zpp_pool != null) {
                        var nxt = ZPP_SensorArbiter.zpp_pool.next;
                        ZPP_SensorArbiter.zpp_pool.next = null;
                        ZPP_SensorArbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_FluidArbiter.zpp_pool != null) {
                        var nxt = ZPP_FluidArbiter.zpp_pool.next;
                        ZPP_FluidArbiter.zpp_pool.next = null;
                        ZPP_FluidArbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_Set_ZPP_CbSet.zpp_pool != null) {
                        var nxt = ZPP_Set_ZPP_CbSet.zpp_pool.next;
                        ZPP_Set_ZPP_CbSet.zpp_pool.next = null;
                        ZPP_Set_ZPP_CbSet.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_FluidArbiter.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_FluidArbiter.zpp_pool.next;
                        ZNPNode_ZPP_FluidArbiter.zpp_pool.next = null;
                        ZNPNode_ZPP_FluidArbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_ColArbiter.zpp_pool != null) {
                        var nxt = ZPP_ColArbiter.zpp_pool.next;
                        ZPP_ColArbiter.zpp_pool.next = null;
                        ZPP_ColArbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_SensorArbiter.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_SensorArbiter.zpp_pool.next;
                        ZNPNode_ZPP_SensorArbiter.zpp_pool.next = null;
                        ZNPNode_ZPP_SensorArbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_Listener.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_Listener.zpp_pool.next;
                        ZNPNode_ZPP_Listener.zpp_pool.next = null;
                        ZNPNode_ZPP_Listener.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_ColArbiter.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_ColArbiter.zpp_pool.next;
                        ZNPNode_ZPP_ColArbiter.zpp_pool.next = null;
                        ZNPNode_ZPP_ColArbiter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_InteractionGroup.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_InteractionGroup.zpp_pool.next;
                        ZNPNode_ZPP_InteractionGroup.zpp_pool.next = null;
                        ZNPNode_ZPP_InteractionGroup.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_ToiEvent.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_ToiEvent.zpp_pool.next;
                        ZNPNode_ZPP_ToiEvent.zpp_pool.next = null;
                        ZNPNode_ZPP_ToiEvent.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_InteractionFilter.zpp_pool != null) {
                        var nxt = ZPP_InteractionFilter.zpp_pool.next;
                        ZPP_InteractionFilter.zpp_pool.next = null;
                        ZPP_InteractionFilter.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ConvexResult.zpp_pool != null) {
                        var nxt = ZNPNode_ConvexResult.zpp_pool.next;
                        ZNPNode_ConvexResult.zpp_pool.next = null;
                        ZNPNode_ConvexResult.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_ZPP_GeomPoly.zpp_pool != null) {
                        var nxt = ZNPNode_ZPP_GeomPoly.zpp_pool.next;
                        ZNPNode_ZPP_GeomPoly.zpp_pool.next = null;
                        ZNPNode_ZPP_GeomPoly.zpp_pool = nxt;
                    }
                }
                {
                    while (ZNPNode_RayResult.zpp_pool != null) {
                        var nxt = ZNPNode_RayResult.zpp_pool.next;
                        ZNPNode_RayResult.zpp_pool.next = null;
                        ZNPNode_RayResult.zpp_pool = nxt;
                    }
                }
                {
                    while (ZPP_PubPool.poolGeomPoly != null) {
                        var nxt = ZPP_PubPool.poolGeomPoly.zpp_pool;
                        ZPP_PubPool.poolGeomPoly.zpp_pool = null;
                        ZPP_PubPool.poolGeomPoly = nxt;
                    }
                }
                {
                    while (ZPP_PubPool.poolVec2 != null) {
                        var nxt = ZPP_PubPool.poolVec2.zpp_pool;
                        ZPP_PubPool.poolVec2.zpp_pool = null;
                        ZPP_PubPool.poolVec2 = nxt;
                    }
                }
                {
                    while (ZPP_PubPool.poolVec3 != null) {
                        var nxt = ZPP_PubPool.poolVec3.zpp_pool;
                        ZPP_PubPool.poolVec3.zpp_pool = null;
                        ZPP_PubPool.poolVec3 = nxt;
                    }
                }
            };
            Debug.TIMES = function (space) {
                var text = "";
                var dt = space.timeStamp - Debug.ltime;
                text += "Validation:    " + (Debug.VALID / dt).toString().substr(0, 5) + "ms\n";
                text += "Broadphase:    " + ((Debug.BROAD - Debug.NARROW) / dt).toString().substr(0, 5) + "ms :: total = " + (Debug.BROAD / dt).toString().substr(0, 5) + "ms\n";
                text += "Narrowphase:   " + (Debug.NARROW / dt).toString().substr(0, 5) + "ms\n";
                text += "Set-Forest:    " + (Debug.FOR / dt).toString().substr(0, 5) + "ms\n";
                text += "Prestep:       " + (Debug.PRE / dt).toString().substr(0, 5) + "ms\n";
                text += "Contact sort:  " + (Debug.SORT / dt).toString().substr(0, 5) + "ms\n";
                text += "Position It.:  " + (Debug.POS / dt).toString().substr(0, 5) + "ms\n";
                text += "Velocity It.:  " + (Debug.VEL / dt).toString().substr(0, 5) + "ms\n";
                text += "Debug Draw:    " + (Debug.DRAW / dt).toString().substr(0, 5) + "ms\n";
                text += "\n";
                text += "arb:        " + Debug.ACNT + "\n";
                text += "active arb: " + Debug.AACNT + "\n";
                text += "con:        " + Debug.CCNT + "\n";
                text += "active con: " + Debug.ACCNT + "\n";
                text += "\n";
                text += "hash collisions: " + (Debug.HASH / Debug.HASHT * 100).toString().substr(0, 5) + "%\n";
                text += "\n";
                text += "Broadphase adjustments: " + (Debug.BROADCLASH / Debug.BROADTOTAL * 100).toString().substr(0, 5) + "%\n";
                if (space.timeStamp - Debug.ltime > 50) {
                    Debug.FOR = Debug.BROAD = Debug.PRE = Debug.POS = Debug.VEL = Debug.DRAW = Debug.VALID = Debug.SORT = Debug.NARROW = Debug.BROADCLASH = Debug.BROADTOTAL = 0;
                    Debug.ltime = space.timeStamp;
                }
                return text;
            };
            Debug.createGraphic = function (body) {
                if (body == null)
                    throw new Error("Error: Cannot create debug graphic for null Body");
                var ret = new createjs.Shape();
                var graphics = ret.graphics;
                var idc = Math.floor(0xffffff * Math.exp(-body.id / 1500));
                var _r = (((idc & 0xff0000) >> 16)) * 0.7;
                var _g = (((idc & 0xff00) >> 8)) * 0.7;
                var _b = (idc & 0xff) * 0.7;
                var col = (Math.floor(_r) << 16) | (Math.floor(_g) << 8) | (Math.floor(_b));
                Debug.lineStyle(graphics, 0.1, col, 1);
                var iterator = body.shapes.iterator();
                while (iterator.hasNext()) {
                    var s = iterator.next();
                    if (s.isCircle()) {
                        var c = s.castCircle;
                        graphics.drawCircle(c.localCOM.x, c.localCOM.y, c.radius);
                    }
                    else {
                        var p = s.castPolygon;
                        graphics.moveTo(s.localCOM.x, s.localCOM.y);
                        for (var i = -0, l = p.worldVerts.length; i < l; i++) {
                            var px = p.localVerts.at(i);
                            graphics.lineTo(px.x, px.y);
                        }
                        var px = p.localVerts.at(0);
                        graphics.lineTo(px.x, px.y);
                    }
                    if (s.isCircle()) {
                        var c = s.castCircle;
                        graphics.moveTo(c.localCOM.x + c.radius * 0.3, c.localCOM.y);
                        graphics.lineTo(c.localCOM.x + c.radius, c.localCOM.y);
                    }
                }
                return ret;
            };
            Object.defineProperty(Debug.prototype, "bgColour", {
                /**
                 * Background colour for debug draw display.
                 * <br/><br/>
                 * This value does not have much use for ShapeDebug, or for
                 * a transparent BitmapDebug but will still be used in tinting
                 * object colours to better fit an idealised background colour.
                 */
                get: function () {
                    return this.zpp_inner.bg_col;
                },
                set: function (bgColour) {
                    this.zpp_inner.d_shape.setbg(bgColour);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Debug.prototype, "display", {
                /**
                 * The flash/openfl||nme native display object representing debug draw.
                 * <br/><br/>
                 * When using debug drawer, you should add this to your display list.
                 */
                get: function () {
                    return this.zpp_inner.d_shape.shape;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Debug.prototype, "transform", {
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
                get: function () {
                    if (this.zpp_inner.xform == null)
                        this.zpp_inner.setform();
                    return this.zpp_inner.xform.outer;
                },
                set: function (transform) {
                    this.transform.set(transform);
                },
                enumerable: true,
                configurable: true
            });
            /**
             * Clear the debug view.
             */
            Debug.prototype.clear = function () { };
            /**
             * Flush any pending draw operations to debug view.
             * <br/><br/>
             * This operation is not needed for ShapeDebug at present.
             */
            Debug.prototype.flush = function () { };
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
            Debug.prototype.draw = function (object) { };
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
            Debug.prototype.drawLine = function (start, end, colour) { };
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
            Debug.prototype.drawCurve = function (start, control, end, colour) { };
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
            Debug.prototype.drawCircle = function (position, radius, colour) { };
            /**
             * Draw AABB.
             * <br/><br/>
             * This AABB will be drawn with no thickness or fill.
             *
             * @param aabb The AABB to draw.
             * @param colour The colour to draw AABB with in RGB.
             * @throws # If AABB is null.
             */
            Debug.prototype.drawAABB = function (aabb, colour) { };
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
            Debug.prototype.drawFilledTriangle = function (p0, p1, p2, colour) { };
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
            Debug.prototype.drawFilledCircle = function (position, radius, colour) { };
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
            Debug.prototype.drawPolygon = function (polygon, colour) { };
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
            Debug.prototype.drawFilledPolygon = function (polygon, colour) { };
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
            Debug.prototype.drawSpring = function (start, end, colour, coils, radius) {
                if (coils === void 0) { coils = 3; }
                if (radius === void 0) { radius = 3.0; }
            };
            ////
            //// Mixins
            Debug.lineStyle = function (graphics, thickness, colour, alpha) {
                if (alpha === void 0) { alpha = 1; }
                var _r = (colour & 0xff0000) >> 16;
                var _g = (colour & 0xff00) >> 8;
                var _b = colour & 0xff;
                graphics.setStrokeStyle(thickness).beginStroke("rgb(" + _r + "," + _g + "," + _b + "," + alpha + ")");
            };
            Debug.WEAK = function (v) {
                if (v.zpp_inner.weak) {
                    v.dispose();
                    return true;
                }
                return false;
            };
            Debug.PolyWeak = function (polygon) {
                if ((polygon instanceof Array) && polygon.__enum__ == null) {
                    var lv = polygon;
                    var i = 0;
                    while (i < lv.length) {
                        var cur = lv[i];
                        if (Debug.WEAK(cur)) {
                            lv.splice(i, 1);
                            continue;
                        }
                        i++;
                    }
                }
                else if (polygon instanceof Vec2List) {
                    var lv = polygon;
                    if (lv.zpp_inner._validate != null)
                        lv.zpp_inner._validate();
                    var ins = lv.zpp_inner.inner;
                    var pre = null;
                    var cur = ins.begin();
                    while (cur != null) {
                        var x = cur.elem();
                        if (x.outer.zpp_inner.weak) {
                            cur = ins.erase(pre);
                            Debug.WEAK(x.outer);
                        }
                        else {
                            pre = cur;
                            cur = cur.next;
                        }
                    }
                }
            };
            Debug.PolyIter = function (polygon, callback) {
                if ((polygon instanceof Array) && polygon.__enum__ == null) {
                    for (var key in polygon) {
                        callback(polygon[key]);
                    }
                }
                else if (polygon instanceof Vec2List) {
                    var iterator = polygon.iterator();
                    while (iterator.hasNext()) {
                        callback(iterator.next());
                    }
                }
                else if (polygon instanceof GeomPoly) {
                    var iterator = polygon.iterator();
                    while (iterator.hasNext()) {
                        callback(iterator.next());
                    }
                }
            };
            Debug.debug_draw = function (context, obj) {
                if (context.zpp_inner.xnull) {
                    if (obj instanceof Space)
                        context.zpp_inner_zn.draw_space(obj.zpp_inner, null, 1.0, true);
                    else if (obj instanceof Compound)
                        context.zpp_inner_zn.draw_compound(obj.zpp_inner, null, 1.0, true);
                    else if (obj instanceof Body)
                        context.zpp_inner_zn.draw_body(obj.zpp_inner, null, 1.0, true);
                    else if (obj instanceof Shape)
                        context.zpp_inner_zn.draw_shape(obj.zpp_inner, null, 1.0, true);
                    else if (obj instanceof Constraint)
                        obj.zpp_inner.draw(context);
                }
                else {
                    if (obj instanceof Space)
                        context.zpp_inner_zn.draw_space(obj.zpp_inner, context.zpp_inner.xform, context.zpp_inner.xdet, false);
                    else if (obj instanceof Body)
                        context.zpp_inner_zn.draw_body(obj.zpp_inner, context.zpp_inner.xform, context.zpp_inner.xdet, false);
                    else if (obj instanceof Shape)
                        context.zpp_inner_zn.draw_shape(obj.zpp_inner, context.zpp_inner.xform, context.zpp_inner.xdet, false);
                    else if (obj instanceof Constraint)
                        obj.zpp_inner.draw(context);
                }
            };
            Debug.debug_spring = function (context, start, end, colour, coils, radius) {
                if (coils == 0)
                    context.drawLine(start, end, colour);
                else {
                    var dx = end.x - start.x;
                    var dy = end.y - start.y;
                    {
                        var t = (1.0 / (coils * 4));
                        dx *= t;
                        dy *= t;
                    }
                    var nx = dx;
                    var ny = dy;
                    if ((nx * nx + ny * ny) < 0.1)
                        return;
                    {
                        var d = (nx * nx + ny * ny);
                        var imag = 1 / Math.sqrt(d);
                        nx *= imag;
                        ny *= imag;
                        {
                            var t = nx;
                            nx = -ny;
                            ny = t;
                        }
                    }
                    {
                        var t = (radius * 2);
                        nx *= t;
                        ny *= t;
                    }
                    var u = start.copy();
                    var v = Vec2.get(0, 0, false);
                    var q = Vec2.get(0, 0, false);
                    for (var i = 0; i < coils; i++) {
                        v.x = u.x + dx + nx;
                        v.y = u.y + dy + ny;
                        q.x = u.x + dx * 2;
                        q.y = u.y + dy * 2;
                        context.drawCurve(u, v, q, colour);
                        u.x = q.x;
                        u.y = q.y;
                        v.x = u.x + dx - nx;
                        v.y = u.y + dy - ny;
                        q.x = u.x + dx * 2;
                        q.y = u.y + dy * 2;
                        context.drawCurve(u, v, q, colour);
                        u.x = q.x;
                        u.y = q.y;
                    }
                    u.dispose();
                    v.dispose();
                    q.dispose();
                }
                Debug.WEAK(start);
                Debug.WEAK(end);
            };
            Debug.ltime = 0;
            Debug.ACNT = 0;
            Debug.AACNT = 0;
            Debug.CCNT = 0;
            Debug.ACCNT = 0;
            Debug.FOR = 0;
            Debug.PRE = 0;
            Debug.VEL = 0;
            Debug.POS = 0;
            Debug.BROAD = 0;
            Debug.NARROW = 0;
            Debug.DRAW = 0;
            Debug.VALID = 0;
            Debug.SORT = 0;
            Debug.HASH = 0;
            Debug.HASHT = 0;
            Debug.BROADCLASH = 0;
            Debug.BROADTOTAL = 0;
            return Debug;
        })();
        util.Debug = Debug; // class Debug
    })(util = nape.util || (nape.util = {})); // nape.util
})(nape || (nape = {})); // nape
///<reference path='lib/nape.d.ts'/>
///<reference path='Debug.ts'/>
///<reference path='ZPP_ShapeDebug.ts'/>
var zpp_nape;
(function (zpp_nape) {
    var util;
    (function (util) {
        var ZPP_AABB = zpp_nape.geom.ZPP_AABB;
        var Vec2 = nape.geom.Vec2;
        var Mat23 = nape.geom.Mat23;
        var ZPP_Debug = (function () {
            function ZPP_Debug(width, height) {
                this.outer = null;
                this.isbmp = false;
                this.d_shape = null;
                this.bg_r = 0.0;
                this.bg_g = 0.0;
                this.bg_b = 0.0;
                this.bg_col = 0;
                this.xform = null;
                this.xnull = false;
                this.xdet = 0.0;
                this.width = 0;
                this.height = 0;
                this.viewport = null;
                this.iport = null;
                this.tmpab = null;
                this.xnull = true;
                this.xdet = 1.0;
                this.width = width;
                this.height = height;
                this.viewport = ZPP_AABB.get(0, 0, width, height);
                this.iport = ZPP_AABB.get(0, 0, width, height);
                this.tmpab = new ZPP_AABB();
            }
            ZPP_Debug.prototype.xform_invalidate = function () {
                {
                    var x = this.xform.outer.determinant;
                    this.xdet = Math.sqrt(x < 0 ? -x : x);
                }
                this.xnull = this.xform.a == 1.0 && this.xform.b == 0.0 && this.xform.c == 0.0 && this.xform.d == 1.0 && this.xform.tx == 0.0 && this.xform.ty == 0.0;
                var qmat = this.xform.outer.inverse();
                var q = Vec2.get(0, 0, false);
                var v = qmat.transform(q);
                {
                    this.iport.minx = v.x;
                    this.iport.miny = v.y;
                }
                {
                    this.iport.maxx = this.iport.minx;
                    this.iport.maxy = this.iport.miny;
                }
                v.dispose();
                q.x = this.width;
                v = qmat.transform(q);
                this.iport.setExpandPoint(v.x, v.y);
                v.dispose();
                q.y = this.height;
                v = qmat.transform(q);
                this.iport.setExpandPoint(v.x, v.y);
                v.dispose();
                q.x = 0;
                v = qmat.transform(q);
                this.iport.setExpandPoint(v.x, v.y);
                v.dispose();
                q.dispose();
            };
            ZPP_Debug.prototype.setform = function () {
                this.xform = (new Mat23()).zpp_inner;
                this.xform._invalidate = this.xform_invalidate;
            };
            ZPP_Debug.prototype.cull = function (aabb) {
                if (this.xnull)
                    return aabb.intersect(this.viewport);
                else {
                    var qx = 0.0;
                    var qy = 0.0;
                    var vx = 0.0;
                    var vy = 0.0;
                    {
                        vx = aabb.minx;
                        vy = aabb.miny;
                    }
                    // if(false){
                    // 	this.tmpab.minx=vx;
                    // 	this.tmpab.miny=vy;
                    // }
                    // else{
                    this.tmpab.minx = this.xform.a * vx + this.xform.b * vy + this.xform.tx;
                    this.tmpab.miny = this.xform.c * vx + this.xform.d * vy + this.xform.ty;
                    // }
                    {
                        this.tmpab.maxx = this.tmpab.minx;
                        this.tmpab.maxy = this.tmpab.miny;
                    }
                    vx = aabb.maxx;
                    // if(false){
                    // 	qx=vx;
                    // 	qy=vy;
                    // }
                    // else{
                    qx = this.xform.a * vx + this.xform.b * vy + this.xform.tx;
                    qy = this.xform.c * vx + this.xform.d * vy + this.xform.ty;
                    // }
                    this.tmpab.setExpandPoint(qx, qy);
                    vy = aabb.maxy;
                    // if(false){
                    // 	qx=vx;
                    // 	qy=vy;
                    // }
                    // else{
                    qx = this.xform.a * vx + this.xform.b * vy + this.xform.tx;
                    qy = this.xform.c * vx + this.xform.d * vy + this.xform.ty;
                    // }
                    this.tmpab.setExpandPoint(qx, qy);
                    vx = aabb.minx;
                    // if(false){
                    // 	qx=vx;
                    // 	qy=vy;
                    // }
                    // else{
                    qx = this.xform.a * vx + this.xform.b * vy + this.xform.tx;
                    qy = this.xform.c * vx + this.xform.d * vy + this.xform.ty;
                    // }
                    this.tmpab.setExpandPoint(qx, qy);
                    return this.tmpab.intersect(this.viewport);
                }
            };
            ZPP_Debug.prototype.sup_setbg = function (bgcol) {
                this.bg_r = (bgcol >> 16) & 0xff;
                this.bg_g = (bgcol >> 8) & 0xff;
                this.bg_b = (bgcol) & 0xff;
                this.bg_col = bgcol;
            };
            ////
            //// Mixins
            ZPP_Debug.prototype.colour = function (id, sleep) {
                var idc;
                if (this.outer.colour == null)
                    idc = Math.floor(0xffffff * Math.exp(-(id % 500) / 1500));
                else
                    idc = this.outer.colour(id);
                var _r = (((idc & 0xff0000) >> 16)) * 0.7;
                var _g = (((idc & 0xff00) >> 8)) * 0.7;
                var _b = (idc & 0xff) * 0.7;
                if (sleep) {
                    _r = 0.4 * _r + 0.6 * this.bg_r;
                    _g = 0.4 * _g + 0.6 * this.bg_g;
                    _b = 0.4 * _b + 0.6 * this.bg_b;
                }
                return 0xff000000 | ((Math.floor(_r)) << 16) | ((Math.floor(_g)) << 8) | (Math.floor(_b));
            };
            //noinspection JSMethodCanBeStatic
            ZPP_Debug.prototype.tint = function (__col, __ncol, __f) {
                var col = __col;
                var ncol = __ncol;
                var f = __f;
                var _r = Math.floor(((col >> 16) & 0xff) * f + ((ncol >> 16) & 0xff) * (1 - f));
                var _g = Math.floor(((col >> 8) & 0xff) * f + ((ncol >> 8) & 0xff) * (1 - f));
                var _b = Math.floor(((col) & 0xff) * f + ((ncol) & 0xff) * (1 - f));
                return 0xff000000 | (_r << 16) | (_g << 8) | (_b);
            };
            ZPP_Debug.internal = false;
            return ZPP_Debug;
        })();
        util.ZPP_Debug = ZPP_Debug; // zpp_nape.util
    })(util = zpp_nape.util || (zpp_nape.util = {}));
})(zpp_nape || (zpp_nape = {})); // zpp_nape
///<reference path='lib/nape.d.ts'/>
///<reference path='ZPP_Debug.ts'/>
///<reference path='ShapeDebug.ts'/>
///<reference path='lib/easeljs.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var zpp_nape;
(function (zpp_nape) {
    var util;
    (function (util) {
        var ZPP_ShapeDebug = (function (_super) {
            __extends(ZPP_ShapeDebug, _super);
            function ZPP_ShapeDebug(width, height) {
                _super.call(this, width, height);
                this.outer_zn = null;
                this.shape = null;
                this.graphics = null;
                this.compoundstack = null;
                this.shapeList = null;
                this.bodyList = null;
                this.shape = new createjs.Shape();
                // this.shape.scrollRect=new flash.geom.Rectangle(0,0,width,height);
                this.graphics = this.shape.graphics;
                this.isbmp = false;
                this.d_shape = this;
            }
            ZPP_ShapeDebug.prototype.setbg = function (bgColor) {
                this.sup_setbg(bgColor);
            };
            ZPP_ShapeDebug.prototype.draw_compound = function (compound, xform, xdet, xnull) {
                {
                    var cx_ite = compound.compounds.begin();
                    while (cx_ite != null) {
                        var c = cx_ite.elem();
                        this.draw_compound(c, xform, xdet, xnull);
                        cx_ite = cx_ite.next;
                    }
                }
                {
                    var cx_ite = compound.bodies.begin();
                    while (cx_ite != null) {
                        var b = cx_ite.elem();
                        if (b.outer.debugDraw)
                            this.draw_body(b, xform, xdet, xnull);
                        cx_ite = cx_ite.next;
                    }
                }
                {
                    var cx_ite = compound.constraints.begin();
                    while (cx_ite != null) {
                        var c = cx_ite.elem();
                        if (c.active && c.outer.debugDraw)
                            c.draw(this.outer);
                        cx_ite = cx_ite.next;
                    }
                }
            };
            ZPP_ShapeDebug.prototype.draw_space = function (space, xform, xdet, xnull) {
                if (this.outer.cullingEnabled) {
                    if (this.outer.drawBodies) {
                        if (this.outer.drawBodyDetail) {
                            var bods = this.bodyList = space.bphase.bodiesInAABB(this.iport, false, false, null, this.bodyList);
                            while (!bods.empty()) {
                                var b = bods.shift();
                                if (b.debugDraw)
                                    this.draw_body(b.zpp_inner, xform, xdet, xnull);
                            }
                        }
                        else {
                            var shapes = this.shapeList = space.bphase.shapesInAABB(this.iport, false, false, null, this.shapeList);
                            while (!shapes.empty()) {
                                var s = shapes.shift();
                                if (s.body.debugDraw)
                                    this.draw_shape(s.zpp_inner, xform, xdet, xnull);
                            }
                        }
                    }
                }
                else {
                    if (this.outer.drawBodies) {
                        if (this.compoundstack == null)
                            this.compoundstack = new util.ZNPList_ZPP_Compound();
                        {
                            var cx_ite = space.bodies.begin();
                            while (cx_ite != null) {
                                var b_1 = cx_ite.elem();
                                if (b_1.outer.debugDraw)
                                    this.draw_body(b_1, xform, xdet, xnull);
                                cx_ite = cx_ite.next;
                            }
                        }
                        {
                            var cx_ite = space.compounds.begin();
                            while (cx_ite != null) {
                                var c = cx_ite.elem();
                                this.compoundstack.add(c);
                                cx_ite = cx_ite.next;
                            }
                        }
                        while (!this.compoundstack.empty()) {
                            var x = this.compoundstack.pop_unsafe();
                            {
                                var cx_ite = x.bodies.begin();
                                while (cx_ite != null) {
                                    var b_2 = cx_ite.elem();
                                    if (b_2.outer.debugDraw)
                                        this.draw_body(b_2, xform, xdet, xnull);
                                    cx_ite = cx_ite.next;
                                }
                            }
                            {
                                var cx_ite = x.compounds.begin();
                                while (cx_ite != null) {
                                    var c = cx_ite.elem();
                                    this.compoundstack.add(c);
                                    cx_ite = cx_ite.next;
                                }
                            }
                        }
                    }
                }
                if (this.outer.drawCollisionArbiters || this.outer.drawFluidArbiters || this.outer.drawSensorArbiters) {
                    var iterator = space.outer.arbiters.iterator();
                    while (iterator.hasNext()) {
                        var arb = iterator.next();
                        this.draw_arbiter(arb.zpp_inner, xform, xdet, xnull);
                    }
                }
                if (this.outer.drawConstraints) {
                    if (this.compoundstack == null)
                        this.compoundstack = new util.ZNPList_ZPP_Compound();
                    {
                        var cx_ite = space.constraints.begin();
                        while (cx_ite != null) {
                            var c = cx_ite.elem();
                            if (c.active && c.outer.debugDraw)
                                c.draw(this.outer);
                            cx_ite = cx_ite.next;
                        }
                    }
                    {
                        var cx_ite = space.compounds.begin();
                        while (cx_ite != null) {
                            var c = cx_ite.elem();
                            this.compoundstack.add(c);
                            cx_ite = cx_ite.next;
                        }
                    }
                    while (!this.compoundstack.empty()) {
                        var x = this.compoundstack.pop_unsafe();
                        {
                            var cx_ite = x.constraints.begin();
                            while (cx_ite != null) {
                                var c = cx_ite.elem();
                                if (c.active && c.outer.debugDraw)
                                    c.draw(this.outer);
                                cx_ite = cx_ite.next;
                            }
                        }
                        {
                            var cx_ite = x.compounds.begin();
                            while (cx_ite != null) {
                                var c = cx_ite.elem();
                                this.compoundstack.add(c);
                                cx_ite = cx_ite.next;
                            }
                        }
                    }
                }
            };
            ZPP_ShapeDebug.prototype.draw_body = function (body, xform, xdet, xnull) {
                var graphics = this.graphics;
                {
                    var cx_ite = body.shapes.begin();
                    while (cx_ite != null) {
                        var s = cx_ite.elem();
                        this.draw_shape(s, xform, xdet, xnull);
                        cx_ite = cx_ite.next;
                    }
                }
                if (!this.outer.drawBodyDetail)
                    return;
                var col = this.colour(body.id, body.space != null && body.outer.isSleeping);
                this.lineStyle(this.tint(col, 0xff0000, 0.8), 1);
                var px = 0.0;
                var py = 0.0;
                var qx = 0.0;
                var qy = 0.0;
                if (!body.shapes.empty()) {
                    body.validate_worldCOM();
                    if (xnull) {
                        px = body.worldCOMx;
                        py = body.worldCOMy;
                    }
                    else {
                        px = xform.a * body.worldCOMx + xform.b * body.worldCOMy + xform.tx;
                        py = xform.c * body.worldCOMx + xform.d * body.worldCOMy + xform.ty;
                    }
                    graphics.drawCircle(px, py, 1);
                    body.validate_aabb();
                    this.AABB(body, xnull, xform, body.aabb);
                }
                if (xnull) {
                    qx = body.pre_posx;
                    qy = body.pre_posy;
                }
                else {
                    qx = xform.a * body.pre_posx + xform.b * body.pre_posy + xform.tx;
                    qy = xform.c * body.pre_posx + xform.d * body.pre_posy + xform.ty;
                }
                if (xnull) {
                    px = body.posx;
                    py = body.posy;
                }
                else {
                    px = xform.a * body.posx + xform.b * body.posy + xform.tx;
                    py = xform.c * body.posx + xform.d * body.posy + xform.ty;
                }
                graphics.moveTo(qx, qy);
                graphics.lineTo(px, py);
                graphics.drawCircle(px, py, 1);
            };
            ZPP_ShapeDebug.prototype.draw_shape = function (shape, xform, xdet, xnull) {
                var graphics = this.graphics;
                var outer = this.outer;
                var col = this.colour(shape.id, false);
                var body = shape.body;
                if (body == null)
                    return;
                var bcol = this.colour(body.id, body.space != null && body.outer.isSleeping);
                col = this.tint(col, bcol, 0.2);
                this.lineStyle(col, 1.0);
                if (shape.isCircle()) {
                    var circ = shape.circle;
                    circ.validate_worldCOM();
                    var vx = circ.worldCOMx;
                    var vy = circ.worldCOMy;
                    if (!xnull) {
                        var t = xform.a * vx + xform.b * vy + xform.tx;
                        vy = xform.c * vx + xform.d * vy + xform.ty;
                        vx = t;
                    }
                    graphics.drawCircle(vx, vy, circ.radius * xdet);
                    if (outer.drawShapeAngleIndicators) {
                        var v0x = circ.worldCOMx + 0.3 * circ.radius * body.axisy;
                        var v0y = circ.worldCOMy + 0.3 * circ.radius * body.axisx;
                        var v1x = circ.worldCOMx + circ.radius * body.axisy;
                        var v1y = circ.worldCOMy + circ.radius * body.axisx;
                        if (!xnull) {
                            var t = xform.a * v0x + xform.b * v0y + xform.tx;
                            v0y = xform.c * v0x + xform.d * v0y + xform.ty;
                            v0x = t;
                        }
                        if (!xnull) {
                            var t = xform.a * v1x + xform.b * v1y + xform.tx;
                            v1y = xform.c * v1x + xform.d * v1y + xform.ty;
                            v1x = t;
                        }
                        graphics.moveTo(v0x, v0y);
                        graphics.lineTo(v1x, v1y);
                    }
                }
                else {
                    var poly = shape.polygon;
                    poly.validate_gverts();
                    var u = poly.gverts.front();
                    var vx_1 = u.x;
                    var vy_1 = u.y;
                    if (!xnull) {
                        var t_1 = xform.a * vx_1 + xform.b * vy_1 + xform.tx;
                        vy_1 = xform.c * vx_1 + xform.d * vy_1 + xform.ty;
                        vx_1 = t_1;
                    }
                    graphics.moveTo(vx_1, vy_1);
                    var vox = vx_1;
                    var voy = vy_1;
                    {
                        var cx_ite = poly.gverts.begin().next;
                        while (cx_ite != null) {
                            var u_1 = cx_ite.elem();
                            {
                                vx_1 = u_1.x;
                                vy_1 = u_1.y;
                                if (!xnull) {
                                    var t_2 = xform.a * vx_1 + xform.b * vy_1 + xform.tx;
                                    vy_1 = xform.c * vx_1 + xform.d * vy_1 + xform.ty;
                                    vx_1 = t_2;
                                }
                                graphics.lineTo(vx_1, vy_1);
                            }
                            cx_ite = cx_ite.next;
                        }
                    }
                    graphics.lineTo(vox, voy);
                    if (outer.drawShapeAngleIndicators) {
                        poly.validate_worldCOM();
                        if (xnull) {
                            vx_1 = poly.worldCOMx;
                            vy_1 = poly.worldCOMy;
                        }
                        else {
                            vx_1 = xform.a * poly.worldCOMx + xform.b * poly.worldCOMy + xform.tx;
                            vy_1 = xform.c * poly.worldCOMx + xform.d * poly.worldCOMy + xform.ty;
                        }
                        graphics.moveTo(vx_1, vy_1);
                        graphics.lineTo(vox, voy);
                    }
                }
                if (outer.drawShapeDetail) {
                    shape.validate_worldCOM();
                    this.lineStyle(this.tint(col, 0xff0000, 0.8), 1);
                    var vx_2 = 0.0;
                    var vy_2 = 0.0;
                    if (xnull) {
                        vx_2 = shape.worldCOMx;
                        vy_2 = shape.worldCOMy;
                    }
                    else {
                        vx_2 = xform.a * shape.worldCOMx + xform.b * shape.worldCOMy + xform.tx;
                        vy_2 = xform.c * shape.worldCOMx + xform.d * shape.worldCOMy + xform.ty;
                    }
                    graphics.drawCircle(vx_2, vy_2, 1);
                    shape.validate_aabb();
                    this.AABB(body, xnull, xform, shape.aabb);
                }
            };
            ZPP_ShapeDebug.prototype.draw_arbiter = function (arb, xform, xdet, xnull) {
                var outer = this.outer;
                var vx = 0.0;
                var vy = 0.0;
                if (arb.outer.isSensorArbiter()) {
                    if (outer.drawSensorArbiters) {
                        var sarb = arb.outer;
                        this.lineStyle(this.tint(0xff00, ~this.bg_col, 0.7), 1);
                        if (xnull) {
                            vx = sarb.shape1.worldCOM.x;
                            vy = sarb.shape1.worldCOM.y;
                        }
                        else {
                            vx = xform.a * sarb.shape1.worldCOM.x + xform.b * sarb.shape1.worldCOM.y + xform.tx;
                            vy = xform.c * sarb.shape1.worldCOM.x + xform.d * sarb.shape1.worldCOM.y + xform.ty;
                        }
                        this.graphics.moveTo(vx, vy);
                        if (xnull) {
                            vx = sarb.shape2.worldCOM.x;
                            vy = sarb.shape2.worldCOM.y;
                        }
                        else {
                            vx = xform.a * sarb.shape2.worldCOM.x + xform.b * sarb.shape2.worldCOM.y + xform.tx;
                            vy = xform.c * sarb.shape2.worldCOM.x + xform.d * sarb.shape2.worldCOM.y + xform.ty;
                        }
                        this.graphics.lineTo(vx, vy);
                    }
                }
                else if (arb.outer.isFluidArbiter()) {
                    if (outer.drawFluidArbiters) {
                        var farb = arb.outer.fluidArbiter;
                        this.lineStyle(this.tint(0xff, ~this.bg_col, 0.7), 1);
                        if (xnull) {
                            vx = farb.position.x;
                            vy = farb.position.y;
                        }
                        else {
                            vx = xform.a * farb.position.x + xform.b * farb.position.y + xform.tx;
                            vy = xform.c * farb.position.x + xform.d * farb.position.y + xform.ty;
                        }
                        this.graphics.drawCircle(vx, vy, 0.75);
                    }
                }
                else if (outer.drawCollisionArbiters) {
                    var carb = arb.outer.collisionArbiter;
                    if (!carb.contacts.empty()) {
                        var px = 0.0;
                        var py = 0.0;
                        if (carb.contacts.length == 2) {
                            var c1 = carb.contacts.at(0).position;
                            var c2 = carb.contacts.at(1).position;
                            var n = carb.normal;
                            var x = 0.661437828;
                            var y = 0.75;
                            if ((n.y * c1.x - n.x * c1.y) < (n.y * c2.x - n.x * c2.y)) {
                                x = -x;
                                y = -y;
                            }
                            this.lineStyle(this.tint(0xff, ~this.bg_col, 0.7), 1);
                            vx = c1.x + n.x * y - n.y * x;
                            vy = c1.y + n.y * y + n.x * x;
                            if (!xnull) {
                                var t = xform.a * vx + xform.b * vy + xform.tx;
                                vy = xform.c * vx + xform.d * vy + xform.ty;
                                vx = t;
                            }
                            this.graphics.moveTo(vx, vy);
                            vx = c2.x + n.x * y + n.y * x;
                            vy = c2.y + n.y * y - n.x * x;
                            if (!xnull) {
                                var t = xform.a * vx + xform.b * vy + xform.tx;
                                vy = xform.c * vx + xform.d * vy + xform.ty;
                                vx = t;
                            }
                            this.graphics.lineTo(vx, vy);
                            this.lineStyle(this.tint(0xff0000, ~this.bg_col, 0.7), 1);
                            vx = c1.x - n.x * y - n.y * x;
                            vy = c1.y - n.y * y + n.x * x;
                            if (!xnull) {
                                var t = xform.a * vx + xform.b * vy + xform.tx;
                                vy = xform.c * vx + xform.d * vy + xform.ty;
                                vx = t;
                            }
                            this.graphics.moveTo(vx, vy);
                            vx = c2.x - n.x * y + n.y * x;
                            vy = c2.y - n.y * y - n.x * x;
                            if (!xnull) {
                                var t = xform.a * vx + xform.b * vy + xform.tx;
                                vy = xform.c * vx + xform.d * vy + xform.ty;
                                vx = t;
                            }
                            this.graphics.lineTo(vx, vy);
                            px = 0.5 * (c1.x + c2.x);
                            py = 0.5 * (c1.y + c2.y);
                            if (!xnull) {
                                var t = xform.a * px + xform.b * py + xform.tx;
                                py = xform.c * px + xform.d * py + xform.ty;
                                px = t;
                            }
                        }
                        else {
                            px = carb.contacts.at(0).position.x;
                            py = carb.contacts.at(0).position.y;
                            if (!xnull) {
                                var t = xform.a * px + xform.b * py + xform.tx;
                                py = xform.c * px + xform.d * py + xform.ty;
                                px = t;
                            }
                            this.lineStyle(this.tint(0xff00ff, ~this.bg_col, 0.7), 1);
                            this.graphics.drawCircle(px, py, 1);
                        }
                        this.lineStyle(this.tint(~this.bg_col, this.bg_col, 0.7), 1);
                        this.graphics.moveTo(px, py);
                        vx = carb.normal.x * 5;
                        vy = carb.normal.y * 5;
                        if (!xnull) {
                            var t = xform.a * vx + xform.b * vy;
                            vy = xform.c * vx + xform.d * vy;
                            vx = t;
                        }
                        this.graphics.lineTo(px + vx, py + vy);
                    }
                }
            };
            ////
            //// Mixins
            ZPP_ShapeDebug.prototype.lineStyle = function (thickness, colour, alpha) {
                if (alpha === void 0) { alpha = 1; }
                if (arguments.length == 2) {
                    alpha = colour;
                    colour = thickness;
                    thickness = this.outer_zn.thickness;
                }
                var _r = (colour & 0xff0000) >> 16;
                var _g = (colour & 0xff00) >> 8;
                var _b = colour & 0xff;
                this.graphics.setStrokeStyle(thickness).beginStroke("rgba(" + _r + "," + _g + "," + _b + "," + alpha + ")");
            };
            ZPP_ShapeDebug.prototype.AABB = function (body, xnull, xform, aabb) {
                if (xnull)
                    this.graphics.drawRect(body.aabb.minx, body.aabb.miny, body.aabb.width(), body.aabb.height());
                else {
                    var ox = 0.0;
                    var oy = 0.0;
                    // if(false){
                    // 	ox=body.aabb.minx;
                    // 	oy=body.aabb.miny;
                    // }
                    // else{
                    ox = xform.a * body.aabb.minx + xform.b * body.aabb.miny + xform.tx;
                    oy = xform.c * body.aabb.minx + xform.d * body.aabb.miny + xform.ty;
                    // }
                    var wx = body.aabb.width();
                    var wy = 0;
                    // if(!false){
                    var t = xform.a * wx + xform.b * wy;
                    wy = xform.c * wx + xform.d * wy;
                    wx = t;
                    // }
                    var hx = 0;
                    var hy = body.aabb.height();
                    // if(!false){
                    var t = xform.a * hx + xform.b * hy;
                    hy = xform.c * hx + xform.d * hy;
                    hx = t;
                    // }
                    this.graphics.moveTo(ox, oy);
                    this.graphics.lineTo(ox + wx, oy + wy);
                    this.graphics.lineTo(ox + wx + hx, oy + wy + hy);
                    this.graphics.lineTo(ox + hx, oy + hy);
                    this.graphics.lineTo(ox, oy);
                }
            };
            return ZPP_ShapeDebug;
        })(util.ZPP_Debug);
        util.ZPP_ShapeDebug = ZPP_ShapeDebug; // zpp_nape.util
    })(util = zpp_nape.util || (zpp_nape.util = {}));
})(zpp_nape || (zpp_nape = {})); // zpp_nape
///<reference path='lib/nape.d.ts'/>
///<reference path='Debug.ts'/>
///<reference path='ZPP_Debug.ts'/>
///<reference path='ZPP_ShapeDebug.ts'/>
///<reference path='lib/easeljs.d.ts'/>
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var nape;
(function (nape) {
    var util;
    (function (util) {
        var ZPP_ShapeDebug = zpp_nape.util.ZPP_ShapeDebug;
        var Vec2 = nape.geom.Vec2;
        /**
         * Implementation of nape debug draw using flash/openfl||nme graphics API.
         * <br/><br/>
         * This debug draw is slower than BitmapDebug which is available in flash10+
         * however the BitmapDebug draw makes use of Alchemy opcodes so you may wish
         * not to use it if you are also using Stage3D and do not wish to be subject
         * to Adobe licensing.
         */
        var ShapeDebug = (function (_super) {
            __extends(ShapeDebug, _super);
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
            function ShapeDebug(width, height, bgColour) {
                if (bgColour === void 0) { bgColour = 0x333333; }
                _super.call(this);
                /**
                 * @private
                 */
                this.zpp_inner_zn = null;
                /**
                 * Thickness to draw lines with.
                 * @default 0.1
                 */
                this.thickness = 0.0;
                this.zpp_inner_zn = new ZPP_ShapeDebug(width, height);
                this.zpp_inner_zn.outer_zn = this;
                this.zpp_inner = this.zpp_inner_zn;
                this.zpp_inner.outer = this;
                this.bgColour = bgColour;
                this.thickness = 0.1;
            }
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.clear = function () {
                this.zpp_inner_zn.graphics.clear();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawLine = function (start, end, colour) {
                var zpp_inner = this.zpp_inner;
                var zpp_inner_zn = this.zpp_inner_zn;
                var g = zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, this.thickness, colour & 0xffffff, 1);
                if (zpp_inner.xnull) {
                    g.moveTo(start.x, start.y);
                    g.lineTo(end.x, end.y);
                    util.Debug.WEAK(start);
                    util.Debug.WEAK(end);
                }
                else {
                    var v = zpp_inner.xform.outer.transform(start);
                    g.moveTo(v.x, v.y);
                    v.dispose();
                    v = zpp_inner.xform.outer.transform(end);
                    g.lineTo(v.x, v.y);
                    v.dispose();
                }
                g.endStroke();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawCurve = function (start, control, end, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, this.thickness, colour & 0xffffff, 1);
                if (zpp_inner.xnull) {
                    g.moveTo(start.x, start.y);
                    g.curveTo(control.x, control.y, end.x, end.y);
                    util.Debug.WEAK(start);
                    util.Debug.WEAK(control);
                    util.Debug.WEAK(end);
                }
                else {
                    var u = zpp_inner.xform.outer.transform(start);
                    var v = zpp_inner.xform.outer.transform(control);
                    var q = zpp_inner.xform.outer.transform(end);
                    g.moveTo(u.x, u.y);
                    g.curveTo(v.x, v.y, q.x, q.y);
                    u.dispose();
                    v.dispose();
                    q.dispose();
                }
                g.endStroke();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawCircle = function (position, radius, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, this.thickness, colour & 0xffffff, 1);
                if (zpp_inner.xnull) {
                    g.drawCircle(position.x, position.y, radius);
                    util.Debug.WEAK(position);
                }
                else {
                    var v = zpp_inner.xform.outer.transform(position);
                    g.drawCircle(v.x, v.y, radius * zpp_inner.xdet);
                    v.dispose();
                }
                g.endStroke();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawAABB = function (aabb, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, this.thickness, colour & 0xffffff, 1);
                if (zpp_inner.xnull)
                    g.drawRect(aabb.x, aabb.y, aabb.width, aabb.height);
                else {
                    var v = zpp_inner.xform.outer.transform(aabb.min);
                    var w = Vec2.get(aabb.width, 0, false);
                    var w2 = zpp_inner.xform.outer.transform(w, true);
                    var h = Vec2.get(0, aabb.height, false);
                    var h2 = zpp_inner.xform.outer.transform(h, true);
                    g.moveTo(v.x, v.y);
                    g.lineTo(v.x + w2.x, v.y + w2.y);
                    g.lineTo(v.x + w2.x + h2.x, v.y + w2.y + h2.y);
                    g.lineTo(v.x + h2.x, v.y + h2.y);
                    g.lineTo(v.x, v.y);
                    v.dispose();
                    w.dispose();
                    w2.dispose();
                    h.dispose();
                    h2.dispose();
                }
                g.endStroke();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawFilledTriangle = function (p0, p1, p2, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, 0, 0, 0);
                g.beginFill(this.rgba(colour & 0xffffff, 1));
                if (zpp_inner.xnull) {
                    g.moveTo(p0.x, p0.y);
                    g.lineTo(p1.x, p1.y);
                    g.lineTo(p2.x, p2.y);
                    util.Debug.WEAK(p0);
                    util.Debug.WEAK(p1);
                    util.Debug.WEAK(p2);
                }
                else {
                    var v = zpp_inner.xform.outer.transform(p0);
                    g.moveTo(v.x, v.y);
                    v.dispose();
                    v = zpp_inner.xform.outer.transform(p1);
                    g.lineTo(v.x, v.y);
                    v.dispose();
                    v = zpp_inner.xform.outer.transform(p2);
                    g.lineTo(v.x, v.y);
                    v.dispose();
                }
                g.endFill();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawFilledCircle = function (position, radius, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, 0, 0, 0);
                g.beginFill(this.rgba(colour & 0xffffff, 1));
                if (zpp_inner.xnull) {
                    g.drawCircle(position.x, position.y, radius);
                    util.Debug.WEAK(position);
                }
                else {
                    var v = zpp_inner.xform.outer.transform(position);
                    g.drawCircle(v.x, v.y, radius * zpp_inner.xdet);
                    v.dispose();
                }
                g.endFill();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawPolygon = function (polygon, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                util.Debug.lineStyle(g, this.thickness, colour & 0xffffff, 1.0);
                var fst = null;
                var fsttime = true;
                if (zpp_inner.xnull) {
                    util.Debug.PolyIter(polygon, function (p) {
                        if (fsttime) {
                            fst = p.copy(false);
                            g.moveTo(p.x, p.y);
                        }
                        else
                            g.lineTo(p.x, p.y);
                        fsttime = false;
                    });
                    g.lineTo(fst.x, fst.y);
                    fst.dispose();
                }
                else {
                    util.Debug.PolyIter(polygon, function (p) {
                        var v = zpp_inner.xform.outer.transform(p);
                        if (fsttime) {
                            fst = v;
                            g.moveTo(v.x, v.y);
                        }
                        else
                            g.lineTo(v.x, v.y);
                        if (!fsttime)
                            v.dispose();
                        fsttime = false;
                    });
                    g.lineTo(fst.x, fst.y);
                    fst.dispose();
                }
                util.Debug.PolyWeak(polygon);
                g.endStroke();
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawFilledPolygon = function (polygon, colour) {
                var zpp_inner = this.zpp_inner;
                var g = this.zpp_inner_zn.graphics;
                g.beginFill(this.rgba(colour & 0xffffff, 1.0));
                util.Debug.lineStyle(g, 0, 0, 0);
                var fst = null;
                var fsttime = true;
                if (zpp_inner.xnull) {
                    util.Debug.PolyIter(polygon, function (p) {
                        if (fsttime) {
                            fst = p.copy(false);
                            g.moveTo(p.x, p.y);
                        }
                        else
                            g.lineTo(p.x, p.y);
                        fsttime = false;
                    });
                    g.lineTo(fst.x, fst.y);
                    fst.dispose();
                }
                else {
                    util.Debug.PolyIter(polygon, function (p) {
                        var v = zpp_inner.xform.outer.transform(p);
                        if (fsttime) {
                            fst = v;
                            g.moveTo(v.x, v.y);
                        }
                        else
                            g.lineTo(v.x, v.y);
                        if (!fsttime)
                            v.dispose();
                        fsttime = false;
                    });
                    g.lineTo(fst.x, fst.y);
                    fst.dispose();
                }
                g.endFill();
                util.Debug.PolyWeak(polygon);
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.draw = function (object) {
                util.Debug.debug_draw(this, object);
            };
            /**
             * @inheritDoc
             */
            ShapeDebug.prototype.drawSpring = function (start, end, colour, coils, radius) {
                if (coils === void 0) { coils = 3; }
                if (radius === void 0) { radius = 3.0; }
                util.Debug.debug_spring(this, start, end, colour, coils, radius);
            };
            ////
            //// Mixins
            //noinspection JSMethodCanBeStatic
            ShapeDebug.prototype.rgba = function (colour, alpha) {
                if (alpha === void 0) { alpha = 1; }
                var _r = (colour & 0xff0000) >> 16;
                var _g = (colour & 0xff00) >> 8;
                var _b = colour & 0xff;
                return "rgb(" + _r + "," + _g + "," + _b + "," + alpha + ")";
            };
            return ShapeDebug;
        })(util.Debug);
        util.ShapeDebug = ShapeDebug; // class ShapeDebug
    })(util = nape.util || (nape.util = {})); // nape.util
})(nape || (nape = {})); // nape
