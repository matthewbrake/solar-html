
/**
 * @fileoverview map-renderer.js
 * This file contains the client-side JavaScript logic for rendering solar data overlays
 * on a Google Map, following the static site blueprint. It uses the geotiff.js library
 * to parse and visualize data from the Google Solar API.
 */

// --- Custom Canvas Overlay Definition ---

/**
 * A custom Google Maps overlay for drawing a canvas element.
 */
class CanvasOverlay extends google.maps.OverlayView {
    constructor(canvas, bounds) {
        super();
        this.canvas = canvas;
        this.bounds = bounds;
        this.div = null;
    }

    onAdd() {
        this.div = document.createElement('div');
        this.div.style.borderStyle = 'none';
        this.div.style.borderWidth = '0px';
        this.div.style.position = 'absolute';
        this.div.appendChild(this.canvas);

        const panes = this.getPanes();
        panes.overlayLayer.appendChild(this.div);
    }

    draw() {
        const overlayProjection = this.getProjection();
        if (!overlayProjection || !this.div) return;

        const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
        const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

        if (sw && ne) {
            this.div.style.left = `${sw.x}px`;
            this.div.style.top = `${ne.y}px`;
            this.div.style.width = `${ne.x - sw.x}px`;
            this.div.style.height = `${sw.y - ne.y}px`;
        }
    }

    onRemove() {
        if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }
}


// --- Main Rendering Pipeline ---

/**
 * Fetches, parses, and renders the solar data overlays onto the map.
 * @param {google.maps.Map} map The Google Map instance.
 * @param {object} visualizationData The 'visualization' object from the Solar API.
 * @param {string} apiKey Your Google Maps API Key.
 */
async function renderSolarOverlay(map, visualizationData, apiKey) {
    if (!visualizationData || !visualizationData.annualFluxUrl || !visualizationData.maskUrl) {
        console.error("Visualization data is incomplete. Cannot render overlay.");
        return;
    }

    console.log("Starting GeoTIFF rendering pipeline...");

    try {
        // 1. Fetch and parse both the flux (heatmap) and mask GeoTIFFs
        const [fluxTiff, maskTiff] = await Promise.all([
            GeoTIFF.fromUrl(`${visualizationData.annualFluxUrl}&key=${apiKey}`),
            GeoTIFF.fromUrl(`${visualizationData.maskUrl}&key=${apiKey}`)
        ]);

        const fluxImage = await fluxTiff.getImage();
        const maskImage = await maskTiff.getImage();

        const fluxData = await fluxImage.readRasters();
        const maskData = await maskImage.readRasters();

        const width = fluxImage.getWidth();
        const height = fluxImage.getHeight();

        // 2. Create a canvas and render the heatmap
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('Could not create canvas context.');
        }

        const imageData = ctx.createImageData(width, height);
        const palette = createPalette(ANNUAL_FLUX_PALETTE);
        const fluxRaster = fluxData[0]; // Single band for flux
        const maskRaster = maskData[0]; // Single band for mask

        // 3. Render the heatmap and apply the roof mask simultaneously
        for (let i = 0; i < fluxRaster.length; i++) {
            // If the mask value is 0, this pixel is not part of the building. Make it transparent.
            if (maskRaster[i] === 0) {
                imageData.data[i * 4 + 3] = 0; // Alpha (transparency)
                continue;
            }

            const value = fluxRaster[i];
            const normalized = normalize(value, 1800, 0); // Using standard min/max for annual flux
            const colorIndex = Math.floor(normalized * (palette.length - 1));
            const color = palette[colorIndex];

            imageData.data[i * 4] = color.r;     // Red
            imageData.data[i * 4 + 1] = color.g; // Green
            imageData.data[i * 4 + 2] = color.b; // Blue
            imageData.data[i * 4 + 3] = 200;     // Alpha (opacity)
        }

        ctx.putImageData(imageData, 0, 0);
        console.log("Canvas rendering complete.");

        // 4. Create the map overlay
        const { sw, ne } = visualizationData.boundingBox;
        const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(sw.latitude, sw.longitude),
            new google.maps.LatLng(ne.latitude, ne.longitude)
        );

        const overlay = new CanvasOverlay(canvas, bounds);
        overlay.setMap(map);

        console.log("Solar overlay added to map.");

    } catch (error) {
        console.error("Error during GeoTIFF rendering:", error);
        alert("An error occurred while rendering the solar data. Please check the console for details.");
    }
}


// --- Color and Math Helper Functions ---

const ANNUAL_FLUX_PALETTE = ['#000000', '#FFBF42', '#FFFFFF']; // Simplified for demonstration

function createPalette(hexColors) {
    const rgb = hexColors.map(hexToRgb);
    const size = 256;
    const step = (rgb.length - 1) / (size - 1);
    return Array(size).fill(0).map((_, i) => {
        const index = i * step;
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        return {
            r: lerp(rgb[lower].r, rgb[upper].r, index - lower),
            g: lerp(rgb[lower].g, rgb[upper].g, index - lower),
            b: lerp(rgb[lower].b, rgb[upper].b, index - lower),
        };
    });
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 };
}

function normalize(value, max, min) {
    if (max === min) return 1;
    const result = (value - min) / (max - min);
    return Math.max(0, Math.min(1, result));
}

function lerp(x, y, t) {
    return x + t * (y - x);
}
