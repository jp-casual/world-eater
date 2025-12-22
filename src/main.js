import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import MenuScene from './scenes/MenuScene.js';

// ...existing code...
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#333',
    scale: {
        mode: Phaser.Scale.FIT,               // Scales to fit container while maintaining aspect ratio
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 960,                           // Internal rendering resolution (controls zoom feel)
        height: 540,                          // 16:9 aspect ratio - Scale.FIT handles upscaling
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
