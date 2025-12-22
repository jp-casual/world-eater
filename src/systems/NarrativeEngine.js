import StoryRegistry from './StoryRegistry.js';
import DialogueUI from './DialogueUI.js';

export default class NarrativeEngine {
    constructor(scene) {
        this.scene = scene;
        this.registry = new StoryRegistry(scene);
        this.ui = new DialogueUI(scene);
        this.currentStory = null;
        this.triggeredEvents = new Set();
        
        // Define story triggers - this is where you map events to stories
        this.storyTriggers = {
            'game_start': {
                delay: 3000,
                storyKey: 'player_thoughts',
                storyPath: '/narrative/player_thoughts.json',
                type: 'thought'
            }
            // Add more triggers here:
            // 'first_enemy_encounter': { ... },
            // 'reach_village': { ... },
        };
    }

    async init() {
        console.log('Narrative engine initialized');
    }

    // Call this from GameScene when game events happen
    triggerEvent(eventName) {
        // Prevent duplicate triggers
        if (this.triggeredEvents.has(eventName)) {
            return;
        }

        const trigger = this.storyTriggers[eventName];
        if (!trigger) {
            return; // No story for this event
        }

        this.triggeredEvents.add(eventName);

        // Handle delayed triggers
        if (trigger.delay) {
            this.scene.time.delayedCall(trigger.delay, () => {
                this._executeStoryTrigger(trigger);
            });
        } else {
            this._executeStoryTrigger(trigger);
        }
    }

    async _executeStoryTrigger(trigger) {
        try {
            const story = await this.registry.loadStory(trigger.storyKey, trigger.storyPath);
            
            if (story.canContinue) {
                const text = story.Continue();
                
                // Route to appropriate UI based on type
                if (trigger.type === 'thought') {
                    this.ui.showThought(text);
                } else if (trigger.type === 'dialogue') {
                    this.ui.showNPCDialogue(text);
                }
            }
        } catch (error) {
            console.error(`Failed to trigger story ${trigger.storyKey}:`, error);
        }
    }

    hide() {
        this.ui.hide();
    }
}