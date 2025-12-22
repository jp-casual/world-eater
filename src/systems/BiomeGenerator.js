/**
 * BiomeGenerator determines which biome exists at any world coordinate.
 * Uses Perlin-like noise or other algorithms to create smooth, natural-looking biome regions.
 * 
 * Biomes can represent:
 * - Climate zones (tundra, desert, forest, ocean)
 * - Dimensional realms (material plane, shadow realm, etc.)
 * - Ecological regions (volcanic, crystalline, corrupted)
 */
export default class BiomeGenerator {
    constructor(config = {}) {
        this.seed = config.seed || 42;
        this.scale = config.scale || 0.01; // How "zoomed in" the biome map is
        this.octaves = config.octaves || 3; // Noise detail levels
        
        // Define your biomes here
        // Thresholds must not overlap and should cover the full -1.0 to 1.0 range
        // Larger threshold range = more common biome
        this.biomes = [
            {
                name: 'plains',
                color: 0x88cc88,
                density: 0.3,
                tileType: 'grass',
                threshold: { min: -1.0, max: -0.3 }  // 35% of world
            },
            {
                name: 'forest',
                color: 0x447744,
                density: 0.7,
                tileType: 'tree',
                threshold: { min: -0.3, max: 0.3 }   // 30% of world
            },
            {
                name: 'desert',
                color: 0xddaa77,
                density: 0.15,
                tileType: 'sand',
                threshold: { min: 0.3, max: 0.6 }    // 15% of world
            },
            {
                name: 'void',
                color: 0x000000,
                density: 0.05,
                tileType: 'void',
                threshold: { min: 0.6, max: 0.8 }    // 10% of world (easier to find!)
            },
            {
                name: 'tundra',
                color: 0xccddee,
                density: 0.2,
                tileType: 'snow',
                threshold: { min: 0.8, max: 1.0 }    // 10% of world
            }
        ];
    }

    /**
     * Returns the biome at a specific world coordinate.
     * Uses 2D noise to create natural-looking regions.
     * 
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {object} Biome data
     */
    getBiomeAt(worldX, worldY) {
        // Generate noise value for this position
        const noiseValue = this.noise2D(worldX * this.scale, worldY * this.scale);
        
        // Map noise value (-1 to 1) to a biome
        for (const biome of this.biomes) {
            if (noiseValue >= biome.threshold.min && noiseValue < biome.threshold.max) {
                return biome;
            }
        }
        
        // Fallback to first biome if no match
        return this.biomes[0];
    }

    /**
     * Simple 2D noise implementation using multiple octaves.
     * For production, consider using a library like simplex-noise or perlin-noise.
     * 
     * Returns value between -1 and 1.
     */
    noise2D(x, y) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;

        // Combine multiple octaves for more natural-looking noise
        for (let i = 0; i < this.octaves; i++) {
            total += this.rawNoise2D(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }

        // Normalize to -1 to 1
        return total / maxValue;
    }

    /**
     * Raw noise function - simple pseudo-random gradient noise.
     * For better results, replace with proper Perlin or Simplex noise.
     */
    rawNoise2D(x, y) {
        // Get integer coordinates
        const xi = Math.floor(x);
        const yi = Math.floor(y);
        
        // Get fractional parts
        const xf = x - xi;
        const yf = y - yi;
        
        // Smooth interpolation curve (Smoothstep)
        const u = this.fade(xf);
        const v = this.fade(yf);
        
        // Hash coordinates to get gradients
        const aa = this.hash(xi, yi);
        const ab = this.hash(xi, yi + 1);
        const ba = this.hash(xi + 1, yi);
        const bb = this.hash(xi + 1, yi + 1);
        
        // Interpolate between gradients
        const x1 = this.lerp(aa, ba, u);
        const x2 = this.lerp(ab, bb, u);
        
        return this.lerp(x1, x2, v);
    }

    /**
     * Smoothstep interpolation (3t² - 2t³)
     */
    fade(t) {
        return t * t * (3 - 2 * t);
    }

    /**
     * Linear interpolation
     */
    lerp(a, b, t) {
        return a + t * (b - a);
    }

    /**
     * Deterministic hash function for coordinates.
     * Same coordinates always produce same value.
     */
    hash(x, y) {
        const h = Math.sin(x * 374761393 + y * 668265263 + this.seed) * 43758.5453;
        return (h - Math.floor(h)) * 2 - 1; // Returns -1 to 1
    }

    /**
     * Add a new biome definition.
     * Useful for dynamic biome creation or modding.
     */
    addBiome(biome) {
        this.biomes.push(biome);
        // Re-sort by threshold for proper mapping
        this.biomes.sort((a, b) => a.threshold.min - b.threshold.min);
    }

    /**
     * Get all defined biomes.
     */
    getAllBiomes() {
        return [...this.biomes];
    }

    /**
     * Optional: Get biome transition blend at a coordinate.
     * Useful for smooth color transitions between biomes.
     */
    getBiomeBlend(worldX, worldY, radius = 5) {
        // Sample nearby positions and blend biomes
        const biomeWeights = new Map();
        
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= radius) {
                    const biome = this.getBiomeAt(worldX + dx, worldY + dy);
                    const weight = 1 - (dist / radius);
                    biomeWeights.set(biome.name, (biomeWeights.get(biome.name) || 0) + weight);
                }
            }
        }
        
        return biomeWeights;
    }
}
