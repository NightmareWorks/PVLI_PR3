var pauseScene = {
    create: function () {
        console.log("Paused");
        var button = this.game.add.button(400, 300,
            'button',this.actionOnClick, this, 2, 1, 0);

        button.anchor.set(0.5);

        var goText = this.game.add.text(400, 100, "Paused");

        var text = this.game.add.text(0, 0, "Continue Playing");
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);
        
        //TODO 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego.
        var button2 = this.game.add.button(400, 400,
                                          'button',
                                          this.click2, 
                                          this, 2, 1, 0);
        button2.anchor.set(0.5);
        var text2 = this.game.add.text(0, 0, "Return Menu");
        text2.anchor.set(0.5);
        button2.addChild(text2);
    },
    
    //TODO 7 declarar el callback del boton.
    actionOnClick: function(){
        this.game.state.resume('play');
    },

    //Callback del otro botón (punto 8)
    click2: function(){
        //this.game.state.start('preloader');
        this.game.state.start('menu');
    }
};

module.exports = pauseScene;