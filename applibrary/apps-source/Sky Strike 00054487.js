var simplexOS_AppConfig = {
    name: "Sky Strike",
    icon: '<i class="fa-solid fa-jet-fighter"></i>',
    defaultSize: { width: 400, height: 540 },
    init: function(contentEl, windowId) {
        // --- HTML Structure ---
        const appPrefix = `skystrike-${windowId}`;
        contentEl.style.padding = '0';
        contentEl.style.overflow = 'hidden';
        contentEl.style.backgroundColor = '#111';
        contentEl.style.display = 'flex';
        contentEl.style.flexDirection = 'column';

        contentEl.innerHTML = `
            <style>
                #${appPrefix}-container { flex-grow: 1; position: relative; overflow: hidden; background: #000; outline: none; touch-action: none; }
                #${appPrefix}-canvas { display: block; width: 100%; height: 100%; object-fit: contain; }
                
                /* Overlay UI */
                #${appPrefix}-ui { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(0,0,0,0.7); }
                .${appPrefix}-text { color: white; font-family: 'Courier New', Courier, monospace; text-align: center; text-shadow: 2px 2px 0 #000; }
                
                /* HUD */
                #${appPrefix}-hud { position: absolute; top: 10px; left: 15px; right: 15px; display: flex; justify-content: space-between; pointer-events: none; align-items: flex-start; }
                .score-container { display: flex; flex-direction: column; align-items: flex-start; }
                #${appPrefix}-score { font-size: 1.2em; font-weight: bold; color: #00FFcc; text-shadow: 2px 2px 0 #000; font-family: 'Courier New', Courier, monospace; }
                #${appPrefix}-highscore { font-size: 0.8em; color: #888; font-weight: bold; text-shadow: 1px 1px 0 #000; font-family: 'Courier New', Courier, monospace; transition: color 0.3s; }
                
                .right-hud { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; pointer-events: auto; }
                #${appPrefix}-mode-display { font-size: 1em; color: #ffcc00; text-shadow: 2px 2px 0 #000; font-family: 'Courier New', Courier, monospace; pointer-events: none;}
                #${appPrefix}-sound-toggle { color: white; cursor: pointer; font-size: 1.2em; background: rgba(255,255,255,0.2); padding: 5px; border-radius: 5px; transition: background 0.2s; }
                #${appPrefix}-sound-toggle:hover { background: rgba(255,255,255,0.4); }
                
                /* Menus */
                #${appPrefix}-message { font-size: 2.5em; font-weight: bold; margin-bottom: 5px; color: #fff; }
                #${appPrefix}-submessage { font-size: 0.9em; margin-bottom: 25px; color: #ccc; line-height: 1.4; }
                #${appPrefix}-menu { display: flex; gap: 8px; pointer-events: auto; }
                
                .sky-diff-btn { padding: 8px 12px; border: 2px solid #fff; border-radius: 5px; font-weight: bold; font-family: 'Courier New', Courier, monospace; font-size: 0.9em; cursor: pointer; transition: transform 0.1s, filter 0.1s; display: flex; flex-direction: column; align-items: center; user-select: none; -webkit-tap-highlight-color: transparent; }
                .sky-diff-btn span.key-hint { font-size: 0.7em; opacity: 0.7; margin-top: 3px; }
                .sky-diff-btn:hover { transform: scale(1.05); filter: brightness(1.2); }
                .sky-diff-btn:active { transform: scale(0.95); }
                
                #${appPrefix}-btn-easy { background: #28a745; color: white; }
                #${appPrefix}-btn-medium { background: #fd7e14; color: white; }
                #${appPrefix}-btn-hard { background: #dc3545; color: white; }
                
                /* Mobile Touch Controls */
                #${appPrefix}-controls { display: flex; height: 80px; background: #222; border-top: 2px solid #444; user-select: none; flex-shrink: 0; touch-action: none; }
                .sky-btn { flex: 1; display: flex; justify-content: center; align-items: center; color: white; font-size: 1.5em; background: #333; border: 1px solid #111; cursor: pointer; transition: background 0.1s; user-select: none; -webkit-tap-highlight-color: transparent; }
                .sky-btn:active { background: #555; }
                .sky-btn-shoot { flex: 2; background: #b00; font-weight: bold; }
                .sky-btn-shoot:active { background: #f00; }
            </style>
            
            <div id="${appPrefix}-container" tabindex="0">
                <canvas id="${appPrefix}-canvas"></canvas>
                <div id="${appPrefix}-hud">
                    <div class="score-container">
                        <div id="${appPrefix}-score">SCORE: 0</div>
                        <div id="${appPrefix}-highscore">HIGH: 0</div>
                    </div>
                    <div class="right-hud">
                        <i id="${appPrefix}-sound-toggle" class="fa-solid fa-volume-high" title="Toggle Sound"></i>
                        <div id="${appPrefix}-mode-display"></div>
                    </div>
                </div>
                
                <div id="${appPrefix}-ui">
                    <div id="${appPrefix}-message" class="${appPrefix}-text">SKY STRIKE</div>
                    <div id="${appPrefix}-submessage" class="${appPrefix}-text">SELECT DIFFICULTY OR PRESS [1, 2, 3]</div>
                    <div id="${appPrefix}-menu">
                        <button class="sky-diff-btn" id="${appPrefix}-btn-easy">EASY <span class="key-hint">[1]</span></button>
                        <button class="sky-diff-btn" id="${appPrefix}-btn-medium">MED <span class="key-hint">[2]</span></button>
                        <button class="sky-diff-btn" id="${appPrefix}-btn-hard">HARD <span class="key-hint">[3]</span></button>
                    </div>
                </div>
            </div>
            
            <!-- Touch Controls (Bottom Bar) -->
            <div id="${appPrefix}-controls">
                <div class="sky-btn" id="${appPrefix}-left" title="Left Arrow or A"><i class="fa-solid fa-arrow-left"></i></div>
                <div class="sky-btn sky-btn-shoot" id="${appPrefix}-shoot" title="Space or Up Arrow">FIRE</div>
                <div class="sky-btn" id="${appPrefix}-right" title="Right Arrow or D"><i class="fa-solid fa-arrow-right"></i></div>
            </div>
        `;

        // --- Elements & Context ---
        const gameContainer = contentEl.querySelector(`#${appPrefix}-container`);
        const canvas = contentEl.querySelector(`#${appPrefix}-canvas`);
        const ctx = canvas.getContext('2d');
        const scoreEl = contentEl.querySelector(`#${appPrefix}-score`);
        const highScoreEl = contentEl.querySelector(`#${appPrefix}-highscore`);
        const modeDisplayEl = contentEl.querySelector(`#${appPrefix}-mode-display`);
        const soundToggleBtn = contentEl.querySelector(`#${appPrefix}-sound-toggle`);
        const uiEl = contentEl.querySelector(`#${appPrefix}-ui`);
        const msgEl = contentEl.querySelector(`#${appPrefix}-message`);
        const subMsgEl = contentEl.querySelector(`#${appPrefix}-submessage`);
        
        const btnEasy = contentEl.querySelector(`#${appPrefix}-btn-easy`);
        const btnMedium = contentEl.querySelector(`#${appPrefix}-btn-medium`);
        const btnHard = contentEl.querySelector(`#${appPrefix}-btn-hard`);
        
        const btnLeft = contentEl.querySelector(`#${appPrefix}-left`);
        const btnRight = contentEl.querySelector(`#${appPrefix}-right`);
        const btnShoot = contentEl.querySelector(`#${appPrefix}-shoot`);

        // --- Game Resolution ---
        canvas.width = 400;
        canvas.height = 500;

        // --- Audio Engine (8-bit Synth) ---
        let audioCtx = null;
        let soundEnabled = true;

        function playSound(type) {
            if (!soundEnabled) return;
            
            // Lazy load audio context (required for mobile Safari)
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            const now = audioCtx.currentTime;

            if (type === 'shoot') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } 
            else if (type === 'explosion') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 0.2);
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            } 
            else if (type === 'gameover') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(30, now + 1.0);
                gainNode.gain.setValueAtTime(0.2, now);
                gainNode.gain.linearRampToValueAtTime(0.001, now + 1.0);
                osc.start(now);
                osc.stop(now + 1.0);
            }
            else if (type === 'start') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(660, now + 0.1);
                osc.frequency.setValueAtTime(880, now + 0.2);
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.linearRampToValueAtTime(0.001, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        }

        // --- Difficulty Settings ---
        const diffSettings = {
            easy:   { spawnRate: 70, speedMin: 1.5, speedMax: 2.5, pSpeed: 6.0, drift: 0.0, scoreMult: 50,  color: '#ff9999' },
            medium: { spawnRate: 45, speedMin: 2.5, speedMax: 4.5, pSpeed: 5.0, drift: 0.5, scoreMult: 100, color: '#ff5500' },
            hard:   { spawnRate: 25, speedMin: 4.0, speedMax: 7.0, pSpeed: 4.5, drift: 2.0, scoreMult: 250, color: '#cc0000' }
        };

        // --- Game State Variables ---
        let animationId;
        let isPlaying = false;
        let score = 0;
        let frameCount = 0;
        let currentMode = 'medium'; 
        
        let highScore = parseInt(localStorage.getItem('skystrike_highscore')) || 0;
        highScoreEl.textContent = `HIGH: ${highScore}`;

        let player;
        let bullets = [];
        let enemies = [];
        let stars = [];
        let particles = [];

        const keys = { left: false, right: false, shoot: false };
        let lastShootTime = 0;

        // --- Initialize Game Objects ---
        function initGame(mode) {
            currentMode = mode;
            score = 0;
            frameCount = 0;
            bullets = [];
            enemies = [];
            particles = [];
            
            scoreEl.textContent = `SCORE: ${score}`;
            highScoreEl.style.color = '#888';
            modeDisplayEl.textContent = `MODE: ${mode.toUpperCase()}`;
            modeDisplayEl.style.color = mode === 'easy' ? '#28a745' : (mode === 'medium' ? '#fd7e14' : '#dc3545');
            
            player = {
                x: canvas.width / 2 - 20,
                y: canvas.height - 60,
                width: 40,
                height: 40,
                speed: diffSettings[mode].pSpeed,
                color: '#00ccff'
            };

            stars = [];
            for(let i=0; i<60; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speed: Math.random() * 3 + 1
                });
            }
        }

        // --- Create Explosion ---
        function createExplosion(x, y, color) {
            for(let i=0; i<15; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 1.0,
                    decay: Math.random() * 0.05 + 0.02,
                    color: Math.random() > 0.5 ? color : '#ffffff'
                });
            }
        }

        // --- Game Loop ---
        function update() {
            if (!isPlaying) return;
            const settings = diffSettings[currentMode];
            
            // Background
            ctx.fillStyle = '#0a0a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Stars
            ctx.fillStyle = '#ffffff';
            stars.forEach(star => {
                star.y += star.speed;
                if(star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
                ctx.fillRect(star.x, star.y, star.size, star.size);
            });

            // Player Movement
            if (keys.left && player.x > 0) player.x -= player.speed;
            if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;

            // Player Shooting
            if (keys.shoot && Date.now() - lastShootTime > 150) {
                bullets.push({
                    x: player.x + player.width / 2 - 3,
                    y: player.y,
                    width: 6,
                    height: 18,
                    speed: 12,
                    color: '#ffff00'
                });
                playSound('shoot'); 
                lastShootTime = Date.now();
            }

            // Draw Player
            ctx.fillStyle = player.color;
            ctx.beginPath();
            ctx.moveTo(player.x + player.width/2, player.y);
            ctx.lineTo(player.x + player.width, player.y + player.height);
            ctx.lineTo(player.x + player.width/2, player.y + player.height - 10);
            ctx.lineTo(player.x, player.y + player.height);
            ctx.fill();

            // Bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                let b = bullets[i];
                b.y -= b.speed;
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x, b.y, b.width, b.height);
                if (b.y < -20) bullets.splice(i, 1);
            }

            // Enemies
            if (frameCount % settings.spawnRate === 0) {
                enemies.push({
                    x: Math.random() * (canvas.width - 30),
                    y: -30,
                    width: 30,
                    height: 30,
                    speed: Math.random() * (settings.speedMax - settings.speedMin) + settings.speedMin,
                    drift: (Math.random() - 0.5) * settings.drift,
                    color: settings.color
                });
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                e.y += e.speed;
                e.x += e.drift;
                
                if (e.x < 0 || e.x + e.width > canvas.width) e.drift *= -1;
                
                ctx.fillStyle = e.color;
                ctx.fillRect(e.x, e.y, e.width, e.height);

                if (rectIntersect(player, e)) {
                    createExplosion(player.x + player.width/2, player.y + player.height/2, '#00ccff');
                    gameOver();
                    return; 
                }

                let hit = false;
                for (let j = bullets.length - 1; j >= 0; j--) {
                    let b = bullets[j];
                    if (rectIntersect(b, e)) {
                        createExplosion(e.x + e.width/2, e.y + e.height/2, e.color);
                        playSound('explosion'); 
                        
                        bullets.splice(j, 1);
                        enemies.splice(i, 1);
                        score += settings.scoreMult;
                        scoreEl.textContent = `SCORE: ${score}`;
                        
                        if (score > highScore) {
                            highScore = score;
                            highScoreEl.textContent = `HIGH: ${highScore}`;
                            highScoreEl.style.color = '#ffcc00';
                        }
                        
                        hit = true;
                        break; 
                    }
                }

                if (!hit && e.y > canvas.height) enemies.splice(i, 1);
            }

            // Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                
                if (p.life <= 0) {
                    particles.splice(i, 1);
                } else {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(p.x, p.y, 4, 4);
                    ctx.globalAlpha = 1.0; 
                }
            }

            frameCount++;
            animationId = requestAnimationFrame(update);
        }

        function rectIntersect(r1, r2) {
            return !(r2.x > r1.x + r1.width || 
                     r2.x + r2.width < r1.x || 
                     r2.y > r1.y + r1.height ||
                     r2.y + r2.height < r1.y);
        }

        // --- Game Controls Logic ---
        function startGame(mode) {
            playSound('start'); 
            initGame(mode);
            uiEl.style.display = 'none';
            isPlaying = true;
            gameContainer.focus();
            update();
        }

        function gameOver() {
            isPlaying = false;
            keys.shoot = false; keys.left = false; keys.right = false; 
            
            playSound('gameover'); 
            localStorage.setItem('skystrike_highscore', highScore);
            
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (let p of particles) {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, 4, 4);
            }
            ctx.globalAlpha = 1.0;
            
            cancelAnimationFrame(animationId);
            
            setTimeout(() => {
                uiEl.style.display = 'flex';
                msgEl.textContent = "GAME OVER";
                msgEl.style.color = '#ff3333';
                
                let isNewRecord = (score === highScore && score > 0);
                subMsgEl.innerHTML = `FINAL SCORE: <span style="color:#fff; font-weight:bold;">${score}</span>` + 
                                     (isNewRecord ? `<br><span style="color:#ffcc00; font-weight:bold;">★ NEW HIGH SCORE! ★</span>` : '') +
                                     `<br><br>PRESS [SPACE] TO RESTART OR CHOOSE:`;
            }, 500); 
        }

        // --- Universal Button Touch/Click Handler ---
        // This ensures mobile devices respond instantly without the 300ms click delay
        const bindButton = (element, callback) => {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevents double-firing from synthetic click
                callback(e);
            }, {passive: false});
            element.addEventListener('click', (e) => {
                e.preventDefault();
                callback(e);
            });
        };

        // Menu Button Listeners
        bindButton(btnEasy, () => startGame('easy'));
        bindButton(btnMedium, () => startGame('medium'));
        bindButton(btnHard, () => startGame('hard'));

        // Sound Toggle Listener
        bindButton(soundToggleBtn, (e) => {
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            soundToggleBtn.className = soundEnabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
            soundToggleBtn.style.color = soundEnabled ? "white" : "#888";
            gameContainer.focus();
        });

        // Click on background to regain focus
        contentEl.addEventListener('mousedown', () => gameContainer.focus());

        // --- Keyboard Events ---
        const handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault(); 
            }

            const k = e.key.toLowerCase();
            if (k === 'arrowleft' || k === 'a') keys.left = true;
            if (k === 'arrowright' || k === 'd') keys.right = true;
            if (k === ' ' || k === 'arrowup') keys.shoot = true;

            if (!isPlaying) {
                if (k === '1') startGame('easy');
                if (k === '2') startGame('medium');
                if (k === '3') startGame('hard');
                if (k === ' ' || k === 'enter') startGame(currentMode); 
            }
        };

        const handleKeyUp = (e) => {
            const k = e.key.toLowerCase();
            if (k === 'arrowleft' || k === 'a') keys.left = false;
            if (k === 'arrowright' || k === 'd') keys.right = false;
            if (k === ' ' || k === 'arrowup') keys.shoot = false;
        };

        const handleBlur = () => {
            keys.left = false;
            keys.right = false;
            keys.shoot = false;
        };

        gameContainer.addEventListener('keydown', handleKeyDown);
        gameContainer.addEventListener('keyup', handleKeyUp);
        gameContainer.addEventListener('blur', handleBlur);

        // --- Bottom Control Pad Touch Events ---
        const addControl = (element, keyName) => {
            // Mouse
            element.addEventListener('mousedown', (e) => { e.preventDefault(); keys[keyName] = true; });
            element.addEventListener('mouseup', (e) => { e.preventDefault(); keys[keyName] = false; });
            element.addEventListener('mouseleave', (e) => { e.preventDefault(); keys[keyName] = false; });
            
            // Touch
            element.addEventListener('touchstart', (e) => { e.preventDefault(); keys[keyName] = true; }, {passive: false});
            element.addEventListener('touchend', (e) => { e.preventDefault(); keys[keyName] = false; }, {passive: false});
            element.addEventListener('touchcancel', (e) => { e.preventDefault(); keys[keyName] = false; }, {passive: false});
        };

        addControl(btnLeft, 'left');
        addControl(btnRight, 'right');
        addControl(btnShoot, 'shoot');

        // Initial setup
        initGame('medium');
        isPlaying = false; 
        ctx.fillStyle = '#0a0a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        setTimeout(() => gameContainer.focus(), 100);

        // --- Cleanup (Runs when window is closed) ---
        if (openWindows[windowId]) {
            openWindows[windowId].cleanup = () => {
                isPlaying = false;
                cancelAnimationFrame(animationId);
                if (audioCtx && audioCtx.state !== 'closed') {
                    audioCtx.close();
                }
            };
        }
    }
};