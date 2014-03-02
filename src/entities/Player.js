(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        w: 24,
        h: 32,

        bx: 0,
        by: 220,

        room: null,

        missiles: null,
        mustGoToGround: false,

        state: null,

        puterMsg: null,

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;
            this.missiles = [];
            this.puterMsg = [""];
            this.state = new Ω.utils.State("BORN");
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
                    this.puterMsg = ["NO SIGNAL"];
                    this.arrived = false;
                }
                this.state.set("GOTOROOM");
                break;
            case "GOTOROOM":
                console.log(this.arrived);
                if (!this.arrived && this.room) {
                    var arrived = Math.abs(this.room.x - this.bx) < 12;
                    if (!arrived) {
                        if (this.room.x + 10 < this.bx) {
                            this.bx -= 10;
                        } else if (this.room.x + 10 > this.bx) {
                            this.bx += 10;
                        }
                    } else {
                        this.state.set("SCANROOM");
                    }
                }
                break;
            case "SCANROOM":
                if (this.state.first()) {
                    this.puterMsg = ["///SCANNING"];
                }
                if (this.state.count > 40) {
                    this.state.set("INROOM");
                }
                break;
            case "INROOM":
                if (this.state.first()) {
                    this.puterMsg.push("HAS COMPUTER? " + (this.room.hasComputer ? "Y" : "N"));
                }
                if (this.state.count > 40 && this.room.hasComputer) {
                    this.state.set("SCANCOMPUTER");
                }
                break;
            case "SCANCOMPUTER":
                if (this.state.first()) {
                    this.puterMsg.push("SCANNING COMPUTER");
                }
                if (this.state.count > 80) {
                    this.state.set("INCOMPUTER");
                }
                break;
            case "INCOMPUTER":
                if (this.state.first()) {
                    this.puterMsg.push("FOUND CODE? " + (this.room.hasPiece ? "Y" : "N"));
                }
                break;
            }

            // Check for missile fire
            if (Ω.input.pressed("select")) {
                if (this.screen.deSelected) {

                    this.missiles.push(
                        new Missile(this.screen.selected.x + 10, this.screen.selected.y + 10, this.x, this.y)
                    );
                }
            }

            this.missiles = this.missiles.filter(function (m) {
                return m.tick();
            });

        },

        goTo: function (room) {
            this.lastRoom = this.room;
            this.room = room;
            this.state.set("ROOMSELECTED");
        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.missiles.forEach(function (m) {
                m.render(gfx);
            });
            c.fillStyle = "hsl(200, 90%, 50%)";
            c.fillRect(this.bx - 3, this.by - 1, 6, 3);

            c.fillStyle = "hsl(80, 50%, 50%)";
            c.fillRect(this.x - 2, this.y - 2, 4, 4);

        }

    });

    window.Player = Player;

}(window.Ω));