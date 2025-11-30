export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_move', 'walk_down_01');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.speed = 200;
  }

  update(cursors) {
    const velocity = { x: 0, y: 0 };
    const speed = this.speed;

    if (cursors.left.isDown) velocity.x = -speed;
    else if (cursors.right.isDown) velocity.x = speed;
    if (cursors.up.isDown) velocity.y = -speed;
    else if (cursors.down.isDown) velocity.y = speed;

    this.setVelocity(velocity.x, velocity.y);

    // Choose animation
    if (velocity.x !== 0 || velocity.y !== 0) {
      if (velocity.y > 0) this.anims.play('walk_down', true);
      else if (velocity.y < 0) this.anims.play('walk_up', true);
      else if (velocity.x > 0) this.anims.play('walk_right', true);
      else if (velocity.x < 0) this.anims.play('walk_left', true);
    } else {
      this.anims.stop()
      this.setFrame('walk_down_01');
    }
  }
}

