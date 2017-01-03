'use strict';


var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}


//CONSTRUCTORAS ENEMIGOS Y OBJETOS

var enemy1;
//////////CELESTIAL CROSS/////////////
function CelestialCross(character, sprite, game){
    Phaser.Sprite.call(this, game, character.x,character.y,'cross');
    game.add.existing(this);

    this.scale.setTo(0.1,0.1);
    this.anchor.setTo(0.5, 0.5);

    this.character = character;
    game.physics.arcade.enable(this);
    this.kill();

    this.speed = 350;
    this.maxDist = 200;
    this.initialPosX = -150;
    this.puntoFinal = -150;
    
    this.dir = 'NULL';

    this.vuelta = false;
    this.launched = false;
    this.limit = false;
}

CelestialCross.prototype = Object.create(Phaser.Sprite.prototype);
CelestialCross.prototype.constructor = CelestialCross;
CelestialCross.prototype.setDirection = function(character){
    if (character.scale.x > 0){
        this.body.velocity.x = this.speed + character.body.velocity.x;
        this.puntoFinal = character.x + this.maxDist;
        this.dir = 'DERECHA';
    }
    else{
        this.body.velocity.x = -this.speed + character.body.velocity.x;
        this.puntoFinal = character.x - this.maxDist;
        this.dir = 'IZQUIERDA';
    }
}

CelestialCross.prototype.move = function(character){
    this.revive();

    if(this.launched === false){
        this.x = character.x;
        this.y = character.y-10;
        this.launched = true;
    }else{
        if(this.dir === 'DERECHA'){
            if(this.x >= this.puntoFinal) this.vuelta = true;
            if(this.vuelta && !this.limit) {
                this.body.velocity.x *= -1;
                this.limit = true;
            }
        }
        else if(this.dir === 'IZQUIERDA'){
            if(this.x <= this.puntoFinal) this.vuelta = true;
            if(this.vuelta && !this.limit) {
                this.body.velocity.x *= -1;
                this.limit = true;
            }
        }
        if(this.vuelta && this.x >= character.x-10 && this.x <= character.x+10){
            this.kill();
            this.vuelta = false;
            this.initialPosX = -150; 
            this.launched = false;
            this.limit = false;
            return true;
        }
        this.y = character.y;
        this.angle += 20;
    }

    return false;
}
////////////////////////////////////////////////////////////
function God(x, y, sprite, game){
    Phaser.Sprite.call(this, game, x,y,sprite);
    game.add.existing(this);
    game.physics.arcade.enable(this);
}
God.prototype = Object.create(Phaser.Sprite.prototype);
God.prototype.constructor = God;
God.prototype.checkWin = function(game,Teresa){
    game.physics.arcade.overlap(Teresa, this, function (obj1, obj2) {
        game.state.start('victory');
    });
}

////////////////////////TERESA////////////////////

