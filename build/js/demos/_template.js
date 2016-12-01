///<reference path='../engines/DemoEngineBase.ts'/>
///<reference path='../engines/NapeDemo.ts'/>
///<reference path='../engines/P2JsDemo.ts'/>
///<reference path='../engines/MatterDemo.ts'/>
///<reference path='../engines/PhysicsJsDemo.ts'/>
///<reference path='../engines/Box2dWebDemo.ts'/>
var demos;
(function (demos) {
    var VELOCITY_ITERATIONS = 10;
    var POSITION_ITERATIONS = 10;
    var napeDemo;
    (function (napeDemo) {
        engines.NapeDemo.prototype.loadDemoXX = function () {
        };
    })(napeDemo || (napeDemo = {}));
    var box2dWebDemo;
    (function (box2dWebDemo) {
        engines.Box2dWebDemo.prototype.loadDemoXX = function () {
        };
    })(box2dWebDemo || (box2dWebDemo = {}));
    var p2JsDemo;
    (function (p2JsDemo) {
        engines.P2JsDemo.prototype.loadDemoXX = function () {
        };
    })(p2JsDemo || (p2JsDemo = {}));
    var matterDemo;
    (function (matterDemo) {
        engines.MatterDemo.prototype.loadDemoXX = function () {
        };
    })(matterDemo || (matterDemo = {}));
    var physicsJsDemo;
    (function (physicsJsDemo) {
        engines.PhysicsJsDemo.prototype.loadDemoXX = function () {
        };
    })(physicsJsDemo || (physicsJsDemo = {}));
})(demos || (demos = {}));
//# sourceMappingURL=_template.js.map