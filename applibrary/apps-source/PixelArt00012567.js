// Simplex OS Custom App: Pixel Pad
var simplexOS_AppConfig = {
    name: "Pixel Art",
    icon: '<i class="fa-solid fa-border-all"></i>', // Grid-like icon

    init: function(contentEl, windowId) {
        console.log(`Initializing Pixel Art (Window ID: ${windowId})`);

        // --- App State ---
        let gridWidth = 16;
        let gridHeight = 16;
        let pixelSize = 20; // Initial display size of one grid pixel
        let selectedColor = '#000000';
        let activeTool = 'pencil'; // 'pencil', 'eraser', 'eyedropper'
        let isDrawing = false;
        let showGrid = true;
        const bgColor = '#ffffff'; // Default background

        // --- DOM Elements ---
        const containerId = `pixel-pad-container-${windowId}`;
        const canvasId = `pixel-canvas-${windowId}`;
        const toolbarId = `pixel-toolbar-${windowId}`;
        const colorSwatchId = `color-swatch-${windowId}`;
        const paletteId = `color-palette-${windowId}`;
        const sizeIndicatorId = `size-indicator-${windowId}`;
        const zoomIndicatorId = `zoom-indicator-${windowId}`;
        const canvasContainerId = `canvas-container-${windowId}`;

        // Define App-specific CSS Variables (can be overridden by themes if needed)
        const cssVars = `
            :root {
                --pixel-pad-bg: var(--bg-secondary, #f0f0f0);
                --pixel-pad-canvas-bg: ${bgColor};
                --pixel-pad-toolbar-bg: var(--bg-tertiary, #e0e0e0);
                --pixel-pad-button-bg: var(--bg-secondary, #f0f0f0);
                --pixel-pad-button-hover: var(--border-primary, #ccc);
                --pixel-pad-button-active: var(--accent-primary, #0078d4);
                --pixel-pad-button-active-text: var(--text-secondary, #fff);
                --pixel-pad-border: var(--border-primary, #ccc);
                --pixel-pad-text: var(--text-primary, #222);
                --pixel-pad-grid-color: var(--border-secondary, #ddd);
            }
            body.dark-theme {
                --pixel-pad-bg: var(--bg-secondary-dark, #1e1e1e);
                --pixel-pad-canvas-bg: ${bgColor}; /* Keep canvas background consistent for now */
                --pixel-pad-toolbar-bg: var(--bg-tertiary-dark, #3a3a3a);
                --pixel-pad-button-bg: var(--bg-secondary-dark, #1e1e1e);
                --pixel-pad-button-hover: var(--border-primary-dark, #555);
                --pixel-pad-button-active: var(--accent-primary-dark, #0078d4);
                --pixel-pad-button-active-text: var(--text-secondary-dark, #fff);
                --pixel-pad-border: var(--border-primary-dark, #555);
                --pixel-pad-text: var(--text-primary-dark, #e0e0e0);
                --pixel-pad-grid-color: var(--border-secondary-dark, #444);
            }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = cssVars + `
            /* Pixel Art Specific Styles */
            .pixel-pad-app {
                display: flex;
                flex-direction: column;
                height: 100%;
                background-color: var(--pixel-pad-bg);
                color: var(--pixel-pad-text);
                overflow: hidden; /* Prevent content overflow */
            }
            .pixel-toolbar {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                padding: 5px;
                background-color: var(--pixel-pad-toolbar-bg);
                border-bottom: 1px solid var(--pixel-pad-border);
                gap: 6px;
                flex-shrink: 0;
            }
            .pixel-toolbar button, .pixel-toolbar .toolbar-item {
                background-color: var(--pixel-pad-button-bg);
                color: var(--pixel-pad-text);
                border: 1px solid var(--pixel-pad-border);
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.9em;
                transition: background-color 0.1s ease, border-color 0.1s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-width: 30px;
                gap: 4px;
            }
            .pixel-toolbar button:hover {
                background-color: var(--pixel-pad-button-hover);
            }
            .pixel-toolbar button.active {
                background-color: var(--pixel-pad-button-active);
                border-color: var(--pixel-pad-button-active);
                color: var(--pixel-pad-button-active-text);
            }
            .pixel-toolbar button i { font-size: 1em; margin: 0; }
            .pixel-toolbar .separator {
                width: 1px;
                height: 20px;
                background-color: var(--pixel-pad-border);
                margin: 0 4px;
            }
            .pixel-toolbar .color-swatch {
                width: 24px;
                height: 24px;
                border: 1px solid var(--pixel-pad-border);
                cursor: default;
                padding: 0;
            }
            .pixel-toolbar .palette { display: inline-flex; gap: 2px; }
            .pixel-toolbar .palette-color {
                width: 18px; height: 18px; border: 1px solid var(--pixel-pad-border); cursor: pointer;
                transition: transform 0.1s ease;
            }
            .pixel-toolbar .palette-color:hover { transform: scale(1.1); }
            .pixel-toolbar .toolbar-label { font-size: 0.85em; margin-left: 5px; margin-right: 2px; }
            .pixel-toolbar input[type="checkbox"] { vertical-align: middle; margin-right: 3px; }

            .pixel-canvas-container {
                flex-grow: 1;
                overflow: auto; /* Enable scrollbars for zooming */
                background-color: var(--pixel-pad-bg); /* Match app background */
                display: flex; /* Center canvas */
                justify-content: center;
                align-items: center;
                padding: 10px;
            }
            #${canvasId} {
                display: block;
                background-color: var(--pixel-pad-canvas-bg);
                cursor: crosshair;
                image-rendering: pixelated; /* Ensure crisp pixels */
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
                border: 1px solid var(--pixel-pad-border); /* Optional: border around canvas */
            }
             #${canvasId}.eyedropper-cursor { cursor: crosshair; /* Or specific eyedropper cursor */ }

            #${canvasId}.grid-visible {
                 background-image: linear-gradient(to right, var(--pixel-pad-grid-color) 1px, transparent 1px),
                                   linear-gradient(to bottom, var(--pixel-pad-grid-color) 1px, transparent 1px);
                 background-size: ${pixelSize}px ${pixelSize}px;
            }
        `;
        document.head.appendChild(styleElement);

        // --- HTML Structure ---
        contentEl.style.padding = '0'; // Remove default padding
        contentEl.innerHTML = `
            <div class="pixel-pad-app" id="${containerId}">
                <div class="pixel-toolbar" id="${toolbarId}">
                    <button data-tool="pencil" class="active" title="Pencil"><i class="fa-solid fa-pencil"></i></button>
                    <button data-tool="eraser" title="Eraser"><i class="fa-solid fa-eraser"></i></button>
                    <button data-tool="eyedropper" title="Eyedropper"><i class="fa-solid fa-eye-dropper"></i></button>
                    <div class="separator"></div>
                    <button class="toolbar-item color-swatch" id="${colorSwatchId}" title="Current Color"></button>
                    <div class="palette" id="${paletteId}" title="Color Palette"></div>
                    <div class="separator"></div>
                    <span class="toolbar-label">Size:</span>
                    <span id="${sizeIndicatorId}">${gridWidth}x${gridHeight}</span>
                    <button id="resize-btn-${windowId}" title="Resize Canvas"><i class="fa-solid fa-expand"></i></button>
                    <div class="separator"></div>
                     <span class="toolbar-label">Zoom:</span>
                    <button id="zoom-out-btn-${windowId}" title="Zoom Out"><i class="fa-solid fa-search-minus"></i></button>
                    <span id="${zoomIndicatorId}">${pixelSize}px</span>
                    <button id="zoom-in-btn-${windowId}" title="Zoom In"><i class="fa-solid fa-search-plus"></i></button>
                    <div class="separator"></div>
                    <label class="toolbar-label" title="Show Grid">
                        <input type="checkbox" id="grid-toggle-${windowId}" checked> Grid
                    </label>
                    <div class="separator"></div>
                    <button id="clear-btn-${windowId}" title="Clear Canvas"><i class="fa-solid fa-trash-can"></i></button>
                    <button id="save-btn-${windowId}" title="Save as PNG"><i class="fa-solid fa-save"></i></button>
                </div>
                <div class="pixel-canvas-container" id="${canvasContainerId}">
                    <canvas id="${canvasId}"></canvas>
                </div>
            </div>
        `;

        // --- Get References to Created Elements ---
        const appContainer = contentEl.querySelector(`#${containerId}`);
        const canvas = contentEl.querySelector(`#${canvasId}`);
        const canvasContainer = contentEl.querySelector(`#${canvasContainerId}`);
        const ctx = canvas.getContext('2d', { willReadFrequently: true }); // willReadFrequently for eyedropper
        const toolbar = contentEl.querySelector(`#${toolbarId}`);
        const colorSwatch = contentEl.querySelector(`#${colorSwatchId}`);
        const paletteContainer = contentEl.querySelector(`#${paletteId}`);
        const sizeIndicator = contentEl.querySelector(`#${sizeIndicatorId}`);
        const zoomIndicator = contentEl.querySelector(`#${zoomIndicatorId}`);
        const gridToggle = contentEl.querySelector(`#grid-toggle-${windowId}`);
        const zoomInBtn = contentEl.querySelector(`#zoom-in-btn-${windowId}`);
        const zoomOutBtn = contentEl.querySelector(`#zoom-out-btn-${windowId}`);
        const resizeBtn = contentEl.querySelector(`#resize-btn-${windowId}`);
        const clearBtn = contentEl.querySelector(`#clear-btn-${windowId}`);
        const saveBtn = contentEl.querySelector(`#save-btn-${windowId}`);

        // --- Helper Functions ---
        function updateCanvasSize() {
            canvas.width = gridWidth * pixelSize;
            canvas.height = gridHeight * pixelSize;
            canvas.style.width = `${canvas.width}px`;
            canvas.style.height = `${canvas.height}px`;
            ctx.imageSmoothingEnabled = false; // Crucial for pixel art
            redrawCanvas(); // Redraw existing content
            updateGridVisibility(); // Update CSS grid
        }

        function redrawCanvas() {
            // Clear (with background color might be better)
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Redraw pixels from stored data (if we had stored data)
            // For simplicity now, just clearing. Need to store pixel data for redraw on resize/zoom.
            // Example: If pixelData was a 2D array:
            // for (let y = 0; y < gridHeight; y++) {
            //     for (let x = 0; x < gridWidth; x++) {
            //         if (pixelData[y][x]) {
            //             ctx.fillStyle = pixelData[y][x];
            //             ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            //         }
            //     }
            // }
             // For now, just clears on zoom/resize. Actual pixel data needs persistence.
        }

        function updateGridVisibility() {
             if (showGrid) {
                canvas.style.backgroundImage = `linear-gradient(to right, var(--pixel-pad-grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--pixel-pad-grid-color) 1px, transparent 1px)`;
                canvas.style.backgroundSize = `${pixelSize}px ${pixelSize}px`;
             } else {
                 canvas.style.backgroundImage = 'none';
             }
        }

        function drawPixel(gridX, gridY, color) {
            if (gridX < 0 || gridX >= gridWidth || gridY < 0 || gridY >= gridHeight) return;
            ctx.fillStyle = color;
            ctx.fillRect(gridX * pixelSize, gridY * pixelSize, pixelSize, pixelSize);
             // TODO: Store this color in a persistent data structure (e.g., 2D array)
        }

        function getPixelColor(gridX, gridY) {
             if (gridX < 0 || gridX >= gridWidth || gridY < 0 || gridY >= gridHeight) return null;
             try {
                 const imageData = ctx.getImageData(gridX * pixelSize + Math.floor(pixelSize / 2), gridY * pixelSize + Math.floor(pixelSize / 2), 1, 1);
                 const data = imageData.data;
                 // Convert to hex
                 const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1).toLowerCase();
                 return hex;
             } catch (e) {
                 console.error("Error getting pixel data (maybe outside canvas bounds or tainted):", e);
                 return bgColor; // Return background on error
             }
        }

         function setActiveButton(tool) {
            toolbar.querySelectorAll('button[data-tool]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tool === tool);
            });
            canvas.classList.toggle('eyedropper-cursor', tool === 'eyedropper');
             if (tool !== 'eyedropper') {
                 canvas.style.cursor = 'crosshair'; // Default drawing cursor
             }
        }

        function updateColorSwatch() {
            colorSwatch.style.backgroundColor = selectedColor;
        }

        // --- Palette Setup ---
        const defaultPalette = [
            '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#808080', '#c0c0c0', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'
        ];
        paletteContainer.innerHTML = defaultPalette.map(color =>
            `<button class="palette-color" style="background-color: ${color};" data-color="${color}" title="${color}"></button>`
        ).join('');

        // --- Event Listeners ---
        toolbar.addEventListener('click', (e) => {
            // Tool buttons
            const toolButton = e.target.closest('button[data-tool]');
            if (toolButton) {
                activeTool = toolButton.dataset.tool;
                setActiveButton(activeTool);
            }

            // Palette buttons
            const paletteButton = e.target.closest('.palette-color');
            if (paletteButton) {
                selectedColor = paletteButton.dataset.color;
                updateColorSwatch();
            }
        });

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
            const scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

            const canvasX = (e.clientX - rect.left) * scaleX; // scale mouse coordinates after they have
            const canvasY = (e.clientY - rect.top) * scaleY;  // been adjusted to be relative to element

            const gridX = Math.floor(canvasX / pixelSize);
            const gridY = Math.floor(canvasY / pixelSize);

            if (activeTool === 'pencil') {
                drawPixel(gridX, gridY, selectedColor);
            } else if (activeTool === 'eraser') {
                drawPixel(gridX, gridY, bgColor);
            } else if (activeTool === 'eyedropper') {
                const pickedColor = getPixelColor(gridX, gridY);
                if (pickedColor) {
                    selectedColor = pickedColor;
                    updateColorSwatch();
                }
                isDrawing = false; // Eyedropper is a single click action
            }
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing || activeTool === 'eyedropper') return;

            const rect = canvas.getBoundingClientRect();
             const scaleX = canvas.width / rect.width;
             const scaleY = canvas.height / rect.height;
             const canvasX = (e.clientX - rect.left) * scaleX;
             const canvasY = (e.clientY - rect.top) * scaleY;

             const gridX = Math.floor(canvasX / pixelSize);
             const gridY = Math.floor(canvasY / pixelSize);

             if (activeTool === 'pencil') {
                drawPixel(gridX, gridY, selectedColor);
            } else if (activeTool === 'eraser') {
                drawPixel(gridX, gridY, bgColor);
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDrawing = false;
        });

        // Grid Toggle
        gridToggle.addEventListener('change', (e) => {
            showGrid = e.target.checked;
            updateGridVisibility();
        });

        // Zoom Buttons
        zoomInBtn.addEventListener('click', () => {
            pixelSize = Math.min(50, pixelSize + 2); // Max zoom 50px per pixel
            zoomIndicator.textContent = `${pixelSize}px`;
            updateCanvasSize();
        });
        zoomOutBtn.addEventListener('click', () => {
            pixelSize = Math.max(2, pixelSize - 2); // Min zoom 2px per pixel
            zoomIndicator.textContent = `${pixelSize}px`;
            updateCanvasSize();
        });

         // Resize Button
        resizeBtn.addEventListener('click', () => {
            const newSize = prompt(`Enter new size (WidthxHeight, e.g., 32x32):`, `${gridWidth}x${gridHeight}`);
            if (!newSize) return;
            const parts = newSize.toLowerCase().split('x');
            if (parts.length === 2) {
                const w = parseInt(parts[0]);
                const h = parseInt(parts[1]);
                if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0 && w <= 128 && h <= 128) { // Added size limit
                     // TODO: Add logic here to preserve existing pixel data if desired
                     gridWidth = w;
                     gridHeight = h;
                     sizeIndicator.textContent = `${gridWidth}x${gridHeight}`;
                     updateCanvasSize(); // This will currently clear the canvas
                 } else {
                     alert("Invalid size. Use format WidthxHeight (e.g., 32x32). Max 128x128.");
                 }
            } else {
                 alert("Invalid format. Use format WidthxHeight (e.g., 32x32).");
             }
        });

        // Clear Button
        clearBtn.addEventListener('click', () => {
            if (confirm("Clear the canvas? This cannot be undone.")) {
                 // TODO: Clear the persistent pixel data array here as well
                 redrawCanvas(); // Clears visually
             }
        });

        // Save Button
        saveBtn.addEventListener('click', () => {
            const filename = prompt("Save image as (e.g., pixelart.png):", "pixelart.png");
            if (!filename) return;

             // Create a temporary canvas at the actual pixel size for saving
             const tempCanvas = document.createElement('canvas');
             tempCanvas.width = gridWidth;
             tempCanvas.height = gridHeight;
             const tempCtx = tempCanvas.getContext('2d');
             tempCtx.imageSmoothingEnabled = false;

             // Draw the current canvas content onto the temp canvas at 1:1 pixel ratio
             // This requires reading pixel data accurately. GetImageData is one way.
             try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const scaledData = tempCtx.createImageData(gridWidth, gridHeight);
                for (let y = 0; y < gridHeight; y++) {
                    for (let x = 0; x < gridWidth; x++) {
                        // Get color from the center of the source pixel box
                         const srcX = Math.floor(x * pixelSize + pixelSize / 2);
                         const srcY = Math.floor(y * pixelSize + pixelSize / 2);
                         const srcIndex = (srcY * canvas.width + srcX) * 4;
                         const destIndex = (y * gridWidth + x) * 4;

                         scaledData.data[destIndex] = imgData.data[srcIndex];     // R
                         scaledData.data[destIndex + 1] = imgData.data[srcIndex + 1]; // G
                         scaledData.data[destIndex + 2] = imgData.data[srcIndex + 2]; // B
                         scaledData.data[destIndex + 3] = imgData.data[srcIndex + 3]; // A (or 255 if opaque)
                    }
                 }
                 tempCtx.putImageData(scaledData, 0, 0);

                 // Create download link
                 const dataURL = tempCanvas.toDataURL('image/png');
                 const a = document.createElement('a');
                 a.href = dataURL;
                 a.download = filename.endsWith('.png') ? filename : filename + '.png';
                 a.style.display = 'none';
                 document.body.appendChild(a);
                 a.click();
                 document.body.removeChild(a);
             } catch(e) {
                 console.error("Error saving canvas:", e);
                 alert("Could not save image. The canvas might be tainted if external images were loaded.");
             }
        });

        // --- Initial Setup ---
        updateCanvasSize();
        updateColorSwatch();
        setActiveButton('pencil'); // Set default tool

        // Cleanup function (remove styles)
        if (window.openWindows && window.openWindows[windowId]) {
            window.openWindows[windowId].cleanup = () => {
                console.log(`Cleaning up Pixel Art (Window ID: ${windowId})`);
                if (styleElement && styleElement.parentNode) {
                     styleElement.parentNode.removeChild(styleElement);
                 }
            };
        }
    } // End of init function
}; // End of simplexOS_AppConfig