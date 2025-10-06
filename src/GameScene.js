import Phaser from 'phaser';

// Chunk/tile configuration
const TILE_SIZE = 64;           // Size of one tile in pixels
const CHUNK_SIZE = 8;           // Number of tiles per chunk (chunk is 8x8 tiles)
const CHUNK_PIXEL_SIZE = TILE_SIZE * CHUNK_SIZE; //Size of chunk in pixels
const CHUNK_RADIUS = 2;         // How many chunks in each direction to keep loaded

// Deterministic pseudo-random function for procedural generation
function pseudoRandom(x, y, seed = 42) {
    return Math.abs(Math.sin(x * 374761393 + y * 668265263 + seed) % 1);
}

// Utility for generating a unique key for chunk coordinates
function chunkKey(cx, cy) {
    return `${cx},${cy}`;
}

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.loadedChunks = {}; // Tracks currently loaded chunks
    }

    preload() {
        // Load assets here, e.g.:
        // this.load.image('player', 'assets/player.png');
    }

    create() {
        // Example: Add a player sprite in the center
        this.player = this.add.rectangle(0, 0, 32, 32, 0xffff00);
        this.physics.add.existing(this.player);
        this.cameras.main.startFollow(this.player);
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Update chunks
        this.updateChunks();
        // Basic player movement
        if (!this.player) return;
        const speed = 200;
        if (this.cursors.left.isDown) this.player.x -= speed * this.game.loop.delta / 1000;
        if (this.cursors.right.isDown) this.player.x += speed * this.game.loop.delta / 1000;
        if (this.cursors.up.isDown) this.player.y -= speed * this.game.loop.delta / 1000;
        if (this.cursors.down.isDown) this.player.y += speed * this.game.loop.delta / 1000;
        console.log("Player:", this.player.x, this.player.y, "Camera:", this.cameras.main.scrollX, this.cameras.main.scrollY);
    }

    //Generates a chunk at the given chunk coordinates, adds pellets, and returns the chunk object
    generateChunk(cx, cy) {
        //Object to hold references to chunk sprites/entities
        const chunk = {tiles: [] };
        for (let tx = 0; tx < CHUNK_SIZE; tx++) {
            for (let ty = 0; ty < CHUNK_SIZE; ty++) {
                //world position of this tile
                const wx = cx * CHUNK_SIZE + tx;
                const wy = cy * CHUNK_SIZE + ty;

                //Deterministic placement: only place a pellet if seeded random > threshold
                if (pseudoRandom(wx, wy) > 0.7) {
                    const x = wx * TILE_SIZE + TILE_SIZE / 2;
                    const y = wy * TILE_SIZE + TILE_SIZE / 2;
                    const pellet = this.add.circle(x, y, 12, 0xffffff);
                    chunk.tiles.push(pellet);
                }
            }
        }
        return chunk;
    }

    // Loads chunks around the player and unloads chunks that are too far away
    updateChunks() {
        const playerX = this.player.x;
        const playerY = this.player.y;

        const playerChunkX = Math.floor(playerX / CHUNK_PIXEL_SIZE);
        const playerChunkY = Math.floor(playerY / CHUNK_PIXEL_SIZE);

        const chunksToKeep = new Set();

        // Load/generate all chunks within CHUNK_RADIUS
        for (let dx = -CHUNK_RADIUS; dx <= CHUNK_RADIUS; dx++) {
            for (let dy = -CHUNK_RADIUS; dy <= CHUNK_RADIUS; dy++) {
                const cx = playerChunkX + dx;
                const cy = playerChunkY + dy;
                const key = chunkKey(cx, cy);
                chunksToKeep.add(key);

                if (!this.loadedChunks[key]) {
                    this.loadedChunks[key] = this.generateChunk(cx, cy);
                }
            }
        }

        // Unload chunks outside the radius
        for (const key in this.loadedChunks) {
            if (!chunksToKeep.has(key)) {
                this.loadedChunks[key].tiles.forEach(tile => tile.destroy());
            }
        }
    }
}
