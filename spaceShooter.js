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
	// add purple ball
	game.load.image('purpleBall', 'purple_ball.png');
	// add enemy ship
	game.load.image('enemyShip', 'enemy-ship.png');
	// add click to start button
	game.load.image('clickToStartImage', 'click-to-start.png');
	// add out of time button 
	game.load.image('outOfTimeImage', 'space-shooter-time.png');
	// add you are dead button
	game.load.image('youAreDeadImage', 'you-are-dead.png');
	// add you won button
	game.load.image('youWonImage', 'you-won.png');
}

var ship;
var weapon;
var aliens;
var score = 0;
var scoreText;
var winScore = 350;
var lives = 3;
var livesText;
var timeLeftCounterSeconds = 60;
var clicked = false;
var textStyle = {font: "14px Arial", fill: "#ffffff", align: "left"};
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
    ship.visible = false;
    // ship physics 
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.drag.set(150);
    ship.body.maxVelocity.set(125);

    ////// create bullets //////
    weapon = game.add.weapon(30, 'bullet');
    weapon.enableBody = true;
   	game.physics.enable(weapon, Phaser.Physics.ARCADE);      
    //kill bullet on bounds
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;     
    //bullet speed
    weapon.bulletSpeed = 300;
    //bullet fire rate
    weapon.fireRate = 200;
    //bullet track ship
    weapon.trackSprite(ship,0, 0, true);
    
    ////// create purple balls //////
    purpleBalls = game.add.group();
    purpleBalls.enableBody = true;
    game.physics.enable(purpleBalls, Phaser.Physics.ARCADE);

    ////// create aliens //////
    aliens = game.add.group();
    aliens.enableBody = true;  
    game.physics.enable(aliens, Phaser.Physics.ARCADE);

    ////// enemy ships //////
    enemies = game.add.group();
    enemies.enableBody = true;
    game.physics.enable(enemies, Phaser.Physics.ARCADE);


    /////// game input //////
    cursors = game.input.keyboard.createCursorKeys();
    //space bar too shoot
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    // add enter button
    enterButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    ////// create score counter //////
    scoreText = game.add.text(20, 20, 'score: 0', textStyle);
    livesText = game.add.text(430, 20, 'lives: 3', textStyle);    
    ////// timer //////
    timerText = game.add.text(game.width/2-15, 380, 'Time: 60', timerTextStyle);  

    ////// out of time button //////
   	clickToStartButton = game.add.button(game.world.centerX - 200, game.world.centerY - 50, 'clickToStartImage', startGame, this);
    clickToStartButton.visible = true;

    ////// out of time button //////
   	outOfTimeButton = game.add.button(game.world.centerX - 200, game.world.centerY - 50, 'outOfTimeImage', restart, this);
    outOfTimeButton.visible = false;

    ////// out of time button //////
   	youAreDeadButton = game.add.button(game.world.centerX - 200, game.world.centerY - 50, 'youAreDeadImage', restart, this);
    youAreDeadButton.visible = false;

    ////// you won button //////
    youWonButton = game.add.button(game.world.centerX - 200, game.world.centerY - 50, 'youWonImage', restart, this);
    youWonButton.visible = false;
}