///////////////////////ENEMIGO//////////////////////////////
function Enemy(x, y, sprite, game, dist){
    Phaser.Sprite.call(this, game, x,y,sprite);
    game.add.existing(this);


    //Posición inicial necesaria para el movimiento
    this.initialPos = this.x;
    this.speed = 150;
    //Escalado guarro para las pruebas
    this.scale.setTo(0.1,0.1);
    game.physics.arcade.enable(this);
    this.body.velocity.x = -this.speed;
    this.body.gravity.y = 30;
    this.body.collideWorldBounds = true;

    var time = 4000;
    this.EnemyTween= game.add.tween(this).to({
        x:x + dist
    }, 2000,Phaser.Linear,true, 1,100,true);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.collisionCross = function(game,cross){
    game.physics.arcade.overlap(cross, this, function (obj1, obj2) {
        obj2.kill();
        obj1.kill();

        /////FUTURO MARCADOR
        //score += 1;
        //scoreText.text = 'Score: ' + score;
    });
}
///////////////////////////////////////////////////

 function EnemyBird(index, game, x,y){
    Phaser.Sprite.call(this, game, x, y, 'enemy');
    this.anchor.setTo(0.5);
    this.name = 'EnemyBird_'+index.toString();

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.body.collideWorldBounds = true;
    this.body.allowGravity =false;

    this.scale.setTo(0.1,0.1);
    var time = 4000;
    this.birdTween= game.add.tween(this).to({
        x:this.x + x
    }, time*0.9,Phaser.Easing.Sinusoidal.InOut, true, 1,100,true);
}
EnemyBird.prototype = Object.create(Phaser.Sprite.prototype);
EnemyBird.prototype.constructor = EnemyBird;
EnemyBird.prototype.collisionCross = function(game,cross){
    game.physics.arcade.overlap(cross, this, function (obj1, obj2) {
        obj2.kill();
        obj1.kill();
    });
}

/////////BOTON 
        function up() {
            console.log('button up', arguments);
        }

        function over() {
            console.log('button over');
        }

        function out() {
            console.log('button out');
        }

        function actionOnClick () {

            background.visible =! background.visible;

        }
/////////////////PLAY SCENE///////////////////////
var PlayScene = {
    _Teresa: {}, //player
    _enemy2:{},
    enemies:{},
    _speed: 250, //velocidad del player
    _jumpSpeed: 400, //velocidad de salto
    _jumpHight: 100, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _lanzamiento: false,//controla el lanzamiento de la cruz
    menu:{},
    pausestate: false,
    god:{},

    create: function () {

        ///PAUSA
        var Esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
        Esc.onDown.add(this.unpause, this);

        var button = this.game.add.button(this.game.world.centerX, 400, 'enemy', actionOnClick, this, 2, 1, 0);

        button.onInputOver.add(over, this);
        button.onInputOut.add(out, this);
        button.onInputUp.add(up, this);



        //Creamos al player con un sprite por defecto.
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //TODO 5 Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
        this._Teresa = this.game.add.sprite(100,4700,'rush');
                this.god = new God(this._Teresa.x+40, this._Teresa.y, 'God',this.game);

        //Creo la cruz de Santa Teresa
        this.cross = new CelestialCross(this._Teresa,'cross',this.game);

        //TODO 4: Cargar el tilemap 'tilemap' y asignarle al tileset 'patrones' la imagen de sprites 'tiles'
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('patrones','tiles');

        //Creacion de las layers
        this.backgroundLayer = this.map.createLayer('BackgroundLayer');
        this.groundLayer = this.map.createLayer('GroundLayer');
        //plano de muerte
        this.death = this.map.createLayer('Death');
        //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
        this.map.setCollisionBetween(1, 5000, true, 'Death');
        this.map.setCollisionBetween(1, 5000, true, 'GroundLayer');
        this.death.visible = false;
          
        //Cambia la escala a x3.
        this.groundLayer.setScale(3,3);
        this.backgroundLayer.setScale(5,5);
        this.death.setScale(3,3);
         
        this.groundLayer.resizeWorld(); //resize world and adjust to the screen
          
        //nombre de la animación, frames, framerate, isloop
        this._Teresa.animations.add('run',
            Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
        this._Teresa.animations.add('stop',
            Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
        this._Teresa.animations.add('jump',
            Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
        this.configure();


        //Introduzco al enemigo
        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;

        for (var i = 0; i < 2; i++) {
            var enemy = new Enemy(130+ 30*i, 250, 'enemy', this.game,290);
            this.enemies.add(enemy);
        }

        enemy1 = new EnemyBird(0, this.game, 100, 500);
        this.enemies.add(enemy1);
    },

    //IS called one per frame.
    update: function () {
        this.GetInput();
        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._Teresa, this.groundLayer);
        var enemyStanding = this.game.physics.arcade.collide(this.enemies, this.groundLayer);
        var collisionWithEnemy = this.game.physics.arcade.collide(this._Teresa, this.enemies);

        ///NO UTILIZADO AUN
        var collisionWithEnemyBird = this.game.physics.arcade.collide(this._Teresa, enemy1);
        
       
        ///////////SI SE LANZA SE MIRA SI COLISIONA CON ENEMIGOS
        if(this._lanzamiento){        
            this.enemies.forEach( function(enemy) {
                enemy.collisionCross(this.game, this.cross);
            },this);
        }
        var movement = this.GetMovement();

        ///////////////////////TRANSITIONS//////////////////////
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap)){
                    this._playerState = PlayerState.JUMP;
                    this._initialJumpHeight = this._Teresa.y;
                    this._Teresa.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._Teresa.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._Teresa.animations.play('stop');
                    }
                }    
                break;
                
            case PlayerState.JUMP:
                
                var currentJumpHeight = this._Teresa.y - this._initialJumpHeight;
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight && !collisionWithTilemap)
                    ? PlayerState.JUMP : PlayerState.FALLING;
                break;
                
            case PlayerState.FALLING:
                if(this.isStanding()){
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._Teresa.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._Teresa.animations.play('stop');
                    }
                }
                break;     
        }
        if(this._playerState !== PlayerState.JUMP && !this.isStanding())
            this._playerState = PlayerState.FALLING;

        /////////////////////////////////////////////////////////////////////


        ////////////////STATES////////////////////////
        switch(this._playerState){
                
            case PlayerState.STOP:
                moveDirection.x = 0;
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:

            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                    moveDirection.x = this._speed;
                    if(this._Teresa.scale.x < 0)
                        this._Teresa.scale.x *= -1;
                }
                else if(movement === Direction.LEFT){
                    moveDirection.x = -this._speed;
                    if(this._Teresa.scale.x > 0)
                        this._Teresa.scale.x *= -1; 
                }
                if(this._playerState === PlayerState.JUMP)
                    moveDirection.y = -this._jumpSpeed;
                else if(this._playerState === PlayerState.FALLING)
                    moveDirection.y = this._jumpSpeed;//0;
                break;    
        }
        
        ///////////CROSS LAUNCH/////////////////

        if(this.launches() && !this._lanzamiento){
            this._lanzamiento = true;
            this.cross.setDirection(this._Teresa);
        }
        if(this._lanzamiento)
            if(this.cross.move(this._Teresa))
                this._lanzamiento = false;

        ////////////////////////////////////////

        ////////////MOVEMENT PLAYER////////////
        this.movement(moveDirection,50,
            this.backgroundLayer.layer.widthInPixels*this.backgroundLayer.scale.x - 10);
        /*
        this.enemies.forEach(function (aux){
            aux.move(10,300);
        });
*/

        this.checkPlayerDmg(collisionWithEnemyBird);

        this.checkPlayerDmg(collisionWithEnemy);
        this.god.checkWin(this.game,this._Teresa);

        //console.log(this._playerState);
        
    },
    
    
    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap; //|| this._jamping; //ESTO PUEDE SERVIR PARA ALGO
    },
    
    onPlayerFell: function(){
        //TODO 6 Carga de 'gameOver';
        this.game.state.start('gameOver');
    },
    
    checkPlayerDmg: function(collisionWithEnemy){
        if(this.game.physics.arcade.collide(this._Teresa, this.death) || collisionWithEnemy){
            this._lanzamiento = false;
            this.onPlayerFell();
            this._playerState = PlayerState.STOP;
        }

    },
        
    isStanding: function(){
        return this._Teresa.body.blocked.down || this._Teresa.body.touching.down;
    },
        
    isJumping: function(collisionWithTilemap){
        return this.canJump(collisionWithTilemap) && 
            this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
    },

    launches:function(){
        return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    },
        
    GetMovement: function(){
        var movement = Direction.NONE
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }
        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },

    GetInput:function(){
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ESC))
            this.pause();
    },

    //CONFIGURE THE SCENE
    configure: function(){

        this.game.world.setBounds(0, 0, 1000, 4800);
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#a920ff';
        this.game.physics.arcade.enable(this._Teresa,this._enemy2);
        
        this._Teresa.body.bounce.y = 0;
        //Creo que deberíamos quitar la gravedad y controlarlo nosotros
        this._Teresa.body.gravity.y = 1;
        this._Teresa.body.gravity.x = 0;
        //Este creo que no es necesario
        this._Teresa.body.velocity.x = 0;
        this.game.camera.follow(this._Teresa);
    },

    //MOVE PLAYER
    movement: function(point, xMin, xMax){
        this._Teresa.body.velocity = point;// * this.game.time.elapseTime;
        
        if((this._Teresa.x < xMin && point.x < 0)|| (this._Teresa.x > xMax && point.x > 0))
            this._Teresa.body.velocity.x = 0;

    },
    
    //DESTRUYE LOS RECURSOS
    destroy: function(){
        this.tilemap.destroy();
        this.tiles.destroy();
        this.game.world.setBounds(0,0,800,600);
    },

    pause: function(){
        this.pausestate = true;
        //Phaser.StateManager(this.game, this);
        //var estadoactual = this.game.state.current;
       // this.game.state.add(estadoactual,'pause', true);
        //Phaser.StateManager#pause();
        this.menu = new menu(this.game);
        
        //this.game.StateManager.add('juegocomenzado', this, false);
       // this.game.StateManager.add('pause', pauseScene, true);


        //this.game.state.start('pause');

    },

    unpause: function (event){
        // Only act if paused
        if(this.game.paused){
            // Unpause the game
            this.pausestate = false;
            this.game.paused = false;
            this.menu.destroy();
        }
    }

};

function menu(game){

    //////CREO EL MENU
    this.button = game.add.button(400, 300,
        'button', actionOnClick, this, 2, 1, 0);

    this.button.onInputOver.add(actionOnClick,this);

    this.button.anchor.set(0.5);
    this.goText = game.add.text(400, 100, "GameOver");
    this.text = game.add.text(0, 0, "Reset Game");
    this.text.anchor.set(0.5);
    this.goText.anchor.set(0.5);
    this.button.addChild(this.text);
    
    //TODO 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego.
    this.button2 = game.add.button(400, 400, 
        'button',this.click2, this, 2, 1, 0);

    this.button2.anchor.set(0.5);
    this.text2 = game.add.text(0, 0, "Return Menu");
    this.text2.anchor.set(0.5);
    this.button2.addChild(this.text2);
}
menu.prototype.destroy = function(){
    this.button.destroy();
    this.goText.destroy();
    this.text.destroy();
    this.button2.destroy();
    this.text2.destroy();
}

function actionOnClick (){
    this.game.state.start('play');
}
    //Callback del otro botón (punto 8)
function click2(){
//this.game.state.start('preloader');
    this.game.state.start('menu');
}
function pausar(){
    this.pause();
}

module.exports = PlayScene;
