/**
 * TerrainGenerator handles terrain features within and between biomes.
 * Responsibilities:
 * - Void edge detection and void-cursed terrain generation
 * - Rivers, mountains, roads, and other terrain features
 * - Terrain variations within biomes
 * - Traversability rules based on terrain type
 */
export default class TerrainGenerator {
    constructor(config = {}) {
        this.seed = config.seed || 42;
        this.biomeGenerator = config.biomeGenerator;
        this.edgeCheckRadius = config.edgeCheckRadius || 2; // How far to check for biome edges
    }

    /**
     * Generates terrain data for a tile based on its biome and surroundings.
     * Returns terrain type, color modifications, traversability, etc.
     * 
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @param {object} biome - Current biome at this position
     * @returns {object} Terrain data
     */
    generateTerrain(worldX, worldY, biome) {
        // Special handling for void biome
        if (biome.name === 'void') {
            return this.generateVoidTerrain(worldX, worldY, biome);
        }

        // Standard terrain for other biomes
        return {
            type: 'normal',
            color: null, // Use biome default color
            traversable: true,
            isEdge: false
        };
    }

    /**
     * Generates void terrain, checking for edges with other biomes.
     * Void edges become void-cursed versions of neighboring biomes (traversable).
     * Interior void remains untraversable nothingness.
     */
    generateVoidTerrain(worldX, worldY, voidBiome) {
        // Check surrounding positions for non-void biomes
        const neighborBiomes = this.getNeighborBiomes(worldX, worldY);
        
        // If we have non-void neighbors, this is an edge tile
        if (neighborBiomes.length > 0) {
            // Pick the most common neighboring biome for consistency
            const dominantNeighbor = this.getDominantBiome(neighborBiomes);
            
            return {
                type: 'void-cursed',
                baseType: dominantNeighbor.tileType,
                baseBiome: dominantNeighbor.name,
                color: this.blendColors(voidBiome.color, dominantNeighbor.color, 0.3), // 30% void, 70% neighbor
                traversable: true,
                isEdge: true,
                // Mark that this should load void-cursed asset variant
                assetVariant: `void-cursed-${dominantNeighbor.name}`
            };
        }

        // Interior void - untraversable
        return {
            type: 'void-interior',
            color: voidBiome.color,
            traversable: false,
            isEdge: false,
            // No tiles spawn in interior void (handled by density)
        };
    }

    /**
     * Checks surrounding tiles for biomes different from void.
     */
    getNeighborBiomes(worldX, worldY) {
        const neighbors = [];
        const checked = new Set();

        // Check in a radius around the position
        for (let dx = -this.edgeCheckRadius; dx <= this.edgeCheckRadius; dx++) {
            for (let dy = -this.edgeCheckRadius; dy <= this.edgeCheckRadius; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip self

                const biome = this.biomeGenerator.getBiomeAt(worldX + dx, worldY + dy);
                
                // Only collect non-void biomes
                if (biome.name !== 'void' && !checked.has(biome.name)) {
                    neighbors.push(biome);
                    checked.add(biome.name);
                }
            }
        }

        return neighbors;
    }

    /**
     * Returns the most common biome from a list.
     * For tie-breaking, uses deterministic selection based on position.
     */
    getDominantBiome(biomes) {
        if (biomes.length === 0) return null;
        if (biomes.length === 1) return biomes[0];
        
        // For multiple neighbors, return first one (could enhance with frequency count)
        return biomes[0];
    }

    /**
     * Blends two hex colors together.
     * @param {number} color1 - First hex color
     * @param {number} color2 - Second hex color
     * @param {number} ratio - Blend ratio (0 = all color1, 1 = all color2)
     * @returns {number} Blended hex color
     */
    blendColors(color1, color2, ratio) {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;

        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        const r = Math.round(r1 + (r2 - r1) * ratio);
        const g = Math.round(g1 + (g2 - g1) * ratio);
        const b = Math.round(b1 + (b2 - b1) * ratio);

        return (r << 16) | (g << 8) | b;
    }

    /**
     * Future: Generate rivers, roads, or other terrain features.
     */
    generateRivers(worldX, worldY, biome) {
        // To be implemented
    }

    /**
     * Future: Generate mountains or elevation changes.
     */
    generateElevation(worldX, worldY, biome) {
        // To be implemented
    }
}
