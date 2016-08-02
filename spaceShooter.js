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

}

function create(){

	game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

	// add arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// create space background
    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    // create ship
    ship = game.add.sprite(game.width/2, game.height/2, 'ship');
    ship.anchor.set(0.5);
    // ship physics 
    game.physics.enable(ship, Phaser.Physics.ARCADE);
    ship.body.drag.set(100);
    ship.body.maxVelocity.set(200);


    //game input
    cursors = game.input.keyboard.createCursorKeys();


}

function update(){

	if(cursors.up.isDown)
	{
		game.physics.arcade.accelerationFromRotation(ship.rotation, 200, ship.body.acceleration);
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

}

function render(){

}