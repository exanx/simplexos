// Simplex OS Custom App: Markdown Editor
var simplexOS_AppConfig = {
    name: "Markdown Editor",
    icon: '<i class="fa-brands fa-markdown"></i>',

    init: function(contentEl, windowId) {
        const appPrefix = `md-editor-${windowId}`;
        const MARKED_CDN_URL = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js';

        const LOCALSTORAGE_CONTENT_KEY_PREFIX = 'simplexMdEditor_content_';
        const LOCALSTORAGE_THEME_KEY = 'simplexMdEditor_theme';

        let markedParser = null;
        let autoSaveTimeout = null;

        // --- HTML Structure ---
        contentEl.innerHTML = `
            <div id="${appPrefix}-container" class="${appPrefix}-container">
                <div class="${appPrefix}-toolbar">
                    <div class="${appPrefix}-toolbar-section ${appPrefix}-toolbar-section-file">
                        <button id="${appPrefix}-theme-toggle" title="Toggle Theme"><i class="fa-solid fa-moon"></i></button>
                        <button id="${appPrefix}-new-doc" title="New Document (Clear All)"><i class="fa-solid fa-file"></i></button>
                        <button id="${appPrefix}-save-md" title="Save as .md file"><i class="fa-solid fa-download"></i> MD</button>
                        <button id="${appPrefix}-save-html" title="Save as .html file"><i class="fa-solid fa-code"></i> HTML</button>
                    </div>
                    <div class="${appPrefix}-toolbar-section ${appPrefix}-toolbar-section-format">
                        <button data-format="bold" title="Bold (Ctrl+B)"><i class="fa-solid fa-bold"></i></button>
                        <button data-format="italic" title="Italic (Ctrl+I)"><i class="fa-solid fa-italic"></i></button>
                        <button data-format="strikethrough" title="Strikethrough"><i class="fa-solid fa-strikethrough"></i></button>
                        <div class="${appPrefix}-separator"></div>
                        <button data-format="h1" title="Heading 1"><i class="fa-solid fa-heading"></i>1</button>
                        <button data-format="h2" title="Heading 2"><i class="fa-solid fa-heading"></i>2</button>
                        <button data-format="h3" title="Heading 3"><i class="fa-solid fa-heading"></i>3</button>
                        <div class="${appPrefix}-separator"></div>
                        <button data-format="ul" title="Unordered List"><i class="fa-solid fa-list-ul"></i></button>
                        <button data-format="ol" title="Ordered List"><i class="fa-solid fa-list-ol"></i></button>
                        <button data-format="quote" title="Blockquote"><i class="fa-solid fa-quote-left"></i></button>
                        <div class="${appPrefix}-separator"></div>
                        <button data-format="code" title="Inline Code"><i class="fa-solid fa-code"></i></button>
                        <button data-format="codeblock" title="Code Block"><i class="fa-solid fa-file-code"></i></button>
                        <button data-format="link" title="Insert Link"><i class="fa-solid fa-link"></i></button>
                        <button data-format="image" title="Insert Image"><i class="fa-solid fa-image"></i></button>
                        <button data-format="hr" title="Horizontal Rule"><i class="fa-solid fa-minus"></i></button>
                    </div>
                    <div class="${appPrefix}-toolbar-section ${appPrefix}-toolbar-section-status">
                        <div class="${appPrefix}-status-box">
                            <span class="${appPrefix}-status" id="${appPrefix}-status">Loading...</span>
                        </div>
                    </div>
                </div>
                <div class="${appPrefix}-editor-area">
                    <textarea id="${appPrefix}-markdown-input" spellcheck="false" placeholder="## Start typing your Markdown here..."></textarea>
                    <div id="${appPrefix}-preview-output" class="markdown-body"></div>
                </div>
            </div>
        `;

        // --- Inline CSS Styling ---
        const style = document.createElement('style');
        style.id = `${appPrefix}-styles`; // Give the style tag an ID for potential removal on cleanup
        style.textContent = `
            /* OS Theme Variables Fallbacks & Resolution (Same as previous good version) */
            :root {
                --os-bg-primary-fallback: #ffffff;
                --os-bg-secondary-fallback: #f0f0f0;
                --os-bg-tertiary-fallback: #e0e0e0;
                --os-text-primary-fallback: #222222;
                --os-text-secondary-fallback: #555555;
                --os-border-primary-fallback: #cccccc;
                --os-border-secondary-fallback: #bbbbbb;
                --os-accent-primary-fallback: #0078d4;
                --os-scrollbar-thumb-fallback: #b0b0b0;
                --os-scrollbar-track-fallback: #e0e0e0;

                --os-bg-primary-resolved: var(--bg-primary-dark, #2d2d2d);
                --os-bg-secondary-resolved: var(--bg-secondary-dark, #1e1e1e);
                --os-bg-tertiary-resolved: var(--bg-tertiary-dark, #3a3a3a);
                --os-text-primary-resolved: var(--text-primary-dark, #e0e0e0);
                --os-text-secondary-resolved: var(--text-secondary-dark, #aaaaaa);
                --os-border-primary-resolved: var(--border-primary-dark, #555555);
                --os-border-secondary-resolved: var(--border-secondary-dark, #444444);
                --os-accent-primary-resolved: var(--accent-primary-dark, #0078d4);
                --os-scrollbar-thumb-resolved: var(--scrollbar-thumb-dark, #555555);
                --os-scrollbar-track-resolved: var(--scrollbar-track-dark, #333333);
            }
            body:not(.dark-theme):not([data-theme-mode="dark"]), :root:not([data-theme-mode="dark"]) {
                --os-bg-primary-resolved: var(--bg-primary, var(--os-bg-primary-fallback));
                --os-bg-secondary-resolved: var(--bg-secondary, var(--os-bg-secondary-fallback));
                --os-bg-tertiary-resolved: var(--bg-tertiary, var(--os-bg-tertiary-fallback));
                --os-text-primary-resolved: var(--text-primary, var(--os-text-primary-fallback));
                --os-text-secondary-resolved: var(--text-secondary, var(--os-text-secondary-fallback));
                --os-border-primary-resolved: var(--border-primary, var(--os-border-primary-fallback));
                --os-border-secondary-resolved: var(--border-secondary, var(--os-border-secondary-fallback));
                --os-accent-primary-resolved: var(--accent-primary, var(--os-accent-primary-fallback));
                --os-scrollbar-thumb-resolved: var(--scrollbar-thumb, var(--os-scrollbar-thumb-fallback));
                --os-scrollbar-track-resolved: var(--scrollbar-track, var(--os-scrollbar-track-fallback));
            }

            #${appPrefix}-container { /* Targeted by ID for higher specificity */
                /* App's default dark theme variables */
                --md-bg-app: #22272e;
                --md-bg-editor: #2d333b;
                --md-text-editor: #adbac7;
                --md-border-editor: #444c56;
                --md-toolbar-bg: #22272e;
                --md-toolbar-border: #444c56;
                --md-button-bg: #373e47;
                --md-button-hover-bg: #444c56;
                --md-button-text: #adbac7;
                --md-status-text: #768390;
                --md-status-bg: #373e47;
                --md-preview-text: #adbac7;
                --md-preview-code-block-bg: #1c2128;
                --md-preview-code-block-text: #c9d1d9;
                --md-preview-inline-code-bg: #444c56;
                --md-preview-inline-code-text: #c9d1d9;
                --md-preview-quote-bg: rgba(83, 155, 245, 0.12);
                --md-preview-quote-border: #539bf5;
                --md-preview-quote-text: #a1c0df;
                --md-preview-link-color: #539bf5;
                --md-scrollbar-thumb-app: #545d68;
                --md-scrollbar-track-app: #2d333b;

                --md-preview-font-size-main: 1em;
                --md-preview-font-size-code: 0.9em;
                --md-preview-font-size-quote: 0.95em;

                display: flex; flex-direction: column; height: 100%;
                background-color: var(--md-bg-app); color: var(--md-text-editor);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 0.95em;
            }

             #${appPrefix}-container.app-light-mode { /* Targeted by ID */
                /* App's light theme override */
                --md-bg-app: #f6f8fa;
                --md-bg-editor: #ffffff;
                --md-text-editor: #24292f;
                --md-border-editor: #d0d7de;
                --md-toolbar-bg: #f6f8fa;
                --md-toolbar-border: #d0d7de;
                --md-button-bg: #f6f8fa;
                --md-button-hover-bg: #eaeef2;
                --md-button-text: #24292f;
                --md-status-text: #57606a;
                --md-status-bg: #eaeef2;
                --md-preview-text: #24292f;
                --md-preview-code-block-bg: #f0f0f0;
                --md-preview-code-block-text: #24292f;
                --md-preview-inline-code-bg: #eaeef2;
                --md-preview-inline-code-text: #24292f;
                --md-preview-quote-bg: rgba(9, 105, 218, 0.08);
                --md-preview-quote-border: #0969da;
                --md-preview-quote-text: #415568;
                --md-preview-link-color: #0969da;
                --md-scrollbar-thumb-app: #d0d7de;
                --md-scrollbar-track-app: #f6f8fa;
            }

            /* Toolbar Styles */
            #${appPrefix}-container .${appPrefix}-toolbar { /* Higher specificity */
                display: flex; flex-wrap: nowrap; justify-content: space-between; align-items: center;
                padding: 6px 10px; background-color: var(--md-toolbar-bg);
                border-bottom: 1px solid var(--md-toolbar-border); flex-shrink: 0; min-height: 38px;
            }
            #${appPrefix}-container .${appPrefix}-toolbar-section { display: flex; align-items: center; gap: 4px; }
            #${appPrefix}-container .${appPrefix}-toolbar-section-format {
                flex-grow: 1; justify-content: center; overflow-x: auto;
                scrollbar-width: none; -ms-overflow-style: none; padding: 0 5px;
            }
            #${appPrefix}-container .${appPrefix}-toolbar-section-format::-webkit-scrollbar { display: none; }
            #${appPrefix}-container .${appPrefix}-toolbar-section-format button i { font-size: 0.9em !important; }
            #${appPrefix}-container .${appPrefix}-toolbar-section-format button { padding: 5px 7px !important; }
            #${appPrefix}-container .${appPrefix}-toolbar button {
                background-color: var(--md-button-bg); color: var(--md-button-text);
                border: 1px solid transparent; padding: 6px 8px; border-radius: 4px;
                cursor: pointer; transition: background-color 0.15s ease, border-color 0.15s ease;
                display: inline-flex; align-items: center; gap: 4px;
                font-size: 0.85em; min-width: auto; white-space: nowrap;
            }
            #${appPrefix}-container .${appPrefix}-toolbar button:hover { background-color: var(--md-button-hover-bg); border-color: var(--md-border-editor); }
            #${appPrefix}-container .${appPrefix}-toolbar button i { font-size: 1em; margin: 0; vertical-align: middle; }
            #${appPrefix}-container .${appPrefix}-separator { width: 1px; height: 18px; background-color: var(--md-border-editor); margin: 0 4px; flex-shrink: 0; }
            #${appPrefix}-container .${appPrefix}-toolbar-section-file, #${appPrefix}-container .${appPrefix}-toolbar-section-status { flex-shrink: 0; }
            #${appPrefix}-container .${appPrefix}-status-box {
                min-width: 80px; height: 26px; display: flex; align-items: center; justify-content: center;
                padding: 0 8px; background-color: var(--md-status-bg);
                border: 1px solid var(--md-border-editor); border-radius: 4px; margin-left: 5px;
            }
            #${appPrefix}-container .${appPrefix}-status { font-size: 0.8em; color: var(--md-status-text); white-space: nowrap; }

            /* Editor Area & Preview General Styles */
            #${appPrefix}-container .${appPrefix}-editor-area { display: flex; flex-grow: 1; overflow: hidden; }
            #${appPrefix}-container #${appPrefix}-markdown-input, #${appPrefix}-container #${appPrefix}-preview-output {
                flex: 1; padding: 15px 20px; overflow-y: auto; height: 100%; box-sizing: border-box;
                scrollbar-width: thin; scrollbar-color: var(--md-scrollbar-thumb-app) var(--md-scrollbar-track-app);
            }
            #${appPrefix}-container #${appPrefix}-markdown-input::-webkit-scrollbar, #${appPrefix}-container #${appPrefix}-preview-output::-webkit-scrollbar { width: 10px; }
            #${appPrefix}-container #${appPrefix}-markdown-input::-webkit-scrollbar-track, #${appPrefix}-container #${appPrefix}-preview-output::-webkit-scrollbar-track { background: var(--md-scrollbar-track-app); }
            #${appPrefix}-container #${appPrefix}-markdown-input::-webkit-scrollbar-thumb, #${appPrefix}-container #${appPrefix}-preview-output::-webkit-scrollbar-thumb { background: var(--md-scrollbar-thumb-app); border-radius: 5px; border: 2px solid var(--md-scrollbar-track-app); }
            #${appPrefix}-container #${appPrefix}-markdown-input {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 0.95em; line-height: 1.6;
                border: none; border-right: 1px solid var(--md-border-editor); resize: none; outline: none;
                background-color: var(--md-bg-editor); color: var(--md-text-editor);
                white-space: pre-wrap; word-wrap: break-word;
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body {
                background-color: var(--md-bg-editor);
                color: var(--md-preview-text);
                line-height: 1.7;
                word-wrap: break-word;
                overflow-wrap: break-word;
                font-size: var(--md-preview-font-size-main);
            }

            /* Markdown Body Element Specific Styles for Preview Pane */
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body h1,
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body h2 {
                border-bottom: 1px solid var(--md-border-editor); padding-bottom: 0.3em; color: var(--md-preview-text);
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body h1 { font-size: 2em; margin-top:0.5em; margin-bottom: 0.6em; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body h2 { font-size: 1.6em; margin-top:1em; margin-bottom: 0.5em; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body h3 { font-size: 1.35em; margin-top:1em; margin-bottom: 0.4em; color: var(--md-preview-text); }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body p { margin-bottom: 1em; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body ul, #${appPrefix}-container #${appPrefix}-preview-output.markdown-body ol { margin-bottom: 1em; padding-left: 2.5em; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body li > p { margin-bottom: 0.2em; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body table {
                border-collapse: collapse; margin-bottom: 1.2em; width: auto; border: 1px solid var(--md-border-editor);
                display: block; overflow-x: auto; font-size: 0.9em;
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body th, #${appPrefix}-container #${appPrefix}-preview-output.markdown-body td {
                border: 1px solid var(--md-border-editor); padding: 0.6em 0.8em;
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body th { background-color: var(--md-toolbar-bg); font-weight: 600; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body img {
                max-width: 100%; height: auto; border-radius: 4px; margin: 0.5em 0; border: 1px solid var(--md-border-editor);
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body a { color: var(--md-preview-link-color); text-decoration: none; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body a:hover { text-decoration: underline; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body hr {
                height: 0.25em; padding: 0; margin: 24px 0; background-color: var(--md-border-editor); border: 0;
            }

            /* Blockquote Styling */
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body blockquote {
                border-left: 5px solid var(--md-preview-quote-border);
                padding: 0.8em 1.2em; margin: 1.2em 0;
                color: var(--md-preview-quote-text);
                background-color: var(--md-preview-quote-bg);
                border-radius: 0 4px 4px 0;
                font-size: var(--md-preview-font-size-quote);
                line-height: 1.6;
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body blockquote p { color: inherit; margin-bottom: 0.5em; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body blockquote p:last-child { margin-bottom: 0; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body blockquote > :first-child { margin-top: 0; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body blockquote > :last-child { margin-bottom: 0; }

            /* Inline Code Styling */
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body code:not(pre > code) {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
                background-color: var(--md-preview-inline-code-bg);
                color: var(--md-preview-inline-code-text);
                padding: 0.2em 0.4em;
                border-radius: 4px;
                font-size: var(--md-preview-font-size-code);
                border: 1px solid var(--md-border-editor);
            }

            /* Code Block Styling */
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body pre {
                background-color: var(--md-preview-code-block-bg);
                color: var(--md-preview-code-block-text);
                padding: 1em; border-radius: 5px; overflow-x: auto;
                margin-bottom: 1.2em; border: 1px solid var(--md-border-editor);
                white-space: pre-wrap; word-break: break-all;
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
                font-size: var(--md-preview-font-size-code);
                line-height: 1.5;
            }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body pre > code {
                background-color: transparent !important; color: inherit !important;
                padding: 0 !important; border: none !important;
                font-size: inherit !important; line-height: inherit !important;
                white-space: inherit !important; word-break: inherit !important;
                font-family: inherit !important;
            }
            /* Example: Basic syntax highlighting (can be expanded if marked.js adds classes) */
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body pre .hljs-keyword { color: var(--md-preview-link-color); font-weight: bold; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body pre .hljs-string { color: #92c274; }
            #${appPrefix}-container.app-light-mode #${appPrefix}-preview-output.markdown-body pre .hljs-string { color: #208837; }
            #${appPrefix}-container #${appPrefix}-preview-output.markdown-body pre .hljs-comment { color: var(--md-status-text); font-style: italic; }
        `;
        contentEl.prepend(style);


        // --- Get DOM Elements ---
        const container = contentEl.querySelector(`#${appPrefix}-container`);
        const markdownInput = contentEl.querySelector(`#${appPrefix}-markdown-input`);
        const previewOutput = contentEl.querySelector(`#${appPrefix}-preview-output`);
        const themeToggleButton = contentEl.querySelector(`#${appPrefix}-theme-toggle`);
        const newDocButton = contentEl.querySelector(`#${appPrefix}-new-doc`);
        const saveMdButton = contentEl.querySelector(`#${appPrefix}-save-md`);
        const saveHtmlButton = contentEl.querySelector(`#${appPrefix}-save-html`);
        const statusElement = contentEl.querySelector(`#${appPrefix}-status`);
        const formatToolbar = contentEl.querySelector(`.${appPrefix}-toolbar-section-format`);

        // --- Formatting Functions ---
        function applyFormat(type) {
            const ta = markdownInput;
            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const selectedText = ta.value.substring(start, end);
            let before = ta.value.substring(0, start);
            let after = ta.value.substring(end);

            let prefix = '', suffix = '', placeholder = '';
            let newStart = start, newEnd = end;

            const currentLineStartPos = ta.value.lastIndexOf('\n', start - 1) + 1;
            const isAtStartOfLine = start === currentLineStartPos;
            const needsNewLinePrefix = (start > 0 && ta.value[start - 1] !== '\n');

            switch (type) {
                case 'bold': prefix = '**'; suffix = '**'; placeholder = 'bold text'; break;
                case 'italic': prefix = '*'; suffix = '*'; placeholder = 'italic text'; break;
                case 'strikethrough': prefix = '~~'; suffix = '~~'; placeholder = 'strike'; break;
                case 'h1': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n\n' : (isAtStartOfLine ? '' : '\n')) + '# '; placeholder = 'Heading 1'; suffix = '\n'; break;
                case 'h2': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n\n' : (isAtStartOfLine ? '' : '\n')) + '## '; placeholder = 'Heading 2'; suffix = '\n'; break;
                case 'h3': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n\n' : (isAtStartOfLine ? '' : '\n')) + '### '; placeholder = 'Heading 3'; suffix = '\n'; break;
                case 'ul': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n' : '') + '- '; placeholder = 'List item'; break;
                case 'ol': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n' : '') + '1. '; placeholder = 'List item'; break;
                case 'quote': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n' : '') + '> '; placeholder = 'Quote'; break;
                case 'code': prefix = '`'; suffix = '`'; placeholder = 'code'; break;
                case 'codeblock': prefix = (needsNewLinePrefix && !isAtStartOfLine ? '\n\n' : '\n') + '```\n'; suffix = '\n```\n'; placeholder = 'code block'; break;
                case 'hr':
                    before = before + (needsNewLinePrefix && !isAtStartOfLine ? '\n\n' : (isAtStartOfLine ? '' : '\n'));
                    prefix = '---';
                    after = '\n' + after;
                    break;
                case 'link':
                    const url = prompt("Enter URL:", "https://");
                    if (url === null) return;
                    prefix = '[';
                    suffix = `](${url || 'https://example.com'})`;
                    placeholder = 'link text';
                    break;
                case 'image':
                    const imgUrl = prompt("Enter Image URL:", "https://");
                    if (imgUrl === null) return; // User cancelled URL prompt

                    const sizeInput = prompt("Enter image size (small, medium, large, or a custom width e.g., 200px, 50%):", "medium");
                    if (sizeInput === null) return; // User cancelled size prompt

                    let imgWidthAttribute = "";
                    const sanitizedSizeInput = sizeInput.toLowerCase().trim();

                    switch (sanitizedSizeInput) {
                        case 'small':
                            imgWidthAttribute = 'width="150"'; // HTML width attribute implies pixels
                            break;
                        case 'medium':
                            imgWidthAttribute = 'width="300"';
                            break;
                        case 'large':
                            imgWidthAttribute = 'width="500"';
                            break;
                        default:
                            // Check for patterns like "200px", "50%", or just "200"
                            if (/^\d+(\.\d+)?px$/i.test(sanitizedSizeInput)) { // e.g., 200px
                                imgWidthAttribute = `width="${parseInt(sanitizedSizeInput, 10)}"`;
                            } else if (/^\d+(\.\d+)?%$/.test(sanitizedSizeInput)) { // e.g., 50%
                                imgWidthAttribute = `width="${sanitizedSizeInput}"`;
                            } else if (/^\d+(\.\d+)?$/.test(sanitizedSizeInput)) { // Just a number, assume px
                                imgWidthAttribute = `width="${sanitizedSizeInput}"`;
                            } else {
                                alert("Invalid size. Defaulting to medium (300px width). Please use 'small', 'medium', 'large', a pixel value (e.g., '200' or '200px'), or a percentage (e.g., '50%').");
                                imgWidthAttribute = 'width="300"'; // Fallback
                            }
                            break;
                    }

                    const defaultAltTextForImage = 'alt text'; // Placeholder for the alt attribute
                    let imageHtmlToInsert;
                    let finalCursorStart, finalCursorEnd;

                    if (selectedText) {
                        // Use selected text as alt text
                        imageHtmlToInsert = `<img src="${imgUrl || 'https://via.placeholder.com/150'}" alt="${selectedText}" ${imgWidthAttribute}>`;
                        ta.value = before + imageHtmlToInsert + after;
                        finalCursorStart = start + imageHtmlToInsert.length; // Place cursor after the inserted image
                        finalCursorEnd = finalCursorStart;
                    } else {
                        // Insert image with placeholder alt text and select it for editing
                        imageHtmlToInsert = `<img src="${imgUrl || 'https://via.placeholder.com/150'}" alt="${defaultAltTextForImage}" ${imgWidthAttribute}>`;
                        ta.value = before + imageHtmlToInsert + after;
                        // Calculate position to select the default alt text
                        const altTextStartIndexInHtml = imageHtmlToInsert.indexOf(`alt="${defaultAltTextForImage}"`) + `alt="`.length;
                        finalCursorStart = before.length + altTextStartIndexInHtml;
                        finalCursorEnd = finalCursorStart + defaultAltTextForImage.length;
                    }

                    ta.focus();
                    ta.setSelectionRange(finalCursorStart, finalCursorEnd);
                    updatePreview();
                    autoSaveContent();
                    return; // IMPORTANT: Return here to skip default prefix/suffix logic below
            }

            // This part is for other formatting options that use prefix/suffix
            if (selectedText) {
                ta.value = before + prefix + selectedText + suffix + after;
                newStart = start + prefix.length;
                newEnd = newStart + selectedText.length;
            } else {
                ta.value = before + prefix + placeholder + suffix + after;
                newStart = start + prefix.length;
                newEnd = newStart + placeholder.length;
            }

            ta.focus();
            ta.setSelectionRange(newStart, newEnd);

            updatePreview();
            autoSaveContent();
        }


        formatToolbar.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-format]');
            if (button && button.dataset.format) {
                applyFormat(button.dataset.format);
            }
        });

        // --- Core Logic Functions (Mostly same, check marked.js init and updatePreview) ---
        async function loadMarked() {
            statusElement.textContent = 'Loading parser...';
            try {
                if (typeof window.marked === 'undefined') {
                    const response = await fetch(MARKED_CDN_URL);
                    if (!response.ok) throw new Error(`Workspace failed: ${response.statusText}`);
                    const scriptText = await response.text();
                    (new Function(scriptText))();
                }
                if (typeof window.marked === 'object' && typeof window.marked.parse === 'function') {
                    markedParser = window.marked;
                    markedParser.setOptions({
                        gfm: true,
                        breaks: true,
                        pedantic: false,
                        mangle: false,
                        headerIds: false,
                        // highlight: function(code, lang) { ... } // Remains commented out
                    });
                    initializeEditor();
                } else {
                    throw new Error('marked.js did not initialize correctly.');
                }
            } catch (error) {
                console.error('Error loading or initializing marked.js:', error);
                statusElement.textContent = 'Parser Error!';
                previewOutput.innerHTML = `<p style="color: red; font-weight:bold;">Error: Markdown rendering unavailable.</p><p>${error.message}</p>`;
            }
        }

        function updatePreview() {
            if (!markedParser) {
                statusElement.textContent = 'Parser not ready.';
                return;
            }
            const markdownText = markdownInput.value;
            try {
                previewOutput.innerHTML = markedParser.parse(markdownText);
                statusElement.textContent = 'Rendered';
            } catch (e) {
                console.error("Markdown parsing error:", e);
                previewOutput.innerHTML = `<p style="color:red;">Render Error!</p>`;
                statusElement.textContent = 'Render Error!';
            }
        }

        function autoSaveContent() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                localStorage.setItem(LOCALSTORAGE_CONTENT_KEY_PREFIX + windowId, markdownInput.value);
                statusElement.textContent = 'Saved ✓';
            }, 1000);
        }

        function loadContent() {
            const instanceContent = localStorage.getItem(LOCALSTORAGE_CONTENT_KEY_PREFIX + windowId);
            const genericContent = localStorage.getItem('simplexMdEditor_content'); // Kept for backward compatibility if needed
            if (instanceContent !== null) {
                markdownInput.value = instanceContent;
            } else if (genericContent !== null) {
                markdownInput.value = genericContent;
            } else {
                markdownInput.value = `# Welcome to Markdown Editor!\n\nUse the toolbar or type Markdown.\n\n## Code & Quotes Test\n\nInline \`code\` example. And some *italic* text.\n\n\`\`\`javascript\nfunction test() {\n  console.log("This is a JS code block.");\n  // Check the styling!\n  const anotherLine = "Ensure this wraps if very long";\n}\n\`\`\`\n\n> This is a blockquote.\n> It should have a distinct background, border, and slightly smaller font.\n> And specific text color.\n\nTry inserting an image with the new size option!\n<img src="https://via.placeholder.com/150" alt="test image" width="150">\n\nAnother paragraph for normal text size.`;
            }
        }

        function newDocument() {
            if (confirm("Create a new document? This will clear the current content.")) {
                markdownInput.value = '';
                updatePreview();
                autoSaveContent();
                markdownInput.focus();
            }
        }

        function downloadFile(filename, content, mimeType) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            statusElement.textContent = `Downloaded`;
        }

        function setTheme(theme) {
            const themeIcon = themeToggleButton.querySelector('i');
            const appContainerElement = contentEl.querySelector(`#${appPrefix}-container`);
            if (!appContainerElement) return;

            if (theme === 'dark') {
                appContainerElement.classList.remove('app-light-mode');
                appContainerElement.classList.add('app-dark-mode'); // Ensure this class is used if not already
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                themeToggleButton.title = "Switch to Light Theme";
            } else {
                appContainerElement.classList.remove('app-dark-mode');
                appContainerElement.classList.add('app-light-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                themeToggleButton.title = "Switch to Dark Theme";
            }
            localStorage.setItem(LOCALSTORAGE_THEME_KEY, theme);
        }

        function toggleTheme() {
            const appContainerElement = contentEl.querySelector(`#${appPrefix}-container`);
            if (!appContainerElement) return;
            // Check presence of dark mode class, or if neither exists assume default (dark) and switch to light.
            if (appContainerElement.classList.contains('app-dark-mode') || (!appContainerElement.classList.contains('app-light-mode') && !appContainerElement.classList.contains('app-dark-mode'))) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        }
        

        function loadAppTheme() {
            const savedTheme = localStorage.getItem(LOCALSTORAGE_THEME_KEY);
            setTheme(savedTheme || 'dark'); // Default to dark theme
        }

        markdownInput.addEventListener('keydown', function(e) {
            const ta = markdownInput;
            if (e.ctrlKey || e.metaKey) {
                let handled = true;
                switch (e.key.toLowerCase()) {
                    case 'b': applyFormat('bold'); break;
                    case 'i': applyFormat('italic'); break;
                    default: handled = false; break;
                }
                if (handled) e.preventDefault();
            }
            if (e.key === 'Enter') {
                const currentLineStart = ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1;
                const currentLine = ta.value.substring(currentLineStart, ta.selectionStart);
                const listMatch = currentLine.match(/^(\s*(?:[-*+]|\d+\.)\s+)/);
                if (listMatch && currentLine.trim() === listMatch[0].trim()) { // Line is empty except for list marker
                    // Remove the list marker
                    ta.value = ta.value.substring(0, currentLineStart) + ta.value.substring(ta.selectionStart);
                    ta.selectionStart = ta.selectionEnd = currentLineStart;
                    e.preventDefault();
                } else if (listMatch) { // Continue list
                    e.preventDefault();
                    let nextListItem = '\n';
                    const indent = currentLine.match(/^\s*/)[0]; // Preserve indentation
                    if (listMatch[1].match(/([-*+]\s+)/)) { // Unordered list
                        nextListItem += indent + listMatch[1].match(/([-*+]\s+)/)[0];
                    } else { // Ordered list
                        const num = parseInt(listMatch[1]);
                        nextListItem += indent + listMatch[1].replace(/\d+/, num + 1);
                    }
                    const startPos = ta.selectionStart;
                    ta.value = ta.value.substring(0, startPos) + nextListItem + ta.value.substring(ta.selectionEnd);
                    ta.selectionStart = ta.selectionEnd = startPos + nextListItem.length;
                }
                // No explicit call to updatePreview/autoSaveContent here as it's on input/keydown for other keys
            }
             // Call autosave and preview update on relevant key events
            if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
                // Delay slightly to allow character to be inserted for 'Enter' continuation logic
                setTimeout(() => {
                    updatePreview();
                    autoSaveContent();
                }, 0);
            }
        });

        function initializeEditor() {
            loadAppTheme();
            loadContent();
            updatePreview(); // Initial render after content is loaded

            markdownInput.addEventListener('input', () => {
                updatePreview();
                autoSaveContent();
            });

            themeToggleButton.addEventListener('click', toggleTheme);
            newDocButton.addEventListener('click', newDocument);
            saveMdButton.addEventListener('click', () => {
                downloadFile('document.md', markdownInput.value, 'text/markdown;charset=utf-8');
            });
            saveHtmlButton.addEventListener('click', () => {
                const appContainerElement = contentEl.querySelector(`#${appPrefix}-container`);
                if(markedParser && appContainerElement) {
                    const isDarkMode = appContainerElement.classList.contains('app-dark-mode') || 
                                   (!appContainerElement.classList.contains('app-light-mode') && getComputedStyle(appContainerElement).getPropertyValue('--md-bg-app').includes('22272e')); // Fallback check for default dark
                    const themeClass = isDarkMode ? 'theme-dark' : 'theme-light';
                    
                    const currentStyles = getComputedStyle(appContainerElement); 
                    
                    // Helper to get resolved CSS variable values
                    const getResolvedVar = (varName, fallbackLightTheme, fallbackDarkTheme) => {
                        const resolvedValue = currentStyles.getPropertyValue(varName).trim();
                        // If the resolved value is one of the generic OS fallbacks, use app-specific fallbacks
                        if (resolvedValue === 'var(--os-bg-primary-fallback)' || resolvedValue === 'var(--os-text-primary-fallback)' || resolvedValue === '' || resolvedValue.startsWith('var(--bg-primary')) {
                             return isDarkMode ? fallbackDarkTheme : fallbackLightTheme;
                        }
                        return resolvedValue;
                    };

                    const exportStyles = `
                        body {
                            font-family: sans-serif; line-height: 1.6; padding: 20px;
                            max-width: 800px; margin: auto;
                            font-size: ${getResolvedVar('--md-preview-font-size-main', '1em', '1em')};
                        }
                        body.theme-dark {
                            background-color: ${getResolvedVar('--md-bg-editor', '#ffffff', '#2d333b')};
                            color: ${getResolvedVar('--md-preview-text', '#24292f', '#adbac7')};
                        }
                        body.theme-light {
                            background-color: ${getResolvedVar('--md-bg-editor', '#ffffff', '#2d333b')};
                            color: ${getResolvedVar('--md-preview-text', '#24292f', '#adbac7')};
                        }
                        img { max-width: 100%; height: auto; border-radius: 4px; border: 1px solid ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')}; }
                        pre {
                            padding: 1em; border-radius: 5px; overflow-x: auto; 
                            border: 1px solid ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')};
                            white-space: pre-wrap; word-break: break-all;
                            font-size: ${getResolvedVar('--md-preview-font-size-code', '0.9em', '0.9em')};
                            background-color: ${getResolvedVar('--md-preview-code-block-bg', '#f0f0f0', '#1c2128')};
                            color: ${getResolvedVar('--md-preview-code-block-text', '#24292f', '#c9d1d9')};
                        }
                        code:not(pre > code) {
                            padding: .2em .4em; margin: 0; border-radius: 3px; 
                            border: 1px solid ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')};
                            font-size: ${getResolvedVar('--md-preview-font-size-code', '0.9em', '0.9em')};
                            background-color: ${getResolvedVar('--md-preview-inline-code-bg', '#eaeef2', '#444c56')};
                            color: ${getResolvedVar('--md-preview-inline-code-text', '#24292f', '#c9d1d9')};
                        }
                        blockquote {
                            padding: 0.8em 1.2em; margin: 1.2em 0; border-left-width: 5px; border-left-style: solid;
                            border-radius: 0 4px 4px 0;
                            font-size: ${getResolvedVar('--md-preview-font-size-quote', '0.95em', '0.95em')};
                            border-color: ${getResolvedVar('--md-preview-quote-border', '#0969da', '#539bf5')};
                            color: ${getResolvedVar('--md-preview-quote-text', '#415568', '#a1c0df')};
                            background-color: ${getResolvedVar('--md-preview-quote-bg', 'rgba(9, 105, 218, 0.08)', 'rgba(83, 155, 245, 0.12)')};
                        }
                        a { text-decoration: none; color: ${getResolvedVar('--md-preview-link-color', '#0969da', '#539bf5')}; }
                        a:hover { text-decoration: underline; }
                        table { border-collapse: collapse; margin-bottom: 1em; font-size: 0.9em; border: 1px solid ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')};}
                        th, td { border: 1px solid ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')}; padding: 0.5em; }
                        th { background-color: ${getResolvedVar('--md-toolbar-bg', '#f6f8fa', '#22272e')}; }
                        h1, h2 { border-bottom: 1px solid ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')}; padding-bottom: 0.3em; }
                        hr { height: 0.25em; padding: 0; margin: 24px 0; background-color: ${getResolvedVar('--md-border-editor', '#d0d7de', '#444c56')}; border: 0; }
                    `;
                    const fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Markdown Document</title>\n  <style>\n    ${exportStyles}\n  </style>\n</head>\n<body class="${themeClass}">\n${markedParser.parse(markdownInput.value)}\n</body>\n</html>`;
                    downloadFile('document.html', fullHtml, 'text/html;charset=utf-8');
                } else {
                    alert("Markdown parser not ready.");
                }
            });

            let isSyncing = false;
            const syncScroll = (source, target) => {
                if (isSyncing) return;
                isSyncing = true;
                const sh = source.scrollHeight - source.clientHeight;
                if (sh <=0) { isSyncing = false; return; } // Avoid division by zero or negative
                const scrollPercentage = source.scrollTop / sh;

                const th = target.scrollHeight - target.clientHeight;
                if (th <=0) { isSyncing = false; return; } // Avoid issues if target isn't scrollable
                target.scrollTop = scrollPercentage * th;
                
                // RAF or shorter timeout might be smoother but 30ms is generally fine
                setTimeout(() => { isSyncing = false; }, 30); 
            };
            markdownInput.addEventListener('scroll', () => syncScroll(markdownInput, previewOutput));
            previewOutput.addEventListener('scroll', () => syncScroll(previewOutput, markdownInput));

            markdownInput.focus();
            statusElement.textContent = 'Ready';
        }

        loadMarked();

        // --- Cleanup Function ---
        // Ensure this cleanup is correctly registered by the Simplex OS shell when the window is closed
        if (typeof openWindows !== 'undefined' && openWindows[windowId] && typeof openWindows[windowId].setCleanup === 'function') {
            openWindows[windowId].setCleanup(() => {
                clearTimeout(autoSaveTimeout);
                // Final save attempt before closing
                if (markdownInput && markdownInput.value) { // Check if markdownInput still exists
                    localStorage.setItem(LOCALSTORAGE_CONTENT_KEY_PREFIX + windowId, markdownInput.value);
                }
                const styleTag = document.getElementById(`${appPrefix}-styles`);
                if (styleTag) {
                    styleTag.remove();
                }
                console.log(`Markdown Editor ${windowId} cleaned up.`);
            });
        } else if (typeof openWindows !== 'undefined' && openWindows[windowId]) { // Fallback for older cleanup registration
             openWindows[windowId].cleanup = () => {
                clearTimeout(autoSaveTimeout);
                if (markdownInput && markdownInput.value) {
                     localStorage.setItem(LOCALSTORAGE_CONTENT_KEY_PREFIX + windowId, markdownInput.value);
                }
                const styleTag = document.getElementById(`${appPrefix}-styles`);
                if (styleTag) {
                    styleTag.remove();
                }
            };
        }
    }
};