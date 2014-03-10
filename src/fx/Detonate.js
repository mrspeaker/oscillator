(function (Ω) {
    "use strict";

    var Detonate = Ω.Class.extend({

        init: function (x, y, size, life) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.life = life;
            this.max = life;
            this.alpha = 1;

            this.deading = 50;
        },

        tick: function () {
            if (this.life-- < 0) {
                this.deading--;
                this.alpha = 1 - (this.deading / 50);
            }

            return this.deading > 0;

        },

        render: function (gfx) {
            var c = gfx.ctx;

            if (this.life >= 0) {
                c.fillStyle = "rgba(50, 50, 50, " + (Math.min(1, this.alpha)) + ")";
                c.beginPath();
                c.arc(this.x, this.y, (1 - (this.life / this.max)) * this.size, 0, Math.PI * 2, false);
                c.fill();
            } else {
                c.fillStyle = "rgba(100, 100, 100, " + (1 - (Math.min(1, this.alpha))) + ")";
                c.beginPath();
                c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                c.fill();
            }
        }
    });

    window.Detonate = Detonate;

}(window.Ω));