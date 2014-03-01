(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        init: function () {

            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2);
            this.world = window.Physics.createWorld();
            console.log(this.world);
        },

        tick: function () {

            this.player.tick();

            this.world.Step(1 / 60, 10, 10);

            this.world.ClearForces();

        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 40%)");

            c.fillStyle = "hsl(30, 10%, 20%)";
            c.fillRect(0, gfx.h - 140, gfx.w, 140);

            this.world.DrawDebugData();
            this.player.render(gfx);
        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
