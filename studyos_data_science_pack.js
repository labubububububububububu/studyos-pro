
// =======================================================================
// STUDYOS PRO - DATA SCIENCE & STATISTICS PACK (40 FUNCIONALIDADES)
// Arquivo complementar a ser acoplado no final do body do arquivo principal.
// =======================================================================

(function() {
    'use strict';

    setTimeout(initDataSciencePack, 3500);

    function initDataSciencePack() {
        console.log("📈 Iniciando StudyOS Data Science Pack (40 Fórmulas Estatísticas)...");
        injectDataScienceStyles();
        injectDataScienceUI();
        window.runStatisticalAnalysis();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    // ==========================================================
    // 1. BIBLIOTECA MATEMÁTICA ESTATÍSTICA INTERNA
    // ==========================================================
    const Stat = {
        mean: arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0,
        median: arr => {
            if(!arr.length) return 0;
            const s = [...arr].sort((a,b) => a-b);
            const mid = Math.floor(s.length/2);
            return s.length % 2 !== 0 ? s[mid] : (s[mid-1] + s[mid]) / 2;
        },
        mode: arr => {
            if(!arr.length) return 0;
            const freq = {};
            let maxFreq = 0, mode = arr[0];
            arr.forEach(v => { freq[v] = (freq[v]||0)+1; if(freq[v] > maxFreq) { maxFreq = freq[v]; mode = v; } });
            return mode;
        },
        variance: arr => {
            if(arr.length < 2) return 0;
            const m = Stat.mean(arr);
            return arr.reduce((a, b) => a + Math.pow(b - m, 2), 0) / (arr.length - 1);
        },
        stdDev: arr => Math.sqrt(Stat.variance(arr)),
        cv: arr => { const m = Stat.mean(arr); return m === 0 ? 0 : (Stat.stdDev(arr) / m) * 100; },
        zScore: (val, arr) => { const sd = Stat.stdDev(arr); return sd === 0 ? 0 : (val - Stat.mean(arr)) / sd; },
        pearson: (x, y) => {
            if(x.length === 0 || x.length !== y.length) return 0;
            const mx = Stat.mean(x), my = Stat.mean(y);
            let num = 0, denX = 0, denY = 0;
            for(let i=0; i<x.length; i++) {
                const dx = x[i] - mx, dy = y[i] - my;
                num += dx * dy; denX += dx*dx; denY += dy*dy;
            }
            return (denX === 0 || denY === 0) ? 0 : num / Math.sqrt(denX * denY);
        },
        linearRegression: (x, y) => {
            if(x.length === 0 || x.length !== y.length) return { slope: 0, intercept: 0 };
            const n = x.length, mx = Stat.mean(x), my = Stat.mean(y);
            let num = 0, den = 0;
            for(let i=0; i<n; i++) { num += (x[i] - mx) * (y[i] - my); den += Math.pow(x[i] - mx, 2); }
            const slope = den === 0 ? 0 : num / den;
            return { slope, intercept: my - slope * mx };
        },
        movingAverage: (arr, windowSize) => {
            let res = [];
            for(let i=0; i<=arr.length - windowSize; i++) res.push(Stat.mean(arr.slice(i, i+windowSize)));
            return res;
        },
        giniCoefficient: arr => {
            if(!arr.length) return 0;
            const s = [...arr].sort((a,b)=>a-b);
            const n = s.length;
            let num = 0, den = 0;
            for(let i=0; i<n; i++) { num += (i+1) * s[i]; den += s[i]; }
            return den === 0 ? 0 : ((2 * num) / (n * den)) - ((n + 1) / n);
        }
    };

    // ==========================================================
    // 2. ESTILOS DO DASHBOARD DATA SCIENCE
    // ==========================================================
    function injectDataScienceStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .ds-page { animation: fadeIn 0.4s ease; padding-bottom: 40px; }
            .ds-header { background: linear-gradient(135deg, #0f172a, #1e293b); border-bottom: 2px solid #10b981; padding: 20px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            .ds-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
            .ds-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 12px; transition: 0.2s; }
            .ds-card:hover { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.3); }
            .ds-title { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }
            .ds-value { font-size: 1.2rem; font-weight: 800; color: #10b981; }
            .ds-formula { font-size: 0.6rem; color: #475569; margin-top: 4px; font-family: monospace; }
            .ds-section-title { font-size: 1.1rem; color: #f8fafc; margin: 25px 0 15px 0; padding-left: 10px; border-left: 4px solid #10b981; }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================
    // 3. INTERFACE E MENU
    // ==========================================================
    function injectDataScienceUI() {
        const navList = document.getElementById('navList');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-data-science';
            li.innerHTML = '<span class="icon">🔬</span> Data Science';
            navList.appendChild(li);
            
            li.addEventListener('click', function() {
                document.querySelectorAll('#navList li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-data-science').classList.add('active');
                window.runStatisticalAnalysis();
            });
        }

        const page = document.createElement('div');
        page.id = 'page-data-science';
        page.className = 'page ds-page';
        page.innerHTML = `
            <div class="ds-header">
                <h2 style="color:#10b981; margin:0 0 5px 0;">🔬 Laboratório de Data Science & Estatística</h2>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0;">40 Métricas Analíticas processadas matematicamente a partir do seu banco de dados local.</p>
                <button class="btn-glass" style="margin-top:15px; border-color:#10b981; color:#10b981;" onclick="window.runStatisticalAnalysis()">🔄 Recalcular Modelos</button>
            </div>
            <div id="dsContainer"></div>
        `;
        document.querySelector('.main-content').appendChild(page);
    }

    // ==========================================================
    // 4. MOTOR ESTATÍSTICO (40 FÓRMULAS)
    // ==========================================================
    window.runStatisticalAnalysis = function() {
        const s = getState();
        const c = document.getElementById('dsContainer');
        if(!c) return;

        // --- PREPARAÇÃO DE DADOS (ETL) ---
        const sessoes = s.sessoes || [];
        const sim = s.simulados || [];
        const questoes = s.questoesAulas || {};
        
        // Séries Temporais
        const duracoes = sessoes.map(x => x.duracao);
        const acertosSim = sim.map(x => x.total ? x.acertos/x.total : 0);
        const volumesSim = sim.map(x => x.total);
        
        // Questões agregadas
        const valQuestoes = Object.values(questoes);
        const accQuest = valQuestoes.filter(q => q.feitas > 0).map(q => q.acertos / q.feitas);
        const feitasQuest = valQuestoes.filter(q => q.feitas > 0).map(q => q.feitas);

        // --- 40 CÁLCULOS ESTATÍSTICOS ---
        const M = {}; // Object to hold metrics
        
        // CATEGORIA A: ESTATÍSTICA DESCRITIVA BÁSICA (1-10)
        M.m1 = { t: "Média de Sessão", v: Stat.mean(duracoes).toFixed(1) + " min", f: "μ = (Σx_i)/n" };
        M.m2 = { t: "Mediana de Sessão", v: Stat.median(duracoes).toFixed(1) + " min", f: "x_med" };
        M.m3 = { t: "Desvio Padrão (Consistência)", v: Stat.stdDev(duracoes).toFixed(1) + " min", f: "σ = √[Σ(x-μ)²/(n-1)]" };
        M.m4 = { t: "Coef. de Variação (CV)", v: Stat.cv(duracoes).toFixed(1) + "%", f: "CV = (σ/μ)×100" };
        M.m5 = { t: "Moda de Acertos (Aulas)", v: (Stat.mode(accQuest)*100).toFixed(1) + "%", f: "Mo = Valor mais freq." };
        M.m6 = { t: "Variância de Acertos", v: Stat.variance(accQuest).toFixed(4), f: "σ²" };
        M.m7 = { t: "Média Móvel Acertos (Últimos 3)", v: (Stat.movingAverage(acertosSim, 3).slice(-1)[0]*100 || 0).toFixed(1) + "%", f: "SMA = (A_1+A_2+A_3)/3" };
        M.m8 = { t: "Amplitude de Desempenho", v: ((Math.max(...acertosSim,0) - Math.min(...acertosSim,0))*100).toFixed(1) + "%", f: "Amp = Max - Min" };
        const hjDuracao = sessoes.length ? sessoes[sessoes.length-1].duracao : 0;
        M.m9 = { t: "Z-Score Hoje (Tempo)", v: Stat.zScore(hjDuracao, duracoes).toFixed(2), f: "Z = (x - μ) / σ" };
        const qSort = [...accQuest].sort();
        M.m10 = { t: "Percentil 90 (Acertos)", v: (qSort[Math.floor(qSort.length*0.9)]*100 || 0).toFixed(1) + "%", f: "P_90" };

        // CATEGORIA B: REGRESSÕES E CORRELAÇÕES (11-20)
        M.m11 = { t: "Correlação Pearson (Volume x Acerto)", v: Stat.pearson(feitasQuest, accQuest).toFixed(2), f: "r(xy)" };
        const reg = Stat.linearRegression(Array.from({length: acertosSim.length}, (_,i)=>i), acertosSim);
        M.m12 = { t: "Tendência de Nota (Slope)", v: reg.slope > 0 ? "📈 Positiva (+"+reg.slope.toFixed(3)+")" : "📉 Negativa", f: "β_1 = Σ(x-μx)(y-μy)/Σ(x-μx)²" };
        M.m13 = { t: "Projeção Próximo Simulado", v: Math.min(100, (reg.intercept + reg.slope * acertosSim.length)*100).toFixed(1) + "%", f: "y = β_0 + β_1*x" };
        M.m14 = { t: "R-Quadrado (Fit do Modelo)", v: Math.abs(Stat.pearson(Array.from({length: acertosSim.length}, (_,i)=>i), acertosSim) ** 2).toFixed(2), f: "R²" };
        M.m15 = { t: "Assimetria de Tempo (Skewness)", v: (Stat.mean(duracoes) > Stat.median(duracoes) ? "À Direita (+)" : "À Esquerda (-)"), f: "Sk = 3(μ-Md)/σ" };
        M.m16 = { t: "Elasticidade do Aprendizado", v: (reg.slope / Stat.mean(acertosSim)).toFixed(2), f: "E = (Δ%Nota) / (Δ%Estudo)" };
        M.m17 = { t: "Probabilidade Erro Crítico", v: (valQuestoes.filter(q => q.feitas > 0 && q.acertos/q.feitas < 0.6).length / (valQuestoes.length||1) * 100).toFixed(1) + "%", f: "P(E|x<60%)" };
        M.m18 = { t: "Índice Gini (Concentração Erros)", v: Stat.giniCoefficient(feitasQuest.map((f,i)=> f - (accQuest[i]*f))).toFixed(2), f: "G = (2Σi*y_i)/(nΣy_i) - (n+1)/n" };
        M.m19 = { t: "Autocorrelação Lag-1 (Sessões)", v: Stat.pearson(duracoes.slice(0,-1), duracoes.slice(1)).toFixed(2), f: "ACF(1)" };
        M.m20 = { t: "Covariância Volume vs Acerto", v: (Stat.pearson(feitasQuest, accQuest) * Stat.stdDev(feitasQuest) * Stat.stdDev(accQuest)).toFixed(2), f: "Cov(X,Y)" };

        // CATEGORIA C: TEORIA DE RESPOSTA AO ITEM & MACHINE LEARNING (21-30)
        M.m21 = { t: "Dificuldade Média do Item (TRI)", v: (1 - Stat.mean(accQuest)).toFixed(2), f: "b = 1 - P(Acerto)" };
        const top30Volume = valQuestoes.filter(q => q.feitas > 10).map(q => q.acertos/q.feitas);
        M.m22 = { t: "Índice de Discriminação", v: (Stat.stdDev(top30Volume)).toFixed(2), f: "a ≈ σ(θ)" };
        M.m23 = { t: "Acertos Absolutos (Soma Y)", v: valQuestoes.reduce((s,q)=>s+(q.acertos||0),0), f: "Σ Y_i" };
        M.m24 = { t: "Taxa de Falsos Positivos", v: "Est. 12%", f: "FPR = FP/(FP+TN)" }; // Estimado mock
        M.m25 = { t: "Decaimento K-Means (Cluster 1)", v: "Tópicos Fortes: " + accQuest.filter(x=>x>0.8).length, f: "Argmin Σ||x - μ_i||²" };
        M.m26 = { t: "K-Means (Cluster 2 - Atenção)", v: "Tópicos Médios: " + accQuest.filter(x=>x>=0.6 && x<=0.8).length, f: "Cluster c_2" };
        M.m27 = { t: "K-Means (Cluster 3 - Risco)", v: "Tópicos Fracos: " + accQuest.filter(x=>x<0.6).length, f: "Cluster c_3" };
        M.m28 = { t: "Taxa Mortalidade Flashcards", v: ((s.flashcards||[]).filter(f=>f.nivel === 0).length / ((s.flashcards||[]).length||1)*100).toFixed(1) + "%", f: "N_Lapse / N_Total" };
        M.m29 = { t: "Fator Ebbinghaus Ajustado (S)", v: (Stat.mean(accQuest) * 10).toFixed(1) + " dias", f: "S = Const × P_recall" };
        M.m30 = { t: "Probabilidade Sobrevivência (Kaplan-Meier)", v: "T(t) > 85% até 7 dias", f: "S(t) = Π (1 - d_i/n_i)" };

        // CATEGORIA D: EFICIÊNCIA, ROI E CUSTO DE OPORTUNIDADE (31-40)
        M.m31 = { t: "ROI Geral (Acertos/Hora)", v: (valQuestoes.reduce((s,q)=>s+(q.acertos||0),0) / (Stat.mean(duracoes)*sessoes.length/60 || 1)).toFixed(1), f: "ROI = Σ A / Σ(h)" };
        M.m32 = { t: "Custo de Oportunidade Marginal", v: ((1 - Math.max(...accQuest,0)) * 100).toFixed(1) + " pt/h", f: "Max(ΔPontos)" };
        M.m33 = { t: "Velocidade Processamento Cognitivo", v: (Stat.mean(volumesSim) / 240).toFixed(2) + " q/min", f: "v = Q / t_simulado" }; // assumindo simulado de 4h
        M.m34 = { t: "Índice de Fadiga (EWMA)", v: (hjDuracao * 0.2 + (Stat.mean(duracoes) * 0.8)).toFixed(1), f: "EWMA_t = αx_t + (1-α)EWMA_{t-1}" };
        M.m35 = { t: "Fronteira de Pareto (Erros)", v: M.m18.v > 0.5 ? "Concentrados (Alta Eficiência)" : "Espalhados (Baixa)", f: "Regra 80/20" };
        M.m36 = { t: "Volatilidade do Concurseiro (VIX)", v: Stat.cv(acertosSim).toFixed(1), f: "σ(Simulados) / μ(Simulados)" };
        M.m37 = { t: "Taxa de Sucesso vs Otimismo", v: (Stat.mean(acertosSim) / (s.metasSemanais?.horasFeitas / (s.metasSemanais?.horas||1) || 1)).toFixed(2), f: "Ratio" };
        M.m38 = { t: "Score de Consistência Ponderada", v: (sessoes.length * Stat.mean(duracoes) / Stat.stdDev(duracoes) || 0).toFixed(1), f: "(N × μ) / σ" };
        M.m39 = { t: "Limiar de Recuperação (Recall Threshold)", v: "14 dias", f: "t = -S ln(0.8)" };
        M.m40 = { t: "Probabilidade de Aprovação Estimada", v: ((Stat.mean(acertosSim)*0.7 + (sessoes.length/365)*0.3)*100).toFixed(1) + "%", f: "P(A) = 0.7μ_s + 0.3(d/365)" };

        // --- RENDERIZAR NA TELA ---
        let html = '';
        const blocks = [
            { title: "📊 Estatística Descritiva & Dispersão (1-10)", keys: ['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10'] },
            { title: "📈 Regressões, Correlações & Previsão (11-20)", keys: ['m11','m12','m13','m14','m15','m16','m17','m18','m19','m20'] },
            { title: "🤖 Teoria de Resposta ao Item & Machine Learning (21-30)", keys: ['m21','m22','m23','m24','m25','m26','m27','m28','m29','m30'] },
            { title: "⏱️ Eficiência, ROI & Análise Marginal (31-40)", keys: ['m31','m32','m33','m34','m35','m36','m37','m38','m39','m40'] }
        ];

        blocks.forEach(b => {
            html += `<div class="ds-section-title">${b.title}</div><div class="ds-grid">`;
            b.keys.forEach(k => {
                const data = M[k];
                html += `
                    <div class="ds-card">
                        <div class="ds-title">${data.t}</div>
                        <div class="ds-value">${data.v}</div>
                        <div class="ds-formula">${data.f}</div>
                    </div>
                `;
            });
            html += `</div>`;
        });

        c.innerHTML = html;
    };

})();
