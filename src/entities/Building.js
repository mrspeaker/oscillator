(function (Ω) {

    "use strict";

    var Building = Ω.Entity.extend({

        w: 20,
        h: 20,
        body: null,

        init: function (world, x, y) {
            this.body = (window.Physics.createBox(world, x, y, 1, 1)).GetBody();
            this.body.SetUserData(this);
        },

        tick: function () {
            var pos = this.body.GetPosition();
            this.angle = this.body.GetAngle();
            this.x = pos.x * 20 - 10;
            this.y = pos.y * 20 - 10;
        },

        render: function (gfx) {

            var c = gfx.ctx;
            c.fillStyle = "#000";
            c.save();
            c.translate(this.x + 10,  this.y + 10);
            c.rotate(this.angle);
            c.translate(-10, -10);
            c.fillRect(0, 0, this.w, this.h);
            c.restore();

        }

    });

    window.Building = Building;

}(window.Ω));