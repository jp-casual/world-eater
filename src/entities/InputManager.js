export default class InputManager {
    constructor(scene) {
        this.scene = scene;
        this.deadzone = 0.2;
        
        // Setup keyboard
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Setup gamepad
        this.gamepad = null;
        if (scene.input.gamepad) {
            scene.input.gamepad.once('connected', (pad) => {
                this.gamepad = pad;
                console.log('Gamepad connected:', pad.id);
            });
        }
        
        // Action state
        this.actions = {
            moveLeft: false,
            moveRight: false,
            moveUp: false,
            moveDown: false,
            attack: false,
            interact: false,
            pause: false
        };
    }

    update() {
        // Reset actions
        for (let key in this.actions) {
            this.actions[key] = false;
        }

        // Keyboard - Arrow keys
        if (this.cursors.left.isDown) this.actions.moveLeft = true;
        if (this.cursors.right.isDown) this.actions.moveRight = true;
        if (this.cursors.up.isDown) this.actions.moveUp = true;
        if (this.cursors.down.isDown) this.actions.moveDown = true;

        // Keyboard - WASD
        if (this.wasd.left.isDown) this.actions.moveLeft = true;
        if (this.wasd.right.isDown) this.actions.moveRight = true;
        if (this.wasd.up.isDown) this.actions.moveUp = true;
        if (this.wasd.down.isDown) this.actions.moveDown = true;

        // Gamepad
        if (!this.gamepad && this.scene.input.gamepad) {
            this.gamepad = this.scene.input.gamepad.getPad(0);
        }

        if (this.gamepad) {
            // Left stick
            if (Math.abs(this.gamepad.leftStick.x) > this.deadzone) {
                if (this.gamepad.leftStick.x < 0) this.actions.moveLeft = true;
                if (this.gamepad.leftStick.x > 0) this.actions.moveRight = true;
            }
            if (Math.abs(this.gamepad.leftStick.y) > this.deadzone) {
                if (this.gamepad.leftStick.y < 0) this.actions.moveUp = true;
                if (this.gamepad.leftStick.y > 0) this.actions.moveDown = true;
            }

            // D-pad
            if (this.gamepad.left) this.actions.moveLeft = true;
            if (this.gamepad.right) this.actions.moveRight = true;
            if (this.gamepad.up) this.actions.moveUp = true;
            if (this.gamepad.down) this.actions.moveDown = true;

            // Buttons
            if (this.gamepad.A) this.actions.attack = true;
            if (this.gamepad.B) this.actions.interact = true;
            if (this.gamepad.buttons[9].pressed) this.actions.pause = true; // Start button
        }

        return this.actions;
    }

    getMovementVector() {
        const vector = { x: 0, y: 0 };
        
        if (this.actions.moveLeft) vector.x -= 1;
        if (this.actions.moveRight) vector.x += 1;
        if (this.actions.moveUp) vector.y -= 1;
        if (this.actions.moveDown) vector.y += 1;

        // Normalize diagonal movement
        if (vector.x !== 0 && vector.y !== 0) {
            const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            vector.x /= magnitude;
            vector.y /= magnitude;
        }

        return vector;
    }

    getMovementAngle() {
        const vector = this.getMovementVector();
        if (vector.x === 0 && vector.y === 0) return null;
        return Math.atan2(vector.y, vector.x);
    }
}