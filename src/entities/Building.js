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

        init: function (world, x, y, col, row, screen) {
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
            this.x = pos.x * 20 - 10;
            this.y = pos.y * 20 - 10;
        },

        render: function (gfx) {

            var c = gfx.ctx,
                COL_on = DATA.colours.nitro,
                COL_searched = DATA.colours.nitroMute,
                COL_selected = DATA.colours.satin,
                COL_off = "#222",
                COL_edgeHighlight = "#333",
                isGameOver = this.screen.state.is("DIE");

            c.fillStyle = this.selected && !this.searched && Ω.utils.toggle(300, 2) ?
                COL_on :
                (isGameOver && this.hasPiece && !this.searched && this.dead > 0.1 && Ω.utils.toggle(150, 2) ?
                    DATA.colours.nitroMute :
                    "#000");
            c.save();
            c.translate((this.x | 0) + 10,  (this.y | 0) + 10);
            c.rotate(this.angle);
            c.translate(-10, -10);
            c.fillRect(0, 0, this.w, this.h);
            // If !searched, and selected - flash.
            c.fillStyle = this.dead ? COL_off : (this.selected ? COL_selected : (this.searched ? COL_searched : COL_on));
            c.fillRect(0, 0, this.w, 1);
            c.fillStyle = COL_edgeHighlight;
            c.fillRect(0, 1, 2, this.h);
            c.restore();

        }

    });

    window.Building = Building;

}(window.Ω, window.DATA));