(function (Ω, DATA) {

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
        bombTime: DATA.times.bombInitialDelay,
        lastBomb: null,
        smokes: null,
        count: 0,

        shake: null,

        bgflyPos: 500,

        res: {
            bg: new Ω.Image("res/images/allbg2.png", null, 1),
            bgfly: new Ω.Image("res/images/truc.png", null, 0.3),
            scratch: new Ω.Image("res/images/scratchscreen.png", null, 0.4)
        },

        audio: {
            warning: new Ω.Sound("res/audio/warning"),
            danger: new Ω.Sound("res/audio/danger"),
            expl: new Ω.Sound("res/audio/expl2", 0.4),
            corrupt: new Ω.Sound("res/audio/codecorrupted"),
            complete: new Ω.Sound("res/audio/programcomplete"),
            welldone: new Ω.Sound("res/audio/welldone"),
            tickle: new Ω.Sound("res/audio/tickle"),
            tick: new Ω.Sound("res/audio/tick", 0.5),
            nope: new Ω.Sound("res/audio/nope", 0.6),
            win: new Ω.Sound("res/audio/win", 0.3),
            lose: new Ω.Sound("res/audio/lose", 0.25),
            theme: new Ω.Sound("res/audio/osctune", 0.4, true)
        },

        selected: null,
        deSelected: false,

        state: null,

        init: function () {

            this.buildings = [];
            this.bombs = [];
            this.smokes = [];
            this.lastBomb = 0;

            this.audio.theme.play();

            this.state = new Ω.utils.State("BORN");

            this.selected ={
                x: Ω.env.w / 2,
                y: Ω.env.h
            };

            this.player = new window.Player(-10 , -10, this);
            this.world = window.Physics.createWorld(this.scale);

            this.pieces = [false, false, false, false, false];
            var numColums = 8,
                numComputers = 15,
                numPieces = this.pieces.length,
                colH = [7, 6, 6, 5, 5, 6, 8, 7].sort(function () { return 0.5 - Math.random(); });

            for (var j = 0; j < numColums; j++) {
                var h = colH[j];
                for (var i = 0; i < h; i++) {
                    this.buildings.push(
                        new Building(this.world, j * 4 + 4, numColums - (i * 1) + 2, j, i, this)
                    );
                    this.buildings[this.buildings.length - 1].id = j * 8 + i;
                    this.buildings[this.buildings.length - 1].flash(10 + i * 5 + j * 1, 10);
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
                    room.hadPiece = true;
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
            this.reduceBombDelay(DATA.times.bombPieceDelay);
        },

        reduceBombDelay: function (amount) {
            this.bombTime = Math.max(DATA.times.bombMinimumDelay, this.bombTime - amount);
        },

        select: function (body) {

            if (this.state.isIn("DIE", "WIN")) {
                return;
            }

            var room = body ? body.GetUserData() : null;

            if (room && room.type == "BUILDING") {
                this.audio.tick.play();
                if (room.dead || room.searched) {
                    this.audio.nope.play();
                } else {
                    if (this.selected) {
                        this.selected.selected = false;
                    }
                    room.select();
                    this.selected = room;
                    this.deSelected = false;
                    this.player.goTo(room, this.getDistToPiece(room));
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
            this.bombs.push(new Bomb(this.world, x - 0.2, -3, this));
            this.bombs.push(new Bomb(this.world, x + 0.2, -1, this));
            this.reduceBombDelay(DATA.times.bombLaunchedDelay);
        },

        tick: function () {

            this.handleInput();
            this.state.tick();

            switch (this.state.get()) {
            case "BORN":
                if (this.state.first()) {
                    this.voiceOver = "search for code fragments";
                }
                if (this.state.count == 25) {
                    this.audio.tickle.play();
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
                if (++this.count - this.lastBomb > this.bombTime) {
                    if (this.firstBomb) {
                        this.firstBomb = false;
                        this.voiceOver = "incoming anomaly. fire!";
                        this.voiceOverCount = 130;
                        this.audio.warning.play();
                    }
                    this.addBomb();
                    this.lastBomb = this.count;
                }
                if (this.voiceOver && this.voiceOverCount--<0) {
                    this.voiceOver = "";
                }

                // Move the lil' background blip. ToDO: background activity
                this.bgflyPos -= 0.4;
                if (this.bgflyPos < -20) {
                    this.bgflyPos = Ω.env.w + 10;
                }
                break;
            case "EXPLOSE":
                break;
            case "DIE":
                if (this.state.first()) {
                    this.audio.theme.stop();
                    this.audio.nope.play();
                    this.voiceOver = "code corrupted. game over.";
                    this.audio.corrupt.play();
                    this.selected.selected = false;
                    this.player.die();
                }
                if (this.state.count === 30) {
                    this.audio.lose.play();
                }
                if (this.state.count > 150 && Ω.input.pressed("select")) {
                    game.setScreen(new TitleScreen());
                }

                break;
            case "WIN":
                this.voiceOver = "> program complete. override successful.";
                if (this.state.first()) {
                    this.audio.theme.stop();
                    this.audio.complete.play();
                    this.audio.win.play();
                    this.bombs.forEach(function (b) {
                        b.disarm();
                    });
                }
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

            this.smokes = this.smokes.filter(function (s) {
                return s.tick();
            });

            this.buildings.forEach(function (b) {
                b.tick();
            });
            if (this.shake && !this.shake.tick()) {
                this.shake = null;
            }

            var self = this;
            this.bombs.forEach(function (b) {
                var alive = b.tick();
                if (alive) {
                    self.player.missiles.forEach(function (m) {
                        if (m.exploding && m.explodeTime >= 0) {
                            var dist = Ω.utils.distCenter(b, m);
                            if (dist < m.rad) {
                                self.shake = new Ω.Shake(30, 3);
                                self.audio.expl.play();
                                b.deactivate();
                                self.smokey(b);
                            }
                        }
                    });
                }
                return alive;
            });

        },

        handleInput: function () {
            if (Ω.input.pressed("select")) {
                var sel = Physics.getBodyAtXY(this.world, Ω.input.mouse.x / this.scale, Ω.input.mouse.y / this.scale);
                this.select(sel);
            }
        },

        smokey: function (b) {
            for (var i = 0; i < 5; i++) {
                var s = new Smoke(
                    b.x + Ω.utils.rand(-5, 5),
                    b.y + Ω.utils.rand(-5, 5),
                    Ω.utils.rand(5, 10) / 10 - 0.5,
                    Ω.utils.rand(5, 10) / 10 - 0.5,
                    Ω.utils.rand(2, 20),
                    Ω.utils.rand(0, 100) / 100);
                this.smokes.push(s);
            }
        },

        distCenterSquished: function (a, b) {

            var dx = (a.x / 4 + (a.w / 2)) - (b.x / 4 + (b.w / 2)),
                dy = (a.y + (a.h / 2)) - (b.y + (b.h / 2));

            return Math.sqrt(dx * dx + dy * dy);

        },

        getDistToPieces: function (piece) {
            var dist = this.distCenterSquished;
            return this.buildings.filter(function (b) {
                return b.hasPiece && !b.searched;
            }).map(function (b) {
                return dist(piece, b) | 0;
            }).sort(function (a, b) {
                return a - b;
            });

        },


        getDistToPiece: function (piece) {

            return this.getDistToPieces(piece)[0];
        },

        located: function (room) {
            var dist = this.distCenterSquished;
            this.buildings.map(function (b) {
                var d = dist(room, b);
                b.flash(((d * d) / 300) | 0, 20);
            });
        },

        render: function (gfx) {

            var c = gfx.ctx,
                grd,
                col;

            c.save();

            this.shake && this.shake.render(gfx);

            this.clear(gfx, DATA.colours.dust);

            this.res.bg.render(gfx, 0, 0);
            this.res.bgfly.render(gfx, this.bgflyPos, 90);

            // add linear gradient
            /*grd = c.createLinearGradient(gfx.w / 2, 140, gfx.w / 2, 190);
            grd.addColorStop(0, 'rgba(0,0,0,0)');
            grd.addColorStop(1, 'rgba(17, 17, 119, 0.5)');
            c.fillStyle = grd;
            c.fillRect(0, 140, gfx.w, 50);*/

            this.player.renderBG(gfx);
            //this.world.DrawDebugData();


            this.buildings.forEach(function (b) {
                b.render(gfx);
            });
            this.bombs.forEach(function (b) {
                b.render(gfx);
            });
            this.smokes.forEach(function (s) {
                s.render(gfx);
            });

            this.renderCompy(gfx);


            this.renderCode(gfx);
            this.player.renderFG(gfx);
            var state = this.state.get();

            if (state === "DIE" || state === "WIN") {
                grd = c.createRadialGradient(gfx.w / 2, gfx.h / 2, 0, gfx.w / 2, gfx.h /2, 400);
                grd.addColorStop(0, "rgba(0, 0, 0, 0)");
                col = state === "DIE" ? "0,80%,8%" : (this.state.count % 360 | 0) + ",50%,30%";
                grd.addColorStop(1, "hsla(" + col + ",0.4)");

                c.fillStyle = grd;
                c.fillRect(0, 0, gfx.w, gfx.h);
                c.fill();
            }

            this.renderVoiceOver(gfx);

            c.restore();


        },

        renderCompy: function (gfx) {
            var puterX = 500,
                puterY = gfx.h - 70,
                puterW = 240,
                puterH = 60,
                c = gfx.ctx;

            /*c.fillStyle = "#000";
            c.fillRect(puterX, puterY, puterW, puterH);*/
            c.fillStyle = DATA.colours.satin;
            c.font = "8pt monospace";

            var msgs = this.player.puterMsg;
            msgs.forEach(function (msg, i) {
                if (i != msgs.length - 1 || Ω.utils.toggle(200, 2)) {
                    c.fillText(msg, puterX + 5, puterY + (i + 1) * 10 + 5);
                }
            });

            this.res.scratch.render(gfx, puterX, puterY);
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
                c.fillStyle = t && (Ω.utils.since(t) > 2000 || Ω.utils.toggle(200, 2)) ? DATA.colours.satin : DATA.colours.nitroMute;
                if (this.state.is("WIN") && !(Ω.utils.toggle(200, 2))) {
                    c.fillStyle = DATA.colours.nitroMute;
                }
                c.fillRect(ps[i], sy, ws[i], sh);
            }

            /*titles.forEach(function (t, i) {
                this.font.render(gfx, t, ps[i], titleY);
            }, this);*/
        },

        renderVoiceOver: function (gfx) {
            if (!this.voiceOver) {
                return;
            }

            var c = gfx.ctx,
                x = gfx.w / 2 - (this.voiceOver.length * 4),
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

}(window.Ω, window.DATA));
