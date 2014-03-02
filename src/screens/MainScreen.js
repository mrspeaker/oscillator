(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        scale: 20,

        buildings: null,
        bombs: null,

        count: 0,

        res: {
            bg: new Ω.Image("res/images/bg.png", null, 0.5),
            scanlines: new Ω.Image("res/images/scanlines.png", null, 0.5),
        },

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
                        new Building(this.world, j * 4 + 4, 8 - (i * 1) + 2, j, i)
                    );
                }
            }

            this.maxPieces = this.buildings.reduce(function (ac, b) {
                return ac + (b.hasPiece ? 1 : 0);
            }, 0);
            console.log(this.maxPieces);

            var xbomb = (Math.random() * 8 | 0) * 4 + 2;
            this.addBomb();
        },

        checkPieces: function () {
            if (this.player.numPieces === this.maxPieces) {
                alert("done!");
                game.setSceen(new MainScreen());
            }
        },

        select: function (body) {

            var room = body ? body.GetUserData() : null;

            if (room && room.type == "BUILDING") {
                if (!room.searched) {
                    if (this.selected) {
                        this.selected.selected = false;
                    }
                    room.select();
                    this.selected = room;
                    this.deSelected = false;
                    this.player.goTo(room);
                }
            } else {
                this.deSelected = true;
            }

        },

        addBomb: function () {
            var x = (Math.random() * 8 | 0) * 4 + 2;
            this.bombs.push(new Bomb(this.world, x - 0.2, -3, 0.5));
            this.bombs.push(new Bomb(this.world, x + 0.2, -1, 0.5));
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
                var alive = b.tick();
                if (alive) {
                    this.player.missiles.forEach(function (m) {
                        if (m.exploding) {
                            var dist = Ω.utils.distCenter(b, m);
                            if (dist < 12) {
                                b.disactivate();
                            }
                        }
                    });
                }
                return alive;
            }, this);

            if (++this.count % 500 === 0) {
                this.addBomb();
            }

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
            this.res.bg.render(gfx, 0, 0);
            this.player.renderBG(gfx);
            //this.world.DrawDebugData();

            this.buildings.forEach(function (b) {
                b.render(gfx);
            });
            this.bombs.forEach(function (b) {
                b.render(gfx);
            });
            this.renderCompy(gfx);

            this.renderCode(gfx);
            this.player.renderFG(gfx);


        },

        renderCompy: function (gfx) {
            var puterX = gfx.w - 210,
                puterY = 60,
                puterW = 200,
                puterH = gfx.h - 80,
                c = gfx.ctx;

            c.fillStyle = "#000";
            c.strokeStyle = "#444";
            c.fillRect(puterX, puterY, puterW, puterH);
            c.strokeRect(puterX, puterY, puterW, puterH);
            c.fillStyle = "#FFCF5B";
            c.font = "10pt monospace";
            /*if (!this.selected) {
                c.fillText("NO SIGNAL", puterX + 10, puterY + 20);
            } else {
                c.fillText("COMPUTER? " + (this.selected.hasComputer ? "Y" : "N"), puterX + 10, puterY + 20);
                c.fillText("CODE? " + (this.selected.hasPiece ? "Y" : "N"), puterX + 10, puterY + 30);
            }*/
            var msgs = this.player.puterMsg;
            msgs.forEach(function (msg, i) {
                if (i != msgs.length - 1 || Ω.utils.toggle(200, 2)) {
                    c.fillText(msg, puterX + 10, puterY + (i + 1) * 20);
                }
            });

            this.res.scanlines.render(gfx, puterX, puterY);
        },

        renderCode: function (gfx) {
            var c = gfx.ctx,
                sx = 20,
                sy = 230,
                sw = 40,
                sh = 10;
            c.fillStyle = "#D55F4C";
            for (var i = 0; i < this.player.numPieces; i++) {
                c.fillRect(sx + (i * (sw + 10)), sy, sw, sh);
            }
            c.fillStyle = "#650f0c";
            for (i = this.player.numPieces; i < this.maxPieces; i++) {
                c.fillRect(sx + (i * (sw + 10)), sy, sw, sh);
            }
        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
