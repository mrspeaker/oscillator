(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        w: 24,
        h: 32,

        bx: -5,
        by: 220,

        room: null,

        missiles: null,
        mustGoToGround: false,

        numPieces: 0,

        state: null,

        audio: {
            located: new Ω.Sound("res/audio/codelocated"),
            notfound: new Ω.Sound("res/audio/notfound"),
            scanning: new Ω.Sound("res/audio/scanning")

        },

        puterMsg: null,

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;
            this.missiles = [];
            this.puterMsg = [""];
            this.state = new Ω.utils.State("BORN");
            this.lastMissile = Ω.utils.now();

            Ω.input.mouse.x = -10;
            Ω.input.mouse.y = -10;
        },

        tick: function () {

            this.x = Ω.input.mouse.x;
            this.y = Ω.input.mouse.y;

            this.state.tick();

            switch (this.state.get()) {
            case "BORN":
                break;
            case "ROOMSELECTED":
                if (this.state.first()) {
                    if (this.lastRoom && this.lastRoom.col !== this.room.col) {
                        this.mustGoToGround = true;
                    }
                    this.puterMsg = ["NO SIGNAL", ""];
                    this.arrived = false;
                }
                this.state.set("GOTOROOM");
                break;
            case "GOTOROOM":
                if (!this.arrived && this.room) {
                    var arrived = Math.abs((this.room.x + 5) - (this.bx + 4)) < 12;
                    if (!arrived) {
                        if (this.room.x + 10 < this.bx) {
                            this.bx -= 10;
                        } else if (this.room.x + 10 > this.bx) {
                            this.bx += 10;
                        }
                    } else {
                        this.state.set("SCANROOM");
                        this.bx = this.room.x + 12;
                    }
                }
                break;
            case "SCANROOM":
                if (this.state.first()) {
                    this.puterMsg = ["> PLEASE WAIT... SCANNING CONDO."];
                }
                if (this.state.count > 60) {
                    this.state.set("INROOM");
                }
                break;
            case "INROOM":
                if (this.state.first()) {
                    this.puterMsg.push("HAS COMPUTER? " + (this.room.hasComputer ? "Y" : "N"));
                    if (!this.room.hasComputer) {
                        this.room.searched = true;
                    }
                }
                if (this.state.count === 40) {
                    if (this.room.hasComputer) {
                        this.state.set("SCANCOMPUTER");
                    } else {
                        this.audio.notfound.play();
                        this.puterMsg.push("SEARCH COMPLETE. TRY ELSEWHERE.");
                    }
                }
                if (this.state.count === 70) {
                    this.puterMsg.push("");
                }
                break;
            case "SCANCOMPUTER":
                if (this.state.first()) {
                    this.audio.scanning.play();
                    this.puterMsg.push("SCANNING COMPUTER");
                }
                if (this.state.count > 80) {
                    this.state.set("INCOMPUTER");
                }
                break;
            case "INCOMPUTER":
                if (this.state.first()) {
                    if (this.room.hasPiece) {
                        this.numPieces++;
                        this.screen.checkPieces();
                    }
                    this.puterMsg.push("FOUND CODE? " + (this.room.hasPiece ? "Y" : "N"));
                    if (this.room.hasPiece) {
                        if (this.numPieces < 5) {
                            this.audio.located.play();
                        }
                    } else {
                        this.audio.notfound.play();
                    }
                    this.room.hasPiece = false;
                    this.room.searched = true;
                }
                if (this.state.count == 40) {
                    this.puterMsg.push("");
                }
                break;
            case "DIE":
                break;
            }

            // Check for missile fire
            if (Ω.input.pressed("select") && this.room) {
                if (this.screen.deSelected) {
                    // If in the screen, fire.
                    if (this.x > 0 && this.x < Ω.env.w && this.y > 0 && this.y < 218) {
                        this.missiles.push(
                            new Missile(this.screen.selected.x + 10, this.screen.selected.y + 10, this.x, this.y)
                        );
                        if (Ω.utils.since(this.lastMissile) > 100) {
//                            this.audio.fire.play();
                            this.lastMissile = Ω.utils.now();
                        }
                    }
                }
            }

            this.missiles = this.missiles.filter(function (m) {
                return m.tick();
            });

        },

        die: function () {
            this.state.set("DIE");
            this.puterMsg = [""];
        },

        goTo: function (room) {
            this.lastRoom = this.room;
            this.room = room;
            this.state.set("ROOMSELECTED");
        },

        renderBG: function (gfx) {
            this.missiles.forEach(function (m) {
                m.render(gfx);
            });
        },

        renderFG: function (gfx) {
            var c = gfx.ctx;
            c.fillStyle = "hsl(200, 90%, 50%)";
            c.fillRect(this.bx - 3, this.by - 1, 6, 3);

            c.fillStyle = "hsl(80, 50%, 50%)";
            c.fillRect(this.x - 2, this.y - 2, 4, 4);
        }

    });

    window.Player = Player;

}(window.Ω));