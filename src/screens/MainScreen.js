(function (Ω) {

    "use strict";

    var MainScreen = Ω.Screen.extend({

        scale: 20,

        buildings: null,

        init: function () {

            this.buildings = [];

            this.player = new window.Player(Ω.env.w * 0.5, Ω.env.h * 0.2);
            this.world = window.Physics.createWorld(this.scale);

            for (var j = 0; j < 8; j++) {
                var h = (Math.random() * 3 | 0) + 5;
                for (var i = 0; i < h; i++) {
                    this.buildings.push(
                        new Building(this.world, j * 4 + 4, 8 - (i * 1) + 2)
                    )
                }
            }

            Physics.createCircle(this.world, 5.69, -2, 0.5);
            Physics.createCircle(this.world, 6.11, 2, 0.5);
        },

        tick: function () {

            this.player.tick();

            var step = window.game.preset_dt;
            //step /= Math.max(1, Math.abs(Math.sin(Date.now() / 1000) * 20));
            this.world.Step(step, 10, 10);
            this.world.ClearForces();

            this.buildings.forEach(function (b) {
                b.tick();
            });

            if (Ω.input.pressed("select")) {
                var sel = Physics.getBodyAtXY(this.world, Ω.input.mouse.x / this.scale, Ω.input.mouse.y / this.scale);
                if (sel) {
                    sel.SetAwake(true);
                    console.log(sel.GetAngle());
                }
            }

        },

        render: function (gfx) {

            var c = gfx.ctx;

            this.clear(gfx, "hsl(195, 40%, 5%)");

            c.fillStyle = "hsl(30, 10%, 9%)";
            c.fillRect(0, gfx.h - 140, gfx.w, 140);

            this.world.DrawDebugData();

            this.buildings.forEach(function (b) {
                b.render(gfx);
            });
            this.player.render(gfx);
        }
    });

    window.MainScreen = MainScreen;

}(window.Ω));
