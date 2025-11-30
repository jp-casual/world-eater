import Player from '../entities/Player.js';
import ChunkManager from '../entities/ChunkManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Setup world
        this.chunkManager = new ChunkManager(this);
        
        // Setup player
        this.player = new Player(this, 0, 0);
        this.cameras.main.startFollow(this.player);
        
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        this.player.update(this.cursors);
        this.chunkManager.update(this.player.x, this.player.y);

        // Debug info
        console.log("Player:", this.player.x, this.player.y, "Camera:", this.cameras.main.scrollX, this.cameras.main.scrollY);
    }

    shutdown() {
        this.chunkManager.destroy();
    }
}
