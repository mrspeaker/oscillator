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
            this.x = pos.x * 20 - 10;
            this.y = pos.y * 20 - 10;
        },

        render: function (gfx) {

            var c = gfx.ctx;
            c.fillStyle = "#000";
            c.fillRect(this.x, this.y, this.w, this.h);

        }

    });

    window.Building = Building;

}(window.Ω));