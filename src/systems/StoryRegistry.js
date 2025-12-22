import { Story } from 'inkjs';

export default class StoryRegistry {
    constructor(scene) {
        this.scene = scene;
        this.stories = new Map();
        this.activeStory = null;
    }

    // Load story only when needed
    async loadStory(key, path) {
        if (!this.stories.has(key)) {
            const response = await fetch(path);
            const inkJSON = await response.json();
            const story = new Story(inkJSON);
            this.stories.set(key, story);
        }
        return this.stories.get(key);
    }

    // Unload stories you're done with
    unloadStory(key) {
        this.stories.delete(key);
    }
}