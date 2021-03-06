var MenuScene = {
    create: function () {
        this.Judas = this.game.add.audio('Judas');
        this.Judas.loop = true;
        this.Judas.play();
        this.game.world.setBounds(0,0,800,600);
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY+80, 
                                               'button', 
                                               this.actionOnClick, 
                                               this,1,0,2);
        buttonStart.anchor.set(0.5);
    
        var textStart = this.game.add.text(0, 0, "Start");
        textStart.font = 'VT323';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);
    },
    
    actionOnClick: function(){
        this.game.state.start('preloader');
        this.Judas.destroy();
    } 
};

module.exports = MenuScene;