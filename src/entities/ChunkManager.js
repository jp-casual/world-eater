const TILE_SIZE = 64;
const CHUNK_SIZE = 8;
const CHUNK_PIXEL_SIZE = TILE_SIZE * CHUNK_SIZE;
const CHUNK_RADIUS = 2;

function pseudoRandom(x, y, seed = 42) {
    return Math.abs(Math.sin(x * 374761393 + y * 668265263 + seed) % 1);
}

function chunkKey(cx, cy) {
    return `${cx},${cy}`;
}

export default class ChunkManager {
    constructor(scene) {
        this.scene = scene;
        this.loadedChunks = {};
        this.tileSize = TILE_SIZE;
        this.chunkSize = CHUNK_SIZE;
        this.chunkPixelSize = CHUNK_PIXEL_SIZE;
        this.chunkRadius = CHUNK_RADIUS;
    }

    generateChunk(cx, cy) {
        const chunk = { tiles: [] };
        
        for (let tx = 0; tx < this.chunkSize; tx++) {
            for (let ty = 0; ty < this.chunkSize; ty++) {
                const wx = cx * this.chunkSize + tx;
                const wy = cy * this.chunkSize + ty;

                if (pseudoRandom(wx, wy) > 0.7) {
                    const x = wx * this.tileSize + this.tileSize / 2;
                    const y = wy * this.tileSize + this.tileSize / 2;
                    const pellet = this.scene.add.circle(x, y, 12, 0xffffff);
                    chunk.tiles.push(pellet);
                }
            }
        }
        
        return chunk;
    }

    update(playerX, playerY) {
        const playerChunkX = Math.floor(playerX / this.chunkPixelSize);
        const playerChunkY = Math.floor(playerY / this.chunkPixelSize);

        const chunksToKeep = new Set();

        // Load chunks within radius
        for (let dx = -this.chunkRadius; dx <= this.chunkRadius; dx++) {
            for (let dy = -this.chunkRadius; dy <= this.chunkRadius; dy++) {
                const cx = playerChunkX + dx;
                const cy = playerChunkY + dy;
                const key = chunkKey(cx, cy);
                chunksToKeep.add(key);

                if (!this.loadedChunks[key]) {
                    this.loadedChunks[key] = this.generateChunk(cx, cy);
                }
            }
        }

        // Unload distant chunks
        for (const key in this.loadedChunks) {
            if (!chunksToKeep.has(key)) {
                this.loadedChunks[key].tiles.forEach(tile => tile.destroy());
                delete this.loadedChunks[key];
            }
        }
    }

    destroy() {
        for (const key in this.loadedChunks) {
            this.loadedChunks[key].tiles.forEach(tile => tile.destroy());
        }
        this.loadedChunks = {};
    }
}