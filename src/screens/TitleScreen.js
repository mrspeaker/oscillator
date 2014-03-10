(function (Ω) {

    "use strict";

    var TitleScreen = Ω.Screen.extend({

        count: 0,

        font: new Ω.Font("res/fonts/mig68000.png", 8, 16),

        sfx: new Ω.Sound("res/audio/oscillator"),
        bom: new Ω.Sound("res/audio/transport"),
        vhs: new Ω.Image("res/images/static1.png", null, 1),
        vhs2: new Ω.Image("res/images/static3.png", null, 1),

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
            this.vhs.render(gfx, 0, -80);
            this.font.render(gfx, "oscilla or", gfx.w / 2, gfx.h / 2);
            this.font.render(gfx, "t", gfx.w / 2 + 55, gfx.h / 2 - 4);
            this.vhs2.render(gfx, 0, gfx.h - 15);
        }

    });

    window.TitleScreen = TitleScreen;

}(window.Ω));