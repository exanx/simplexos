// Simplex OS Custom App: Unit Converter
var simplexOS_AppConfig = {
    name: 'Unit Converter',
    icon: '<i class="fa-solid fa-right-left"></i>', // Using a "right-left" arrow icon for conversion
    init: function(contentEl, windowId) { // Changed to traditional function
        const appPrefix = `uc-app-${windowId}`;

        const conversionData = {
            "Length": {
                baseUnit: "m",
                units: {
                    "mm": { displayName: "Millimeter (mm)", toBase: 0.001 },
                    "cm": { displayName: "Centimeter (cm)", toBase: 0.01 },
                    "m":  { displayName: "Meter (m)",       toBase: 1 },
                    "km": { displayName: "Kilometer (km)",  toBase: 1000 },
                    "in": { displayName: "Inch (in)",       toBase: 0.0254 },
                    "ft": { displayName: "Foot (ft)",       toBase: 0.3048 },
                    "yd": { displayName: "Yard (yd)",       toBase: 0.9144 },
                    "mi": { displayName: "Mile (mi)",       toBase: 1609.34 }
                }
            },
            "Mass": {
                baseUnit: "kg",
                units: {
                    "mg":  { displayName: "Milligram (mg)",    toBase: 0.000001 },
                    "g":   { displayName: "Gram (g)",          toBase: 0.001 },
                    "kg":  { displayName: "Kilogram (kg)",     toBase: 1 },
                    "oz":  { displayName: "Ounce (oz)",        toBase: 0.0283495 },
                    "lb":  { displayName: "Pound (lb)",        toBase: 0.453592 },
                    "t_metric": { displayName: "Tonne (metric t)", toBase: 1000 },
                    "t_us":   { displayName: "Ton (US short)",  toBase: 907.185 }
                }
            },
            "Temperature": {
                baseUnit: "K", // Abstract base for consistent handling via functions
                units: {
                    "C": {
                        displayName: "Celsius (°C)",
                        toBase: function(c) { return c + 273.15; },
                        fromBase: function(k) { return k - 273.15; },
                        formulaTo: function(toUnitSymbol, inputValueInCelsius) { // inputValue is already in Celsius
                            if (toUnitSymbol === "F") return `${parseFloat(inputValueInCelsius.toPrecision(5))} °C = (${parseFloat(inputValueInCelsius.toPrecision(5))} × 9/5) + 32 °F`;
                            if (toUnitSymbol === "K") return `${parseFloat(inputValueInCelsius.toPrecision(5))} °C = ${parseFloat(inputValueInCelsius.toPrecision(5))} + 273.15 K`;
                            return "";
                        }
                    },
                    "F": {
                        displayName: "Fahrenheit (°F)",
                        toBase: function(f) { return (f - 32) * 5/9 + 273.15; },
                        fromBase: function(k) { return (k - 273.15) * 9/5 + 32; },
                        formulaTo: function(toUnitSymbol, inputValueInFahrenheit) { // inputValue is already in Fahrenheit
                            if (toUnitSymbol === "C") return `${parseFloat(inputValueInFahrenheit.toPrecision(5))} °F = (${parseFloat(inputValueInFahrenheit.toPrecision(5))} - 32) × 5/9 °C`;
                            if (toUnitSymbol === "K") return `${parseFloat(inputValueInFahrenheit.toPrecision(5))} °F = (${parseFloat(inputValueInFahrenheit.toPrecision(5))} - 32) × 5/9 + 273.15 K`;
                            return "";
                        }
                    },
                    "K": {
                        displayName: "Kelvin (K)",
                        toBase: function(k) { return k; },
                        fromBase: function(k) { return k; },
                        formulaTo: function(toUnitSymbol, inputValueInKelvin) { // inputValue is already in Kelvin
                            if (toUnitSymbol === "C") return `${parseFloat(inputValueInKelvin.toPrecision(5))} K = ${parseFloat(inputValueInKelvin.toPrecision(5))} - 273.15 °C`;
                            if (toUnitSymbol === "F") return `${parseFloat(inputValueInKelvin.toPrecision(5))} K = (${parseFloat(inputValueInKelvin.toPrecision(5))} - 273.15) × 9/5 + 32 °F`;
                            return "";
                        }
                    }
                }
            },
            "Volume": {
                baseUnit: "L",
                units: {
                    "mL":  { displayName: "Milliliter (mL)", toBase: 0.001 },
                    "L":   { displayName: "Liter (L)",       toBase: 1 },
                    "cm3": { displayName: "Cubic cm (cm³)",  toBase: 0.001 },
                    "m3":  { displayName: "Cubic meter (m³)",toBase: 1000 },
                    "floz_us": { displayName: "Fluid Ounce (US fl oz)", toBase: 0.0295735 },
                    "cup_us":  { displayName: "Cup (US)",      toBase: 0.236588 },
                    "pt_us":   { displayName: "Pint (US)",     toBase: 0.473176 },
                    "qt_us":   { displayName: "Quart (US)",    toBase: 0.946353 },
                    "gal_us":  { displayName: "Gallon (US)",   toBase: 3.78541 }
                }
            },
            "Area": {
                baseUnit: "m2",
                units: {
                    "mm2": { displayName: "Square mm (mm²)", toBase: 0.000001 },
                    "cm2": { displayName: "Square cm (cm²)", toBase: 0.0001 },
                    "m2":  { displayName: "Square meter (m²)", toBase: 1 },
                    "km2": { displayName: "Square km (km²)", toBase: 1000000 },
                    "in2": { displayName: "Square inch (in²)", toBase: 0.00064516 },
                    "ft2": { displayName: "Square foot (ft²)", toBase: 0.092903 },
                    "yd2": { displayName: "Square yard (yd²)", toBase: 0.836127 },
                    "mi2": { displayName: "Square mile (mi²)", toBase: 2589990 },
                    "ha":  { displayName: "Hectare (ha)",    toBase: 10000 },
                    "ac":  { displayName: "Acre (ac)",       toBase: 4046.86 }
                }
            },
            "Speed": {
                baseUnit: "m/s",
                units: {
                    "m/s":  { displayName: "Meter/second (m/s)", toBase: 1 },
                    "km/h": { displayName: "Kilometer/hour (km/h)", toBase: 1/3.6 },
                    "mph":  { displayName: "Miles/hour (mph)",   toBase: 0.44704 },
                    "knot": { displayName: "Knot (kn)",          toBase: 0.514444 },
                    "ft/s": { displayName: "Foot/second (ft/s)", toBase: 0.3048 }
                }
            },
            "Time": { // Note: month and year are averages
                baseUnit: "s",
                units: {
                    "ms":    { displayName: "Millisecond (ms)", toBase: 0.001 },
                    "s":     { displayName: "Second (s)",       toBase: 1 },
                    "min":   { displayName: "Minute (min)",     toBase: 60 },
                    "hr":    { displayName: "Hour (hr)",        toBase: 3600 },
                    "day":   { displayName: "Day (day)",        toBase: 86400 },
                    "week":  { displayName: "Week (week)",      toBase: 604800 },
                    "month_avg": { displayName: "Month (avg ~30.44d)", toBase: 2629800 },
                    "year_avg":  { displayName: "Year (avg ~365.25d)",  toBase: 31557600 }
                }
            },
            "Data Storage (Binary)": {
                baseUnit: "B",
                units: {
                    "b":  { displayName: "Bit (b)",      toBase: 0.125 },
                    "B":  { displayName: "Byte (B)",     toBase: 1 },
                    "KiB": { displayName: "Kibibyte (KiB)", toBase: 1024 },
                    "MiB": { displayName: "Mebibyte (MiB)", toBase: Math.pow(1024, 2) },
                    "GiB": { displayName: "Gibibyte (GiB)", toBase: Math.pow(1024, 3) },
                    "TiB": { displayName: "Tebibyte (TiB)", toBase: Math.pow(1024, 4) },
                    "PiB": { displayName: "Pebibyte (PiB)", toBase: Math.pow(1024, 5) }
                }
            },
            "Pressure": {
                baseUnit: "Pa",
                units: {
                    "Pa":   { displayName: "Pascal (Pa)", toBase: 1 },
                    "kPa":  { displayName: "Kilopascal (kPa)", toBase: 1000 },
                    "bar":  { displayName: "Bar (bar)", toBase: 100000 },
                    "psi":  { displayName: "Pound/sq inch (psi)", toBase: 6894.76 },
                    "atm":  { displayName: "Atmosphere (atm)", toBase: 101325 },
                    "mmHg": { displayName: "Millimeter of mercury (mmHg)", toBase: 133.322 }
                }
            },
             "Energy": {
                baseUnit: "J",
                units: {
                    "J":    { displayName: "Joule (J)", toBase: 1 },
                    "kJ":   { displayName: "Kilojoule (kJ)", toBase: 1000 },
                    "cal":  { displayName: "Calorie (cal)", toBase: 4.184 },
                    "kcal": { displayName: "Kilocalorie (kcal)", toBase: 4184 },
                    "Wh":   { displayName: "Watt-hour (Wh)", toBase: 3600 },
                    "kWh":  { displayName: "Kilowatt-hour (kWh)", toBase: 3600000 },
                    "BTU":  { displayName: "British Thermal Unit (BTU)", toBase: 1055.06 }
                }
            },
            "Power": {
                baseUnit: "W",
                units: {
                    "W":  { displayName: "Watt (W)", toBase: 1 },
                    "kW": { displayName: "Kilowatt (kW)", toBase: 1000 },
                    "hp_metric": { displayName: "Horsepower (metric hp)", toBase: 735.499 },
                    "hp_mech": { displayName: "Horsepower (mechanical hp)", toBase: 745.7 }
                }
            },
            "Frequency": {
                baseUnit: "Hz",
                units: {
                    "Hz":  { displayName: "Hertz (Hz)", toBase: 1 },
                    "kHz": { displayName: "Kilohertz (kHz)", toBase: 1000 },
                    "MHz": { displayName: "Megahertz (MHz)", toBase: 1000000 },
                    "GHz": { displayName: "Gigahertz (GHz)", toBase: 1000000000 }
                }
            },
            "Angle": {
                baseUnit: "rad",
                units: {
                    "deg": { displayName: "Degree (°)", toBase: Math.PI / 180 },
                    "rad": { displayName: "Radian (rad)", toBase: 1 },
                    "grad":{ displayName: "Gradian (grad)", toBase: Math.PI / 200 }
                }
            }
        };

        for (const category in conversionData) {
            for (const unit in conversionData[category].units) {
                const unitData = conversionData[category].units[unit];
                if (typeof unitData.toBase === 'number' && typeof unitData.fromBase === 'undefined') {
                    unitData.fromBase = 1 / unitData.toBase;
                }
            }
        }

        const style = `
            .${appPrefix}-container {
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 15px; /* Increased padding */
                height: 100%;
                font-size: 0.9em;
                background-color: var(--bg-secondary); /* Use OS theme */
                color: var(--text-primary);
            }
            .${appPrefix}-controls {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .${appPrefix}-controls label {
                flex-shrink: 0;
                font-weight: bold;
                color: var(--text-secondary);
            }
            .${appPrefix}-controls select {
                flex-grow: 1;
                padding: 8px; /* Increased padding */
                border: 1px solid var(--border-primary); /* Use OS theme */
                background-color: var(--bg-primary); /* Use OS theme */
                color: var(--text-primary);
                border-radius: 4px; /* Slightly more rounded */
                font-size: 0.95em;
            }
            .${appPrefix}-conversion-area {
                display: grid; /* Use grid for better alignment */
                grid-template-columns: 1fr auto 1fr;
                align-items: end; /* Align items to the bottom of their cell */
                gap: 12px; /* Increased gap */
                padding: 15px;
                background-color: var(--bg-primary);
                border-radius: 5px;
                border: 1px solid var(--border-secondary);
            }
            .${appPrefix}-input-group, .${appPrefix}-output-group {
                display: flex;
                flex-direction: column;
                gap: 8px; /* Increased gap */
            }
            .${appPrefix}-input-group label, .${appPrefix}-output-group label {
                font-weight: bold;
                font-size: 0.9em;
                color: var(--text-secondary);
            }
            .${appPrefix}-conversion-area input[type="number"], .${appPrefix}-conversion-area input[type="text"] {
                padding: 10px; /* Increased padding */
                border: 1px solid var(--border-primary);
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border-radius: 4px;
                width: 100%;
                box-sizing: border-box;
                font-size: 1.1em; /* Larger font for input/output */
            }
            .${appPrefix}-conversion-area input[readonly] {
                background-color: var(--bg-tertiary); /* Slightly different for readonly */
                font-weight: bold;
            }
            .${appPrefix}-conversion-area select {
                padding: 10px; /* Increased padding */
                border: 1px solid var(--border-primary);
                background-color: var(--bg-secondary);
                color: var(--text-primary);
                border-radius: 4px;
                width: 100%;
                font-size: 0.95em;
            }
            .${appPrefix}-swap-button {
                padding: 8px 12px;
                background-color: var(--settings-button-bg);
                border: 1px solid var(--border-primary);
                color: var(--text-primary);
                cursor: pointer;
                border-radius: 4px;
                font-size: 1.2em; /* Larger swap icon */
                line-height: 1;
                height: 40px; /* Match input height */
                margin-bottom: 30px; /* Align with the bottom of unit select */
            }
            .${appPrefix}-swap-button:hover {
                background-color: var(--settings-button-hover);
            }
            .${appPrefix}-formula-display {
                margin-top: 10px;
                padding: 12px; /* Increased padding */
                background-color: var(--bg-primary);
                border: 1px solid var(--border-secondary);
                border-radius: 4px;
                font-size: 0.95em;
                min-height: 3em; /* More space */
                line-height: 1.5;
                color: var(--text-secondary);
                word-break: break-all;
                text-align: center;
            }
        `;

        // Prepending style to contentEl to ensure it's applied correctly within the app's scope
        const styleEl = document.createElement('style');
        styleEl.textContent = style;
        contentEl.prepend(styleEl);


        contentEl.innerHTML += `
            <div class="${appPrefix}-container">
                <div class="${appPrefix}-controls">
                    <label for="${appPrefix}-category">Category:</label>
                    <select id="${appPrefix}-category"></select>
                </div>
                <div class="${appPrefix}-conversion-area">
                    <div class="${appPrefix}-input-group">
                        <label for="${appPrefix}-from-value">From Value:</label>
                        <input type="number" id="${appPrefix}-from-value" value="1" step="any">
                        <label for="${appPrefix}-from-unit">From Unit:</label>
                        <select id="${appPrefix}-from-unit"></select>
                    </div>
                    <button id="${appPrefix}-swap" class="${appPrefix}-swap-button" title="Swap Units"><i class="fa-solid fa-exchange-alt"></i></button>
                    <div class="${appPrefix}-output-group">
                        <label for="${appPrefix}-to-value">To Value:</label>
                        <input type="text" id="${appPrefix}-to-value" readonly>
                        <label for="${appPrefix}-to-unit">To Unit:</label>
                        <select id="${appPrefix}-to-unit"></select>
                    </div>
                </div>
                <div id="${appPrefix}-formula" class="${appPrefix}-formula-display">Select units to see conversion info.</div>
            </div>
        `;

        const categorySelect = contentEl.querySelector(`#${appPrefix}-category`);
        const fromUnitSelect = contentEl.querySelector(`#${appPrefix}-from-unit`);
        const toUnitSelect = contentEl.querySelector(`#${appPrefix}-to-unit`);
        const fromValueInput = contentEl.querySelector(`#${appPrefix}-from-value`);
        const toValueOutput = contentEl.querySelector(`#${appPrefix}-to-value`);
        const swapButton = contentEl.querySelector(`#${appPrefix}-swap`);
        const formulaDisplay = contentEl.querySelector(`#${appPrefix}-formula`);

        function populateCategories() {
            categorySelect.innerHTML = ''; // Clear existing options
            Object.keys(conversionData).sort().forEach(categoryName => { // Sort categories alphabetically
                const option = document.createElement('option');
                option.value = categoryName;
                option.textContent = categoryName;
                categorySelect.appendChild(option);
            });
            categorySelect.value = "Length"; // Default category
            populateUnits();
        }

        function populateUnits() {
            const selectedCategory = categorySelect.value;
            const categoryInfo = conversionData[selectedCategory];
            if (!categoryInfo) return;

            fromUnitSelect.innerHTML = '';
            toUnitSelect.innerHTML = '';

            Object.entries(categoryInfo.units)
                .sort(([,a], [,b]) => a.displayName.localeCompare(b.displayName)) // Sort units by display name
                .forEach(([unitSymbol, unitDetails]) => {
                    const option = document.createElement('option');
                    option.value = unitSymbol;
                    option.textContent = unitDetails.displayName;
                    fromUnitSelect.appendChild(option.cloneNode(true));
                    toUnitSelect.appendChild(option);
            });

            const unitSymbols = Object.keys(categoryInfo.units);
            if (unitSymbols.length > 0) {
                fromUnitSelect.value = unitSymbols[0];
                if (unitSymbols.length > 1) {
                    // Try to pick a different default 'to' unit. A common one like base unit or second in list.
                    toUnitSelect.value = categoryInfo.baseUnit && categoryInfo.units[categoryInfo.baseUnit] && unitSymbols[0] !== categoryInfo.baseUnit ?
                                         categoryInfo.baseUnit :
                                         (unitSymbols.length > 1 && unitSymbols[1] !== unitSymbols[0] ? unitSymbols[1] : unitSymbols[0]);

                    if (fromUnitSelect.value === toUnitSelect.value && unitSymbols.length > 1) {
                        // Fallback if first and base are the same, pick the second if available
                        toUnitSelect.value = unitSymbols.find(s => s !== fromUnitSelect.value) || unitSymbols[0];
                    }

                } else {
                    toUnitSelect.value = unitSymbols[0];
                }
            }
            convert();
        }

        function convert() {
            const selectedCategory = categorySelect.value;
            const categoryInfo = conversionData[selectedCategory];
            const fromUnitSymbol = fromUnitSelect.value;
            const toUnitSymbol = toUnitSelect.value;

            if (!categoryInfo || !categoryInfo.units[fromUnitSymbol] || !categoryInfo.units[toUnitSymbol]) {
                toValueOutput.value = "Error";
                formulaDisplay.textContent = "Unit data missing.";
                return;
            }

            const fromUnitData = categoryInfo.units[fromUnitSymbol];
            const toUnitData = categoryInfo.units[toUnitSymbol];

            const fromValue = parseFloat(fromValueInput.value);

            if (isNaN(fromValue)) {
                toValueOutput.value = ""; // Clear output for invalid input
                formulaDisplay.textContent = "Please enter a valid number to convert.";
                return;
            }

            let valueInBase;
            if (typeof fromUnitData.toBase === 'function') {
                valueInBase = fromUnitData.toBase(fromValue);
            } else {
                valueInBase = fromValue * fromUnitData.toBase;
            }

            let finalValue;
            if (typeof toUnitData.fromBase === 'function') {
                finalValue = toUnitData.fromBase(valueInBase);
            } else {
                finalValue = valueInBase * toUnitData.fromBase;
            }

            // Format output nicely
            if (Math.abs(finalValue) < 1e-6 && finalValue !== 0) { // Scientific notation for very small numbers
                toValueOutput.value = finalValue.toExponential(5);
            } else if (Math.abs(finalValue) > 1e9) { // Scientific notation for very large numbers
                toValueOutput.value = finalValue.toExponential(5);
            } else {
                toValueOutput.value = parseFloat(finalValue.toPrecision(7));
            }


            // Update formula display
            if (selectedCategory === "Temperature") {
                let formulaText = "";
                if (fromUnitSymbol === toUnitSymbol) {
                    formulaText = `${fromUnitData.displayName} remains ${fromUnitData.displayName}.`;
                } else if (fromUnitData.formulaTo && typeof fromUnitData.formulaTo === 'function'){
                    // Pass the original 'fromValue' to the formula function
                    formulaText = fromUnitData.formulaTo(toUnitSymbol, fromValue);
                }
                formulaDisplay.textContent = formulaText || `Converting ${fromUnitData.displayName} to ${toUnitData.displayName}.`;

            } else {
                if (fromUnitSymbol === toUnitSymbol) {
                    formulaDisplay.textContent = `1 ${fromUnitData.displayName} = 1 ${toUnitData.displayName}`;
                } else {
                    const oneUnitFromInBase = (typeof fromUnitData.toBase === 'function' ? fromUnitData.toBase(1) : 1 * fromUnitData.toBase);
                    const oneUnitFromInTo = (typeof toUnitData.fromBase === 'function' ? toUnitData.fromBase(oneUnitFromInBase) : oneUnitFromInBase * toUnitData.fromBase);
                    formulaDisplay.textContent = `1 ${fromUnitData.displayName} = ${parseFloat(oneUnitFromInTo.toPrecision(5))} ${toUnitData.displayName}`;
                }
                if(fromUnitSymbol.includes("_avg") || toUnitSymbol.includes("_avg")) {
                    formulaDisplay.textContent += " (Note: Month/Year conversions use averages.)";
                }
            }
        }

        function swapUnits() {
            const tempFromUnit = fromUnitSelect.value;
            const tempFromValue = fromValueInput.value;

            fromUnitSelect.value = toUnitSelect.value;
            toUnitSelect.value = tempFromUnit;

            // If the output was a valid number, use it as the new input
            const currentToValue = parseFloat(toValueOutput.value);
            if (!isNaN(currentToValue)) {
                fromValueInput.value = currentToValue;
            } else {
                // If output was not a number (e.g. "Invalid"), keep original fromValue
                fromValueInput.value = tempFromValue;
            }
            convert();
        }

        categorySelect.addEventListener('change', populateUnits);
        fromUnitSelect.addEventListener('change', convert);
        toUnitSelect.addEventListener('change', convert);
        fromValueInput.addEventListener('input', convert);
        swapButton.addEventListener('click', swapUnits);

        populateCategories();
    }
};