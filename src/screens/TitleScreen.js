(function () {

    "use strict";

    var TitleScreen = Ω.Screen.extend({

        count: 0,

        font: new Ω.Font("res/fonts/mig68000.png", 8, 16),

        sfx: new Ω.Sound("res/audio/oscillator"),
        bom: new Ω.Sound("res/audio/transport"),

        init: function () {
            this.sfx.play();
            this.bom.play();
        },

        tick: function () {
            if (++this.count > 40 && (Ω.input.pressed("select"))) {
                game.setScreen(new MainScreen());
            }
        },

        render: function (gfx) {
            var c = gfx.ctx;
            c.font = "20pt helvetica";
            c.fillStyle = "#FF5BA6";
            this.font.render(gfx, "oscillator", gfx.w / 2, gfx.h / 2);
        }

    });

    window.TitleScreen = TitleScreen;

}(window.Ω));