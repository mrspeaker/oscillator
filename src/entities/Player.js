(function (Ω) {

    "use strict";

    var Player = Ω.Entity.extend({
        w: 24,
        h: 32,

        missiles: null,

        init: function (x, y, screen) {
            this._super(x, y);
            this.screen = screen;
            this.missiles = [];
        },

        tick: function () {

            this.x = Ω.input.mouse.x;
            this.y = Ω.input.mouse.y;

            if (Ω.input.pressed("select")) {
                if (this.screen.deSelected) {

                    this.missiles.push(
                        new Missile(this.screen.selected.x + 10, this.screen.selected.y + 10, this.x, this.y)
                    );
                }
            }

            this.missiles = this.missiles.filter(function (m) {
                return m.tick();
            });

        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.missiles.forEach(function (m) {
                m.render(gfx);
            });

            c.fillStyle = "hsl(80, 50%, 50%)";
            c.fillRect(this.x - 2, this.y - 2, 4, 4);
        }

    });

    window.Player = Player;

}(window.Ω));