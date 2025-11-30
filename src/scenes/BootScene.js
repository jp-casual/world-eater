import createPlayerAnimations from '../animations/playerAnimations.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Player atlases
    this.load.atlas(
      'player_move',
      'assets/sprites/player/move/player_move.png',
      'assets/sprites/player/move/player_move.json'
    );

    //this.load.atlas(
    //  'player_combat',
    //  'assets/sprites/player/combat/player_combat.png',
    //  'assets/sprites/player/combat/player_combat.json'
    //);

    //this.load.atlas(
    //  'player_interact',
    //  'assets/sprites/player/interact/player_interact.png',
    //  'assets/sprites/player/interact/player_interact.json'
    //);

    // Example: tiles, UI, etc. could also load here
  }

  create() {
    createPlayerAnimations(this);

    // Go to main menu
    this.scene.start('MenuScene');
  }
}
