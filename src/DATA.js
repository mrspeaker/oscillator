(function () {

    "use strict";

    var DATA = {
        colours: {
            nitros: ["#33fbda", "#30fbd4", "#2afbc9", "#24fabb", "#1ef9ae", "#18faa6", "#15f89d", "#0ef88f", "#07f782", "#00f774"],
            nitroBlue: "#33FBDA",
            nitro: "#33FBDA", //rgb(0, 254, 91)", //"#35FB66",
            nitroMute: "#0E5E50",
            satin: "#FC55F5",
            dust: "#052229",
            electric: "#33FBDA",
            baddream: "#FC5154"
        },
        times: {
            scanningRoom: 100,
            scanningComputer: 80,

            bombInitialDelay: 500,
            bombPieceDelay: 15, // Reduce bomb delay when peice found
            bombLaunchedDelay: 10, // reduce bomb dealy when bomb launched
            bombMinimumDelay: 50
        }
    };

    window.DATA = DATA;

}());
