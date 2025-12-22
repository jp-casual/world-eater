import Player from '../entities/Player.js';
import ChunkManager from '../entities/ChunkManager.js';
import inputManager from '../entities/InputManager.js';
import NarrativeEngine from '../systems/NarrativeEngine.js';





export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.narrativeReady = false;
    }

    create() {
        // Setup input
        this.inputManager = new inputManager(this);

        // Setup world
        this.chunkManager = new ChunkManager(this);
        
        // Setup player
        this.player = new Player(this, 0, 0);
        this.cameras.main.startFollow(this.player);
        
        // Note: Camera zoom removed - Scale.FIT mode in main.js handles all scaling
        // Adjust scale.width/height in main.js to control how zoomed in the game feels

        // Initialize narrative system asynchronously
        this.narrative = new NarrativeEngine(this);
        this.narrative.init().then(() => {
            this.narrativeReady = true;
            console.log('Narrative system ready');
            
            // Trigger game start event - narrative system decides what to show
            this.narrative.triggerEvent('game_start');
        }).catch(err => {
            console.error('Failed to initialize narrative system:', err);
        });

        // Example: Setup interactable objects once in create()
        // this.setupInteractables();
    }

    // setupInteractables() {
    //     // Create a sign or interactable object
    //     this.sign = this.add.rectangle(100, 100, 32, 32, 0xff0000);
    //     this.physics.add.existing(this.sign);
    //     
    //     // Add interaction logic
    //     this.physics.add.overlap(this.player, this.sign, () => {
    //         if (this.narrativeReady && this.inputManager.isActionPressed()) {
    //             this.narrative.showStory('world/signs', 'ancient_rune');
    //         }
    //     });
    // }

    update() {
        // Update input state
        this.inputManager.update();

        // Update game objects with input
        this.player.update(this.inputManager);
        this.chunkManager.update(this.player.x, this.player.y);

        // Update dialogue UI to follow player
        if (this.narrative && this.narrative.ui) {
            this.narrative.ui.update();
        }

        // Debug info
        console.log("Player:", this.player.x, this.player.y, "Camera:", this.cameras.main.scrollX, this.cameras.main.scrollY);
    }

    shutdown() {
        this.chunkManager.destroy();
    }
}
