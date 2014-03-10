(function (Ω) {

    "use strict";

    var Missile = Ω.Entity.extend({

        w: 6,
        h: 6,
        speed: 1,

        rad: 0,

        exploding: false,
        explodeTime: 0,
        maxExplodeTime: 40,

        trails: null,

        detonation: null,

        init: function (x, y, tx, ty) {
            this._super(x, y);

            this.trails = [];
            this.count = 0;

            this.sx = x;
            this.sy = y;
            this.tx = tx | 0;
            this.ty = ty | 0;

            var angle = Ω.utils.angleBetween({x:this.tx, y:this.ty}, {x:x, y:y});
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
                    this.x = this.tx;
                    this.y = this.ty;
                    this.explodeTime = this.maxExplodeTime;
                    this.detonation = new Detonate(this.tx, this.ty, 20, 40);
                }
            } else {
                this.rad = Math.max(1, (this.maxExplodeTime/2) - (Math.max(1, this.explodeTime / 2)));
                this.explodeTime--;
            }

            if (this.detonation) {
                if (!this.detonation.tick()) {
                    this.detonation = null;
                }
            }

            return !(this.exploding && this.detonation == null);

        },

        render: function (gfx) {
            var c = gfx.ctx,
                x = Math.round(this.x),
                y = Math.round(this.y);

            c.strokeStyle = DATA.colours.satin;
            c.setLineDash([3,3]);
            c.beginPath();
            c.moveTo(this.sx, this.sy);
            c.lineTo(x, y);
            c.stroke();
            c.fillStyle = "#282828";
            if (!this.exploding) {
                c.fillRect(x - this.w/ 2, y - this.h /2, this.w, this.h);
            } else {
                /*c.beginPath();
                c.arc(x + this.w / 2 , y + this.h / 2 , this.rad, 0, Math.PI * 2);
                c.fill();*/
            }
            this.detonation && this.detonation.render(gfx);

        }

    });

    window.Missile = Missile;

}(window.Ω));
