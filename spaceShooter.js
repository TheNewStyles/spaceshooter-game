var game = new Phaser.Game(500	, 400, Phaser.CANVAS, 'spaceShooter', { 
	preload: preload, create: create, update: update, render: render });


function preload(){
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignhorizontally = true;
	game.scale.pageAlignVertically = true;

	// add space background 
	game.load.image('space', 'SpaceBackground.png');
	// add ship spritsheet
	game.load.spritesheet('ship', 'humstar.png', 32, 32);
	// add space alien
	game.load.spritesheet('baddie', 'alien.png');
	// add bullets
	game.load.image('bullet', 'shmup-bullet.png');
}

var ship;
var weapon;
var aliens;
var score = 0;
var scoreText;
var lives = 3;
var livesText;
var clickText;
var timeLeftCounterSeconds = 60;
var clicked = false;
var textStyle = {font: "14px Arial", fill: "#ffffff", align: "left"};
var textStyleIntro = {font: "40px Arial", fill: "#ffffff", align: "center"};
var timerTextStyle = {font: "16px Arial", fill: "#ffffff", align: "left"};

function create(){
	// add arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;


	////// create space background //////
    game.add.tileSprite(0, 0, game.width, game.height, 'space');



    ////// create ship //////
    ship = game.add.sprite(50, game.height/2, 'ship');
    ship.anchor.set(0.5);
    // ship physics 
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.drag.set(150);
    ship.body.maxVelocity.set(175);


    ////// create bullets //////
    weapon = game.add.weapon(30, 'bullet');
    weapon.enableBody = true;
   	game.physics.enable(weapon, Phaser.Physics.ARCADE);      
    //kill bullet on bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;     
    //bullet speed
    weapon.bulletSpeed = 600;
    //bullet fire rate
    weapon.fireRate = 100;
    //bullet track ship
    weapon.trackSprite(ship,0, 0, true);
    


    ////// create aliens //////
    aliens = game.add.group();
    aliens.enableBody = true;  
    game.physics.enable(aliens, Phaser.Physics.ARCADE);


    /////// game input //////
    cursors = game.input.keyboard.createCursorKeys();
    //space bar too shoot
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    // add enter button
    enterButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    ////// create score counter //////
    scoreText = game.add.text(20, 20, 'score: 0', textStyle);
    livesText = game.add.text(430, 20, 'lives: 3', textStyle);   
    introText = game.add.text(130, 150, '- click to start -', textStyleIntro);
    ////// timer //////
    timerText = game.add.text(game.width/2-15, 380, 'Time: 60', timerTextStyle);    
   
}

function update(){		

	//if game input is down start game
    if(enterButton.isDown || game.input.activePointer.leftButton.isDown){
    	startGame();
    }

    outOfTime();

	//ship collides with aliens
	game.physics.arcade.collide(aliens, ship, hitShip, null, this);
	//bullet kills aliens	
	game.physics.arcade.collide(aliens, weapon.bullets, hitAlien, null, this);

	ship.body.collideWorldBounds = true;
    ship.body.bounce.setTo(0.9, 0.9);

	///// ship navigation ///////
	if(cursors.up.isDown)
	{
		game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
	}
	else if(cursors.down.isDown){
		game.physics.arcade.accelerationFromRotation(ship.rotation, -50, ship.body.acceleration);
	}
	else
	{
		ship.body.acceleration.set(0);
	}

	if (cursors.left.isDown)
    {
        ship.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        ship.body.angularVelocity = 300;
    }
    else
    {
        ship.body.angularVelocity = 0;
    } 

    ///// fire on space bar/////
    if(fireButton.isDown)
    {
    	weapon.fire();
    }
}

function render(){			
	// game.debug.body(aliens);
    // game.debug.body(weapon);
}

function hitAlien (obj1, obj2){ 	
	score += 10;
	scoreText.text = 'score: ' + score;

	if(score === 500){
		alert('You Won!');
	}

	obj1.kill();
	obj2.kill();
}

function hitShip (obj1, obj2){
	lives -= 1;
	livesText.text = 'lives: ' + lives;

	if(lives === 0){
		alert('You are dead!')
	}
}

function startGame(){

	if(clicked === false){
		introText.visible = false;
		createAliens();	
		game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);		
		clicked = true;	
	}
}

function updateTimer() {    
	timeLeftCounterSeconds--;
	timerText.text = 'Time: ' + timeLeftCounterSeconds;
}

function outOfTime(){

	if(timeLeftCounterSeconds === 0)
	{
		alert('You ran out of time!');		
	}	
}

function createAliens(){
	for (var i=0; i<50; i++)
    {
    	var s = aliens.create(game.world.randomX + 200, game.world.randomY, 'baddie');
    	s.name = 'alien' + s;
    	s.body.collideWorldBounds = true;
    	s.body.bounce.setTo(0.5, 0.5);
    	s.body.velocity.setTo(20 + Math.random() * 40, 20 + Math.random() * 40);
    }    
}