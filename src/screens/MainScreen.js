(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        scale: 20,

        buildings: null,
        bombs: null,
        firstBomb: true,

        font: new Ω.Font("res/fonts/mig68000.png", 8, 16),

        voiceOver: null,
        voiceOverCount: 0,

        pieces: null,
        bombTime: 500,

        count: 0,

        res: {
            bg: new Ω.Image("res/images/bg.png", null, 0.5),
            scanlines: new Ω.Image("res/images/scanlines.png", null, 0.5),
        },

        audio: {
            warning: new Ω.Sound("res/audio/warning"),
            danger: new Ω.Sound("res/audio/danger"),
            corrupt: new Ω.Sound("res/audio/codecorrupted"),
            complete: new Ω.Sound("res/audio/programcomplete"),
            welldone: new Ω.Sound("res/audio/welldone")
        },

        selected: null,
        deSelected: false,

        state: null,

        init: function () {

            this.buildings = [];
            this.bombs = [];

            this.state = new Ω.utils.State("BORN");

            this.selected ={
                x: Ω.env.w / 2,
                y: Ω.env.h
            };

            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2, this);
            this.world = window.Physics.createWorld(this.scale);

            this.pieces = [false, false, false, false, false];
            var numColums = 8,
                numComputers = 15,
                numPieces = this.pieces.length,
                colH = [7, 6, 4, 5, 5, 6, 7, 7].sort(function () { return 0.5 - Math.random(); });

            for (var j = 0; j < numColums; j++) {
                //var h = (Math.random() * 3 | 0) + 5;
                var h = colH[j];
                for (var i = 0; i < h; i++) {
                    this.buildings.push(
                        new Building(this.world, j * 4 + 4, numColums - (i * 1) + 2, j, i, this)
                    );
                    this.buildings[this.buildings.length - 1].id = j * 8 + i;
                }
            }

            for (var k = 0; k < numComputers; k++) {
                var room = this.buildings[Ω.utils.rand(this.buildings.length)];
                while (room.hasComputer) {
                    room = this.buildings[Ω.utils.rand(this.buildings.length)];
                }
                room.hasComputer = true;
                if (k < numPieces) {
                    room.hasPiece = true;
                }
            }

        },

        checkPieces: function () {
            var piece = Ω.utils.rand(this.pieces.length);
            while (this.pieces[piece]) {
                piece = Ω.utils.rand(this.pieces.length);
            }
            this.pieces[piece] = Ω.utils.now();
            if (this.player.numPieces === this.pieces.length) {
                this.state.set("WIN");
            }
        },

        select: function (body) {

            if (this.state.isIn("DIE", "WIN")) {
                return;
            }

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

        lostPiece: function () {
            if (this.state.isNot("DIE")) {
                this.state.set("DIE");
            }
        },

        addBomb: function () {
            var x = (Math.random() * 8 | 0) * 4 + 2;
            this.bombs.push(new Bomb(this.world, x - 0.2, -3, 0.5));
            this.bombs.push(new Bomb(this.world, x + 0.2, -1, 0.5));
            this.bombTime -= 5;
            console.log(this.bombTime);
        },

        tick: function () {

            this.handleInput();
            this.state.tick();

            switch (this.state.get()) {
            case "BORN":
                if (this.state.first()) {
                    this.voiceOver = "search condos for codes.";
                }
                if (this.state.count > 200) {
                    this.voiceOver = "";
                    this.state.set("NOBOMBS");
                }
                break;
            case "NOBOMBS":
                if (this.player.room) {
                    this.state.set("RUNNING");
                }
                break;
            case "RUNNING":
                if (++this.count % this.bombTime === 0) {
                    if (this.firstBomb) {
                        this.firstBomb = false;
                        this.voiceOver = "incoming projectiles. shoot them.";
                        this.voiceOverCount = 100;
                        this.audio.warning.play();
                    }
                    this.addBomb();
                }
                if (this.voiceOver && this.voiceOverCount--<0) {
                    this.voiceOver = "";
                }
                break;
            case "EXPLOSE":
                break;
            case "DIE":
                if (this.state.first()) {
                    this.voiceOver = "code corrupted. game over.";
                    this.audio.corrupted.play();
                    this.selected.selected = false;
                }
                if (this.state.count > 100 && Ω.input.pressed("select")) {
                    game.setScreen(new TitleScreen());
                }

                break;
            case "WIN":
                this.voiceOver = "> program complete. overide successful.";
                if (this.state.first()) {
                    this.audio.complete.play();
                }
                this.bombs.forEach(function (b) {
                    b.body.SetActive(false);
                });
                if (this.state.count == 130) {
                    this.audio.welldone.play();
                }
                if (this.state.count > 100 && Ω.input.pressed("select")) {
                    game.setScreen(new TitleScreen());
                }
                break;
            }

            this.player.tick();

            var step = window.game.preset_dt;
            step /= 11; //Math.max(1, Math.abs(Math.sin(Date.now() / 1000) * 20));
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
                            if (dist < m.rad) {
                                b.disactivate();
                            }
                        }
                    });
                }
                return alive;
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
            var state = this.state.get();

            if (state === "DIE" || state === "WIN") {
                var grd = c.createRadialGradient(gfx.w / 2, gfx.h / 2, 0, gfx.w / 2, gfx.h /2, 400);

                grd.addColorStop(0, "rgba(0, 0, 0, 0)");
                var col = state === "DIE" ? "0,80%,8%" : (this.state.count % 360 | 0) + ",50%,30%";
                grd.addColorStop(1, "hsla(" + col + ",0.4)");

                c.fillStyle = grd;
                c.fillRect(0, 0, gfx.w, gfx.h);
                c.fill();
            }

            this.renderVoiceOver(gfx);

        },

        renderCompy: function (gfx) {
            var puterX = 500,
                puterY = gfx.h - 70,
                puterW = 240,
                puterH = 60,
                c = gfx.ctx;

            c.fillStyle = "#000";
            //c.strokeStyle = "#444";
            c.fillRect(puterX, puterY, puterW, puterH);
            //c.strokeRect(puterX, puterY, puterW, puterH);
            c.fillStyle = "#FA5C6F";//"#FFCF5B";
            c.font = "8pt monospace";

            var msgs = this.player.puterMsg;
            msgs.forEach(function (msg, i) {
                if (i != msgs.length - 1 || Ω.utils.toggle(200, 2)) {
                    c.fillText(msg, puterX + 5, puterY + (i + 1) * 10 + 5);
                }
            });

            //this.res.scanlines.render(gfx, puterX, puterY);
        },

        renderCode: function (gfx) {
            var c = gfx.ctx,
                sy = 270,
                sh = 10,
                titleY = 240,
                titles = ["header", "sig.", "stub", "data", "checksum"],
                ps = [20, 100, 180, 260, 400],
                ws = [60, 60, 60, 120, 70];

            for (var i = 0; i < this.pieces.length; i++) {
                var t = this.pieces[i];
                c.fillStyle = t && (Ω.utils.since(t) > 2000 || Ω.utils.toggle(200, 2)) ? "#D55F4C" : "#650f0c";
                if (this.state.is("WIN") && !(Ω.utils.toggle(200, 2))) {
                    c.fillStyle = "#650F0C";
                }
                c.fillRect(ps[i], sy, ws[i], sh);
            }

            titles.forEach(function (t, i) {
                this.font.render(gfx, t, ps[i], titleY);
            }, this);
        },

        renderVoiceOver: function (gfx) {
            var c = gfx.ctx;

            if (!this.voiceOver) {
                return;
            }

            var x = gfx.w / 2 - (this.voiceOver.length * 4),
                y = gfx.h / 2 - 16;

            c.strokeStyle = "#333";
            c.fillStyle = "rgb(0, 0, 0)";
            c.fillRect(x - 10, y - 10, this.voiceOver.length * 8 + 20, 32);
            c.strokeRect(x - 10, y - 10, this.voiceOver.length * 8 + 20, 32);
            if (Ω.utils.toggle(300, 2)) {
                this.font.render(gfx, this.voiceOver, x, y);
            }

        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
