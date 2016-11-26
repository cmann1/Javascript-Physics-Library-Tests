# Javascript Physics Library Tests

A small application used to test, compare and benchmark various physics libraries for Javascript.

So far there are three different demos for each library;
I've tried to keep the demos as similar as possible across engines to allow them to be easily compared.

## Demos
- **Basic** - Randomly creates simple bodies.
- **Constraints** - Compares similar constraints available in each engine.
- **Stress** - Creates a large number of bodies - a good way to measure the performance of each engine.

A lot of these tests have been adapted from the Nape website.

## Libraries
- **Nape** - http://napephys.com/
  - Complete with lots of features
  - Possibly the best performance and accuracy in stress test
  - Very large file size
  - Ported from AS3/Haxe
  - Lacks an organised Javascript port
  - Updated within the last year or two _(as of Nov 2016)_
- **Box2DWeb** - https://github.com/hecht-software/box2dweb
  - Complete
  - Good performance on the stress test - similar to Nape
  - Ported from C++/AS3
  - Last updated one or two years ago _(as of Nov 2016)_
- **p2.js** - http://schteppe.github.io/p2.js/
  - Complete
  - Poor performance on the stress test
  - Updated within the last few months _(as of Nov 2016)_
- **Matter.js** - http://brm.io/matter-js/
  - Incomplete - lacks support for many constraints
  - Poor performance on the stress test
  - Updated recently _(as of Nov 2016)_
- **PhysicsJs** http://wellcaffeinated.net/PhysicsJS/
  - Incomplete - lacks support for many constraints
  - Cannot handle the stress test
  - Seems like it was last updated 2 years ago _(as of Nov 2016)_