function update(){		

	//if game input is down start game
    if(enterButton.isDown || game.input.activePointer.leftButton.isDown){
    	startGame();
    }
       
    ballCollision();

	//ship collides with aliens
	game.physics.arcade.collide(aliens, ship, aliensHitShip, null, this);
	//bullet kills on hit aliens	
	game.physics.arcade.collide(weapon.bullets, aliens, bulletsHitAliens, null, this);
	//bullet needs multiple hits to kill enemie ships
	game.physics.arcade.overlap(weapon.bullets, enemies, bulletsHitEnemies, null, this);
	//kill bullets if they hit the balls
	game.physics.arcade.collide(weapon.bullets, purpleBalls, bulletsHitsBalls, null, this);
	//aliens collides with enemy ships
	game.physics.arcade.collide(aliens, enemies, aliensHitEnemies, null, this);
	//enemies collides with ship
	game.physics.arcade.collide(enemies, ship, aliensHitShip, null, this);

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

function showYouWon(){
	youWonButton.visible = true;
	ship.kill();
}

function bulletsHitAliens (obj1, obj2){ 	
	score += 10;
	scoreText.text = 'score: ' + score;

	if(score === winScore){
		showYouWon();
	}

	obj1.kill();
	obj2.kill();
}

function aliensHitShip (obj1, obj2){
	lives -= 1;
	livesText.text = 'lives: ' + lives;

	if(lives === 0){
		youAreDeadButton.visible = true;
		aliens.removeAll();
		ship.kill();
		enemies.removeAll();
		timeLeftCounterSeconds = 0;
	}
}

function startGame(){

	if(clicked === false){		
		clickToStartButton.visible = false;
		ship.visible = true;
		createAliens();	
		createEnemies();
		createPurpleBalls();
		outOfTime();
    	game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);				
		clicked = true;	
	}
}

function updateTimer() {  
	if(timeLeftCounterSeconds > 0)
	{
		timeLeftCounterSeconds--;
		timerText.text = 'Time: ' + timeLeftCounterSeconds;
	}  	
}

function outOfTime(){

	if(timeLeftCounterSeconds === 0)
	{
		outOfTimeButton.visible = true;
		aliens.removeAll();
		enemies.removeAll();		
		ship.kill();
	}	
}

function createAliens(){
	for (var i=0; i<25; i++)
    {
    	var s = aliens.create(game.world.randomX + 200, game.world.randomY, 'baddie');
    	s.name = 'alien' + s;
    	s.body.collideWorldBounds = true;
    	s.body.bounce.setTo(0.8, 0.8);
    	s.body.velocity.setTo(40 + Math.random() * 40, 40 + Math.random() * 40);
    	s.body.gravity.y = -5;    	
    }    
}

function createEnemies(){
	for (var i=0; i<4; i++){
		var s = enemies.create(game.world.randomX + 200, game.world.randomY, 'enemyShip');
		s.name = 'enemie' + s;
		s.body.collideWorldBounds = true;
		s.body.bounce.setTo(0.4, 0.4);		
		s.body.velocity.setTo(30 + Math.random() * 90, 30 + Math.random() * 90);
		s.body.gravity.y = -5;		
	}
}

function createPurpleBalls(){
	var x = 250;
	var y = -8;
	for (var i=0; i<3; i++)
	{		
		y += (100 + i);
		var b = purpleBalls.create(x, y, 'purpleBall');
		b.name = 'purpleBalls' + b;
		b.body.allowGravity = false;
		b.body.immovable = true;
	}
}

function ballCollision(){
	game.physics.arcade.collide(ship,purpleBalls);
	game.physics.arcade.collide(aliens,purpleBalls);
	game.physics.arcade.collide(enemies,purpleBalls);	
}

function bulletsHitsBalls(obj1, obj2){
	obj1.kill();
}

function bulletsHitEnemies(obj1, obj2){	
	
	obj2.maxHealth -= 10;
	obj1.kill();		

	if(obj2.maxHealth === 0){
		obj1.kill();
		obj2.kill();

		score += 25;
		scoreText.text = 'score: ' + score;

		if(score === winScore){
			showYouWon();
		}
	}	
}

function aliensHitEnemies(obj1,obj2){
	obj1.body.bounce.setTo(0.9, 0.9);
	obj2.body.bounce.setTo(0.9, 0.9);
}

function restart(){		
	outOfTimeButton.visible = false;	
	youAreDeadButton.visible = false;
	youWonButton.visible = false;
	ship.revive();	
	ship.x = 50;
	ship.y = game.height/2;
	createAliens();	
	createEnemies();
	createPurpleBalls();
	timeLeftCounterSeconds = 60;
	lives = 3;
	livesText.text = 'lives: ' + lives;
	score = 0;
	scoreText.text = 'score: ' + score;
}


