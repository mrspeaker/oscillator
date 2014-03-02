(function (Ω) {

    "use strict";

    var Missile = Ω.Entity.extend({

        w: 6,
        h: 6,
        speed: 1,

        exploding: false,
        explodeTime: 0,
        maxExplodeTime: 40,

        trails: null,

        init: function (x, y, tx, ty) {
            this._super(x, y);

            this.trails = [],
            this.count = 0;

            this.sx = x;
            this.sy = y;
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

                if (++this.count % 10 === 0) {
                    this.trails.push([this.x + 2, this.y + 2]);
                }

                if (Math.abs(this.x - this.tx) < 2 && Math.abs(this.y - this.ty) < 2) {
                    this.exploding = true;
                    this.explodeTime = this.maxExplodeTime;
                }
            }

            return !(this.exploding && this.explodeTime-- < 0);

        },

        render: function (gfx) {
            var c = gfx.ctx;

            c.strokeStyle = "#FF5BA6";
            c.setLineDash([2,2]);
            c.beginPath();
            c.moveTo(this.sx, this.sy);
            c.lineTo(this.x + this.w / 2, this.y + this.h / 2);
            c.stroke();
            c.fillStyle = "#282828";
            if (!this.exploding) {
                c.fillRect(this.x, this.y, this.w, this.h);
            } else {
                c.beginPath();
                c.arc(this.x + this.w / 2 , this.y + this.h / 2 , (this.maxExplodeTime/2) - (Math.max(1, this.explodeTime / 2)), 0, Math.PI * 2);
                c.fill();
            }

        }

    });

    window.Missile = Missile;

}(window.Ω));
