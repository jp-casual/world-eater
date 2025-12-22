import WorldGenerator from '../systems/WorldGenerator.js';

const TILE_SIZE = 64;
const CHUNK_SIZE = 8;
const CHUNK_PIXEL_SIZE = TILE_SIZE * CHUNK_SIZE;
const CHUNK_RADIUS = 2;

function chunkKey(cx, cy) {
    return `${cx},${cy}`;
}

export default class ChunkManager {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.loadedChunks = {};
        this.tileSize = TILE_SIZE;
        this.chunkSize = CHUNK_SIZE;
        this.chunkPixelSize = CHUNK_PIXEL_SIZE;
        this.chunkRadius = CHUNK_RADIUS;
        
        // Initialize world generator
        this.worldGenerator = new WorldGenerator({
            seed: config.seed || 42,
            biomeScale: config.biomeScale || 0.01
        });
    }

    generateChunk(cx, cy) {
        // Get chunk data from world generator (pure data, no Phaser objects)
        const chunkData = this.worldGenerator.generateChunkData(cx, cy, this.chunkSize);
        
        // Determine dominant biome for background color
        const dominantBiome = this.getDominantBiome(chunkData.biomes);
        
        // Create background rectangle for this chunk
        const chunkX = cx * this.chunkPixelSize;
        const chunkY = cy * this.chunkPixelSize;
        const background = this.scene.add.rectangle(
            chunkX + this.chunkPixelSize / 2,
            chunkY + this.chunkPixelSize / 2,
            this.chunkPixelSize,
            this.chunkPixelSize,
            dominantBiome.color
        );
        background.setOrigin(0.5, 0.5);
        background.setDepth(-1); // Behind all tiles
        
        // Render the chunk data as Phaser objects
        const chunk = { 
            background: background,
            tiles: [],
            biomes: chunkData.biomes
        };
        
        // Create visual representations for each tile (white pellets)
        for (const tileData of chunkData.tiles) {
            const x = tileData.worldX * this.tileSize + this.tileSize / 2;
            const y = tileData.worldY * this.tileSize + this.tileSize / 2;
            
            // Create circle based on tile data
            const tile = this.scene.add.circle(x, y, tileData.size, tileData.color);
            
            // Store reference to data for future use (traversability, asset variants, etc.)
            tile.tileData = tileData;
            
            chunk.tiles.push(tile);
        }
        
        return chunk;
    }

    /**
     * Determines the dominant biome in a chunk.
     * For now, uses the first biome. Could be enhanced to count tile frequencies.
     */
    getDominantBiome(biomes) {
        return biomes.length > 0 ? biomes[0] : { color: 0x000000, name: 'void' };
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
                const chunk = this.loadedChunks[key];
                chunk.tiles.forEach(tile => tile.destroy());
                if (chunk.background) chunk.background.destroy();
                delete this.loadedChunks[key];
            }
        }
    }

    destroy() {
        for (const key in this.loadedChunks) {
            const chunk = this.loadedChunks[key];
            chunk.tiles.forEach(tile => tile.destroy());
            if (chunk.background) chunk.background.destroy();
        }
        this.loadedChunks = {};
    }
}