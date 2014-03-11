(function (Ω) {

    "use strict";

    var TitleScreen = Ω.Screen.extend({

        count: 0,

        font: new Ω.Font("res/fonts/mig68000.png", 8, 16),

        sfx: new Ω.Sound("res/audio/oscillator"),
        bom: new Ω.Sound("res/audio/transport"),

        img: {
            vhs0: new Ω.Image("res/images/static1.png", null, 1),
            vhs1: new Ω.Image("res/images/static2.png", null, 1),
            vhs2: new Ω.Image("res/images/static3.png", null, 1),
            blue: new Ω.Image("res/images/staticBlue.png", null, 1),
        },

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

            if (this.count % 4 === 1) {
                c.fillStyle = "#000";
                c.fillRect(0, 0, gfx.w, gfx.h);

                c.font = "20pt helvetica";
                var staticType = Math.random() * 2 | 0,
                    staticOff = Math.random() * 480 | 0;

                c.globalAlpha = 0.6;
                this.img["vhs" + staticType].renderClip(gfx, 0, 145, 0, staticOff, gfx.w, 20);
                c.globalAlpha = 1;
                this.font.render(gfx, "oscilla or", gfx.w / 2, gfx.h / 2);
                this.font.render(gfx, "t", gfx.w / 2 + 55, gfx.h / 2 - 4);
                this.img.blue.render(gfx, 0, gfx.h - 50);
            }
        }

    });

    window.TitleScreen = TitleScreen;

}(window.Ω));