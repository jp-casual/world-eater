export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_move', 'walk_down_01');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.speed = 200;
  }

  update(inputManager) {
    const movement = inputManager.getMovementVector();
    const angle = inputManager.getMovementAngle();

    // Apply velocity
    this.setVelocity(movement.x * this.speed, movement.y * this.speed);

    // Handle animation
    if (angle !== null) {
      const direction = this.getDirection(angle);
      this.anims.play(`walk_${direction}`, true);
    } else {
      this.anims.stop();
      this.setFrame('walk_down_01');
    }
  }

  getDirection(angle) {
    // Convert radians to degrees and normalize to 0-360
    let degrees = (angle * 180 / Math.PI + 360) % 360;
    
    // 8-directional movement zones (45° each)
    if (degrees >= 337.5 || degrees < 22.5) return 'right';
    if (degrees >= 22.5 && degrees < 67.5) return 'down_right';
    if (degrees >= 67.5 && degrees < 112.5) return 'down';
    if (degrees >= 112.5 && degrees < 157.5) return 'down_left';
    if (degrees >= 157.5 && degrees < 202.5) return 'left';
    if (degrees >= 202.5 && degrees < 247.5) return 'up_left';
    if (degrees >= 247.5 && degrees < 292.5) return 'up';
    if (degrees >= 292.5 && degrees < 337.5) return 'up_right';
    
    return 'down'; // fallback
  }
}
