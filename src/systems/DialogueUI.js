export default class DialogueUI {
    constructor(scene) {
        this.scene = scene;
        this.thoughtBubble = null;
        this.thoughtText = null;
    }

    showThought(text) {
        // Clean up any existing thought bubble
        this.hide();

        const player = this.scene.player;
        
        // Create thought bubble background (rectangle for now)
        this.thoughtBubble = this.scene.add.rectangle(
            player.x, 
            player.y - 60,  // Position above player
            200, 
            60, 
            0x000000, 
            0.8
        );
        this.thoughtBubble.setStrokeStyle(2, 0xffffff);
        
        // Create thought text
        this.thoughtText = this.scene.add.text(
            player.x, 
            player.y - 60, 
            text.trim(), 
            {
                fontSize: '14px',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 180 }
            }
        );
        this.thoughtText.setOrigin(0.5);
        
        // Make thought bubble follow player
        this.thoughtBubble.setScrollFactor(1);
        this.thoughtText.setScrollFactor(1);
        
        // Auto-hide after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            this.hide();
        });
    }

    hide() {
        if (this.thoughtBubble) {
            this.thoughtBubble.destroy();
            this.thoughtBubble = null;
        }
        if (this.thoughtText) {
            this.thoughtText.destroy();
            this.thoughtText = null;
        }
    }

    update() {
        // Update bubble position to follow player
        if (this.thoughtBubble && this.scene.player) {
            this.thoughtBubble.x = this.scene.player.x;
            this.thoughtBubble.y = this.scene.player.y - 60;
            this.thoughtText.x = this.scene.player.x;
            this.thoughtText.y = this.scene.player.y - 60;
        }
    }
}