import BiomeGenerator from './BiomeGenerator.js';
import TerrainGenerator from './TerrainGenerator.js';

/**
 * WorldGenerator orchestrates all procedural generation for the game world.
 * It acts as the central coordinator between different generation systems:
 * - Biomes (climate/ecology regions)
 * - Terrain (specific features within biomes)
 * - Factions (territorial control)
 * - Structures (buildings, dungeons, landmarks)
 * 
 * This class is deterministic - the same seed produces the same world.
 * It separates generation logic from rendering, making it testable and reusable.
 */
export default class WorldGenerator {
    constructor(config = {}) {
        this.seed = config.seed || 42;
        this.worldScale = config.worldScale || 1.0;
        
        // Initialize sub-generators
        this.biomeGenerator = new BiomeGenerator({
            seed: this.seed,
            scale: config.biomeScale || 0.01
        });
        
        this.terrainGenerator = new TerrainGenerator({
            seed: this.seed,
            biomeGenerator: this.biomeGenerator
        });
        
        // Future generators will be added here:
        // this.factionManager = new FactionTerritoryManager(...)
        // this.structureGenerator = new StructureGenerator(...)
    }

    /**
     * Generates all data needed for a chunk at the given coordinates.
     * Returns a data object (not Phaser objects) that ChunkManager can render.
     * 
     * @param {number} cx - Chunk X coordinate
     * @param {number} cy - Chunk Y coordinate
     * @param {number} chunkSize - Number of tiles per chunk side
     * @returns {object} Chunk data with tiles, entities, structures
     */
    generateChunkData(cx, cy, chunkSize) {
        const chunkData = {
            biomes: [],
            tiles: [],
            entities: [],
            structures: []
        };

        // Generate data for each tile in the chunk
        for (let tx = 0; tx < chunkSize; tx++) {
            for (let ty = 0; ty < chunkSize; ty++) {
                const worldX = cx * chunkSize + tx;
                const worldY = cy * chunkSize + ty;

                // Determine biome for this tile
                const biome = this.biomeGenerator.getBiomeAt(worldX, worldY);
                
                // Determine terrain at this location
                const terrain = this.terrainGenerator.generateTerrain(worldX, worldY, biome);
                
                // Generate tile based on biome and terrain
                const tile = this.generateTile(worldX, worldY, biome, terrain);
                
                if (tile) {
                    chunkData.tiles.push({
                        localX: tx,
                        localY: ty,
                        worldX: worldX,
                        worldY: worldY,
                        biome: biome.name,
                        terrain: terrain.type,
                        type: tile.type,
                        color: tile.color,
                        size: tile.size,
                        traversable: terrain.traversable,
                        assetVariant: terrain.assetVariant || null
                    });
                }

                // Track biome presence in chunk for reference
                if (!chunkData.biomes.find(b => b.name === biome.name)) {
                    chunkData.biomes.push(biome);
                }
            }
        }

        // Future: Add structure generation
        // this.generateStructures(chunkData, cx, cy, chunkSize);
        
        // Future: Add entity spawning
        // this.generateEntities(chunkData, cx, cy, chunkSize);

        return chunkData;
    }

    /**
     * Generates a single tile based on world coordinates, biome, and terrain.
     * Uses biome-specific rules to determine if/what appears at this location.
     * 
     * @param {number} wx - World X coordinate
     * @param {number} wy - World Y coordinate
     * @param {object} biome - Biome data from BiomeGenerator
     * @param {object} terrain - Terrain data from TerrainGenerator
     * @returns {object|null} Tile data or null if empty
     */
    generateTile(wx, wy, biome, terrain) {
        // Use biome's density to determine if something spawns here
        const rand = this.pseudoRandom(wx, wy, this.seed);
        
        if (rand > biome.density) {
            return null; // Empty tile
        }

        // Use terrain color if specified, otherwise use biome color
        const tileColor = terrain.color !== null ? terrain.color : 0xffffff;

        // Return tile data (white pellets for traversal indication)
        return {
            type: biome.tileType || 'pellet',
            color: tileColor,
            size: 12
        };
    }

    /**
     * Deterministic pseudo-random function.
     * Same input coordinates always produce the same output.
     */
    pseudoRandom(x, y, seed = 42) {
        return Math.abs(Math.sin(x * 374761393 + y * 668265263 + seed) % 1);
    }

    /**
     * Get the biome at a specific world coordinate.
     * Useful for UI, player info, or external queries.
     */
    getBiomeAt(worldX, worldY) {
        return this.biomeGenerator.getBiomeAt(worldX, worldY);
    }

    /**
     * Optional: Pre-generate or cache world data for a region.
     * Useful for minimaps or pre-calculation.
     */
    preGenerateRegion(minX, minY, maxX, maxY) {
        // Future implementation for bulk generation
    }
}
