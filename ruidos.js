(function() {
    // 1. Injeta o CSS no cabeçalho da página
    const style = document.createElement('style');
    style.innerHTML = `
        #studyos-noise-widget {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        #studyos-noise-toggle {
            background: #2c3e50;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            font-size: 24px;
            transition: transform 0.2s, background 0.2s;
            float: right;
        }
        #studyos-noise-toggle:hover {
            transform: scale(1.05);
            background: #34495e;
        }
        #studyos-noise-panel {
            display: none;
            clear: both;
            background: #1e272e;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-top: 60px;
            width: 200px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }
        #studyos-noise-panel.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        #studyos-noise-panel button {
            display: block;
            width: 100%;
            margin: 6px 0;
            padding: 8px;
            background: #2c3e50;
            color: white;
            border: 1px solid #4bcffa;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
        }
        #studyos-noise-panel button:hover {
            background: #4bcffa;
            color: #1e272e;
        }
        #studyos-noise-panel button.active-noise {
            background: #0fbcf9;
            color: #1e272e;
            font-weight: bold;
        }
        #studyos-noise-panel button.stop-btn {
            border-color: #ff3f34;
            margin-top: 15px;
        }
        #studyos-noise-panel button.stop-btn:hover {
            background: #ff3f34;
            color: white;
        }
        #studyos-noise-volume {
            width: 100%;
            margin-top: 5px;
            cursor: pointer;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Injeta o HTML (Menu e Botões)
    const widget = document.createElement('div');
    widget.id = 'studyos-noise-widget';
    widget.innerHTML = `
        <button id="studyos-noise-toggle" title="Sons para Foco">🎧</button>
        <div id="studyos-noise-panel">
            <h4 style="margin: 0 0 12px 0; text-align: center; font-size: 16px;">Foco & Relaxamento</h4>
            <button class="noise-btn" data-type="white">Ruído Branco</button>
            <button class="noise-btn" data-type="pink">Ruído Rosa</button>
            <button class="noise-btn" data-type="brown">Ruído Marrom</button>
            <button class="stop-btn" data-type="stop">Parar Áudio</button>
            
            <div style="margin-top: 15px;">
                <label style="display:block; font-size: 12px; color: #808e9b;">Volume:</label>
                <input type="range" id="studyos-noise-volume" min="0" max="1" step="0.01" value="0.05">
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // 3. Lógica de Áudio (Web Audio API)
    let audioCtx;
    let currentSource = null;
    let gainNode = null;
    
    const panel = document.getElementById('studyos-noise-panel');
    const toggleBtn = document.getElementById('studyos-noise-toggle');
    const volumeSlider = document.getElementById('studyos-noise-volume');
    const noiseBtns = document.querySelectorAll('.noise-btn');

    // Abre/Fecha o menu
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    // Função para gerar os buffers de ruído matematicamente
    function createNoiseBuffer(type) {
        const bufferSize = audioCtx.sampleRate * 5; // 5 segundos em loop
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);

        let lastOut = 0;
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
            let white = Math.random() * 2 - 1;
            
            if (type === 'white') {
                output[i] = white;
            } 
            else if (type === 'brown') { // Frequências baixas (som de cachoeira forte)
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // Compensação de ganho
            } 
            else if (type === 'pink') { // Equilíbrio (som de chuva/vento)
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; 
                b6 = white * 0.115926;
            }
        }
        return buffer;
    }

    function playNoise(type) {
        // Inicializa o contexto de áudio na primeira interação (regra dos navegadores)
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioCtx.createGain();
            gainNode.connect(audioCtx.destination);
            gainNode.gain.value = volumeSlider.value;
        }

        stopNoise();

        const buffer = createNoiseBuffer(type);
        currentSource = audioCtx.createBufferSource();
        currentSource.buffer = buffer;
        currentSource.loop = true;
        currentSource.connect(gainNode);
        currentSource.start();
        
        // Atualiza UI
        noiseBtns.forEach(btn => btn.classList.remove('active-noise'));
        document.querySelector(\`button[data-type="\${type}"]\`).classList.add('active-noise');
    }

    function stopNoise() {
        if (currentSource) {
            currentSource.stop();
            currentSource.disconnect();
            currentSource = null;
        }
        noiseBtns.forEach(btn => btn.classList.remove('active-noise'));
    }

    // 4. Event Listeners para os botões
    document.querySelectorAll('#studyos-noise-panel button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const type = e.target.getAttribute('data-type');
            if (type === 'stop') {
                stopNoise();
            } else {
                playNoise(type);
            }
        });
    });

    // Controle de volume em tempo real
    volumeSlider.addEventListener('input', (e) => {
        if (gainNode) {
            // Usa uma curva exponencial leve para que o controle de volume pareça mais natural ao ouvido humano
            gainNode.gain.value = e.target.value * e.target.value; 
        }
    });

})();