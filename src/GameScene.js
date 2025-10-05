import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        // Load assets here, e.g.:
        // this.load.image('player', 'assets/player.png');
    }

    create() {
        // Example: Add a player sprite in the center
        this.player = this.add.rectangle(400, 300, 32, 32, 0xffff00);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Basic player movement
        if (!this.player) return;
        const speed = 200;
        if (this.cursors.left.isDown) this.player.x -= speed * this.game.loop.delta / 1000;
        if (this.cursors.right.isDown) this.player.x += speed * this.game.loop.delta / 1000;
        if (this.cursors.up.isDown) this.player.y -= speed * this.game.loop.delta / 1000;
        if (this.cursors.down.isDown) this.player.y += speed * this.game.loop.delta / 1000;
    }
}
