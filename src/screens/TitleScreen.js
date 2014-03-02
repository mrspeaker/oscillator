(function () {

    "use strict";

    var TitleScreen = Ω.Screen.extend({

        count: 0,

        tick: function () {
            if (++this.count > 40) {
                game.setScreen(new MainScreen());
            }
        },

        render: function (gfx) {
            var c = gfx.ctx;
            c.font = "20pt helvetica";
            c.fillStyle = "#FF5BA6";
            c.fillText("oscillator", gfx.w / 2, gfx.h / 2);
        }

    });

    window.TitleScreen = TitleScreen;

}(window.Ω));