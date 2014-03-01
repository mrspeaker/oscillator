(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        scale: 20,

        buildings: null,
        bombs: null,

        bg: new Ω.Image("res/images/bg.png", null, 0.5),

        selected: null,
        deSelected: false,

        init: function () {

            this.buildings = [];
            this.bombs = [];

            this.selected ={
                x: Ω.env.w / 2,
                y: Ω.env.h
            };

            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
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

            var obj = body ? body.GetUserData() : null;

            if (obj && obj.type == "BUILDING") {
                if (this.selected) {
                    this.selected.selected = false;
                }
                obj.selected = true;
                this.selected = obj;
                this.deSelected = false;
            } else {
                this.deSelected = true;
            }

        },

        tick: function () {

            this.handleInput();

            this.player.tick();

            var step = window.game.preset_dt;
            step /= 10; //Math.max(1, Math.abs(Math.sin(Date.now() / 1000) * 20));
            this.world.Step(step, 10, 10);
            this.world.ClearForces();

            this.buildings.forEach(function (b) {
                b.tick();
            });
            this.bombs.forEach(function (b) {
                b.tick();
                this.player.missiles.forEach(function (m) {
                    if (m.exploding) {
                        var dist = Ω.utils.distCenter(b, m);
                        if (dist < 12) {
                            Physics.jumpTo(b.body, 1, -1, 0);//b.body.GetPosition().x, -2);
                        }
                    }
                });
            }, this);

        },

        handleInput: function () {
            if (Ω.input.pressed("select")) {
                var sel = Physics.getBodyAtXY(this.world, Ω.input.mouse.x / this.scale, Ω.input.mouse.y / this.scale);
                this.select(sel);
            }
        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 5%)");
            this.bg.render(gfx, 0, 0);

            c.fillStyle = "hsla(30, 10%, 9%, 0.2)";
            //c.fillRect(0, gfx.h - 160, gfx.w, 130);

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
                c.fillText("NO SIGNAL", puterX + 10, puterY + 20);
            } else {
                c.fillText("COMPUTER? " + (this.selected.hasComputer ? "Y" : "N"), puterX + 10, puterY + 20);
                c.fillText("CODE? " + (this.selected.hasPiece ? "Y" : "N"), puterX + 10, puterY + 30);
            }

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
