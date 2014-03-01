(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        init: function () {

            this.physics = window.Physics(window.city);
            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2);

        },

        tick: function () {


            this.physics.step(game.time * 100);
            this.player.tick();

        },

        render: function (gfx) {

            this.clear(gfx, "hsl(195, 40%, 40%)");
            this.physics.render();
            this.player.render(gfx);

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
