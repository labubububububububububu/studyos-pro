
// =======================================================================
// STUDYOS PRO - GENIE PACK (O Gênio da Lâmpada Analítico)
// Analisa todos os dados do sistema e gera os 3 principais insights.
// =======================================================================

(function() {
    'use strict';

    setTimeout(initGenie, 4500); // Inicia por último

    function initGenie() {
        console.log("🪔 Despertando o Gênio da Lâmpada...");
        injectGenieStyles();
        injectGenieUI();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    // ==========================================================
    // 1. ESTILOS DO GÊNIO
    // ==========================================================
    function injectGenieStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* A Lâmpada Flutuante */
            .genie-lamp { 
                position: fixed; 
                bottom: 30px; 
                right: 30px; 
                width: 60px; 
                height: 60px; 
                background: linear-gradient(135deg, #fbbf24, #d97706);
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                font-size: 30px; 
                cursor: pointer; 
                box-shadow: 0 10px 25px rgba(217, 119, 6, 0.5);
                z-index: 9999;
                transition: 0.3s;
                animation: floatLamp 3s ease-in-out infinite;
                border: 2px solid #fef3c7;
            }
            .genie-lamp:hover { transform: scale(1.1) rotate(-10deg); box-shadow: 0 10px 35px rgba(251, 191, 36, 0.8); }
            @keyframes floatLamp { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
            
            /* Fumaça Mágica e Modal */
            .genie-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
            .genie-modal { background: linear-gradient(180deg, #312e81, #1e1b4b); border: 2px solid #fbbf24; border-radius: 24px; padding: 30px; width: 90%; max-width: 500px; color: #f8fafc; position: relative; box-shadow: 0 20px 50px rgba(251, 191, 36, 0.2); animation: geniePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            @keyframes geniePop { 0% { transform: scale(0.5) translateY(100px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
            
            .genie-close { position: absolute; top: 15px; right: 20px; font-size: 1.5rem; color: #fbbf24; cursor: pointer; transition: 0.2s; }
            .genie-close:hover { transform: scale(1.2); color: #fff; }
            
            .genie-header { text-align: center; margin-bottom: 25px; }
            .genie-avatar { font-size: 3.5rem; margin-bottom: 10px; display: inline-block; animation: floatLamp 3s infinite; }
            .genie-title { font-size: 1.5rem; color: #fbbf24; font-weight: 800; margin: 0; }
            .genie-subtitle { font-size: 0.85rem; color: #a5b4fc; margin-top: 5px; }

            /* Cartões de Insight */
            .genie-insight { background: rgba(255, 255, 255, 0.05); border-left: 4px solid #fbbf24; padding: 15px; margin-bottom: 15px; border-radius: 0 12px 12px 0; display: flex; gap: 15px; align-items: flex-start; transition: 0.2s; }
            .genie-insight:hover { background: rgba(251, 191, 36, 0.1); transform: translateX(5px); }
            .genie-icon { font-size: 1.8rem; }
            .genie-text h4 { margin: 0 0 5px 0; color: #fbbf24; font-size: 1.05rem; }
            .genie-text p { margin: 0; font-size: 0.85rem; color: #cbd5e1; line-height: 1.4; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================
    // 2. INTERFACE UI DO GÊNIO
    // ==========================================================
    function injectGenieUI() {
        const lamp = document.createElement('div');
        lamp.className = 'genie-lamp';
        lamp.innerHTML = '🪔';
        lamp.title = "Esfregar a Lâmpada Mágica";
        lamp.onclick = window.summonGenie;
        document.body.appendChild(lamp);

        const overlay = document.createElement('div');
        overlay.id = 'genieOverlay';
        overlay.className = 'genie-overlay';
        overlay.innerHTML = `
            <div class="genie-modal">
                <span class="genie-close" onclick="document.getElementById('genieOverlay').style.display='none'">&times;</span>
                <div class="genie-header">
                    <div class="genie-avatar">🧞‍♂️</div>
                    <h2 class="genie-title">Seus 3 Desejos... Digo, Insights!</h2>
                    <div class="genie-subtitle">Analisei milhões de pontos de dados do seu StudyOS. Aqui está o que você precisa focar agora:</div>
                </div>
                <div id="genieInsightsContainer">
                    <!-- Gerado via JS -->
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // ==========================================================
    // 3. O "CÉREBRO" DO GÊNIO (Algoritmo de Análise)
    // ==========================================================
    window.summonGenie = function() {
        const overlay = document.getElementById('genieOverlay');
        const container = document.getElementById('genieInsightsContainer');
        container.innerHTML = '<div style="text-align:center; color:#fbbf24;">Consultando as estrelas (e o localStorage)... ✨</div>';
        overlay.style.display = 'flex';

        setTimeout(() => {
            const insights = generateInsights();
            container.innerHTML = insights.map(i => `
                <div class="genie-insight">
                    <div class="genie-icon">${i.icon}</div>
                    <div class="genie-text">
                        <h4>${i.title}</h4>
                        <p>${i.desc}</p>
                    </div>
                </div>
            `).join('');
        }, 800); // Pequeno delay mágico
    };

    function generateInsights() {
        const s = getState();
        const insights = [];
        const hoje = new Date();

        // --- REGRA 1: Inércia / Frequência (Peso: Até 100) ---
        const sessoes = s.sessoes || [];
        if (sessoes.length > 0) {
            const ultima = new Date(sessoes[sessoes.length - 1].data.split('/').reverse().join('-')); // Ajuste simples de data
            const diffDias = Math.floor((hoje - ultima) / (1000 * 60 * 60 * 24));
            
            if (diffDias >= 2) {
                insights.push({ weight: 100, icon: "⚠️", title: "Quebra de Inércia", desc: `Mestre, faz ${diffDias} dias que você não registra estudos. Volte hoje nem que seja por apenas 25 minutos. O sucesso ama a consistência!` });
            } else if (diffDias === 0) {
                insights.push({ weight: 30, icon: "🔥", title: "Fogo Diário Aceso", desc: "Você já estudou hoje! A constância está afiada. Mantenha o ritmo." });
            }
        } else {
            insights.push({ weight: 90, icon: "🌱", title: "O Início da Jornada", desc: "Você ainda não tem sessões registradas. Comece hoje pelo Bloco 1, mestre!" });
        }

        // --- REGRA 2: Pontos Fracos no Tec Concursos (Peso: 95) ---
        const cadernos = s.tecData?.cadernos || [];
        if (cadernos.length > 0) {
            const mat = {};
            cadernos.forEach(c => {
                if(!mat[c.disciplina]) mat[c.disciplina] = { f: 0, a: 0 };
                mat[c.disciplina].f += c.feitas;
                mat[c.disciplina].a += c.isCebraspe ? c.acertoLiquido : c.acertos;
            });
            
            let piorMat = null, piorPct = 100;
            for(let d in mat) {
                if (mat[d].f >= 15) { // Validade estatística mínima
                    let pct = (mat[d].a / mat[d].f) * 100;
                    if (pct < piorPct) { piorPct = pct; piorMat = d; }
                }
            }
            if (piorMat && piorPct < 70) {
                insights.push({ weight: 95, icon: "🚨", title: "Hemorragia de Pontos", desc: `Seu desempenho em <strong>${piorMat}</strong> está crítico (${piorPct.toFixed(1)}%). Recomendo gerar um caderno focado em seus erros nesta matéria.` });
            }
        }

        // --- REGRA 3: Sobrecarga de Flashcards / Revisão (Peso: 85) ---
        const flashcards = s.flashcards || [];
        if (flashcards.length > 0) {
            const fracos = flashcards.filter(f => f.nivel === 0 || f.nivel === 1).length;
            if (fracos > 15) {
                insights.push({ weight: 85, icon: "🧠", title: "Sobrecarga de Memória", desc: `Você tem ${fracos} flashcards beirando o esquecimento total (Nível Crítico). Dedique os próximos 15 minutos apenas à página de Revisão.` });
            }
        }

        // --- REGRA 4: Gamificação Motivacional (Peso: 80) ---
        const xp = s.student?.gamificacao?.xp || 0;
        const nivel = s.student?.gamificacao?.nivel || 1;
        const metaXP = 100 * Math.pow(1.5, nivel);
        const falta = metaXP - xp;
        if (falta > 0 && falta < 60) {
            insights.push({ weight: 80, icon: "⭐", title: "Nível Quase Concluído!", desc: `Faltam apenas ${Math.round(falta)} XP para você alcançar o Nível ${nivel + 1}. Registre um simulado ou bateria de questões agora e suba de patente!` });
        }

        // --- REGRA 5: Progresso do Edital (Peso: 70) ---
        const checks = Object.keys(s.checks || {}).length;
        if (checks > 0 && checks % 10 === 0) {
            insights.push({ weight: 70, icon: "📈", title: "Marcos do Edital", desc: `Você dominou ${checks} tópicos do edital até agora. O efeito composto do seu esforço está construindo sua aprovação.` });
        }

        // --- REGRAS FALLBACK (Preenchimento) ---
        insights.push({ weight: 10, icon: "🧘‍♂️", title: "Pausa Deliberada", desc: "A neurociência prova que o aprendizado se fixa durante o descanso. Não pule suas pausas de 5 minutos." });
        insights.push({ weight: 11, icon: "💧", title: "Hidratação", desc: "A queda de 2% de água no corpo derruba o foco em 20%. Mestre, vá beber um copo de água." });
        insights.push({ weight: 12, icon: "🎯", title: "Efeito Zeigarnik", desc: "Tarefas inacabadas causam ansiedade (Fugas de Memória). Se abriu um caderno, termine-o antes de dormir." });

        // Ordena pelos pesos maiores (mais urgente/importante) e corta nos 3 primeiros
        insights.sort((a, b) => b.weight - a.weight);
        return insights.slice(0, 3);
    }

})();
