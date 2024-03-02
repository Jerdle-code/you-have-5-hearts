var sf = 3
var config = {
    type: Phaser.AUTO,
    width: 256*sf,
    height: 240*sf,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 80 * sf },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
var player;
var platforms;
var spikes;
var baddies;
var cursors;
var lives = 5;
var hearts;
var powerups = 1; //Storing as bitmap for no reason other than 8bitness
/* 1 = double jump
2 = jetpack
4 = antigravity
8 = heat shield
16 = laser shield
32 = collision detection
64 = underflow detection
128 = ammo limit
 */
var vel = 40 * sf;
var jump = 80 * sf;
var jumped = 0;
var camera;
var level = 2;
var invuln = false;
function loselife(){
    if (!invuln){
        lives--;
        console.log(lives);
        set_hearts(hearts, lives);
        invuln = true;
        this.time.delayedCall(1000, revuln);
    }
}
function revuln(){
    invuln = false;
}
function set_hearts(hearts, lives){
    this.hearts.clear(true);
    for (let i = 0; i < 5; i++){
        if (i < lives){
            hearts.create(i*20*sf+64, 224*sf, 'heart').setScale(sf).setScrollFactor(0,0).refreshBody();
        } else {
            hearts.create(i*20*sf+64, 224*sf, 'noheart').setScale(sf).setScrollFactor(0,0).refreshBody();
        }
    }
}
function preload() {
    this.load.crossOrigin = "Anonymous";
    this.load.image('bg_hills', './img/Green_Hills.png');
    this.load.image('bg_mountains', './img/Death_Mountain.png');
    this.load.image('bg_space', './img/Space.png');
    this.load.image('bg_cave', './img/Cavern.png');
    this.load.image('bg_lava', './img/Lava.png');
    this.load.image('pf_hills', './img/Green_Hills_Platform.png');
    this.load.image('pf_mountains', './img/Death_Mountain_Platform.png');
    this.load.image('pf_space', './img/Space_Platform.png');
    this.load.image('pf_cave', './img/Cavern_Platform.png');
    this.load.image('pf_lava', './img/Lava_Platform.png');
    this.load.image('player', './img/Player.png');
    this.load.image('spikes', './img/Spikes.png');
    this.load.image('heart', './img/Heart.png');
    this.load.image('noheart', './img/Heart_empty.png');
    this.load.image('baddie', './img/Baddie.png');
}
function level_1(){
    this.add.image(512*sf,120*sf,'bg_hills').setScale(sf);
    platforms.create(512*sf, 224*sf, 'pf_hills').setScale(sf*128, sf*4).refreshBody();
    platforms.create(64*sf, 176*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(128*sf, 144*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 112*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(224*sf, 96*sf, 'pf_hills').setScale(sf*2, sf).refreshBody();
    platforms.create(320*sf, 96*sf, 'pf_hills').setScale(sf*2, sf).refreshBody();
    platforms.create(400*sf, 64*sf, 'pf_hills').setScale(sf*8, sf).refreshBody();
    platforms.create(528*sf, 64*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(624*sf, 64*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(720*sf, 64*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(816*sf, 64*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(912*sf, 64*sf, 'pf_hills').setScale(sf*4, sf).refreshBody();
    platforms.create(1024*sf, 32*sf, 'pf_hills').setScale(sf*8, sf).refreshBody();
    this.physics.world.setBounds(0, 0, 256*sf*4, 240*sf);
    camera.setBounds(0, 0, 256*sf*4, 240*sf);
    camera.startFollow(player, true, 0.05, 0, -80*sf, 0*sf);
    for (let i = 40; i < 50; i++) {
        spikes.create(i*16*sf, 200*sf, 'spikes').setScale(sf).refreshBody();
    }
    for (let i = 0; i < 5; i++) {
        baddies.create(Phaser.Math.Between(64, 960)*sf, 0, 'baddie').setScale(sf).setBounce(0.5).setCollideWorldBounds(true).setVelocity(Phaser.Math.Between(-50*sf, 50*sf)).refreshBody();
    }
}
function level_2(){
    this.add.image(128*sf,480*sf,'bg_mountains').setScale(sf);
    platforms.create(128*sf, 944*sf, 'pf_mountains').setScale(sf*32, sf*4).refreshBody();
    platforms.create(32*sf, 896*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(48*sf, 832*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 800*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(64*sf, 784*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(176*sf, 752*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(184*sf, 720*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 688*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(128*sf, 656*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 600*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 536*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(160*sf, 480*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(128*sf, 420*sf, 'pf_mountains').setScale(sf*4, sf).refreshBody();
    platforms.create(64*sf, 360*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(192*sf, 360*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(80*sf, 288*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(176*sf, 288*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(96*sf, 216*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(160*sf, 216*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(112*sf, 144*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(144*sf, 144*sf, 'pf_mountains').setScale(sf, sf).refreshBody();
    platforms.create(128*sf, 64*sf, 'pf_mountains').setScale(sf*2, sf).refreshBody();
    this.physics.world.setBounds(0, 0, 256*sf, 240*sf*4);
    camera.setBounds(0, 0, 256*sf, 240*sf*4);
    camera.startFollow(player, true, 0, 0.05, -80*sf, 0*sf);
    for (let i = 0; i < 5; i++) {
        baddies.create(Phaser.Math.Between(64, 192)*sf, 920*sf, 'baddie').setScale(sf).setBounce(0.5).setCollideWorldBounds(true).setVelocity(Phaser.Math.Between(-50*sf, 50*sf)).refreshBody();
    }
}
function create (){
    platforms = this.physics.add.staticGroup();
    camera = this.cameras.main;
    cursors = this.input.keyboard.createCursorKeys();
    spikes = this.physics.add.staticGroup();
    hearts = this.physics.add.staticGroup();
    baddies = this.physics.add.group();

    switch (level){
        case 1:
            player = this.physics.add.sprite(16*sf,192*sf,'player').setScale(sf).setBounce(0.2).setCollideWorldBounds(true).setDepth(1);
            level_1.call(this);
            break;
        case 2:
            player = this.physics.add.sprite(16*sf,920*sf,'player').setScale(sf).setBounce(0.2).setCollideWorldBounds(true).setDepth(1);
            level_2.call(this);
            break;
    }
    set_hearts(hearts, lives);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(baddies, platforms);
    this.physics.add.collider(baddies, baddies);
    this.physics.add.collider(player, baddies, loselife, null, this);
}
function update(){
    if (cursors.left.isDown)
    {
        player.setVelocityX(-vel);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(vel);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown &&
        Phaser.Input.Keyboard.JustDown(cursors.up) &&
        (player.body.touching.down || ((powerups & 1) && ((powerups & 2) || (jumped < 2))))) //Ugly hack
    {
        player.setVelocityY(-jump);
        jumped++;
    }
    if (player.body.touching.down)
    {
        jumped = 0;
    }
}