(function (Physics) {

    "use strict";

    window.city = function(world){
        var renderer = createDebugRenderer(Ω.env.w, Ω.env.h);

        world.add( renderer );

        // bounds of the window
        var viewportBounds = Physics.aabb(0, 0, renderer.ctx.canvas.width, renderer.ctx.canvas.height);

        // constrain objects to these bounds
        world.add(Physics.behavior('edge-collision-detection', {
          aabb: viewportBounds,
          restitution: 0.99,
          cof: 0.99
        }));

        // add a circle
        world.add(
          Physics.body('circle', {
            x: 50,
            y: 30,
            vx: 0.2,
            vy: 0.01,
            radius: 20
          })
        );

        // ensure objects bounce when edge collision is detected
        world.add( Physics.behavior('body-impulse-response') );

        // add some gravity
        world.add( Physics.behavior('constant-acceleration') );

    };

    var createDebugRenderer = function(w, h) {
        var renderer = Physics.renderer('canvas', {
            el: 'board',
            width: w,
            height: h,
            meta: false, // don't display meta data
            styles: {
                'circle' : {
                    strokeStyle: 'hsla(60, 37%, 17%, 1)',
                    lineWidth: 1,
                    fillStyle: 'hsla(60, 37%, 57%, 0.8)',
                    angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
                }
            }
          });

        // Don't do clear rect
        renderer.beforeRender = function () {};
        return renderer;
    };

}(window.Physics));
