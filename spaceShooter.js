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

function create(){
	// add arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;


	////// create space background //////
    game.add.tileSprite(0, 0, game.width, game.height, 'space');



    ////// create ship //////
    ship = game.add.sprite(game.width/2, game.height/2, 'ship');
    ship.anchor.set(0.5);
    // ship physics 
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.drag.set(100);
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
    weapon.trackSprite(ship, 0,0, true);



    ////// create aliens //////
    aliens = game.add.group();
    aliens.enableBody = true;  
    game.physics.enable(aliens, Phaser.Physics.ARCADE);

    for (var i=0; i<50; i++)
    {
    	var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
    	s.name = 'alien' + s;
    	s.body.collideWorldBounds = true;
    	s.body.bounce.setTo(0.5, 0.5);
    	s.body.velocity.setTo(20 + Math.random() * 40, 20 + Math.random() * 40);
    }    

    /////// game input //////
    cursors = game.input.keyboard.createCursorKeys();
    //space bar too shoot
    fireButton = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);


    ////// create score counter //////
    scoreText = game.add.text(32, 550, 'score: 0', {font: "20px Arial", fill: "#ffffff", align: "left"});

}

function update(){	

	//ship collides with aliens
	game.physics.arcade.collide(aliens, ship);
	//bullet kills aliens	
	game.physics.arcade.collide(aliens, weapon.bullets, collisionHandler, null, this);

	ship.body.collideWorldBounds = true;
    ship.body.bounce.setTo(0.9, 0.9);

	///// ship navigation ///////
	if(cursors.up.isDown)
	{
		game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
	}
	else if(cursors.down.isDown){
		game.physics.arcade.accelerationFromRotation(ship.rotation, -100, ship.body.acceleration);
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

    if(fireButton.isDown)
    {
    	weapon.fire();
    }
}

function render(){
	game.debug.body(aliens);
	game.debug.body(weapon);
}

function collisionHandler (obj1, obj2){
	console.log('collision handler');
	obj1.kill();
	obj2.kill();
}