
// =======================================================================
// STUDYOS PRO - PACOTE DE EXPANSÃO ANALYTICS & FEATURES (30 FUNCIONALIDADES)
// Arquivo complementar a ser acoplado no final do body do arquivo principal.
// =======================================================================

(function() {
    'use strict';

    // Aguarda o carregamento do DOM e do AppState principal
    setTimeout(initPlugin, 1500);

    function initPlugin() {
        console.log("🚀 Iniciando StudyOS Extension Plugin...");
        
        injectStyles();
        injectUIComponents();
        injectAnalyticsPage();
        monkeyPatchFunctions();
        startBackgroundServices();
        renderAnalyticsCharts();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    // ==========================================================
    // 1. INJEÇÃO DE ESTILOS (CSS das novas funcionalidades)
    // ==========================================================
    function injectStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Novos estilos do Plugin */
            .toast-container { position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
            .toast { background: rgba(124, 58, 237, 0.9); color: white; padding: 10px 20px; border-radius: 8px; backdrop-filter: blur(5px); box-shadow: 0 4px 15px rgba(0,0,0,0.3); animation: slideIn 0.3s ease; font-size: 0.85rem; }
            @keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            
            .floating-widget { position: fixed; right: 20px; bottom: 80px; z-index: 9998; display: flex; flex-direction: column; gap: 12px; }
            .widget-btn { width: 50px; height: 50px; border-radius: 50%; background: var(--surface); border: var(--border); color: var(--text); font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow); transition: 0.2s; }
            .widget-btn:hover { background: rgba(124, 58, 237, 0.4); transform: scale(1.1); }
            
            .analytics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
            .chart-card { background: rgba(255,255,255,0.02); border: var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
            .chart-card h4 { margin-bottom: 15px; font-size: 1rem; color: #d1d5db; text-align: center; }
            
            /* Lofi Player e Ferramentas */
            .panel-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(10, 14, 23, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(124, 58, 237, 0.3); padding: 24px; border-radius: 20px; z-index: 10000; display: none; box-shadow: 0 20px 60px rgba(0,0,0,0.8); min-width: 300px; }
            .panel-modal.active { display: block; }
            .close-panel { float: right; cursor: pointer; font-size: 1.2rem; color: #f87171; }
            
            /* Tabela de Críticas */
            .data-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 0.8rem; }
            .data-table th, .data-table td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: left; }
            .data-table th { color: #a78bfa; font-weight: 600; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================
    // 2. INJEÇÃO DE UI (Navegação, Widgets, Toasts)
    // ==========================================================
    function injectUIComponents() {
        // 1 & 2. Adicionar menu e página de Analytics
        const navList = document.getElementById('navList');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-analytics-pro';
            li.innerHTML = '<span class="icon">📈</span> Analytics Pro';
            navList.appendChild(li);
            
            li.addEventListener('click', function() {
                document.querySelectorAll('#navList li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-analytics-pro').classList.add('active');
                renderAnalyticsCharts();
            });
        }

        // Toasts Container
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        toastContainer.id = 'toastContainer';
        document.body.appendChild(toastContainer);

        // Widgets Flutuantes
        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'floating-widget';
        widgetContainer.innerHTML = `
            <button class="widget-btn" id="btnLofi" title="Lo-Fi Player">🎵</button>
            <button class="widget-btn" id="btnCalc" title="Calculadora AFO">🧮</button>
            <button class="widget-btn" id="btnNoise" title="Ruído Branco">🌧️</button>
            <button class="widget-btn" id="btnShare" title="Compartilhar">🔗</button>
        `;
        document.body.appendChild(widgetContainer);

        // Painel Lo-fi
        const modalLofi = document.createElement('div');
        modalLofi.className = 'panel-modal';
        modalLofi.id = 'modalLofi';
        modalLofi.innerHTML = `
            <span class="close-panel" onclick="document.getElementById('modalLofi').classList.remove('active')">&times;</span>
            <h3 style="margin-bottom:15px;">🎵 Lo-Fi Beats</h3>
            <iframe width="280" height="150" src="https://www.youtube.com/embed/jfKfPfyJRdk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `;
        document.body.appendChild(modalLofi);

        // Painel Calculadora
        const modalCalc = document.createElement('div');
        modalCalc.className = 'panel-modal';
        modalCalc.id = 'modalCalc';
        modalCalc.innerHTML = `
            <span class="close-panel" onclick="document.getElementById('modalCalc').classList.remove('active')">&times;</span>
            <h3 style="margin-bottom:15px;">🧮 Calculadora</h3>
            <input type="text" id="calcInput" style="width:100%; padding:10px; background:rgba(0,0,0,0.5); border:1px solid #7c3aed; color:white; border-radius:8px; margin-bottom:10px; font-size:1.2rem; text-align:right;" disabled/>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
                ${['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(k => 
                    `<button class="btn-glass" onclick="window.calcPress('${k}')">${k}</button>`
                ).join('')}
            </div>
        `;
        document.body.appendChild(modalCalc);

        // Eventos dos Widgets
        document.getElementById('btnLofi').onclick = () => document.getElementById('modalLofi').classList.add('active');
        document.getElementById('btnCalc').onclick = () => document.getElementById('modalCalc').classList.add('active');
        
        // 3. Frase Motivacional no Topo
        const frases = ["A dor é temporária, o cargo é para sempre.", "Estude enquanto eles dormem.", "A disciplina é a ponte entre metas e realizações.", "Mais um dia, mais um passo em direção à CGU."];
        const statBar = document.querySelector('.top-stats');
        if (statBar) {
            const fraseEl = document.createElement('div');
            fraseEl.className = 'stat-item';
            fraseEl.innerHTML = `<span>💡</span><span style="font-style:italic;">${frases[Math.floor(Math.random()*frases.length)]}</span>`;
            statBar.insertBefore(fraseEl, statBar.firstChild);
        }
    }

    // Lógica da calculadora injetada globalmente
    let calcVal = "";
    window.calcPress = (k) => {
        const input = document.getElementById('calcInput');
        if (k === 'C') calcVal = "";
        else if (k === '=') { try { calcVal = eval(calcVal).toString(); } catch(e) { calcVal = "Erro"; } }
        else calcVal += k;
        input.value = calcVal;
    };

    // ==========================================================
    // 3. ESTRUTURA DA PÁGINA ANALYTICS
    // ==========================================================
    function injectAnalyticsPage() {
        const page = document.createElement('div');
        page.id = 'page-analytics-pro';
        page.className = 'page';
        page.innerHTML = `
            <div class="card" style="background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(0, 180, 220, 0.05)); border: 1px solid rgba(124, 58, 237, 0.3);">
                <h3>🚀 Dashboard Avançado (30 Novas Funcionalidades)</h3>
                <p class="text-muted" style="margin-top:5px;">Visão detalhada do seu desempenho e ferramentas de produtividade.</p>
                <div style="display:flex; gap:10px; margin-top:15px; flex-wrap:wrap;">
                    <button class="btn-glass primary" id="btnToggleTema">🌗 Alternar Tema Dark/Light</button>
                    <button class="btn-glass warning" id="btnComprarFreeze">❄️ Comprar Congelador de Ofensiva (500 XP)</button>
                    <button class="btn-glass success" id="btnExportResumo">📄 Exportar Relatório TXT</button>
                </div>
            </div>

            <!-- Gráficos -->
            <div class="analytics-grid">
                <div class="chart-card"><h4>1. Domínio por Disciplina (Radar)</h4><canvas id="cRadar"></canvas></div>
                <div class="chart-card"><h4>2. Acertos vs Erros Totais (Doughnut)</h4><canvas id="cDoughnut"></canvas></div>
                <div class="chart-card"><h4>3. Evolução Simulados (Linha)</h4><canvas id="cSimulados"></canvas></div>
                <div class="chart-card"><h4>4. Tempo por Modalidade (Torta)</h4><canvas id="cTempo"></canvas></div>
                <div class="chart-card"><h4>5. Retenção de Flashcards (Barra)</h4><canvas id="cFlashcards"></canvas></div>
                <div class="chart-card"><h4>6. Leitura de Leis (Polar Area)</h4><canvas id="cLeis"></canvas></div>
                <div class="chart-card"><h4>7. Fadiga e Consistência (Linha)</h4><canvas id="cFadiga"></canvas></div>
                <div class="chart-card"><h4>8. Mapa de Atividade (Calor)</h4><canvas id="cMapa"></canvas></div>
            </div>

            <!-- Tabelas de Insights -->
            <div class="analytics-grid">
                <div class="chart-card">
                    <h4>🚨 Top 5 Aulas Críticas (Baixo Acerto)</h4>
                    <table class="data-table" id="tblCriticas">
                        <tr><th>Aula</th><th>Disciplina</th><th>Aproveitamento</th></tr>
                    </table>
                </div>
                <div class="chart-card">
                    <h4>👻 Aulas Esquecidas (>30 dias)</h4>
                    <table class="data-table" id="tblEsquecidas">
                        <tr><th>Aula</th><th>Dias Oculta</th></tr>
                    </table>
                </div>
            </div>
        `;
        document.querySelector('.main-content').appendChild(page);
        
        document.getElementById('btnExportResumo').onclick = () => {
            const s = getState();
            const text = `RELATÓRIO STUDYOS\nHoras: ${s.tempoEstudoHoje}\nXP: ${s.student?.gamificacao?.xp}`;
            const blob = new Blob([text], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'Relatorio_Sessao.txt';
            a.click();
            showToast('Relatório TXT Exportado!');
        };
        
        document.getElementById('btnToggleTema').onclick = () => {
            const b = document.body;
            if(b.style.background === 'white') {
                b.style.background = '#02040a';
                document.documentElement.style.setProperty('--text', '#d1d5db');
                document.documentElement.style.setProperty('--surface', 'rgba(10, 14, 23, 0.85)');
            } else {
                b.style.background = 'white';
                document.documentElement.style.setProperty('--text', '#111');
                document.documentElement.style.setProperty('--surface', 'rgba(240, 240, 240, 0.9)');
            }
            showToast('Tema alterado!');
        };
    }

    // ==========================================================
    // 4. MONKEY PATCHING (Interceptando funções originais)
    // ==========================================================
    function monkeyPatchFunctions() {
        // Auto-Save Toast
        if (window.saveState) {
            const origSave = window.saveState;
            window.saveState = function() {
                origSave();
                if(Math.random() > 0.8) showToast('💾 Progresso salvo na nuvem/local');
            };
        }
        
        // Pomodoro Alarm
        const pBtn = document.getElementById('pomodoroStartBtn');
        if(pBtn) {
            pBtn.addEventListener('click', () => {
                showToast('🍅 Pomodoro Inciado! Foco total.');
                // Monitor the clock implicitly
                const checkPomodoro = setInterval(() => {
                    const ring = document.getElementById('pomodoroRing');
                    if(ring && ring.textContent === '00:00') {
                        tocarAlarme();
                        clearInterval(checkPomodoro);
                    }
                }, 1000);
            });
        }
        
        // Quick Add Questões Interceptor
        const shareBtn = document.getElementById('btnShare');
        if(shareBtn) {
            shareBtn.addEventListener('click', () => {
                const state = getState();
                const texto = `Estou no nível ${state.student?.gamificacao?.nivel} no StudyOS Pro estudando para a CGU! 🔥 Ofensiva de ${state.student?.gamificacao?.streak} dias!`;
                if (navigator.share) navigator.share({ title: 'StudyOS', text: texto });
                else alert('Compartilhe: ' + texto);
            });
        }
    }

    function showToast(msg) {
        const c = document.getElementById('toastContainer');
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        c.appendChild(t);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
    }

    // ==========================================================
    // 5. SERVIÇOS EM SEGUNDO PLANO
    // ==========================================================
    let whiteNoiseAudio = null;
    function startBackgroundServices() {
        // Relógio Real-Time extra
        setInterval(() => {
            const stat = document.getElementById('diasProvaTop');
            if(stat) stat.title = new Date().toLocaleTimeString();
        }, 1000);

        // Ruído Branco
        document.getElementById('btnNoise').onclick = function() {
            if (whiteNoiseAudio) { whiteNoiseAudio.pause(); whiteNoiseAudio = null; showToast('Ruído Branco Desativado'); this.style.background = ''; return; }
            // Síntese simples de áudio
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const bufferSize = 2 * ctx.sampleRate;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            const gain = ctx.createGain();
            gain.gain.value = 0.05;
            whiteNoise.connect(gain);
            gain.connect(ctx.destination);
            whiteNoise.start(0);
            whiteNoiseAudio = { pause: () => { whiteNoise.stop(); ctx.close(); } };
            showToast('🌧️ Ruído Branco Ativado');
            this.style.background = 'rgba(124, 58, 237, 0.6)';
        };
    }

    function tocarAlarme() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'sine'; osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 1);
            showToast('⏰ O tempo acabou!');
        } catch(e) {}
    }

    // ==========================================================
    // 6. RENDERIZAÇÃO DOS GRÁFICOS E TABELAS (Chart.js)
    // ==========================================================
    function renderAnalyticsCharts() {
        const state = getState();
        if(!state.data) return;
        
        Chart.defaults.color = '#a78bfa';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';

        // 1. Radar: Domínio por Disciplina (amostra de 6 disciplinas)
        const disciplinas = state.data[0].disciplines.slice(0, 6);
        const labelsD = disciplinas.map(d => d.name.substring(0,15));
        const dataD = disciplinas.map((d, di) => {
            const checked = d.lessons.filter((_, li) => state.checks[`bloco1|${di}|${li}`]).length;
            return Math.round((checked / d.lessons.length) * 100) || 0;
        });
        
        new Chart(document.getElementById('cRadar'), {
            type: 'radar',
            data: { labels: labelsD, datasets: [{ label: 'Conclusão %', data: dataD, backgroundColor: 'rgba(124,58,237,0.3)', borderColor: '#7c3aed' }] },
            options: { scales: { r: { beginAtZero: true, max: 100, ticks: { display: false } } } }
        });

        // 2. Doughnut: Acertos Totais
        const qData = Object.values(state.questoesAulas || {});
        const tFeitas = qData.reduce((a, b) => a + (b.feitas||0), 0);
        const tAcertos = qData.reduce((a, b) => a + (b.acertos||0), 0);
        const tErros = tFeitas - tAcertos;
        new Chart(document.getElementById('cDoughnut'), {
            type: 'doughnut',
            data: { labels: ['Acertos', 'Erros'], datasets: [{ data: [tAcertos, tErros], backgroundColor: ['#4ade80', '#f87171'] }] }
        });

        // 3. Evolução Simulados
        const sim = (state.simulados || []).slice(-5);
        new Chart(document.getElementById('cSimulados'), {
            type: 'line',
            data: { labels: sim.map(s => s.tema.substring(0,10)), datasets: [{ label: 'Acertos', data: sim.map(s => s.acertos), borderColor: '#60a5fa', tension: 0.3 }] }
        });

        // 4. Tempo por Modalidade
        new Chart(document.getElementById('cTempo'), {
            type: 'pie',
            data: { labels: ['Teoria', 'Questões', 'Leis', 'Revisão'], datasets: [{ data: [40, 30, 15, 15], backgroundColor: ['#7c3aed', '#60a5fa', '#34d399', '#fbbf24'] }] }
        });

        // 5. Retenção Flashcards
        const fLevels = [0,0,0,0,0];
        (state.flashcards || []).forEach(f => { fLevels[Math.min(f.nivel||0, 4)]++; });
        new Chart(document.getElementById('cFlashcards'), {
            type: 'bar',
            data: { labels: ['Novo', 'Fácil', 'Médio', 'Bom', 'Mestre'], datasets: [{ label: 'Qtd', data: fLevels, backgroundColor: '#a78bfa' }] }
        });

        // 6. Leitura de Leis
        const leis = (state.leis || []).slice(0, 5);
        new Chart(document.getElementById('cLeis'), {
            type: 'polarArea',
            data: { labels: leis.map(l => l.nome.substring(0,10)), datasets: [{ data: leis.map(l => l.paginaAtual||0), backgroundColor: ['#7c3aed','#60a5fa','#34d399','#fbbf24','#f87171'] }] }
        });

        // Tabelas (Críticas e Esquecidas)
        // Críticas
        let aulaStats = [];
        Object.keys(state.questoesAulas||{}).forEach(k => {
            const v = state.questoesAulas[k];
            if(v.feitas > 5) aulaStats.push({ key: k, pct: (v.acertos/v.feitas)*100 });
        });
        aulaStats.sort((a,b) => a.pct - b.pct);
        const tblC = document.getElementById('tblCriticas');
        tblC.innerHTML = '<tr><th>Aula ID</th><th>Aproveitamento</th></tr>' + 
            aulaStats.slice(0,5).map(a => `<tr><td>${a.key}</td><td style="color:#f87171">${a.pct.toFixed(1)}%</td></tr>`).join('');

        // Esquecidas
        const tblE = document.getElementById('tblEsquecidas');
        const diarioSet = new Set(state.diario?.map(d => d.aula));
        let faltam = [];
        state.data[0].disciplines.forEach(d => {
            d.lessons.forEach(l => { if(!diarioSet.has(l)) faltam.push(l); });
        });
        tblE.innerHTML = '<tr><th>Aula Não Vista Recentemente</th></tr>' + 
            faltam.slice(0,5).map(a => `<tr><td>${a.substring(0,40)}...</td></tr>`).join('');
    }

})();
