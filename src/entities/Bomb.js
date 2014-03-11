(function (Ω) {

    "use strict";

    var Bomb = Ω.Entity.extend({

        w: 10,
        h: 10,
        body: null,

        audio: new Ω.Sound("res/audio/heartbeat"),

        remove: false,

        count: 0,

        frozen: false,
        danger: false,

        particles: null,

        init: function (world, x, y, screen) {
            this.body = (window.Physics.createCircle(world, x, y, 0.5)).GetBody();
            this.body.SetUserData(this);
            this.screen = screen;
        },

        tick: function () {

            var pos = this.body.GetPosition();
            this.angle = this.body.GetAngle();
            this.x = pos.x * 20 - 5;
            this.y = pos.y * 20 - 5;

            if (this.angle !== 0) {
                this.danger = true;
            }

            if (this.count++ === 140 && this.screen.state.isNotIn("DIE", "WIN")) {
                this.audio.play();
            }

            this.particles && this.particles.tick();

            return !(this.remove);
        },

        disarm: function () {
            this.frozen = true;
            this.danger = false;
            this.body.SetActive(false);
            this.particles = new Ω.Particle({life: 600, col: "252,81,84"});
            this.particles.play(this.x, this.y);
        },

        deactivate: function () {
            this.body.SetActive(false);
            Physics.jumpTo(this.body, 0, -3);
            this.remove = true;
        },

        render: function (gfx) {
            var c = gfx.ctx;
            c.fillStyle = "#222";
            c.save();
            c.translate((this.x | 0 )+ 5,  (this.y | 0) + 5);
            c.rotate(this.angle);
            c.translate(-5, -5);
            c.fillRect(0, 0, this.w, this.h);
            c.fillStyle = this.frozen || (this.danger && Ω.utils.toggle(400, 2)) ? "#222" : DATA.colours.baddream;
            c.fillRect(0, this.h - 1, this.w, 1);

            c.fillStyle = "#444";
            c.fillRect(0, 0, 1, this.h - 1);

            c.restore();

            this.particles && this.particles.render(gfx);
        }

    });

    window.Bomb = Bomb;

}(window.Ω));
