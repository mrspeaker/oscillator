(function (Ω) {
    "use strict";

    var Smoke = Ω.Class.extend({

        init: function (x, y, vx, vy, size, life) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;

            this.alpha = 1 + life;
        },

        tick: function () {

            this.x += this.vx;
            this.y += this.vy;
            this.size += 0.01;
            this.alpha -= 0.01;

            return this.alpha > 0;

        },

        render: function (gfx) {
            var c = gfx.ctx;
            c.fillStyle = "rgba(50, 50, 50, " + (Math.min(1, this.alpha)) + ")";
            c.beginPath();
            c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            c.fill();
        }
    });

    window.Smoke = Smoke;

}(window.Ω));