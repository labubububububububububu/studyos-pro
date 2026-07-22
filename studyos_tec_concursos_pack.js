
// =======================================================================
// STUDYOS PRO - TEC CONCURSOS & QUESTÕES ADVANCED PACK
// Módulo especializado para gestão de desempenho em resolução de questões.
// =======================================================================

(function() {
    'use strict';

    setTimeout(initTecPack, 4000); // Inicia após os outros módulos

    function initTecPack() {
        console.log("🎯 Iniciando StudyOS Tec Concursos Pack...");
        verificarBancoDeDados();
        injectTecStyles();
        injectTecUI();
        window.renderTecDashboard();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    function saveState(state) {
        localStorage.setItem('studyos_pro_data', JSON.stringify(state));
    }

    function verificarBancoDeDados() {
        const s = getState();
        if (!s.tecData) {
            s.tecData = {
                cadernos: [], // Histórico de baterias resolvidas
                metas: { acertoGlobal: 85, questoesDia: 50 },
                config: { modoCebraspe: false } // Uma errada anula uma certa
            };
            saveState(s);
        }
    }

    // ==========================================================
    // 1. ESTILOS DO MÓDULO TEC / QUESTÕES
    // ==========================================================
    function injectTecStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .tec-page { animation: fadeIn 0.4s ease; padding-bottom: 40px; }
            .tec-header { background: linear-gradient(135deg, #0284c7, #0f172a); border-bottom: 3px solid #38bdf8; padding: 20px; border-radius: 16px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(2, 132, 199, 0.3); }
            
            .tec-layout { display: grid; grid-template-columns: 350px 1fr; gap: 20px; }
            @media (max-width: 900px) { .tec-layout { grid-template-columns: 1fr; } }
            
            .tec-panel { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 16px; padding: 20px; backdrop-filter: blur(10px); }
            .tec-panel-title { color: #38bdf8; font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid rgba(56,189,248,0.1); padding-bottom: 10px; }
            
            /* Formulário */
            .tec-form-group { margin-bottom: 12px; }
            .tec-form-group label { display: block; font-size: 0.8rem; color: #94a3b8; margin-bottom: 4px; }
            .tec-input { width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #f8fafc; padding: 10px; border-radius: 8px; font-size: 0.9rem; outline: none; transition: 0.2s; }
            .tec-input:focus { border-color: #38bdf8; box-shadow: 0 0 10px rgba(56,189,248,0.2); }
            .tec-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            
            /* Cards de Estatística */
            .tec-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 20px; }
            .tec-stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; text-align: center; }
            .tec-stat-card.highlight { background: rgba(2, 132, 199, 0.1); border-color: rgba(2, 132, 199, 0.3); }
            .tec-val { font-size: 1.5rem; font-weight: 800; color: #f8fafc; }
            .tec-val.good { color: #34d399; }
            .tec-val.warn { color: #fbbf24; }
            .tec-val.bad { color: #f87171; }
            .tec-lbl { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; text-transform: uppercase; }
            
            /* Tabela de Histórico */
            .tec-table-wrapper { overflow-x: auto; margin-top: 15px; }
            .tec-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
            .tec-table th, .tec-table td { padding: 12px 10px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .tec-table th { color: #38bdf8; font-weight: 600; background: rgba(0,0,0,0.2); }
            .tec-table tr:hover { background: rgba(255,255,255,0.02); }
            .tec-badge { padding: 3px 8px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; }
            .bg-bloco1 { background: rgba(124, 58, 237, 0.2); color: #c4b5fd; }
            .bg-bloco2 { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
            .bg-revisao { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }
            .bg-leis { background: rgba(236, 72, 153, 0.2); color: #f9a8d4; }
            
            .tec-btn { background: #0284c7; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; width: 100%; margin-top: 10px; }
            .tec-btn:hover { background: #0369a1; }
            .tec-btn-delete { background: transparent; border: none; color: #f87171; cursor: pointer; font-size: 1.1rem; }
            .tec-btn-delete:hover { transform: scale(1.1); }
        `;
        document.head.appendChild(style);
    }

    // ==========================================================
    // 2. INJEÇÃO DA INTERFACE (UI)
    // ==========================================================
    function injectTecUI() {
        const navList = document.getElementById('navList');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-tec-concursos';
            li.innerHTML = '<span class="icon">🎯</span> Tec & Questões';
            // Insere antes das configurações
            navList.insertBefore(li, navList.children[navList.children.length - 1]);
            
            li.addEventListener('click', function() {
                document.querySelectorAll('#navList li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-tec-concursos').classList.add('active');
                window.renderTecDashboard();
            });
        }

        const s = getState();
        const disciplinasUnicas = new Set();
        (s.data || []).forEach(b => b.disciplines.forEach(d => disciplinasUnicas.add(d.name)));

        const page = document.createElement('div');
        page.id = 'page-tec-concursos';
        page.className = 'page tec-page';
        page.innerHTML = `
            <div class="tec-header">
                <h2 style="color:#38bdf8; margin:0 0 5px 0;">🎯 Analytics de Questões (Tec Concursos / QConcursos)</h2>
                <p style="font-size:0.85rem; color:#94a3b8; margin:0;">Centralize seus cadernos de questões, monitore o tempo médio por item e descubra lacunas de conhecimento por assunto.</p>
            </div>
            
            <div class="tec-layout">
                <!-- COLUNA ESQUERDA: Formulário -->
                <div class="tec-panel">
                    <div class="tec-panel-title">📝 Registrar Caderno / Bateria</div>
                    
                    <div class="tec-form-group">
                        <label>Disciplina</label>
                        <select id="tecDisc" class="tec-input" onchange="window.updateTecAssuntos()">
                            <option value="">Selecione...</option>
                            ${Array.from(disciplinasUnicas).sort().map(d => `<option value="${d}">${d}</option>`).join('')}
                            <option value="Outras">Outras / Simulado Geral</option>
                        </select>
                    </div>
                    
                    <div class="tec-form-group">
                        <label>Assunto / Tema</label>
                        <select id="tecAssunto" class="tec-input">
                            <option value="">Selecione a disciplina primeiro...</option>
                        </select>
                    </div>

                    <div class="tec-form-group">
                        <label>Módulo de Origem do Estudo</label>
                        <select id="tecModulo" class="tec-input">
                            <option value="bloco1">Bloco 1 (Teoria Nova)</option>
                            <option value="bloco2">Bloco 2 (Revisão por Questões)</option>
                            <option value="revisao">Revisão Espaçada (Geral)</option>
                            <option value="leis">Lei Seca</option>
                        </select>
                    </div>

                    <div class="tec-row">
                        <div class="tec-form-group">
                            <label>Qtd. Resolvidas</label>
                            <input type="number" id="tecFeitas" class="tec-input" min="1" placeholder="Ex: 30">
                        </div>
                        <div class="tec-form-group">
                            <label>Acertos</label>
                            <input type="number" id="tecAcertos" class="tec-input" min="0" placeholder="Ex: 25">
                        </div>
                    </div>

                    <div class="tec-row">
                        <div class="tec-form-group">
                            <label>Tempo Total (min)</label>
                            <input type="number" id="tecTempo" class="tec-input" min="1" placeholder="Ex: 45">
                        </div>
                        <div class="tec-form-group">
                            <label>Link Caderno (Opcional)</label>
                            <input type="text" id="tecLink" class="tec-input" placeholder="https://tecconcursos...">
                        </div>
                    </div>
                    
                    <div class="tec-form-group" style="margin-top:10px;">
                        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                            <input type="checkbox" id="tecCebraspe"> Estilo CEBRASPE (1 Errada anula 1 Certa)
                        </label>
                    </div>

                    <button class="tec-btn" onclick="window.salvarBateriaTec()">💾 Salvar Bateria</button>
                </div>

                <!-- COLUNA DIREITA: Dashboard & Histórico -->
                <div>
                    <div class="tec-stats-grid" id="tecTopStats">
                        <!-- Renderizado via JS -->
                    </div>

                    <div class="tec-panel" style="margin-bottom: 20px;">
                        <div class="tec-panel-title">📉 Gráfico de Evolução (Últimos 10 Cadernos)</div>
                        <canvas id="tecChart" height="80"></canvas>
                    </div>

                    <div class="tec-panel">
                        <div class="tec-panel-title">📋 Histórico Recente de Baterias</div>
                        <div class="tec-table-wrapper">
                            <table class="tec-table">
                                <thead>
                                    <tr>
                                        <th>Data</th>
                                        <th>Módulo</th>
                                        <th>Disciplina / Assunto</th>
                                        <th>A / F</th>
                                        <th>Acerto %</th>
                                        <th>T/Questão</th>
                                        <th>Ação</th>
                                    </tr>
                                </thead>
                                <tbody id="tecHistoryBody">
                                    <!-- Renderizado via JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal de Insights de Pontos Fracos -->
            <div class="tec-panel" style="margin-top: 20px; border-color: rgba(244, 63, 94, 0.3);">
                <div class="tec-panel-title" style="color: #fb7185;">🚨 Radar de Pontos Fracos (Bottom 3)</div>
                <div id="tecWeaknesses" style="display:flex; gap:15px; flex-wrap:wrap;">
                    <!-- Renderizado via JS -->
                </div>
            </div>
        `;
        document.querySelector('.main-content').appendChild(page);
    }

    // ==========================================================
    // 3. LÓGICA DE DADOS E RENDERIZAÇÃO
    // ==========================================================
    
    // Atualiza o select de assuntos baseado na disciplina escolhida
    window.updateTecAssuntos = function() {
        const s = getState();
        const discSelect = document.getElementById('tecDisc').value;
        const assuntoSelect = document.getElementById('tecAssunto');
        
        if (!discSelect || discSelect === 'Outras') {
            assuntoSelect.innerHTML = '<option value="Geral">Geral / Misto</option>';
            return;
        }

        const aulas = [];
        (s.data || []).forEach(b => {
            b.disciplines.forEach(d => {
                if(d.name === discSelect) {
                    d.lessons.forEach(l => aulas.push(l));
                }
            });
        });

        const unicas = [...new Set(aulas)].sort();
        assuntoSelect.innerHTML = '<option value="Geral">Geral / Revisão da Disciplina</option>' + 
            unicas.map(a => `<option value="${a}">${a.length > 50 ? a.substring(0,50)+'...' : a}</option>`).join('');
    };

    window.salvarBateriaTec = function() {
        const disc = document.getElementById('tecDisc').value;
        const assunto = document.getElementById('tecAssunto').value;
        const modulo = document.getElementById('tecModulo').value;
        const feitas = parseInt(document.getElementById('tecFeitas').value);
        const acertos = parseInt(document.getElementById('tecAcertos').value);
        const tempo = parseInt(document.getElementById('tecTempo').value);
        const link = document.getElementById('tecLink').value;
        const cebraspe = document.getElementById('tecCebraspe').checked;

        if(!disc || !feitas || isNaN(acertos) || feitas < 1) {
            return alert('Preencha pelo menos a Disciplina, Qtd. Resolvidas e Acertos.');
        }
        if(acertos > feitas) {
            return alert('Acertos não podem ser maiores que as questões feitas.');
        }

        const s = getState();
        const erros = feitas - acertos;
        // Lógica Cebraspe: Certa (+1), Errada (-1), Branco (0). Assumindo que fez todas.
        let acertoLiquido = acertos;
        if(cebraspe) acertoLiquido = acertos - erros;

        const novaBateria = {
            id: Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            timestamp: Date.now(),
            disciplina: disc,
            assunto: assunto,
            modulo: modulo,
            feitas: feitas,
            acertos: acertos,
            erros: erros,
            acertoLiquido: acertoLiquido,
            isCebraspe: cebraspe,
            tempoMinutos: tempo || 0,
            link: link || ''
        };

        s.tecData.cadernos.push(novaBateria);
        
        // Sincroniza com as estatísticas originais do sistema (progresso)
        // Acha a key da aula se existir no Bloco 1 ou 2
        let aulaKey = null;
        s.data.forEach((b, bi) => b.disciplines.forEach((d, di) => d.lessons.forEach((l, li) => {
            if(d.name === disc && l === assunto) aulaKey = `${b.id}|${di}|${li}`;
        })));

        if(aulaKey) {
            if(!s.questoesAulas) s.questoesAulas = {};
            if(!s.questoesAulas[aulaKey]) s.questoesAulas[aulaKey] = { feitas:0, acertos:0 };
            s.questoesAulas[aulaKey].feitas += feitas;
            s.questoesAulas[aulaKey].acertos += acertos;
        }

        s.student.gamificacao.xp += 15; // Recompensa por registrar
        
        saveState(s);
        
        // Limpar form
        document.getElementById('tecFeitas').value = '';
        document.getElementById('tecAcertos').value = '';
        document.getElementById('tecTempo').value = '';
        
        window.renderTecDashboard();
        alert('Bateria registrada com sucesso! +15 XP');
    };

    window.apagarBateriaTec = function(id) {
        if(!confirm('Deseja realmente apagar este registro?')) return;
        const s = getState();
        s.tecData.cadernos = s.tecData.cadernos.filter(c => c.id !== id);
        saveState(s);
        window.renderTecDashboard();
    };

    window.renderTecDashboard = function() {
        const s = getState();
        const cadernos = s.tecData?.cadernos || [];
        
        let totFeitas = 0, totAcertos = 0, totTempo = 0;
        let acertosBloco1 = 0, feitasBloco1 = 0;
        let acertosBloco2 = 0, feitasBloco2 = 0;

        cadernos.forEach(c => {
            totFeitas += c.feitas;
            totAcertos += c.isCebraspe ? c.acertoLiquido : c.acertos;
            totTempo += c.tempoMinutos || 0;
            
            if(c.modulo === 'bloco1') { feitasBloco1 += c.feitas; acertosBloco1 += c.acertos; }
            if(c.modulo === 'bloco2') { feitasBloco2 += c.feitas; acertosBloco2 += c.acertos; }
        });

        const pctGlobal = totFeitas ? (totAcertos / totFeitas) * 100 : 0;
        const tempoPorQuestao = (totFeitas && totTempo) ? (totTempo * 60) / totFeitas : 0; // em segundos

        // Cores e Status
        const getCor = val => val >= 80 ? 'good' : val >= 60 ? 'warn' : 'bad';
        const getPct = (a,f) => f ? (a/f)*100 : 0;

        // Renderiza Top Stats
        document.getElementById('tecTopStats').innerHTML = `
            <div class="tec-stat-card highlight">
                <div class="tec-val ${getCor(pctGlobal)}">${pctGlobal.toFixed(1)}%</div>
                <div class="tec-lbl">Acerto Global</div>
            </div>
            <div class="tec-stat-card">
                <div class="tec-val">${totFeitas}</div>
                <div class="tec-lbl">Questões Resolvidas</div>
            </div>
            <div class="tec-stat-card">
                <div class="tec-val">${tempoPorQuestao ? (tempoPorQuestao/60).toFixed(1) + ' min' : '--'}</div>
                <div class="tec-lbl">Tempo Médio p/ Questão</div>
            </div>
            <div class="tec-stat-card">
                <div class="tec-val ${getCor(getPct(acertosBloco2, feitasBloco2))}">${getPct(acertosBloco2, feitasBloco2).toFixed(1)}%</div>
                <div class="tec-lbl">Aproveitamento Bloco 2</div>
            </div>
        `;

        // Renderiza Histórico
        const tbody = document.getElementById('tecHistoryBody');
        const recentes = [...cadernos].sort((a,b) => b.timestamp - a.timestamp).slice(0, 15);
        
        if(recentes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8;">Nenhuma bateria registrada.</td></tr>';
        } else {
            tbody.innerHTML = recentes.map(c => {
                const pct = c.feitas ? ((c.isCebraspe ? c.acertoLiquido : c.acertos) / c.feitas) * 100 : 0;
                const badgeClass = `bg-${c.modulo}`;
                const modName = c.modulo === 'bloco1' ? 'B1' : c.modulo === 'bloco2' ? 'B2' : c.modulo === 'revisao' ? 'Rev' : 'Leis';
                const linkIcon = c.link ? `<a href="${c.link}" target="_blank" style="color:#38bdf8;" title="Abrir Caderno no Tec">🔗</a>` : '';
                const tempoItem = (c.tempoMinutos && c.feitas) ? Math.round((c.tempoMinutos*60)/c.feitas) + 's' : '-';
                
                return `
                    <tr>
                        <td>${c.data} ${linkIcon}</td>
                        <td><span class="tec-badge ${badgeClass}">${modName}</span></td>
                        <td><strong>${c.disciplina}</strong><br><span style="font-size:0.7rem; color:#94a3b8;">${c.assunto.substring(0,30)}</span></td>
                        <td>${c.isCebraspe ? c.acertoLiquido : c.acertos} / ${c.feitas} ${c.isCebraspe ? '<small title="Líquidos">(Líq)</small>' : ''}</td>
                        <td class="${getCor(pct)}"><strong>${pct.toFixed(1)}%</strong></td>
                        <td>${tempoItem}</td>
                        <td><button class="tec-btn-delete" onclick="window.apagarBateriaTec(${c.id})" title="Apagar">×</button></td>
                    </tr>
                `;
            }).join('');
        }

        // Renderiza Gráfico (Últimos 10)
        renderTecChart(recentes);
        
        // Renderiza Radar de Pontos Fracos
        renderWeaknesses(cadernos);
    };

    function renderTecChart(recentes) {
        const ctx = document.getElementById('tecChart');
        if(!ctx) return;
        
        // Destroy existing se houver (lógica simplificada para evitar vazamento)
        let chartStatus = Chart.getChart("tecChart"); 
        if (chartStatus != undefined) chartStatus.destroy();

        const dataRev = [...recentes].reverse().slice(-10); // Pegar os 10 mais velhos pros mais novos da amostra
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataRev.map(c => c.data.substring(0,5) + ' (' + c.modulo.substring(0,2) + ')'),
                datasets: [{
                    label: '% de Acerto',
                    data: dataRev.map(c => c.feitas ? ((c.isCebraspe ? c.acertoLiquido : c.acertos) / c.feitas) * 100 : 0),
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointBackgroundColor: '#0f172a',
                    pointBorderColor: '#38bdf8'
                }]
            },
            options: {
                responsive: true,
                scales: { 
                    y: { min: 0, max: 100, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    function renderWeaknesses(cadernos) {
        const container = document.getElementById('tecWeaknesses');
        
        // Agrupar por disciplina
        const agrupado = {};
        cadernos.forEach(c => {
            if(!agrupado[c.disciplina]) agrupado[c.disciplina] = { feitas: 0, acertos: 0 };
            agrupado[c.disciplina].feitas += c.feitas;
            agrupado[c.disciplina].acertos += c.isCebraspe ? c.acertoLiquido : c.acertos;
        });

        // Filtrar matérias com mais de 20 questões para ter validade estatística
        const validados = Object.keys(agrupado)
            .map(d => ({ disc: d, p: agrupado[d].feitas > 0 ? (agrupado[d].acertos / agrupado[d].feitas) * 100 : 0, f: agrupado[d].feitas }))
            .filter(d => d.f >= 20);

        validados.sort((a, b) => a.p - b.p);
        const piores = validados.slice(0, 3);

        if(piores.length === 0) {
            container.innerHTML = '<p class="text-muted" style="font-size:0.8rem; width:100%;">É necessário resolver pelo menos 20 questões em alguma disciplina para gerar o radar de risco.</p>';
            return;
        }

        container.innerHTML = piores.map(p => `
            <div style="background:rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.3); padding:12px; border-radius:8px; flex:1; min-width:200px;">
                <div style="font-weight:bold; color:#f8fafc; font-size:0.9rem;">${p.disc}</div>
                <div style="font-size:1.4rem; font-weight:800; color:#fb7185; margin:5px 0;">${p.p.toFixed(1)}%</div>
                <div style="font-size:0.7rem; color:#94a3b8;">Baseado em ${p.f} questões.</div>
                <button class="btn-glass" style="width:100%; margin-top:8px; font-size:0.7rem; color:#fb7185; border-color:#fb7185;" onclick="alert('Dica: Gere um caderno apenas de erros no Tec Concursos para esta matéria.')">🎯 Focar em Erros</button>
            </div>
        `).join('');
    }

})();
