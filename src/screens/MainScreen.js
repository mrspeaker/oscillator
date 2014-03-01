(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        init: function () {

            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2);
            this.world = window.Physics.createWorld();

            for (var j = 0; j < 8; j++) {
                var h = (Math.random() * 3 | 0) + 5;
                for (var i = 0; i < h; i++) {
                    Physics.createBox(this.world, j * 4 + 4, 8 - (i * 1) + 2, 1, 1);
                }
            }

            Physics.createCircle(this.world, 5.6, -2, 1);
            Physics.createCircle(this.world, 6.4, 2, 1);
        },

        tick: function () {

            this.player.tick();
            var step = window.game.preset_dt;
            step /= Math.max(1, Math.abs(Math.sin(Date.now() / 1000) * 20));
            this.world.Step(step, 10, 10);
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
