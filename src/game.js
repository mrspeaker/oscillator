(function (Ω) {

    "use strict";

    var OmegaGame = Ω.Game.extend({

        canvas: "#board",
        fps: false,

        init: function (w, h) {

            this._super(w, h);

            Ω.evt.progress.push(function (remaining, max) {
                //console.log((((max - remaining) / max) * 100 | 0) + "%");
            });

            Ω.input.bind({
                "escape": "escape",
                "select": ["mouse1", "touch", "space"]
            });

        },

        load: function () {

            this.setScreen(new TitleScreen());

        }

    });

    window.OmegaGame = OmegaGame;

}(Ω));
