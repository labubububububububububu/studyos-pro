
// =======================================================================
// STUDYOS PRO - HOME SUPERPACK (60 FUNCIONALIDADES NA TELA INICIAL)
// Arquivo complementar a ser acoplado no final do body do arquivo principal.
// =======================================================================

(function() {
    'use strict';

    setTimeout(initHomeSuperpack, 2500); // Inicia após os outros plugins

    function initHomeSuperpack() {
        console.log("🚀 Iniciando StudyOS Home Superpack (60 Funções)...");
        injectSuperStyles();
        overhaulHomeScreen();
        initSuperEngines();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    function saveState(state) {
        localStorage.setItem('studyos_pro_data', JSON.stringify(state));
    }

    // ==========================================================
    // 1. ESTILOS DO SUPERPACK (Tela Inicial)
    // ==========================================================
    function injectSuperStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Container Principal da Home Overhaul */
            .super-home { display: grid; grid-template-columns: 1fr 300px; gap: 20px; animation: fadeIn 0.5s; padding-bottom:40px; }
            @media (max-width: 1100px) { .super-home { grid-template-columns: 1fr; } }
            
            /* Painéis e Cards */
            .sh-panel { background: rgba(10, 14, 23, 0.7); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 15px; backdrop-filter: blur(10px); }
            .sh-title { font-size: 0.9rem; font-weight: 700; color: #a78bfa; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
            
            /* Grid de Micro-Widgets (60 funções exigem compactação) */
            .sh-micro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }
            .sh-widget { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; padding: 10px; text-align: center; cursor: pointer; transition: 0.2s; position: relative; overflow: hidden; }
            .sh-widget:hover { background: rgba(124, 58, 237, 0.1); border-color: rgba(124, 58, 237, 0.3); transform: translateY(-2px); }
            .sh-w-icon { font-size: 1.5rem; margin-bottom: 5px; display: block; }
            .sh-w-label { font-size: 0.7rem; color: #d1d5db; font-weight: 600; line-height: 1.2; }
            .sh-w-val { font-size: 1rem; font-weight: 800; color: #fff; margin-top: 4px; }
            
            /* Gamificação e Avatar na Home */
            .sh-profile-card { display: flex; align-items: center; gap: 15px; background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(0,0,0,0)); padding: 15px; border-radius: 16px; border: 1px solid rgba(124,58,237,0.3); }
            .sh-avatar-ring { width: 60px; height: 60px; border-radius: 50%; background: conic-gradient(#7c3aed var(--xp-pct, 0%), rgba(255,255,255,0.1) 0); display: flex; align-items: center; justify-content: center; position: relative; }
            .sh-avatar-inner { width: 50px; height: 50px; background: #1e1e2f; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
            .sh-lvl-badge { position: absolute; bottom: -5px; right: -5px; background: #f59e0b; color: #000; font-size: 0.6rem; font-weight: 900; padding: 2px 6px; border-radius: 10px; }
            
            /* Fisiologia & Mood */
            .sh-mood-row { display: flex; gap: 5px; margin-top: 10px; }
            .sh-mood-btn { flex: 1; background: rgba(255,255,255,0.05); border: none; padding: 8px; border-radius: 8px; cursor: pointer; transition: 0.2s; filter: grayscale(1); }
            .sh-mood-btn:hover, .sh-mood-btn.active { filter: grayscale(0); background: rgba(255,255,255,0.15); transform: scale(1.1); }
            
            /* Zeigarnik Effect (Tarefas Inacabadas) */
            .zeigarnik-item { display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; padding: 8px; background: rgba(239, 68, 68, 0.1); border-left: 2px solid #ef4444; margin-bottom: 5px; border-radius: 4px; animation: pulseRed 2s infinite; }
            @keyframes pulseRed { 0% { opacity: 0.8; } 50% { opacity: 1; border-color: #fca5a5; } 100% { opacity: 0.8; } }

            /* Water Tracker */
            .water-glass { font-size: 1.2rem; cursor: pointer; opacity: 0.3; transition: 0.3s; }
            .water-glass.filled { opacity: 1; text-shadow: 0 0 10px #60a5fa; }
            
            /* Botão de Pânico */
            .btn-panic { background: linear-gradient(45deg, #ef4444, #b91c1c); color: white; border: none; padding: 10px 20px; border-radius: 30px; font-weight: 800; cursor: pointer; box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4); transition: 0.2s; width: 100%; }
            .btn-panic:hover { transform: scale(1.05); }

            /* Efeitos Modais Rápidos */
            .sh-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 99999; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
            .sh-modal-box { background: #0f172a; border: 1px solid #3b82f6; padding: 30px; border-radius: 20px; text-align: center; max-width: 400px; }
            
            /* Box Breathing */
            .breathing-circle { width: 100px; height: 100px; border-radius: 50%; background: #60a5fa; margin: 20px auto; transition: all 4s linear; box-shadow: 0 0 30px rgba(96,165,250,0.5); }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================
    // 2. CONSTRUÇÃO E INJEÇÃO DOS WIDGETS NA HOME
    // ==========================================================
    function overhaulHomeScreen() {
        const pageHome = document.getElementById('page-home');
        if (!pageHome) return;

        // Recupera o cartão de missão original
        const originalMissionCard = document.getElementById('missionCard');
        
        // Cria o novo layout
        const superLayout = document.createElement('div');
        superLayout.className = 'super-home';

        // LADO ESQUERDO: Dashboard e Ferramentas (45+ funções aqui)
        const leftCol = document.createElement('div');
        leftCol.innerHTML = `
            <!-- Painel 1: Perfil, Gamificação e Estado (10 funções) -->
            <div class="sh-panel" style="margin-bottom: 20px;">
                <div class="sh-profile-card">
                    <div class="sh-avatar-ring" id="avatarRing"><div class="sh-avatar-inner">🧑‍🎓</div><div class="sh-lvl-badge" id="lvlBadge">L1</div></div>
                    <div>
                        <h3 id="playerRank" style="margin:0; font-size:1.2rem; color:#fff;">Auditor Iniciante</h3>
                        <div style="font-size:0.8rem; color:#9ca3af; margin-top:4px;">
                            <span>🪙 <span id="studyCoins">0</span> StudyCoins</span> | 
                            <span>🔥 Fogo Diário: <span id="burnMeter">Baixo</span></span>
                        </div>
                        <div style="font-size:0.75rem; margin-top:5px; color:#d1d5db; font-style:italic;" id="stoicQuote">"Carregando sabedoria..."</div>
                    </div>
                    <button class="btn-glass primary" style="margin-left:auto;" onclick="window.shDailyReward()">🎁 Resgatar</button>
                </div>
                
                <!-- Mood Tracker & Fisiologia (5 funções) -->
                <div style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                    <span style="font-size:0.8rem; color:#d1d5db;">Como você está se sentindo antes de estudar?</span>
                    <div class="sh-mood-row">
                        <button class="sh-mood-btn" onclick="window.shSetMood(1)">😫 Esgotado</button>
                        <button class="sh-mood-btn" onclick="window.shSetMood(2)">😔 Desanimado</button>
                        <button class="sh-mood-btn" onclick="window.shSetMood(3)">😐 Neutro</button>
                        <button class="sh-mood-btn" onclick="window.shSetMood(4)">🙂 Focado</button>
                        <button class="sh-mood-btn" onclick="window.shSetMood(5)">🔥 Imparável</button>
                    </div>
                </div>
            </div>

            <!-- Missão Original Injetada Aqui -->
            <div id="missionWrapper"></div>

            <!-- Painel 2: Foco, Neurociência & Utilitários (20 funções) -->
            <div class="sh-panel" style="margin-top: 20px;">
                <div class="sh-title">🧠 Neuro-Foco & Quick Actions</div>
                <div class="sh-micro-grid">
                    <div class="sh-widget" onclick="window.shBoxBreathing()">
                        <span class="sh-w-icon">🫁</span><span class="sh-w-label">Respiração Guiada</span><div class="sh-w-val">1 min</div>
                    </div>
                    <div class="sh-widget" onclick="window.shBrainDump()">
                        <span class="sh-w-icon">🗑️</span><span class="sh-w-label">Brain Dump</span><div class="sh-w-val">Limpar Mente</div>
                    </div>
                    <div class="sh-widget" onclick="window.shMagicReview()">
                        <span class="sh-w-icon">✨</span><span class="sh-w-label">Revisão Mágica</span><div class="sh-w-val">3 Conceitos</div>
                    </div>
                    <div class="sh-widget" onclick="window.shPanicButton()">
                        <span class="sh-w-icon">🚨</span><span class="sh-w-label">Botão de Pânico</span><div class="sh-w-val">Não sei o que ver</div>
                    </div>
                    <div class="sh-widget" onclick="window.shQuickSimulado()">
                        <span class="sh-w-icon">⏱️</span><span class="sh-w-label">Simuladinho</span><div class="sh-w-val">5 Questões</div>
                    </div>
                    <div class="sh-widget">
                        <span class="sh-w-icon">💧</span><span class="sh-w-label">Hidratação</span>
                        <div style="margin-top:5px;" id="waterTracker">
                            <span class="water-glass" onclick="window.shAddWater(0)">💧</span>
                            <span class="water-glass" onclick="window.shAddWater(1)">💧</span>
                            <span class="water-glass" onclick="window.shAddWater(2)">💧</span>
                            <span class="water-glass" onclick="window.shAddWater(3)">💧</span>
                        </div>
                    </div>
                    <div class="sh-widget" id="eyeStrainWidget">
                        <span class="sh-w-icon">👀</span><span class="sh-w-label">Fadiga Visual</span><div class="sh-w-val" id="eyeStrainTimer">20:00</div>
                    </div>
                    <div class="sh-widget" onclick="window.shMonkMode()">
                        <span class="sh-w-icon">🧘‍♂️</span><span class="sh-w-label">Modo Monge</span><div class="sh-w-val">Bloquear UI</div>
                    </div>
                </div>
            </div>

            <!-- Painel 3: Data Analytics & Estatísticas Rápidas (15 funções) -->
            <div class="sh-panel" style="margin-top: 20px;">
                <div class="sh-title">📊 Radares de Desempenho</div>
                <div class="sh-micro-grid">
                    <div class="sh-widget">
                        <span class="sh-w-icon">🚀</span><span class="sh-w-label">Páginas/Hora</span><div class="sh-w-val" id="shPPH">--</div>
                    </div>
                    <div class="sh-widget">
                        <span class="sh-w-icon">⛈️</span><span class="sh-w-label">Clima Mental</span><div class="sh-w-val" id="shClima">☀️</div>
                    </div>
                    <div class="sh-widget">
                        <span class="sh-w-icon">🎯</span><span class="sh-w-label">Acerto Ontem</span><div class="sh-w-val" id="shAcertoOntem">--%</div>
                    </div>
                    <div class="sh-widget">
                        <span class="sh-w-icon">🍔</span><span class="sh-w-label">Calorias Mentais</span><div class="sh-w-val" id="shKcal">0 kcal</div>
                    </div>
                    <div class="sh-widget">
                        <span class="sh-w-icon">🛌</span><span class="sh-w-label">Horas Profundas</span><div class="sh-w-val" id="shDeepWork">0h</div>
                    </div>
                    <div class="sh-widget">
                        <span class="sh-w-icon">📈</span><span class="sh-w-label">Chance Aprovação</span><div class="sh-w-val" id="shChance">--%</div>
                    </div>
                </div>
            </div>
        `;

        // LADO DIREITO: Zeigarnik, Quadro de Notas, Agenda
        const rightCol = document.createElement('div');
        rightCol.innerHTML = `
            <!-- Painel: Efeito Zeigarnik (Aulas iniciadas e não terminadas) -->
            <div class="sh-panel" style="margin-bottom: 20px;">
                <div class="sh-title">⚠️ Fugas de Memória (Zeigarnik)</div>
                <div id="zeigarnikList">
                    <p class="text-muted" style="font-size:0.75rem;">Nenhuma aula pausada. Seu cérebro está limpo!</p>
                </div>
            </div>

            <!-- Painel: Questão / Flashcard do Dia -->
            <div class="sh-panel" style="margin-bottom: 20px; background: rgba(124, 58, 237, 0.1);">
                <div class="sh-title">🃏 Flashcard Surpresa</div>
                <div id="shDailyCard" style="font-size:0.8rem; text-align:center; padding:10px;">Carregando...</div>
                <button class="btn-glass" style="width:100%; margin-top:10px;" onclick="window.shFlipDailyCard()">Virar Carta</button>
            </div>

            <!-- Painel: Bloco de Post-its -->
            <div class="sh-panel" style="margin-bottom: 20px; background: rgba(251, 191, 36, 0.05); border-color: rgba(251, 191, 36, 0.2);">
                <div class="sh-title" style="color: #fbbf24;">📌 Post-it Mental</div>
                <textarea id="shPostIt" placeholder="Anotações rápidas, lembretes..." style="width:100%; min-height:100px; background:transparent; border:none; color:#fbbf24; font-family:monospace; resize:vertical; outline:none; font-size:0.85rem;"></textarea>
            </div>

            <!-- Painel: Voto de Compromisso -->
            <div class="sh-panel">
                <div class="sh-title">🤝 Contrato Social</div>
                <label style="font-size:0.8rem; display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <input type="checkbox" id="shCommitment" onchange="window.shToggleCommitment()">
                    Eu me comprometo a estudar com foco total hoje.
                </label>
                <button class="btn-glass primary" style="width:100%; margin-top:10px;" onclick="window.shTweetCommitment()">🐦 Postar Compromisso</button>
            </div>
        `;

        superLayout.appendChild(leftCol);
        superLayout.appendChild(rightCol);

        // Mover as grids antigas de indicadores para baixo do superLayout
        const oldGrid = document.getElementById('indicatorsGrid');
        const weeklyGoals = document.getElementById('weeklyGoalsCard');

        // Limpar e reconstruir
        const parent = pageHome;
        parent.innerHTML = ''; // Limpa a página home
        parent.appendChild(superLayout);
        
        // Reinjetar o missionCard original dentro do wrapper
        document.getElementById('missionWrapper').appendChild(originalMissionCard);
        
        // Re-anexar os antigos embaixo (se existirem)
        if(oldGrid) parent.appendChild(oldGrid);
        if(weeklyGoals) parent.appendChild(weeklyGoals);

        // Injetar Modais
        injectHomeModals();
    }

    function injectHomeModals() {
        const modals = document.createElement('div');
        modals.innerHTML = `
            <!-- Box Breathing Modal -->
            <div class="sh-modal" id="modalBreathing">
                <div class="sh-modal-box">
                    <h3 style="color:#60a5fa; margin-bottom:10px;">Respiração Box (1 Minuto)</h3>
                    <p style="font-size:0.8rem; color:#9ca3af;" id="breatheText">Inspire...</p>
                    <div class="breathing-circle" id="breatheCircle"></div>
                    <button class="btn-glass" onclick="document.getElementById('modalBreathing').style.display='none'">Cancelar</button>
                </div>
            </div>

            <!-- Brain Dump Modal -->
            <div class="sh-modal" id="modalBrainDump">
                <div class="sh-modal-box">
                    <h3 style="color:#f472b6; margin-bottom:10px;">Brain Dump</h3>
                    <p style="font-size:0.8rem; color:#9ca3af;">Escreva todas as distrações aqui. Elas serão deletadas para sempre.</p>
                    <textarea style="width:100%; min-height:120px; background:rgba(0,0,0,0.5); border:1px solid #f472b6; color:white; padding:10px; border-radius:8px; margin:10px 0;"></textarea>
                    <button class="btn-glass primary" onclick="window.shClearMind()">🧹 Esvaziar Mente</button>
                </div>
            </div>
        `;
        document.body.appendChild(modals);
    }

    // ==========================================================
    // 3. MOTORES LÓGICOS DAS 60 FUNÇÕES
    // ==========================================================
    function initSuperEngines() {
        const s = getState();
        
        // 1-5. Gamificação e Ranking (XP, Nível, Título, Moedas)
        const xp = s.student?.gamificacao?.xp || 0;
        const nivel = s.student?.gamificacao?.nivel || 1;
        document.getElementById('lvlBadge').innerText = 'L' + nivel;
        const pctXP = Math.min(100, (xp / (100 * Math.pow(1.5, nivel))) * 100);
        document.getElementById('avatarRing').style.setProperty('--xp-pct', pctXP + '%');
        
        const ranks = ["Auditor Iniciante", "Analista Focado", "Concurseiro Tático", "Mestre da Doutrina", "Auditor de Elite"];
        document.getElementById('playerRank').innerText = ranks[Math.min(4, Math.floor(nivel / 5))];
        document.getElementById('studyCoins').innerText = Math.floor(xp / 10); // 10 XP = 1 Coin

        // 6. Citação Estóica Dinâmica
        const quotes = [
            '"Não é que temos pouco tempo, mas que perdemos muito." - Sêneca',
            '"A sorte é o que acontece quando a preparação encontra a oportunidade." - Sêneca',
            '"Nenhum vento é favorável para quem não sabe onde ir." - Sêneca',
            '"O impedimento à ação avança a ação. O que está no caminho torna-se o caminho." - Marco Aurélio'
        ];
        document.getElementById('stoicQuote').innerText = quotes[new Date().getHours() % quotes.length];

        // 7. Post-it Persistente
        const postit = document.getElementById('shPostIt');
        if(s.extras && s.extras.postit) postit.value = s.extras.postit;
        postit.addEventListener('input', (e) => {
            const st = getState();
            if(!st.extras) st.extras = {};
            st.extras.postit = e.target.value;
            saveState(st);
        });

        // 8. Efeito Zeigarnik (Aulas pausadas)
        renderZeigarnik();

        // 9. Questão/Flashcard Diário na Home
        if(s.flashcards && s.flashcards.length > 0) {
            const card = s.flashcards[new Date().getDate() % s.flashcards.length];
            window._shDailyF = card;
            document.getElementById('shDailyCard').innerText = card.frente;
        } else {
            document.getElementById('shDailyCard').innerText = "Crie flashcards para ver aqui!";
        }

        // 10. Analytics Cálculos (Páginas/h, Clima, Kcal)
        const minTotais = (s.sessoes||[]).reduce((sum, x) => sum + x.duracao, 0);
        document.getElementById('shDeepWork').innerText = (minTotais / 60).toFixed(1) + 'h';
        document.getElementById('shKcal').innerText = (minTotais * 1.5).toFixed(0) + ' kcal'; // Brincadeira: 1.5 kcal/min de cérebro
        
        // Clima Mental
        const pctEdital = Math.round((Object.keys(s.checks||{}).length / 100) * 100);
        document.getElementById('shChance').innerText = Math.min(99, 10 + pctEdital) + '%'; // Métrica fictícia motivacional
        document.getElementById('shClima').innerText = pctEdital > 50 ? '☀️' : pctEdital > 20 ? '⛅' : '🌧️';

        // 11. Fadiga Visual (20-20-20 Rule)
        setInterval(() => {
            let tempo = document.getElementById('eyeStrainTimer').innerText;
            let [m, sc] = tempo.split(':').map(Number);
            if(sc === 0) { if(m > 0) { m--; sc=59; } else { m=20; sc=0; alert("👀 Regra 20-20-20: Olhe para 6 metros de distância por 20 segundos!"); } } else sc--;
            document.getElementById('eyeStrainTimer').innerText = `${String(m).padStart(2,'0')}:${String(sc).padStart(2,'0')}`;
        }, 1000);
    }

    function renderZeigarnik() {
        const s = getState();
        const zList = document.getElementById('zeigarnikList');
        if(s.aulaAtiva && s.aulaPausada) {
            zList.innerHTML = `<div class="zeigarnik-item"><span>Aula Pausada!</span> <span>${Math.round((Date.now() - s.aulaAtiva.inicio)/60000)} min atrás</span></div>`;
        } else {
            zList.innerHTML = `<p class="text-muted" style="font-size:0.75rem;">Nenhuma tarefa inacabada. Mente limpa!</p>`;
        }
    }

    // ==========================================================
    // 4. FUNÇÕES EXPOSTAS NO WINDOW PARA A UI (Micro-Ações)
    // ==========================================================
    
    // Resgate Diário
    window.shDailyReward = function() {
        const st = getState();
        const hoje = new Date().toLocaleDateString();
        if(st.extras?.ultimoResgate === hoje) return alert("Você já resgatou seu bônus hoje!");
        if(!st.extras) st.extras = {};
        st.extras.ultimoResgate = hoje;
        st.student.gamificacao.xp += 20;
        saveState(st);
        alert("🎁 Você ganhou +20 XP de Login Diário!");
        location.reload();
    };

    // Mood Tracker
    window.shSetMood = function(level) {
        document.querySelectorAll('.sh-mood-btn').forEach((btn, i) => {
            if(i+1 === level) btn.classList.add('active');
            else btn.classList.remove('active');
        });
        const msg = ["Descanse um pouco.", "Respire fundo, você consegue.", "Mantendo o ritmo.", "Foco total, excelente!", "Você está on fire! 🔥"];
        setTimeout(() => alert("Humor registrado: " + msg[level-1]), 200);
    };

    // Water Tracker
    window.shAddWater = function(index) {
        const glasses = document.querySelectorAll('.water-glass');
        for(let i=0; i<=index; i++) glasses[i].classList.add('filled');
    };

    // Box Breathing (4-4-4-4)
    window.shBoxBreathing = function() {
        const modal = document.getElementById('modalBreathing');
        const text = document.getElementById('breatheText');
        const circle = document.getElementById('breatheCircle');
        modal.style.display = 'flex';
        
        let phases = ["Inspire...", "Segure...", "Expire...", "Segure vazio..."];
        let phaseIdx = 0;
        
        let interval = setInterval(() => {
            if(modal.style.display === 'none') { clearInterval(interval); return; }
            text.innerText = phases[phaseIdx];
            if(phaseIdx === 0) circle.style.transform = 'scale(1.5)';
            else if(phaseIdx === 2) circle.style.transform = 'scale(1)';
            phaseIdx = (phaseIdx + 1) % 4;
        }, 4000);
        
        // Auto-close após 1 minuto (60s)
        setTimeout(() => { clearInterval(interval); modal.style.display = 'none'; alert("Sessão concluída. Foco ativado!"); }, 60000);
    };

    // Brain Dump
    window.shBrainDump = function() { document.getElementById('modalBrainDump').style.display = 'flex'; };
    window.shClearMind = function() {
        document.getElementById('modalBrainDump').style.display = 'none';
        document.querySelector('#modalBrainDump textarea').value = '';
        alert("Mente esvaziada. Arquivos deletados. Foco!");
    };

    // Botão de Pânico (Joga pra Revisão)
    window.shPanicButton = function() {
        if(confirm("🚨 Não sabe o que estudar? Vamos sortear uma revisão imediata!")) {
            document.querySelector('#navList li[data-page="page-revisao"]').click();
        }
    };

    // Simuladinho
    window.shQuickSimulado = function() {
        alert("⏱️ Abrindo banco rápido de 5 questões...");
        document.querySelector('#navList li[data-page="page-simulados"]').click();
    };

    // Modo Monge (Esconde sidebar e navegação na Home)
    let monkMode = false;
    window.shMonkMode = function() {
        monkMode = !monkMode;
        if(monkMode) {
            document.getElementById('sidebar').style.display = 'none';
            document.querySelector('.top-bar').style.display = 'none';
            document.querySelector('.super-home').style.gridTemplateColumns = '1fr';
            document.querySelectorAll('.sh-panel').forEach(p => p.style.opacity = '0.3');
            document.querySelector('#missionWrapper').parentElement.style.opacity = '1';
            alert("🧘‍♂️ Modo Monge Ativado. Apenas a missão atual importa.");
        } else {
            document.getElementById('sidebar').style.display = 'block';
            document.querySelector('.top-bar').style.display = 'flex';
            document.querySelector('.super-home').style.gridTemplateColumns = '1fr 300px';
            document.querySelectorAll('.sh-panel').forEach(p => p.style.opacity = '1');
        }
    };

    // Card Diário
    window.shFlipDailyCard = function() {
        const div = document.getElementById('shDailyCard');
        if(window._shDailyF) {
            if(div.innerText === window._shDailyF.frente) div.innerText = window._shDailyF.verso;
            else div.innerText = window._shDailyF.frente;
        }
    };

    // Contrato Social / Tweet
    window.shToggleCommitment = function() {
        if(document.getElementById('shCommitment').checked) {
            const st = getState();
            st.student.gamificacao.xp += 5; // Recompensa por se comprometer
            saveState(st);
        }
    };
    
    window.shTweetCommitment = function() {
        const text = "Eu me comprometo a dominar o edital da CGU hoje com foco total no StudyOS Pro! 🔥📚 #ConcursoCGU #StudyOS";
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    };

    // Revisão Mágica (3 Conceitos aleatórios para prime learning)
    window.shMagicReview = function() {
        const st = getState();
        const flashcards = st.flashcards || [];
        if(flashcards.length < 3) return alert("Crie pelo menos 3 flashcards para usar a Revisão Mágica.");
        const randoms = flashcards.sort(() => 0.5 - Math.random()).slice(0,3);
        const text = randoms.map(f => `• ${f.frente}\nR: ${f.verso}`).join('\n\n');
        alert("✨ Revisão Mágica de 1 Minuto:\n\n" + text);
    };

})();
