(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        scale: 20,

        buildings: null,
        bombs: null,

        selected: null,

        init: function () {

            this.buildings = [];
            this.bombs = [];

            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2);
            this.world = window.Physics.createWorld(this.scale);

            for (var j = 0; j < 8; j++) {
                var h = (Math.random() * 3 | 0) + 5;
                for (var i = 0; i < h; i++) {
                    this.buildings.push(
                        new Building(this.world, j * 4 + 4, 8 - (i * 1) + 2)
                    )
                }
            }

            var xbomb = (Math.random() * 8 | 0) * 4 + 2;
            this.bombs.push(new Bomb(this.world, xbomb - 0.2, -2, 0.5));
            this.bombs.push(new Bomb(this.world, xbomb + 0.2, 2, 0.5));
        },

        select: function (body) {
            var o = body.GetUserData();
            if (this.selected) {
                this.selected.selected = false;
            }
            o.selected = true;
            this.selected = o;
        },

        tick: function () {

            this.player.tick();

            var step = window.game.preset_dt;
            //step /= Math.max(1, Math.abs(Math.sin(Date.now() / 1000) * 20));
            this.world.Step(step, 10, 10);
            this.world.ClearForces();

            this.buildings.forEach(function (b) {
                b.tick();
            });
            this.bombs.forEach(function (b) {
                b.tick();
            });

            if (Ω.input.pressed("select")) {
                var sel = Physics.getBodyAtXY(this.world, Ω.input.mouse.x / this.scale, Ω.input.mouse.y / this.scale);
                if (sel) {
                    this.select(sel);
                }
            }

        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 5%)");

            c.fillStyle = "hsl(30, 10%, 9%)";
            c.fillRect(0, gfx.h - 160, gfx.w, 130);

            //this.world.DrawDebugData();
            this.player.render(gfx);

            this.buildings.forEach(function (b) {
                b.render(gfx);
            });
            this.bombs.forEach(function (b) {
                b.render(gfx);
            });

            var puterX = gfx.w - 210,
                puterY = 60,
                puterW = 200,
                puterH = gfx.h - 80;

            c.fillStyle = "#000";
            c.strokeStyle = "#444";
            c.fillRect(puterX, puterY, puterW, puterH);
            c.strokeRect(puterX, puterY, puterW, puterH);
            c.fillStyle = "#FFCF5B";
            c.font = "10pt monospace";
            if (!this.selected) {
                c.fillText("NO SIGNAL", puterX + 10, puterY + 10);
            } else {
                c.fillText("COMPUTER? " + (this.selected.hasComputer ? "Y" : "N"), puterX + 10, puterY + 20);
                c.fillText("CODE? " + (this.selected.hasPiece ? "Y" : "N"), puterX + 10, puterY + 30);
            }

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
