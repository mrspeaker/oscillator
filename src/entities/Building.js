(function (Ω, DATA) {

    "use strict";

    var Building = Ω.Entity.extend({

        w: 20,
        h: 20,
        body: null,

        dead: false,

        type: "BUILDING",

        selected: false,
        searched: false,

        hasComputer: false,
        hasPiece: false,
        hadPiece: false,

        kit: null,

        sheet: new Ω.SpriteSheet("res/images/lights.png", 20, 20),

        hintTime: 0,
        hintDist: 0,

        init: function (world, x, y, col, row, screen) {
            this.kit = {
                delay: -1,
                count: 0,
                color: DATA.colours.satin
            };

            this.body = (window.Physics.createBox(world, x, y, 1, 1)).GetBody();
            this.body.SetUserData(this);
            this.col = col;
            this.row = row;
            this.screen = screen;
        },

        select: function () {
            this.selected = true;
            //this.searched = true;
        },

        tick: function () {
            var pos = this.body.GetPosition();
            this.angle = this.body.GetAngle();
            var lv = this.body.GetLinearVelocity(),
                dis = 1.6;
            if (Math.abs(lv.x) > dis || Math.abs(lv.y) > dis) {
                this.dead = true;
                if (this.hasPiece) {
                    this.screen.lostPiece();
                }
            }
            this.hintTime--;

            if (this.kit.count > 0) {
                if (this.kit.delay-- <= 0) {
                    this.kit.count--;
                }
            }


            this.x = pos.x * 20 - 10;
            this.y = pos.y * 20 - 10;
        },

        flash: function (delay, count, color) {
            this.kit.delay = delay;
            this.kit.count = count;
            this.kit.color = color || DATA.colours.satin;
        },

        giveHint: function (dist) {
            this.hintTime = 100;
            this.hintDist = dist;
        },

        render: function (gfx) {

            var c = gfx.ctx,
                COL_on = DATA.colours.nitros[Math.min(5, this.row + 1) * 2 - 1],
                COL_searched = DATA.colours.nitroMute,
                COL_selected = DATA.colours.satin,
                COL_off = "#222",
                COL_edgeHighlight = "#333",
                isGameOver = this.screen.state.is("DIE"),
                flashBuilding = this.selected && !this.searched && Ω.utils.toggle(300, 2);

            c.fillStyle = flashBuilding ?
                COL_on :
                (isGameOver && this.hasPiece && !this.searched && this.dead > 0.1 && Ω.utils.toggle(150, 2) ?
                    DATA.colours.nitroMute :
                    "#000");
            /*if (this.hasPiece) {
                c.fillStyle = "#333";
            }*/

            c.save();
            c.translate((this.x | 0) + 10,  (this.y | 0) + 10);
            c.rotate(this.angle);
            c.translate(-10, -10);
            c.fillRect(0, 0, this.w, this.h);
            // If !searched, and selected - flash.

            c.fillStyle = this.dead ? COL_off : (this.selected ? COL_selected : (this.searched ? COL_searched : COL_on));
            if (this.kit.delay < 0 && this.kit.count) {
                c.fillStyle = this.kit.color;
            }

            c.fillRect(0, 0, this.w, 1);

            if (!(this.searched || this.dead)) {
                this.sheet.render(gfx, this.row % 4, this.col % 3, 0, 0);
            }

            if (this.hintTime > 0 && !this.hadPiece) {
                c.fillStyle = "hsla(" + (180 * this.hintDist | 0) + ",50%, 40%, " + (this.hintTime / 100) + ")";
                c.strokeStyle = "hsla(" + (180 * this.hintDist | 0) + ",50%, 40%, " + ((this.hintTime * 2 )/ 100) + ")";
                c.beginPath();
                c.arc(11, 10, 4, 0, Math.PI * 2, false);
                c.fill();
                c.stroke();
            }

            var sat = (10 - Math.min(Math.min(5, this.row + 1) * 2 - 1)) + "0%";
            c.fillStyle = flashBuilding ? COL_on : (this.dead ? COL_edgeHighlight :  "hsl(190, " + sat + "," + sat + ")"); //COL_edgeHighlight;
            c.fillRect(0, 1, 1, this.h - 1);
            c.restore();

        }

    });

    window.Building = Building;

}(window.Ω, window.DATA));