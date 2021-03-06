'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.

//  The Google WebFont Loader will look for this object, so create it before loading the script.
var playScene = require ('./play_scene.js'); 
var gameOver = require ('./gameover_scene.js');
var menuScene = require ('./menu_scene');
var pauseScene = require('./pause_scene');
var victoryScene = require('./victory_scene');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.audio('Judas','sounds/Judas.mp3');
  },

  create: function () {
    //this.game.state.start('preloader');
      this.game.state.start('menu');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    
    this.load.onLoadStart.add(this.loadStart, this);


/////////////////////CARGA DE RECURSOS////////////////////////

    this.game.load.image('mapSheet', 'images/TilesetTorre.png');
    this.game.load.tilemap('tilemap', 'images/map1.json', null, Phaser.Tilemap.TILED_JSON);//
    this.game.load.image('tiles','images/simples_pimples.png');//
    //Carga del enemigo
    this.game.load.atlas('Demon','images/Demon.png', 'images/Demon.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.atlas('enemyFly','images/Fly-Enemy.png', 'images/Fly-Enemy.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    //this.game.load.image('lava','images/lava.png');

    //Carga de la cruz
    
    this.game.load.image('GameOver', 'images/gameover.jpg');
    this.game.load.image('Victory', 'images/victory.jpg');

    this.game.load.image('cross', 'images/cross.png');
    this.game.load.atlas('Teresa', 'images/Teresa.png', 'images/Teresa.json', 
      Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    this.game.load.image('God', 'images/god.png');
    this.game.load.image('muffin','images/muffin.png');
    this.game.load.image('buttonNew','images/buttonNew.png');
    //this.game.load.image('Teresa','images/teresa1.png');
    
    //Carga de sonido
    this.game.load.audio('Problem','sounds/Problem.mp3');
    this.game.load.audio('Jump','sounds/Jump_07.wav');
    this.game.load.audio('EatMuffin', 'sounds/PowerUp.mp3');
    this.game.load.audio('Aleluya', 'sounds/Aleluya.mp3');
    this.game.load.audio('ThrowFx', 'sounds/Throw.wav');
    this.game.load.audio('GameOverFx', 'sounds/GameOverSound.wav');
    this.game.load.audio('Hit', 'sounds/Explosion.wav');
    this.game.load.audio('Onda', 'sounds/ShockWave.mp3');

    //LAVA
    this.game.load.atlas('lava', 'images/lava.png', 'images/lava.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    //MENU
    this.game.load.image('menu', 'images/menu.png');

    //Escucha el evento onLoadComplete con el método loadComplete que el state 'play'
    this.load.onLoadComplete.add(this.loadComplete, this);
  },

  loadStart: function () {
    //this.game.state.start('play');
    console.log("Game Assets Loading ...");
  },
    
  //TODO 2.2b function loadComplete()
  loadComplete: function() {
    this.game.state.start('play');
  },
    
  update: function(){
    this._loadingBar
  }
};


var wfconfig = {
 
    active: function() { 
        console.log("font loaded");
        init();
    },
 
    google: {
        families: ['Sniglet','VT323']
    }
 
};

//TODO 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
window.onload = function() {
    WebFont.load(wfconfig); //carga la fuente definida en el objeto anterior.
};

//TODO 3.3 La creación del juego y la asignación de los states se hará en el método init().
function init () {
   var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

//TODO 1.2 Añadir los states 'boot' BootScene, 'menu' MenuScene,
// 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', playScene);
  game.state.add('gameOver', gameOver);
  game.state.add('menu', menuScene);
  game.state.add('pause', pauseScene);
  game.state.add('victory', victoryScene);


//TODO 1.3 iniciar el state 'boot'. 
  game.state.start('boot');
    
};
