var gameScene = new Phaser.Scene("game");
var titleScene = new Phaser.Scene("title");
var sf = 3
var gravity = 1;
var config = {
    type: Phaser.AUTO,
    width: 256*sf,
    height: 240*sf,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 80 * sf * gravity},
            debug: false
        }
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
var powerups = 0; //Storing as bitmap for no reason other than 8bitness
/* 1 = double jump
2 = jetpack
4 = antigravity
8 = heat shield
16 = laser shield
32 = collision detection
64 = underflow detection
128 = ammo limit
 */
var jetpacks = 10;
var antigrav = 5;
var ammo = 25;
var vel = 40 * sf;
var jump = 80 * sf;
var jumped = 0;
var camera;
var level = 1;
var invuln = false;
let Grav;
let Fire;
let Jet;
let jetpack_enabled = false;
function hitBad(object1, object2){
    if (object2.body.touching.up){
        object2.destroy();
    } else {
        loselife.call(this);
    }
}
function reverseGravity(){
    if (antigrav > 0 && powerups & 4){
        console.log(antigrav);
        antigrav--;
        this.physics.world.gravity.y *= -1;
    }
}
function enableJetpack(){
    if (jetpacks > 0 && powerups & 2){
        console.log(jetpacks);
        jetpacks--;
        jetpack_enabled = true;
        this.time.delayedCall(5000, disableJetpack);
    }
}
function disableJetpack(){
    jetpack_enabled = false;
}
function loselife(){
    if (!invuln && lives > 0){
        lives--;
        console.log(lives);
        set_hearts(hearts, lives);
        invuln = true;
        this.time.delayedCall(1000, revuln);
    }
    if (lives <= 0){
        gameOver();
    }
}
function gameOver(){
    console.log("You lose");
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
gameScene.preload = function() {
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
    for (let i = 10; i < 15; i++) {
        spikes.create(i*48*sf, 200*sf, 'spikes').setScale(sf).refreshBody();
    }
    for (let i = 0; i < 5; i++) {
        baddies.create(Phaser.Math.Between(64, 960)*sf, 0, 'baddie').setScale(sf).setBounce(0.75).setCollideWorldBounds(true).setVelocity(Phaser.Math.Between(-50*sf, 50*sf)).refreshBody();
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
        baddies.create(Phaser.Math.Between(64, 192)*sf, 920*sf, 'baddie').setScale(sf).setBounce(0.75).setCollideWorldBounds(true).setVelocity(Phaser.Math.Between(-50*sf, 50*sf)).refreshBody();
    }
}
function level_3(){
    this.add.image(512*sf,480*sf,'bg_space').setScale(sf);
    platforms.create(128*sf, 944*sf, 'pf_space').setScale(sf*32, sf*4).refreshBody();
    platforms.create(32*sf, 896*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(48*sf, 832*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 800*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(64*sf, 784*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(176*sf, 752*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(184*sf, 720*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 688*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(128*sf, 656*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 600*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(192*sf, 536*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(160*sf, 480*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(128*sf, 420*sf, 'pf_space').setScale(sf*4, sf).refreshBody();
    platforms.create(64*sf, 360*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(192*sf, 360*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(80*sf, 288*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(176*sf, 288*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(96*sf, 216*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(160*sf, 216*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(112*sf, 144*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(144*sf, 144*sf, 'pf_space').setScale(sf, sf).refreshBody();
    platforms.create(128*sf, 64*sf, 'pf_space').setScale(sf*2, sf).refreshBody();
    this.physics.world.setBounds(0, 0, 256*sf*4, 240*sf*4);
    camera.setBounds(0, 0, 256*sf*4, 240*sf*4);
    camera.startFollow(player, true, 0.05, 0.05, -80*sf, 0*sf);
}
function level_4(){
    this.add.image(128*sf,480*sf,'bg_space').setScale(sf);
    this.add.image(128*sf,1440*sf,'bg_mountains').setScale(sf);
    this.add.image(128*sf,2040*sf,'bg_hills').setScale(sf);
    this.add.image(128*sf,2280*sf,'bg_cave').setScale(sf);
    platforms.create(256*sf, 2400*sf, 'pf_cave').setScale(sf*4, sf).refreshBody();
    this.physics.world.setBounds(0, 0, 256*sf, 2400*sf);
    camera.setBounds(0, 0, 256*sf, 2400*sf);
    camera.startFollow(player, true, 0.5, 0.5, 0*sf, 0*sf);
}
gameScene.create = function (){
    platforms = this.physics.add.staticGroup();
    camera = this.cameras.main;
    cursors = this.input.keyboard.createCursorKeys();
    spikes = this.physics.add.staticGroup();
    hearts = this.physics.add.staticGroup();
    baddies = this.physics.add.group();
    Grav = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    Fire = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    Jet = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    switch (level){
        case 1:
            player = this.physics.add.sprite(16*sf,192*sf,'player').setScale(sf).setBounce(0.2).setCollideWorldBounds(true).setDepth(1);
            level_1.call(this);
            break;
        case 2:
            player = this.physics.add.sprite(16*sf,920*sf,'player').setScale(sf).setBounce(0.2).setCollideWorldBounds(true).setDepth(1);
            level_2.call(this);
            break;
        case 3:
            player = this.physics.add.sprite(16*sf,920*sf,'player').setScale(sf).setBounce(0.2).setCollideWorldBounds(true).setDepth(1);
            level_3.call(this);
            break;
        case 4:
            player = this.physics.add.sprite(16*sf,16*sf,'player').setScale(sf).setBounce(0.2).setCollideWorldBounds(true).setDepth(1);
            level_4.call(this);
            break;
    }
    set_hearts(hearts, lives);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(baddies, platforms);
    this.physics.add.collider(baddies, baddies);
    this.physics.add.collider(player, baddies, hitBad, null, this);
}
gameScene.update = function(){
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
        player.setVelocityX(player.VelocityX*0.95);
    }

    if (cursors.up.isDown &&
        Phaser.Input.Keyboard.JustDown(cursors.up) &&
        (player.body.touching.down || ((powerups & 1) &&
            (jetpack_enabled || (jumped < 2))))) //Ugly hack
    {
        player.setVelocityY(-jump);
        jumped++;
    }
    if (player.body.touching.down)
    {
        jumped = 0;
    }
    if (Grav.isDown && Phaser.Input.Keyboard.JustDown(Grav))
    {
        reverseGravity.call(this);
    }
    if (Jet.isDown && Phaser.Input.Keyboard.JustDown(Jet))
    {
        enableJetpack.call(this);
    }
}
titleScene.create = function() {
    let title_text = this.add.text(0, 50*sf, 'You Have Five Hearts', { fontFamily: 'Arial', fontSize: 24*sf, color: '#58f898' });
    let main_text = this.add.text(0, 80*sf, ' You are stuck in the machine. \n You cannot die. \n You have five hearts.', { fontFamily: 'Arial', fontSize: 8*sf, color: '#f8d8f8' });
    let button_text = this.add.text(0, 200*sf, 'Click to escape', { fontFamily: 'Arial', fontSize: 30*sf, color: '#008888' });
    button_text.setInteractive({ useHandCursor: true });
    button_text.on('pointerdown', () => this.clickButton());
}
titleScene.clickButton = function (){
    this.scene.switch("game");
}
game.scene.add("title", titleScene);
game.scene.add("game", gameScene);
game.scene.start("title");