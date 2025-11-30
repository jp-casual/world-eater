import Player from '../entities/Player.js';
import ChunkManager from '../entities/ChunkManager.js';
import inputManager from '../entities/InputManager.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Setup input
        this.inputManager = new inputManager(this);

        // Setup world
        this.chunkManager = new ChunkManager(this);
        
        // Setup player
        this.player = new Player(this, 0, 0);
        this.cameras.main.startFollow(this.player);
    }

    update() {
        // Update input state
        this.inputManager.update();

        // Update game objects with input
        this.player.update(this.inputManager);
        this.chunkManager.update(this.player.x, this.player.y);

        // Debug info
        console.log("Player:", this.player.x, this.player.y, "Camera:", this.cameras.main.scrollX, this.cameras.main.scrollY);
    }

    shutdown() {
        this.chunkManager.destroy();
    }
}
