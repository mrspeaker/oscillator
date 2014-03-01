(function (Ω) {

    "use strict";

    var Missile = Ω.Entity.extend({

        w: 6,
        h: 6,
        speed: 1,

        exploding: false,
        explodeTime: 0,

        init: function (x, y, tx, ty) {
            this._super(x, y);

            this.tx = tx;
            this.ty = ty;

            var angle = Ω.utils.angleBetween({x:tx, y:ty},{x:x, y:y});
            this.xSpeed = this.speed * Math.cos(angle);
            this.ySpeed = this.speed * Math.sin(angle);
        },

        tick: function () {

            if (!this.exploding) {
                this.x += this.xSpeed;
                this.y += this.ySpeed;

                if (Math.abs(this.x - this.tx) < 3 && Math.abs(this.y - this.ty) < 3) {
                    this.exploding = true;
                    this.explodeTime = 30;
                }
            }

            return !(this.exploding && this.explodeTime-- < 0);

        },

        render: function (gfx) {
            var c = gfx.ctx;

            c.fillStyle = "#333";
            if (!this.exploding) {
                c.fillRect(this.x, this.y, this.w, this.h);
            } else {
                c.beginPath();
                c.arc(this.x + 5, this.y + 5, 15 - (Math.max(1, this.explodeTime / 2)), 0, Math.PI * 2);
                c.fill();
            }

        }

    });

    window.Missile = Missile;

}(window.Ω));
