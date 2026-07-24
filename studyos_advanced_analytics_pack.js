(function() {
    'use strict';

    // =========================================================================
    // 🧠 STUDY OS - ADVANCED ANALYTICS & NEUROSCIENCE TRACKER (v2.0)
    // =========================================================================

    const STATE_KEY = 'studyos_pro_data_v2';
    const CROSS_TAB_KEY = 'studyos_cross_tab_event';

    // Aguarda o carregamento inicial da página e injeta dependências
    setTimeout(initAdvancedAnalytics, 3000);

    function initAdvancedAnalytics() {
        console.log("📊 Inicializando StudyOS Advanced Analytics, Chart.js & Session Engine...");
        loadChartJS()
            .then(() => {
                verificarSetupAnalitico();
                injectAnalyticsStyles();
                injectAnalyticsUI();
                setupCrossTabListener();
            })
            .catch(err => console.error("Erro ao carregar dependências: ", err));
    }

    // =========================================================================
    // 💾 GERENCIAMENTO DE ESTADO E PERSISTÊNCIA (DATA ENGINE)
    // =========================================================================
    
    function getState() {
        try {
            const data = localStorage.getItem(STATE_KEY);
            return data ? JSON.parse(data) : null;
        } catch(e) {
            console.error("Erro ao ler dados:", e);
            return null;
        }
    }

    function saveState(state) {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
        if(document.getElementById('page-advanced-analytics')?.classList.contains('active')){
            renderAnalyticsDashboard(); // Atualiza a tela imediatamente ao salvar
        }
    }

    function verificarSetupAnalitico() {
        let s = getState();
        if (!s || !s.analyticsEngine) {
            s = {
                analyticsEngine: {
                    sessoesDetalhadas: [],
                    leisProgresso: {},
                    auditoriaErros: [],
                    configuracoes: {
                        metaHorasSemanais: 25
                    }
                }
            };
            saveState(s);
        }
    }

    function exportarDados() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getState()));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "StudyOS_Backup_" + new Date().toLocaleDateString('pt-BR').replace(/\//g, '-') + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        alert("✅ Backup dos seus dados realizado com sucesso! Guarde este arquivo.");
    }

    // =========================================================================
    // 📡 INTEGRAÇÃO ENTRE ABAS E AUTOMATIZAÇÃO (CROSS-TAB LISTENER)
    // =========================================================================
    // Nota: Para usar isso nas outras abas (Bloco 1, Leis), basta que os outros 
    // scripts rodem: localStorage.setItem('studyos_cross_tab_event', JSON.stringify({ topico: 'Licitações', origem: 'Bloco 1', ts: Date.now() }))
    
    function setupCrossTabListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === CROSS_TAB_KEY && event.newValue) {
                const aulaConcluida = JSON.parse(event.newValue);
                registrarSessaoAutomatica(aulaConcluida);
            }
        });
    }

    function registrarSessaoAutomatica(dadosAbaExterna) {
        const s = getState();
        const novaSessao = {
            id: Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            topico: `${dadosAbaExterna.origem} - ${dadosAbaExterna.topico}`,
            tempo: 0, // Pendente
            tecnica: 'Indefinida',
            foco: 3,
            fadiga: 3,
            cargaCognitiva: 3,
            paginas: 0,
            questoes: "",
            obs: "",
            status: 'pendente' // Indica que o usuário precisa preencher os detalhes
        };
        s.analyticsEngine.sessoesDetalhadas.push(novaSessao);
        saveState(s);
        console.log("🔔 Nova aula detectada de outra aba e registrada como pendente.");
    }

    // =========================================================================
    // 🧠 NEUROCIÊNCIA E CÁLCULOS COGNITIVOS (METRICS ENGINE)
    // =========================================================================

    function calcularMetricasNeuro(foco, fadiga, carga) {
        // Retenção: Quanto mais foco, melhor. Fadiga extrema e carga alta diminuem.
        let retencao = 85 + (foco * 5) - (fadiga * 4) - (Math.abs(carga - 3) * 2);
        retencao = Math.max(10, Math.min(100, retencao)); // Trava entre 10 e 100%

        // Curva de Ebbinghaus (Dias para próxima revisão)
        // Se a carga for altíssima (5), revisar em 1 dia. Se for leve, 7 dias.
        let diasParaRevisao = 7;
        if (carga >= 4) diasParaRevisao = 1;
        else if (carga === 3 || foco <= 2) diasParaRevisao = 3;

        const dataRevisao = new Date();
        dataRevisao.setDate(dataRevisao.getDate() + diasParaRevisao);

        return {
            retencaoEstimada: retencao.toFixed(1) + '%',
            proximaRevisao: dataRevisao.toLocaleDateString('pt-BR')
        };
    }

    // =========================================================================
    // 🎨 UI / UX & ESTILOS GLOBAIS (DESIGN SYSTEM)
    // =========================================================================

    function loadChartJS() {
        return new Promise((resolve) => {
            if (window.Chart) return resolve();
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    }

    function injectAnalyticsStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .ana-container { background: #0f172a; padding: 25px; border-radius: 12px; color: #f8fafc; font-family: 'Inter', 'Segoe UI', sans-serif; margin-bottom: 25px; border: 1px solid #1e293b; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); }
            .ana-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid #1e293b; padding-bottom: 15px; }
            .ana-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .ana-card { background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; padding: 20px; border-radius: 12px; position: relative; overflow: hidden; }
            .ana-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #38bdf8; }
            .ana-card.warning::before { background: #fbbf24; }
            .ana-card.danger::before { background: #f87171; }
            .ana-title { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px; }
            .ana-value { font-size: 2.2rem; font-weight: 800; color: #f1f5f9; line-height: 1; }
            
            /* Botões */
            .ana-btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; display: inline-flex; align-items: center; gap: 8px; }
            .ana-btn:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37,99,235,0.4); }
            .ana-btn-success { background: #10b981; } .ana-btn-success:hover { background: #059669; box-shadow: 0 4px 12px rgba(16,185,129,0.4); }
            .ana-btn-outline { background: transparent; border: 1px solid #475569; } .ana-btn-outline:hover { background: #1e293b; }
            
            /* Tabelas e Badges */
            .ana-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
            .ana-table th { background: #1e293b; color: #94a3b8; font-weight: 600; padding: 12px; text-align: left; border-bottom: 2px solid #334155; }
            .ana-table td { padding: 14px 12px; border-bottom: 1px solid #1e293b; color: #cbd5e1; vertical-align: middle; }
            .ana-table tr:hover { background: rgba(30, 41, 59, 0.5); }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
            .badge-pendente { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #fbbf24; cursor: pointer; }
            .badge-ok { background: rgba(16, 185, 129, 0.2); color: #34d399; }
            
            /* Modal */
            .ana-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.9); z-index: 10000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(8px); }
            .ana-modal-content { background: #0f172a; border: 1px solid #334155; padding: 30px; border-radius: 16px; width: 95%; max-width: 700px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); }
            .ana-form-group { margin-bottom: 18px; }
            .ana-form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
            .ana-form-group input, .ana-form-group select, .ana-form-group textarea { width: 100%; padding: 12px; background: #1e293b; border: 1px solid #334155; border-radius: 8px; color: #f1f5f9; font-size: 0.95rem; box-sizing: border-box; transition: 0.3s; }
            .ana-form-group input:focus, .ana-form-group select:focus, .ana-form-group textarea:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
            
            /* Grid de Gráficos */
            .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
            @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr; } }
            .chart-container { background: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; }
        `;
        document.head.appendChild(style);
    }

    function injectAnalyticsUI() {
        const navList = document.getElementById('navList') || document.querySelector('ul');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-advanced-analytics';
            li.innerHTML = '<span class="icon" style="color:#38bdf8;">🧠</span> Analytics & Neuro';
            li.style.borderLeft = '3px solid #38bdf8';
            li.style.background = 'rgba(56, 189, 248, 0.1)';
            li.style.cursor = 'pointer';
            navList.appendChild(li);

            li.addEventListener('click', function() {
                document.querySelectorAll('li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                
                let page = document.getElementById('page-advanced-analytics');
                if(page) page.classList.add('active');
                
                renderAnalyticsDashboard();
            });
        }

        const page = document.createElement('div');
        page.id = 'page-advanced-analytics';
        page.className = 'page';
        page.style.display = 'none'; // Gerenciado pelo seu CSS principal
        
        page.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto; padding: 20px; padding-bottom: 100px;">
                <div class="ana-header-flex">
                    <div>
                        <h1 style="color:#f8fafc; margin:0; font-size:2rem; font-weight:800;">StudyOS Brain Center</h1>
                        <p style="color:#94a3b8; margin:5px 0 0 0; font-size:1rem;">Metacognição, Retenção e Dados Granulares.</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="ana-btn ana-btn-outline" onclick="window.StudyOS.exportData()">💾 Backup de Dados</button>
                        <button class="ana-btn ana-btn-success" onclick="window.StudyOS.openModal()">+ Registrar Sessão</button>
                    </div>
                </div>

                <!-- CARDS DE RESUMO -->
                <div class="ana-grid">
                    <div class="ana-card">
                        <div class="ana-title">Horas Líquidas Totais</div>
                        <div class="ana-value" id="valHorasLiq">0.0h</div>
                        <div style="font-size:0.8rem; color:#38bdf8; margin-top:8px;">Baseado em registros granulares</div>
                    </div>
                    <div class="ana-card warning">
                        <div class="ana-title">Retenção Média Estimada</div>
                        <div class="ana-value" id="valRetencao">0%</div>
                        <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">Algoritmo Focus/Fadiga</div>
                    </div>
                    <div class="ana-card danger">
                        <div class="ana-title">Carga Cognitiva (Média)</div>
                        <div class="ana-value" id="valCarga">0.0</div>
                        <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">Escala 1 a 5 (Esforço Mental)</div>
                    </div>
                    <div class="ana-card">
                        <div class="ana-title">Sessões Pendentes</div>
                        <div class="ana-value" id="valPendentes" style="color:#fbbf24;">0</div>
                        <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">Capturadas de outras abas</div>
                    </div>
                </div>

                <!-- GRÁFICOS (CHART.JS) -->
                <div class="charts-grid">
                    <div class="chart-container">
                        <h3 style="margin-top:0; color:#cbd5e1; font-size:1rem;">Volume de Estudo (Últimos 7 dias)</h3>
                        <canvas id="chartEvolucao" height="100"></canvas>
                    </div>
                    <div class="chart-container">
                        <h3 style="margin-top:0; color:#cbd5e1; font-size:1rem;">Técnicas Utilizadas</h3>
                        <canvas id="chartTecnicas" height="200"></canvas>
                    </div>
                </div>

                <!-- TABELA DE SESSÕES -->
                <div class="ana-container">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h2 style="color:#f8fafc; font-size:1.3rem; margin:0;">Histórico e Revisões Agendadas</h2>
                    </div>
                    <div id="granularTableContainer" style="overflow-x:auto;"></div>
                </div>
            </div>

            <!-- MODAL DE FORMULÁRIO -->
            <div id="granularSessionModal" class="ana-modal">
                <div class="ana-modal-content">
                    <h2 id="modalTitle" style="color:#f8fafc; margin-top:0; border-bottom:1px solid #334155; padding-bottom:15px;">Registrar / Editar Sessão</h2>
                    <form id="formSessao" onsubmit="window.StudyOS.saveSession(event)">
                        <input type="hidden" id="gsId">
                        
                        <div class="ana-form-group">
                            <label>Disciplina / Tópico Estudado</label>
                            <input type="text" id="gsTopico" required placeholder="Ex: Direito Administrativo - Atos">
                        </div>
                        
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div class="ana-form-group">
                                <label>Tempo Líquido (Minutos)</label>
                                <input type="number" id="gsTempo" required min="1" value="50">
                            </div>
                            <div class="ana-form-group">
                                <label>Método / Técnica</label>
                                <select id="gsTecnica">
                                    <option value="PDF">Leitura PDF / Doutrina</option>
                                    <option value="Video">Vídeo-aula</option>
                                    <option value="LeiSeca">Lei Seca (Artigos)</option>
                                    <option value="Questoes">Resolução de Questões</option>
                                    <option value="Flashcards">Flashcards / Anki</option>
                                    <option value="MapaMental">Criação de Mapas Mentais</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; background:#1e293b; padding:15px; border-radius:8px; margin-bottom:15px;">
                            <div class="ana-form-group" style="margin:0;">
                                <label style="color:#38bdf8;">🎯 Nível de Foco</label>
                                <select id="gsFoco">
                                    <option value="5">5 - Flow / Imersão</option>
                                    <option value="4" selected>4 - Alto / Bom</option>
                                    <option value="3">3 - Intermitente</option>
                                    <option value="2">2 - Distraído</option>
                                    <option value="1">1 - Não rendeu</option>
                                </select>
                            </div>
                            <div class="ana-form-group" style="margin:0;">
                                <label style="color:#f87171;">🔋 Fadiga Mental</label>
                                <select id="gsFadiga">
                                    <option value="1">1 - Mente Fresca</option>
                                    <option value="2" selected>2 - Normal</option>
                                    <option value="3">3 - Cansado</option>
                                    <option value="4">4 - Névoa Mental</option>
                                    <option value="5">5 - Esgotamento</option>
                                </select>
                            </div>
                            <div class="ana-form-group" style="margin:0;">
                                <label style="color:#fbbf24;">🧠 Carga Cognitiva</label>
                                <select id="gsCarga">
                                    <option value="1">1 - Muito Fácil (Revisão)</option>
                                    <option value="2">2 - Fácil de entender</option>
                                    <option value="3" selected>3 - Desafiador, mas fluiu</option>
                                    <option value="4">4 - Difícil / Denso</option>
                                    <option value="5">5 - Complexidade Extrema</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                            <div class="ana-form-group">
                                <label>Páginas / Artigos</label>
                                <input type="number" id="gsPaginas" value="0">
                            </div>
                            <div class="ana-form-group">
                                <label>Questões (Feitas/Acertos)</label>
                                <input type="text" id="gsQuestoes" placeholder="Ex: 30/25">
                            </div>
                        </div>

                        <div class="ana-form-group">
                            <label>⚠️ Pontos de Dificuldade / Dúvidas / Observações</label>
                            <textarea id="gsObs" rows="3" placeholder="Ex: Tive dificuldade em entender o conceito de imperatividade. Revisar prazo prescricional."></textarea>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap:15px; margin-top:25px;">
                            <button type="button" class="ana-btn ana-btn-outline" onclick="window.StudyOS.closeModal()">Cancelar</button>
                            <button type="submit" class="ana-btn ana-btn-success">💾 Salvar Registro Granular</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Adiciona à tela do sistema principal (adapte o seletor conforme seu HTML real)
        const containerRoot = document.querySelector('.main-content') || document.body;
        containerRoot.appendChild(page);
    }

    // =========================================================================
    // ⚙️ CONTROLADOR PRINCIPAL (GLOBAL API)
    // =========================================================================
    
    let chartInstanciaEvolucao = null;
    let chartInstanciaTecnicas = null;

    window.StudyOS = {
        exportData: exportarDados,
        
        openModal: function(id = null) {
            document.getElementById('formSessao').reset();
            document.getElementById('gsId').value = '';
            document.getElementById('modalTitle').innerText = 'Nova Sessão Granular';

            if (id) {
                const s = getState();
                const sessao = s.analyticsEngine.sessoesDetalhadas.find(x => x.id === id);
                if (sessao) {
                    document.getElementById('modalTitle').innerText = 'Completar/Editar Registro Automático';
                    document.getElementById('gsId').value = sessao.id;
                    document.getElementById('gsTopico').value = sessao.topico;
                    document.getElementById('gsTempo').value = sessao.tempo || 50;
                    document.getElementById('gsTecnica').value = sessao.tecnica !== 'Indefinida' ? sessao.tecnica : 'PDF';
                    document.getElementById('gsFoco').value = sessao.foco || 4;
                    document.getElementById('gsFadiga').value = sessao.fadiga || 2;
                    document.getElementById('gsCarga').value = sessao.cargaCognitiva || 3;
                    document.getElementById('gsPaginas').value = sessao.paginas || 0;
                    document.getElementById('gsQuestoes').value = sessao.questoes || "";
                    document.getElementById('gsObs').value = sessao.obs || "";
                }
            }
            document.getElementById('granularSessionModal').style.display = 'flex';
        },

        closeModal: function() {
            document.getElementById('granularSessionModal').style.display = 'none';
        },

        saveSession: function(e) {
            e.preventDefault();
            const s = getState();
            const editId = document.getElementById('gsId').value;
            
            const foco = parseInt(document.getElementById('gsFoco').value);
            const fadiga = parseInt(document.getElementById('gsFadiga').value);
            const carga = parseInt(document.getElementById('gsCarga').value);
            
            // Calcula retenção e revisão via Algoritmo de Neurociência
            const neuroMets = calcularMetricasNeuro(foco, fadiga, carga);

            const dados = {
                data: new Date().toLocaleDateString('pt-BR'),
                topico: document.getElementById('gsTopico').value,
                tempo: parseInt(document.getElementById('gsTempo').value),
                tecnica: document.getElementById('gsTecnica').value,
                foco: foco,
                fadiga: fadiga,
                cargaCognitiva: carga,
                paginas: parseInt(document.getElementById('gsPaginas').value),
                questoes: document.getElementById('gsQuestoes').value,
                obs: document.getElementById('gsObs').value,
                retencaoEstimada: neuroMets.retencaoEstimada,
                proximaRevisao: neuroMets.proximaRevisao,
                status: 'ok' // Concluído/Detalhado
            };

            if (editId) {
                // Atualiza existente (como as capturadas das outras abas)
                const index = s.analyticsEngine.sessoesDetalhadas.findIndex(x => x.id == editId);
                if (index > -1) {
                    s.analyticsEngine.sessoesDetalhadas[index] = { ...s.analyticsEngine.sessoesDetalhadas[index], ...dados };
                }
            } else {
                // Cria nova
                dados.id = Date.now();
                s.analyticsEngine.sessoesDetalhadas.push(dados);
            }

            saveState(s);
            window.StudyOS.closeModal();
            renderAnalyticsDashboard();
        },
        
        deleteSession: function(id) {
            if(confirm("Deseja realmente apagar este registro?")) {
                const s = getState();
                s.analyticsEngine.sessoesDetalhadas = s.analyticsEngine.sessoesDetalhadas.filter(x => x.id !== id);
                saveState(s);
            }
        }
    };

    // =========================================================================
    // 📊 RENDERIZAÇÃO DO PAINEL E GRÁFICOS
    // =========================================================================

    function renderAnalyticsDashboard() {
        const s = getState();
        if (!s || !s.analyticsEngine) return;
        
        const sessoes = s.analyticsEngine.sessoesDetalhadas || [];

        // 1. Cálculo dos Cards Superiores
        const totalMin = sessoes.reduce((acc, curr) => acc + (curr.tempo || 0), 0);
        document.getElementById('valHorasLiq').innerText = (totalMin / 60).toFixed(1) + 'h';

        const sessoesOK = sessoes.filter(x => x.status === 'ok');
        const sessoesPendentes = sessoes.filter(x => x.status === 'pendente');
        document.getElementById('valPendentes').innerText = sessoesPendentes.length;

        if (sessoesOK.length > 0) {
            const avgRetencao = sessoesOK.reduce((acc, curr) => acc + parseFloat(curr.retencaoEstimada), 0) / sessoesOK.length;
            const avgCarga = sessoesOK.reduce((acc, curr) => acc + curr.cargaCognitiva, 0) / sessoesOK.length;
            document.getElementById('valRetencao').innerText = avgRetencao.toFixed(1) + '%';
            document.getElementById('valCarga').innerText = avgCarga.toFixed(1);
        }

        // 2. Renderizar Tabela HTML
        const container = document.getElementById('granularTableContainer');
        if (sessoes.length === 0) {
            container.innerHTML = '<p style="color:#94a3b8; text-align:center; padding:30px;">Nenhuma sessão registrada. Comece estudando ou integre com outras abas.</p>';
        } else {
            // Ordenar da mais recente para a mais antiga
            const sortedSessoes = [...sessoes].sort((a,b) => b.id - a.id);
            container.innerHTML = `
                <table class="ana-table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Tópico</th>
                            <th>Técnica</th>
                            <th>Tempo</th>
                            <th>Foco / Fadiga</th>
                            <th>Próx. Revisão</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedSessoes.map(sess => {
                            const isPendente = sess.status === 'pendente';
                            return `
                            <tr>
                                <td>
                                    ${isPendente 
                                        ? `<span class="badge badge-pendente" onclick="window.StudyOS.openModal(${sess.id})" title="Clique para detalhar">⚠️ Completar</span>` 
                                        : `<span class="badge badge-ok">✓ Detalhado</span>`
                                    }
                                </td>
                                <td style="font-weight:600; color:#f8fafc; max-width:250px;">
                                    ${sess.topico}
                                    ${sess.obs ? `<div style="font-size:0.75rem; color:#f87171; font-weight:normal; margin-top:4px;">Dificuldade: ${sess.obs}</div>` : ''}
                                </td>
                                <td>${sess.tecnica}</td>
                                <td><span style="color:#38bdf8;">${sess.tempo}m</span></td>
                                <td>
                                    ${isPendente ? '-' : `🎯 ${sess.foco} | 🔋 ${sess.fadiga}`}
                                </td>
                                <td>
                                    ${isPendente ? '-' : `<span style="color:#fbbf24;">📅 ${sess.proximaRevisao}</span>`}
                                </td>
                                <td>
                                    <button class="ana-btn ana-btn-outline" style="padding:5px 10px;" onclick="window.StudyOS.openModal(${sess.id})">✏️</button>
                                    <button class="ana-btn ana-btn-outline" style="padding:5px 10px; color:#f87171; border-color:#f87171;" onclick="window.StudyOS.deleteSession(${sess.id})">🗑️</button>
                                </td>
                            </tr>
                        `}).join('')}
                    </tbody>
                </table>
            `;
        }

        // 3. Renderizar Gráficos (Chart.js)
        renderizarGraficos(sessoesOK);
    }

    function renderizarGraficos(sessoes) {
        if (!window.Chart) return;

        // PREPARAR DADOS - TÉCNICAS
        const tecnicasMap = {};
        sessoes.forEach(s => {
            tecnicasMap[s.tecnica] = (tecnicasMap[s.tecnica] || 0) + 1;
        });

        // PREPARAR DADOS - EVOLUÇÃO (Agrupado por data)
        const tempoPorData = {};
        sessoes.slice().reverse().forEach(s => {
            tempoPorData[s.data] = (tempoPorData[s.data] || 0) + s.tempo;
        });
        const labelsDatas = Object.keys(tempoPorData).slice(-7); // Últimos 7 dias de estudo
        const dataTempos = labelsDatas.map(d => tempoPorData[d]);

        // GRÁFICO 1: EVOLUÇÃO (LINHA)
        const ctxEvol = document.getElementById('chartEvolucao').getContext('2d');
        if (chartInstanciaEvolucao) chartInstanciaEvolucao.destroy();
        chartInstanciaEvolucao = new Chart(ctxEvol, {
            type: 'line',
            data: {
                labels: labelsDatas,
                datasets: [{
                    label: 'Minutos Estudados',
                    data: dataTempos,
                    borderColor: '#38bdf8',
                    backgroundColor: 'rgba(56, 189, 248, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
                }
            }
        });

        // GRÁFICO 2: TÉCNICAS (DOUGHNUT)
        const ctxTec = document.getElementById('chartTecnicas').getContext('2d');
        if (chartInstanciaTecnicas) chartInstanciaTecnicas.destroy();
        chartInstanciaTecnicas = new Chart(ctxTec, {
            type: 'doughnut',
            data: {
                labels: Object.keys(tecnicasMap),
                datasets: [{
                    data: Object.values(tecnicasMap),
                    backgroundColor: ['#38bdf8', '#fbbf24', '#f87171', '#34d399', '#818cf8', '#c084fc'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right', labels: { color: '#cbd5e1' } }
                }
            }
        });
    }

})();
