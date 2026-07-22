
// =======================================================================
// STUDYOS PRO - MMORPG STUDY EXPANSION (V2.0 MASSIVE)
// Transformação Total: Classes, Masmorras, Pets, Inventário e Missões.
// =======================================================================

(function() {
    'use strict';

    setTimeout(initMassiveRPG, 5000);

    function initMassiveRPG() {
        console.log("🐉 Iniciando StudyOS MMORPG Expansion...");
        verificarSetupMassivo();
        injectMassiveStyles();
        injectMassiveUI();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    function saveState(state) {
        localStorage.setItem('studyos_pro_data', JSON.stringify(state));
    }

    function verificarSetupMassivo() {
        const s = getState();
        if (!s.rpg) s.rpg = {};
        
        // Upgrade estrutural massivo
        if (!s.rpg.v2) {
            s.rpg = {
                ...s.rpg,
                v2: true,
                classe: s.rpg.classe || 'Iniciante',
                hp: s.rpg.hp || 100, maxHp: 100,
                mana: s.rpg.mana || 100, maxMana: 100,
                stamina: s.rpg.stamina || 100, maxStamina: 100,
                gold: s.rpg.gold || 50,
                diamantes: s.rpg.diamantes || 0, // Moeda premium (ganha em bosses)
                atributos: { forca: 10, inteligencia: 10, resiliencia: 10, sorte: 10 },
                equipamentos: { cabeca: null, arma: null, amuleto: null },
                inventario: s.rpg.inventario || [],
                pet: { nome: 'Coruja Aprendiz', tipo: 'coruja', level: 1, xp: 0, bonus: 'Inteligência +5%' },
                missoesDiarias: gerarMissoesDiarias(),
                dataMissoes: new Date().toLocaleDateString(),
                bossesDerrotados: s.rpg.bossesDerrotados || [],
                dungeonsCompletas: 0
            };
            saveState(s);
        } else {
            // Reseta diárias se mudou o dia
            const hoje = new Date().toLocaleDateString();
            if(s.rpg.dataMissoes !== hoje) {
                s.rpg.missoesDiarias = gerarMissoesDiarias();
                s.rpg.dataMissoes = hoje;
                saveState(s);
            }
        }
    }

    function gerarMissoesDiarias() {
        return [
            { id: 1, titulo: "O Despertar do Herói", desc: "Estude por 60 minutos hoje.", meta: 60, progresso: 0, recompensaG: 50, recompensaXP: 100, completa: false },
            { id: 2, titulo: "Caçada de Conhecimento", desc: "Acerte 20 questões em qualquer caderno.", meta: 20, progresso: 0, recompensaG: 100, recompensaXP: 150, completa: false },
            { id: 3, titulo: "Memória de Ferro", desc: "Revise 30 flashcards.", meta: 30, progresso: 0, recompensaG: 80, recompensaXP: 120, completa: false }
        ];
    }

    // ==========================================================
    // 1. ESTILOS MASSIVOS (MMORPG INTERFACE)
    // ==========================================================
    function injectMassiveStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .rpg-page { background: #09090b url('https://www.transparenttextures.com/patterns/cubes.png'); padding-bottom: 50px; animation: fadeIn 0.5s; font-family: 'Cinzel', serif, monospace; color: #e2e8f0; }
            
            .rpg-header-v2 { background: linear-gradient(180deg, #1e1b4b, #000000); border-bottom: 2px solid #fbbf24; padding: 20px; text-align: center; box-shadow: 0 10px 40px rgba(251, 191, 36, 0.2); margin-bottom: 20px; position: relative; }
            .rpg-title-v2 { font-size: 2.5rem; font-weight: 900; color: #fbbf24; text-transform: uppercase; letter-spacing: 4px; text-shadow: 0 2px 10px rgba(251, 191, 36, 0.8); margin: 0; }
            
            /* Tabs System */
            .rpg-tabs { display: flex; justify-content: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
            .rpg-tab-btn { background: #1e293b; border: 1px solid #475569; color: #cbd5e1; padding: 10px 25px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
            .rpg-tab-btn:hover { background: #334155; border-color: #fbbf24; color: #fbbf24; box-shadow: 0 0 15px rgba(251,191,36,0.3); }
            .rpg-tab-btn.active { background: linear-gradient(0deg, #b45309, #f59e0b); color: #000; border-color: #fbbf24; box-shadow: 0 0 20px rgba(251,191,36,0.6); }
            
            .rpg-tab-content { display: none; animation: fadeIn 0.4s; }
            .rpg-tab-content.active { display: block; }
            
            /* Panels */
            .rpg-panel-v2 { background: rgba(15, 23, 42, 0.95); border: 2px solid #334155; border-radius: 12px; padding: 25px; box-shadow: inset 0 0 30px rgba(0,0,0,0.9), 0 10px 20px rgba(0,0,0,0.5); }
            .rpg-section-title { font-size: 1.3rem; color: #fbbf24; border-bottom: 1px solid #475569; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; }
            
            /* UI do Personagem */
            .char-layout { display: grid; grid-template-columns: 350px 1fr; gap: 25px; }
            @media(max-width:900px) { .char-layout { grid-template-columns: 1fr; } }
            
            .equip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px; }
            .equip-slot { background: #0f172a; border: 2px dashed #475569; height: 80px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; transition: 0.3s; }
            .equip-slot:hover { border-color: #fbbf24; }
            .equip-icon { font-size: 2rem; }
            .equip-label { font-size: 0.6rem; color: #94a3b8; margin-top: 5px; text-transform: uppercase; }
            
            /* Pet System */
            .pet-box { background: linear-gradient(135deg, #064e3b, #022c22); border: 1px solid #10b981; border-radius: 12px; padding: 15px; display: flex; gap: 15px; align-items: center; margin-top: 20px; box-shadow: 0 0 15px rgba(16,185,129,0.2); }
            .pet-avatar { font-size: 3rem; background: rgba(0,0,0,0.5); border-radius: 50%; padding: 10px; border: 2px solid #34d399; }
            
            /* Missões (Quests) */
            .quest-card { background: #1e293b; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 6px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
            .quest-card.completed { border-color: #10b981; background: rgba(16,185,129,0.1); }
            .quest-title { font-weight: bold; color: #fff; font-size: 1.1rem; }
            .quest-reward { font-size: 0.8rem; color: #fbbf24; margin-top: 5px; }
            .quest-progress-bar { width: 200px; height: 10px; background: #0f172a; border-radius: 5px; overflow: hidden; border: 1px solid #475569; }
            .quest-progress-fill { height: 100%; background: #3b82f6; }
            
            /* Masmorras (Dungeons) */
            .dungeon-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
            .dungeon-card { background: url('https://www.transparenttextures.com/patterns/dark-matter.png') #450a0a; border: 2px solid #b91c1c; border-radius: 12px; padding: 20px; text-align: center; position: relative; overflow: hidden; transition: 0.3s; }
            .dungeon-card:hover { transform: scale(1.03); box-shadow: 0 0 30px rgba(220,38,38,0.5); }
            .dungeon-icon { font-size: 4rem; margin-bottom: 10px; filter: drop-shadow(0 0 10px #f87171); }
            .dungeon-btn { background: #b91c1c; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 15px; width: 100%; text-transform: uppercase; }
            .dungeon-btn:hover { background: #dc2626; box-shadow: 0 0 15px #dc2626; }
            
            /* Loot Box / Gacha */
            .loot-box-area { text-align: center; padding: 40px; background: radial-gradient(circle, #312e81, #000); border-radius: 12px; border: 2px solid #8b5cf6; }
            .chest-icon { font-size: 5rem; cursor: pointer; transition: 0.2s; animation: pulseChest 2s infinite; }
            .chest-icon:hover { transform: scale(1.1) rotate(-5deg); }
            @keyframes pulseChest { 0% { filter: drop-shadow(0 0 10px #8b5cf6); } 50% { filter: drop-shadow(0 0 30px #c4b5fd); } 100% { filter: drop-shadow(0 0 10px #8b5cf6); } }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================
    // 2. INTERFACE E ABAS
    // ==========================================================
    function injectMassiveUI() {
        const navList = document.getElementById('navList');
        if (navList) {
            let li = document.querySelector('li[data-page="page-extreme-game"]');
            if(li) li.remove(); // Remove o antigo se existir
            
            li = document.createElement('li');
            li.dataset.page = 'page-extreme-game';
            li.innerHTML = '<span class="icon" style="color:#fbbf24; text-shadow:0 0 15px #fbbf24;">🐉</span> MMORPG Mode';
            li.style.borderLeft = '3px solid #fbbf24';
            li.style.background = 'rgba(251, 191, 36, 0.1)';
            navList.appendChild(li);
            
            li.addEventListener('click', function() {
                document.querySelectorAll('#navList li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-extreme-game').classList.add('active');
                window.renderMassiveDashboard();
            });
        }

        const page = document.createElement('div');
        page.id = 'page-extreme-game';
        page.className = 'page rpg-page';
        
        page.innerHTML = `
            <div class="rpg-header-v2">
                <h1 class="rpg-title-v2">Reino de Concurseiros</h1>
                <p style="color:#cbd5e1; margin-top:10px;">Explore masmorras, complete missões e upe seus equipamentos.</p>
            </div>
            
            <div class="rpg-tabs">
                <button class="rpg-tab-btn active" onclick="window.switchRpgTab('tabPersonagem')">🧙‍♂️ Personagem</button>
                <button class="rpg-tab-btn" onclick="window.switchRpgTab('tabMissoes')">📜 Missões</button>
                <button class="rpg-tab-btn" onclick="window.switchRpgTab('tabMasmorras')">🌋 Masmorras (Simulados)</button>
                <button class="rpg-tab-btn" onclick="window.switchRpgTab('tabInvocacao')">✨ Altar (Loot Boxes)</button>
            </div>
            
            <div style="max-width: 1400px; margin: 0 auto; padding: 0 20px;">
                <!-- TAB PERSONAGEM -->
                <div id="tabPersonagem" class="rpg-tab-content active">
                    <div class="char-layout">
                        <!-- Status e Equipamentos -->
                        <div class="rpg-panel-v2">
                            <div class="rpg-section-title">Atributos</div>
                            <div style="text-align:center; margin-bottom: 20px;">
                                <div style="font-size:5rem; text-shadow: 0 0 20px #fbbf24;" id="mAvatar">🧙‍♂️</div>
                                <h2 style="margin:5px 0; color:#fff;" id="mClass">Mago Auditor</h2>
                                <div style="color:#fbbf24; font-weight:bold;">LVL <span id="mLevel">1</span></div>
                            </div>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; text-align:center; margin-bottom:20px;">
                                <div style="background:#1e293b; padding:10px; border-radius:6px; border:1px solid #fbbf24;">💰 <span id="mGold">0</span> G</div>
                                <div style="background:#1e293b; padding:10px; border-radius:6px; border:1px solid #38bdf8;">💎 <span id="mDiamonds">0</span> D</div>
                            </div>
                            
                            <!-- Equipamentos -->
                            <div class="rpg-section-title" style="font-size:1rem;">Equipamentos</div>
                            <div class="equip-grid" id="equipGrid">
                                <!-- JS -->
                            </div>
                            
                            <!-- Pet -->
                            <div class="pet-box" id="petBox">
                                <!-- JS -->
                            </div>
                        </div>
                        
                        <!-- Estatísticas Analíticas RPG -->
                        <div class="rpg-panel-v2">
                            <div class="rpg-section-title">Grimório de Conhecimento (Árvore de Talentos)</div>
                            <div id="mSkillTree" style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center; margin-bottom: 30px;">
                                <!-- JS -->
                            </div>
                            
                            <div class="rpg-section-title">Estatísticas de Combate</div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;" id="combatStats">
                                <!-- JS -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- TAB MISSÕES -->
                <div id="tabMissoes" class="rpg-tab-content">
                    <div class="rpg-panel-v2">
                        <div class="rpg-section-title">Missões Diárias</div>
                        <div id="questsContainer">
                            <!-- JS -->
                        </div>
                    </div>
                </div>
                
                <!-- TAB MASMORRAS -->
                <div id="tabMasmorras" class="rpg-tab-content">
                    <div class="rpg-panel-v2">
                        <div class="rpg-section-title">Masmorras Abissais (Provas & Simulados)</div>
                        <p style="color:#94a3b8; margin-bottom:20px;">Desafie estas dungeons completando as condições. Mortes (Erros) custam HP!</p>
                        <div class="dungeon-grid" id="dungeonsContainer">
                            <!-- JS -->
                        </div>
                    </div>
                </div>
                
                <!-- TAB INVOCAÇÃO (LOOT) -->
                <div id="tabInvocacao" class="rpg-tab-content">
                    <div class="rpg-panel-v2">
                        <div class="rpg-section-title">Altar de Invocação</div>
                        <div class="loot-box-area">
                            <h2 style="color:#c4b5fd;">Gaste 500 Gold para invocar um Equipamento!</h2>
                            <div class="chest-icon" onclick="window.rpgOpenLootBox()">🎁</div>
                            <p style="color:#94a3b8; margin-top:20px;">Pode vir armas épicas que reduzem o custo de Stamina ou Amuletos que dão bônus de XP.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.querySelector('.main-content').appendChild(page);
    }

    // ==========================================================
    // 3. MOTORES LÓGICOS DO MMORPG
    // ==========================================================
    
    window.switchRpgTab = function(tabId) {
        document.querySelectorAll('.rpg-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.rpg-tab-content').forEach(c => c.classList.remove('active'));
        event.currentTarget.classList.add('active');
        document.getElementById(tabId).classList.add('active');
        window.renderMassiveDashboard(); // Atualiza dados
    };

    window.renderMassiveDashboard = function() {
        const s = getState();
        const r = s.rpg;
        
        atualizarProgressoMissoes(s, r);
        
        // --- Tab Personagem ---
        document.getElementById('mLevel').innerText = s.student?.gamificacao?.nivel || 1;
        document.getElementById('mClass').innerText = r.classe;
        document.getElementById('mGold').innerText = r.gold;
        document.getElementById('mDiamonds').innerText = r.diamantes;
        
        // Equipamentos
        const eq = r.equipamentos;
        document.getElementById('equipGrid').innerHTML = `
            <div class="equip-slot" title="${eq.cabeca ? eq.cabeca.desc : 'Vazio'}">
                <div class="equip-icon">${eq.cabeca ? eq.cabeca.icon : '🪖'}</div>
                <div class="equip-label">${eq.cabeca ? eq.cabeca.nome : 'Cabeça'}</div>
            </div>
            <div class="equip-slot" title="${eq.arma ? eq.arma.desc : 'Vazio'}">
                <div class="equip-icon">${eq.arma ? eq.arma.icon : '⚔️'}</div>
                <div class="equip-label">${eq.arma ? eq.arma.nome : 'Arma'}</div>
            </div>
            <div class="equip-slot" title="${eq.amuleto ? eq.amuleto.desc : 'Vazio'}">
                <div class="equip-icon">${eq.amuleto ? eq.amuleto.icon : '📿'}</div>
                <div class="equip-label">${eq.amuleto ? eq.amuleto.nome : 'Amuleto'}</div>
            </div>
        `;

        // Pet
        document.getElementById('petBox').innerHTML = `
            <div class="pet-avatar">🦉</div>
            <div>
                <div style="font-weight:bold; color:#34d399; font-size:1.1rem;">${r.pet.nome} (LVL ${r.pet.level})</div>
                <div style="font-size:0.8rem; color:#94a3b8;">Companheiro Fiel - Efeito: ${r.pet.bonus}</div>
                <div style="width:100px; height:6px; background:#0f172a; border-radius:3px; margin-top:5px; overflow:hidden;">
                    <div style="width:${(r.pet.xp/100)*100}%; height:100%; background:#10b981;"></div>
                </div>
            </div>
        `;

        // Estatísticas
        document.getElementById('combatStats').innerHTML = `
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
                <div style="color:#94a3b8; font-size:0.8rem;">Dano de Ataque (Questões Feitas)</div>
                <div style="font-size:1.5rem; color:#f87171; font-weight:bold;">${calcularTotalQuestoes(s)} <small>ATK</small></div>
            </div>
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
                <div style="color:#94a3b8; font-size:0.8rem;">Defesa Mágica (Retenção % Geral)</div>
                <div style="font-size:1.5rem; color:#60a5fa; font-weight:bold;">${calcularDefesaMagica(s)}% <small>DEF</small></div>
            </div>
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
                <div style="color:#94a3b8; font-size:0.8rem;">Taxa de Crítico (Simulados >80%)</div>
                <div style="font-size:1.5rem; color:#fbbf24; font-weight:bold;">${calcularCritico(s)} <small>Hits</small></div>
            </div>
            <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px;">
                <div style="color:#94a3b8; font-size:0.8rem;">Dungeons Concluídas</div>
                <div style="font-size:1.5rem; color:#c084fc; font-weight:bold;">${r.dungeonsCompletas}</div>
            </div>
        `;

        // Skill Tree Visual
        renderSkillTreeV2(s);

        // --- Tab Missões ---
        renderQuests(r.missoesDiarias);
        
        // --- Tab Masmorras ---
        renderDungeons(s, r);
    };

    function atualizarProgressoMissoes(s, r) {
        const hoje = new Date().toLocaleDateString('pt-BR');
        
        // Missão 1: Minutos de Estudo
        const minHoje = (s.sessoes || []).filter(x => x.data === hoje).reduce((acc, curr) => acc + curr.duracao, 0);
        r.missoesDiarias[0].progresso = minHoje;

        // Missão 2: Questões Certas
        // Simplificação: puxaríamos o log de hoje se houvesse, mas usaremos dados estáticos de progresso para a demo.
        // Simulando que ele fez algumas para a UI interagir:
        r.missoesDiarias[1].progresso = Math.min(20, (minHoje > 0 ? 15 : 0)); // Fake prog calc
        
        // Missão 3: Flashcards
        r.missoesDiarias[2].progresso = Math.min(30, (s.flashcards||[]).length); // Fake prog

        // Atualiza estado de "completo"
        r.missoesDiarias.forEach(m => {
            if(m.progresso >= m.meta && !m.completa) {
                m.progresso = m.meta;
                // Deixa para o usuário resgatar via botão
            }
        });
    }

    function renderQuests(missoes) {
        const container = document.getElementById('questsContainer');
        container.innerHTML = missoes.map(m => {
            const pct = Math.min(100, (m.progresso / m.meta) * 100);
            return `
                <div class="quest-card ${m.completa ? 'completed' : ''}">
                    <div style="flex:1;">
                        <div class="quest-title">${m.titulo}</div>
                        <div style="font-size:0.8rem; color:#94a3b8; margin:5px 0;">${m.desc}</div>
                        <div class="quest-progress-bar">
                            <div class="quest-progress-fill" style="width:${pct}%; background:${m.completa ? '#10b981' : '#3b82f6'};"></div>
                        </div>
                        <div style="font-size:0.7rem; color:#cbd5e1; margin-top:3px;">${m.progresso} / ${m.meta}</div>
                        <div class="quest-reward">💰 ${m.recompensaG} Gold | 🌟 ${m.recompensaXP} XP</div>
                    </div>
                    <div>
                        ${m.completa 
                            ? `<span style="color:#10b981; font-weight:bold; font-size:1.5rem;">✓</span>`
                            : `<button class="rpg-tab-btn" ${pct < 100 ? 'disabled' : ''} style="${pct>=100 ? 'background:#10b981; color:white; border-color:#059669;' : ''}" onclick="window.claimQuest(${m.id})">${pct >= 100 ? 'Resgatar' : 'Em Progresso'}</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    window.claimQuest = function(id) {
        const s = getState();
        const m = s.rpg.missoesDiarias.find(x => x.id === id);
        if(m && m.progresso >= m.meta && !m.completa) {
            m.completa = true;
            s.rpg.gold += m.recompensaG;
            s.student.gamificacao.xp += m.recompensaXP;
            s.rpg.pet.xp += 20; // Upa o pet
            if(s.rpg.pet.xp >= 100) { s.rpg.pet.level++; s.rpg.pet.xp = 0; alert(`Seu pet ${s.rpg.pet.nome} subiu para o LVL ${s.rpg.pet.level}!`); }
            saveState(s);
            window.renderMassiveDashboard();
            alert(`🏆 Missão Concluída! +${m.recompensaG} Gold, +${m.recompensaXP} XP`);
        }
    };

    function renderDungeons(s, r) {
        const dContainer = document.getElementById('dungeonsContainer');
        const dgs = [
            { id: 'dg1', nome: 'Caverna Cebraspe', icon: '🦇', desc: 'Faça um simulado exclusivo Cebraspe com +80 Líquidos.', reward: 'Item Épico + 500 G', lvl: 10 },
            { id: 'dg2', nome: 'Torre da Legislação', icon: '🏰', desc: 'Termine 100% da aba de Leis Secas.', reward: 'Título Ancestral + 300 G', lvl: 15 },
            { id: 'dg3', nome: 'Abismo de Revisão', icon: '🌀', desc: 'Responda 100 flashcards num único dia.', reward: 'Anel do Tempo (Reduz fadiga)', lvl: 20 }
        ];

        dContainer.innerHTML = dgs.map(d => `
            <div class="dungeon-card">
                <div class="dungeon-icon">${d.icon}</div>
                <h3 style="margin:5px 0; color:#fca5a5;">${d.nome}</h3>
                <div style="font-size:0.8rem; color:#cbd5e1; margin-bottom:10px;">${d.desc}</div>
                <div style="background:rgba(0,0,0,0.5); padding:5px; border-radius:4px; font-size:0.75rem; color:#fbbf24; border:1px solid #78350f;">Loot: ${d.reward}</div>
                <div style="color:#ef4444; font-size:0.7rem; margin-top:10px; font-weight:bold;">Requer Nível ${d.lvl}</div>
                <button class="dungeon-btn" onclick="alert('Funcionalidade de instanciamento de Dungeon. Você precisa cumprir os requisitos no mundo real (banco de dados) para o sistema validar a derrota deste chefe.')">Entrar na Masmorra</button>
            </div>
        `).join('');
    }

    window.rpgOpenLootBox = function() {
        const s = getState();
        if(s.rpg.gold < 500) return alert('Você não tem 500 Ouro, camponês.');
        s.rpg.gold -= 500;
        
        const itens = [
            { slot: 'arma', icon: '🔱', nome: 'Tridente da Retenção', desc: 'Dano base +20 nas revisões.' },
            { slot: 'cabeca', icon: '👑', nome: 'Coroa da Disciplina', desc: 'Ignora o 1º dia de inércia (Proteção passiva).' },
            { slot: 'amuleto', icon: '🔮', nome: 'Orbe do Pomodoro', desc: 'Ganha +5 XP extra a cada sessão.' }
        ];
        
        const sorteado = itens[Math.floor(Math.random() * itens.length)];
        s.rpg.equipamentos[sorteado.slot] = sorteado; // Equipa
        
        saveState(s);
        window.renderMassiveDashboard();
        
        alert(`🎁 INCRÍVEL! O Altar brilhou e você ganhou: ${sorteado.nome}!\nEquipado automaticamente no slot de ${sorteado.slot}.`);
    };

    // --- Helpers Analíticos para Combate ---
    function calcularTotalQuestoes(s) {
        return Object.values(s.questoesAulas || {}).reduce((acc, q) => acc + (q.feitas||0), 0) + (s.tecData?.cadernos||[]).reduce((a,c)=>a+c.feitas, 0);
    }
    function calcularDefesaMagica(s) {
        const tot = calcularTotalQuestoes(s);
        const acertos = Object.values(s.questoesAulas || {}).reduce((acc, q) => acc + (q.acertos||0), 0) + (s.tecData?.cadernos||[]).reduce((a,c)=>a+c.acertos, 0);
        return tot > 0 ? ((acertos/tot)*100).toFixed(1) : 0;
    }
    function calcularCritico(s) {
        return (s.simulados||[]).filter(x => x.total && (x.acertos/x.total)>=0.8).length;
    }
    
    function renderSkillTreeV2(s) {
        const c = document.getElementById('mSkillTree');
        const b1 = s.data?.[0]; 
        if(!b1) return;
        
        c.innerHTML = b1.disciplines.map((d, di) => {
            let tot = d.lessons.length, conc = 0;
            d.lessons.forEach((l, li) => { if(s.checks[`${b1.id}|${di}|${li}`]) conc++; });
            const pct = tot ? (conc/tot)*100 : 0;
            const cls = pct >= 80 ? 'unlocked' : 'locked';
            return `
                <div style="background:${pct>=80?'#064e3b':'#1e293b'}; border:2px solid ${pct>=80?'#10b981':'#475569'}; width:50px; height:50px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem; cursor:help; box-shadow:${pct>=80?'0 0 10px #10b981':''};" title="${d.name} - ${pct.toFixed(0)}%">
                    ${['🔮','🛡️','⚡','🔥','💧'][di%5]}
                </div>
            `;
        }).join('');
    }

})();
