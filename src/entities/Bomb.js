(function (Ω) {

    "use strict";

    var Bomb = Ω.Entity.extend({

        w: 10,
        h: 10,
        body: null,

        audio: new Ω.Sound("res/audio/heartbeat"),

        remove: false,

        count: 0,

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

            if (this.count++ === 140 && this.screen.state.isNotIn("DIE", "WIN")) {
                this.audio.play();
            }

            return !(this.remove);
        },

        disactivate: function () {
            this.body.SetActive(false);
            Physics.jumpTo(this.body, 0, -3);
            this.remove = true;
        },

        render: function (gfx) {
            var c = gfx.ctx;
            c.fillStyle = "#333";
            c.save();
            c.translate(this.x + 5,  this.y + 5);
            c.rotate(this.angle);
            c.translate(-5, -5);
            c.fillRect(0, 0, this.w, this.h);
            c.fillStyle = "#FFF400";
            c.fillRect(0, this.h - 1, this.w, 1);
            c.restore();
        }

    });

    window.Bomb = Bomb;

}(window.Ω));
