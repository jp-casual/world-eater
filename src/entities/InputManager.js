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
        this.gamepadConnected = false;
        
        // Listen for native gamepad events (more reliable)
        window.addEventListener('gamepadconnected', (e) => {
            console.log('Gamepad connected (native event):', e.gamepad.id);
            this.gamepadConnected = true;
        });
        
        window.addEventListener('gamepaddisconnected', (e) => {
            console.log('Gamepad disconnected:', e.gamepad.id);
            this.gamepadConnected = false;
            this.gamepad = null;
        });
        
        // Also use Phaser's gamepad system
        if (scene.input.gamepad) {
            scene.input.gamepad.once('connected', (pad) => {
                this.gamepad = pad;
                console.log('Phaser gamepad connected:', pad.id);
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
        this.gamepadDebugLogged = false;
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

        // Try to get gamepad using native API
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const nativeGamepad = gamepads[0] || gamepads[1] || gamepads[2] || gamepads[3];
        
        // Debug log every 60 frames (~1 second)
        if (this.debugCounter % 60 === 0 && nativeGamepad) {
            console.log('Native gamepad detected:', {
                id: nativeGamepad.id,
                axes: nativeGamepad.axes,
                buttons: nativeGamepad.buttons.map(b => b.pressed)
            });
        }
        this.debugCounter++;

        // Use native gamepad if available
        if (nativeGamepad) {
            // Axes (left stick: axes[0] = X, axes[1] = Y)
            const axisX = nativeGamepad.axes[0] || 0;
            const axisY = nativeGamepad.axes[1] || 0;
            
            if (Math.abs(axisX) > this.deadzone) {
                if (axisX < 0) this.actions.moveLeft = true;
                if (axisX > 0) this.actions.moveRight = true;
            }
            if (Math.abs(axisY) > this.deadzone) {
                if (axisY < 0) this.actions.moveUp = true;
                if (axisY > 0) this.actions.moveDown = true;
            }

            // D-pad (buttons 12-15 on most controllers)
            if (nativeGamepad.buttons[12] && nativeGamepad.buttons[12].pressed) this.actions.moveUp = true;
            if (nativeGamepad.buttons[13] && nativeGamepad.buttons[13].pressed) this.actions.moveDown = true;
            if (nativeGamepad.buttons[14] && nativeGamepad.buttons[14].pressed) this.actions.moveLeft = true;
            if (nativeGamepad.buttons[15] && nativeGamepad.buttons[15].pressed) this.actions.moveRight = true;

            // Face buttons (A/B/X/Y - buttons 0-3)
            if (nativeGamepad.buttons[0] && nativeGamepad.buttons[0].pressed) this.actions.attack = true;
            if (nativeGamepad.buttons[1] && nativeGamepad.buttons[1].pressed) this.actions.interact = true;
            if (nativeGamepad.buttons[9] && nativeGamepad.buttons[9].pressed) this.actions.pause = true;
        }

        // Fallback to Phaser gamepad (try to get if not set)
        if (!this.gamepad && this.scene.input.gamepad) {
            const pads = this.scene.input.gamepad.gamepads;
            if (pads.length > 0) {
                this.gamepad = pads[0];
                console.log('Phaser gamepad found:', this.gamepad.id);
            }
        }

        // Use Phaser gamepad as additional input source
        if (this.gamepad) {
            if (this.gamepad.leftStick) {
                if (Math.abs(this.gamepad.leftStick.x) > this.deadzone) {
                    if (this.gamepad.leftStick.x < 0) this.actions.moveLeft = true;
                    if (this.gamepad.leftStick.x > 0) this.actions.moveRight = true;
                }
                if (Math.abs(this.gamepad.leftStick.y) > this.deadzone) {
                    if (this.gamepad.leftStick.y < 0) this.actions.moveUp = true;
                    if (this.gamepad.leftStick.y > 0) this.actions.moveDown = true;
                }
            }

            if (this.gamepad.left) this.actions.moveLeft = true;
            if (this.gamepad.right) this.actions.moveRight = true;
            if (this.gamepad.up) this.actions.moveUp = true;
            if (this.gamepad.down) this.actions.moveDown = true;
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