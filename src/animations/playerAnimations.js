//export const createPlayerAnimations = (scene) => {
export default function createPlayerAnimations(scene) {
  // Movement animations (from player_move atlas)
//  scene.anims.create({
//    key: 'idle_down',
//    frames: scene.anims.generateFrameNames('player_move', {
//      prefix: 'idle_down_', start: 1, end: 1, zeroPad: 2
//    }),
//    frameRate: 1,
//    repeat: -1
//  });

  scene.anims.create({
    key: 'walk_down',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_down_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'walk_up',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_up_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'walk_left',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_left_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

  scene.anims.create({
    key: 'walk_right',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_right_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });
  
  scene.anims.create({
    key: 'walk_down_left',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_left_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

    scene.anims.create({
    key: 'walk_down_right',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_right_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

    scene.anims.create({
    key: 'walk_up_left',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_up_left_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

    scene.anims.create({
    key: 'walk_up_right',
    frames: scene.anims.generateFrameNames('player_move', {
      prefix: 'walk_up_right_', start: 1, end: 8, zeroPad: 2
    }),
    frameRate: 8,
    repeat: -1
  });

  // Combat example
//  scene.anims.create({
//    key: 'attack_light_right',
//    frames: scene.anims.generateFrameNames('player_combat', {
//      prefix: 'attack_light_right_', start: 1, end: 3, zeroPad: 2
//    }),
//    frameRate: 12,
//    repeat: 0
//  });
};
