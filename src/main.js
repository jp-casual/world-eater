import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import MenuScene from './scenes/MenuScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#333',
    scale: {
        mode: Phaser.Scale.FIT,              // Scales to fit screen while maintaining aspect ratio
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centers the game canvas
        width: 1920,                          // Base/design resolution width
        height: 1080,                         // Base/design resolution height
        min: {
            width: 800,                       // Minimum width
            height: 600                       // Minimum height
        },
        max: {
            width: 2560,                      // Maximum width
            height: 1440                      // Maximum height
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene],
};

const game = new Phaser.Game(config);
