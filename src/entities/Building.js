(function (Ω) {

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

            var c = gfx.ctx;
            c.fillStyle = this.selected && !this.searched && Ω.utils.toggle(300, 2) ? "#2CDA3F" : "#000";
            c.save();
            c.translate(this.x + 10,  this.y + 10);
            c.rotate(this.angle);
            c.translate(-10, -10);
            c.fillRect(0, 0, this.w, this.h);
            // If !searched, and selected - flash.
            c.fillStyle = this.dead ? "#222" : (this.selected ? "#FA5C6F" : (this.searched ? "#0F5CFA" : "#5CFA6F"));
            c.fillRect(0, 0, this.w, 1);
            c.fillStyle = "#333";
            c.fillRect(0, 0, 2, this.h);
            c.restore();

        }

    });

    window.Building = Building;

}(window.Ω));