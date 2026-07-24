(function() {
    'use strict';

    // ========== CONFIGURAÇÃO ==========
    const STORAGE_KEY = 'studyos_pro_data';
    const ENGINE_VERSION = '3.0'; // Integração com abas, gráficos e neurociência

    // Aguarda a interface carregar e então inicializa
    setTimeout(initAdvancedAnalytics, 4000);

    function initAdvancedAnalytics() {
        console.log('%c📊 StudyOS Analytics Engine v' + ENGINE_VERSION,
            'color: #38bdf8; font-size: 1.1em;');
        verificarSetupAnalitico();
        injectAnalyticsStyles();
        injectAnalyticsUI();
        carregarChartJS();            // Carrega Chart.js dinamicamente
        setupDOMObserver();           // Monitora mudanças nas outras abas
        realizarVarreduraInicial();   // Captura aulas já concluídas
    }

    // ========== ESTADO ==========
    function getState() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        try {
            const state = JSON.parse(raw);
            if (!state.analyticsEngine) {
                state.analyticsEngine = createDefaultEngine();
            } else {
                state.analyticsEngine = { ...createDefaultEngine(), ...state.analyticsEngine };
            }
            return state;
        } catch (e) {
            console.error('Erro ao carregar estado, resetando.', e);
            return {};
        }
    }

    function saveState(state) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            console.log('%c✅ Dados salvos com sucesso.', 'color: #4ade80;');
        } catch (e) {
            console.error('Falha ao salvar dados.', e);
            alert('Erro: espaço de armazenamento esgotado.');
        }
    }

    function createDefaultEngine() {
        return {
            sessoesDetalhadas: [],
            leisProgresso: {},
            auditoriaErros: [],
            metasSemanais: { horas: 20, ativa: false },
            configuracoes: { exportarBackup: true },
            registrosAutomaticos: []   // Aulas detectadas automaticamente
        };
    }

    function verificarSetupAnalitico() {
        const s = getState();
        if (!s.analyticsEngine || Object.keys(s.analyticsEngine).length < 6) {
            s.analyticsEngine = createDefaultEngine();
            saveState(s);
        }
    }

    // ========== ESTILOS (adicionados novos para gráficos, tags etc.) ==========
    function injectAnalyticsStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            :root {
                --ana-bg: #0f172a;
                --ana-card: #1e293b;
                --ana-border: #334155;
                --ana-gold: #fbbf24;
                --ana-blue: #38bdf8;
                --ana-red: #f87171;
                --ana-green: #4ade80;
                --ana-text: #f8fafc;
                --ana-muted: #94a3b8;
            }
            .ana-container {
                background: var(--ana-bg);
                padding: 25px;
                border-radius: 12px;
                color: var(--ana-text);
                margin-bottom: 25px;
                border: 1px solid var(--ana-border);
            }
            .ana-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }
            .ana-card {
                background: var(--ana-card);
                border: 1px solid var(--ana-border);
                padding: 20px;
                border-radius: 10px;
                transition: transform 0.2s;
            }
            .ana-card:hover { transform: translateY(-3px); }
            .ana-title {
                font-size: 0.9rem;
                color: var(--ana-gold);
                text-transform: uppercase;
                font-weight: 600;
                margin-bottom: 10px;
            }
            .ana-value { font-size: 2rem; font-weight: 800; }
            .ana-sub { font-size: 0.75rem; color: var(--ana-muted); margin-top: 5px; }
            .ana-btn {
                background: #2563eb;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                text-transform: uppercase;
                font-size: 0.8rem;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            .ana-btn:hover { background: #1d4ed8; }
            .ana-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
            .ana-table th { background: #1e293b; color: var(--ana-gold); padding: 12px; }
            .ana-table td { padding: 12px; border-bottom: 1px solid #1e293b; }
            .ana-modal {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.85); z-index: 10000; display: none;
                align-items: center; justify-content: center; backdrop-filter: blur(5px);
            }
            .ana-modal-content {
                background: var(--ana-card); border: 2px solid var(--ana-gold);
                padding: 30px; border-radius: 16px; width: 90%; max-width: 650px;
                color: #fff; max-height: 90vh; overflow-y: auto;
            }
            .ana-form-group { margin-bottom: 15px; }
            .ana-form-group label {
                display: block; font-size: 0.75rem; color: var(--ana-muted);
                text-transform: uppercase; margin-bottom: 5px; font-weight: 600;
            }
            .ana-form-group input, .ana-form-group select, .ana-form-group textarea {
                width: 100%; padding: 10px; background: var(--ana-bg);
                border: 1px solid var(--ana-border); border-radius: 6px; color: #fff;
            }
            .ana-tag {
                display: inline-block; padding: 2px 10px; border-radius: 12px;
                font-size: 0.7rem; font-weight: bold;
            }
            .ana-tag-focus { background: #1e3a8a; color: #93c5fd; }
            .ana-tag-fatigue { background: #7f1d1d; color: #fca5a5; }
            .chart-container { margin-top: 25px; }
            .chart-row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
            .chart-box { flex: 1; min-width: 300px; background: #1e293b; padding: 15px; border-radius: 10px; }
            .chart-box canvas { max-height: 250px; }
        `;
        document.head.appendChild(style);
    }

    // ========== CARREGAR CHART.JS ==========
    function carregarChartJS() {
        if (window.Chart) return;
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = () => console.log('📊 Chart.js carregado.');
        document.head.appendChild(script);
    }

    // ========== OBSERVAÇÃO DO DOM ==========
    function getAulasConcluidasDOM() {
        // Ajuste os seletores conforme a estrutura real das suas abas
        const checkboxes = document.querySelectorAll(
            '.check-item:checked, .aula-check:checked, input[type="checkbox"][data-concluido="true"]'
        );
        const aulas = [];
        checkboxes.forEach(cb => {
            // Tenta extrair o nome da aula a partir de um elemento pai ou atributo
            const nomeAula = cb.closest('.aula-item')?.querySelector('.aula-nome')?.innerText
                          || cb.dataset.nome
                          || cb.getAttribute('aria-label')
                          || 'Aula sem nome';
            const bloco = cb.closest('[data-bloco]')?.dataset.bloco
                       || cb.closest('.bloco-container')?.querySelector('.bloco-titulo')?.innerText
                       || 'Desconhecido';
            const id = cb.dataset.id || nomeAula + '|' + bloco;
            aulas.push({ id, nome: nomeAula, bloco });
        });
        return aulas;
    }

    let observer = null;
    function setupDOMObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(() => {
            const aulasAtuais = getAulasConcluidasDOM();
            aulasAtuais.forEach(aula => registrarAulaAutomatica(aula));
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    function realizarVarreduraInicial() {
        const aulas = getAulasConcluidasDOM();
        aulas.forEach(aula => registrarAulaAutomatica(aula));
    }

    function registrarAulaAutomatica(aula) {
        const s = getState();
        const engine = s.analyticsEngine;
        // Verifica se já foi registrada (evita duplicatas)
        const jaExiste = engine.registrosAutomaticos.some(r => r.idOrigem === aula.id);
        if (jaExiste) return;

        const novoRegistro = {
            idOrigem: aula.id,
            nome: aula.nome,
            bloco: aula.bloco,
            dataConclusao: new Date().toISOString(),
            detalhado: false   // Indica que ainda não foi enriquecido
        };
        engine.registrosAutomaticos.push(novoRegistro);
        // Cria uma sessão granular básica automaticamente
        const novaSessao = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            data: new Date().toLocaleDateString('pt-BR'),
            topico: `${aula.nome} (${aula.bloco})`,
            tempo: 0, // a ser preenchido pelo usuário
            tecnica: 'Aula Concluída',
            foco: 3,
            fadiga: 2,
            paginas: 0,
            questoes: '',
            dificuldade: 5,
            pontosDificuldade: '',
            qualidadeSono: 3,
            nivelEstresse: 3,
            tempoPausa: 0,
            atencaoPlena: 3,
            revisaoEspacada: false,
            obs: 'Concluído automaticamente. Edite para detalhar.'
        };
        engine.sessoesDetalhadas.push(novaSessao);
        saveState(s);
        console.log('🔔 Aula detectada e registrada:', aula.nome);
    }

    // ========== INTERFACE DO USUÁRIO ==========
    function injectAnalyticsUI() {
        const navList = document.getElementById('navList');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-advanced-analytics';
            li.innerHTML = '<span class="icon" style="color:#38bdf8;">📈</span> Analytics Pro';
            li.style.borderLeft = '3px solid #38bdf8';
            li.style.background = 'rgba(56, 189, 248, 0.1)';
            navList.appendChild(li);
            li.addEventListener('click', () => {
                document.querySelectorAll('#navList li').forEach(l => l.classList.remove('active'));
                li.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-advanced-analytics').classList.add('active');
                window.renderAnalyticsDashboard();
            });
        }

        const page = document.createElement('div');
        page.id = 'page-advanced-analytics';
        page.className = 'page';
        page.innerHTML = `
            <div style="max-width:1400px; margin:0 auto; padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <div>
                        <h1>📊 Painel de Desempenho & Métricas</h1>
                        <p style="color:#94a3b8;">Análise avançada integrada com Blocos, Leis e Neurociência.</p>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="ana-btn" id="btnSalvarAgora">💾 Salvar Agora</button>
                        <button class="ana-btn" onclick="window.openAdvancedSessionModal()">➕ Nova Sessão</button>
                        <button class="ana-btn" style="background:#15803d;" id="btnExportar">📂 Backup</button>
                        <button class="ana-btn" id="btnImportar">📥 Importar</button>
                        <button class="ana-btn" style="background:#b91c1c;" id="btnLimpar">🗑️ Limpar</button>
                    </div>
                </div>
                <div class="ana-grid" id="overviewCards"></div>
                <div class="ana-container" id="metasContainer"></div>
                <div class="ana-container">
                    <h2>📋 Registros Automáticos (Aulas Concluídas)</h2>
                    <div id="autoRegistros"></div>
                </div>
                <div class="ana-container">
                    <h2>📈 Gráficos de Desempenho</h2>
                    <div class="chart-row">
                        <div class="chart-box"><canvas id="chartLinhaFoco"></canvas></div>
                        <div class="chart-box"><canvas id="chartTecnicas"></canvas></div>
                    </div>
                    <div class="chart-row">
                        <div class="chart-box"><canvas id="chartDificuldade"></canvas></div>
                        <div class="chart-box"><canvas id="chartSonoFoco"></canvas></div>
                    </div>
                </div>
                <div class="ana-container">
                    <h2>📋 Histórico Detalhado de Sessões</h2>
                    <div id="granularSessionsTableContainer"></div>
                </div>
            </div>
            <!-- MODAL DE REGISTRO/EDIÇÃO GRANULAR -->
            <div id="granularSessionModal" class="ana-modal">
                <div class="ana-modal-content">
                    <h2 id="modalTitle">Registro Detalhado de Sessão</h2>
                    <form id="sessionForm">
                        <input type="hidden" id="gsEditId" />
                        <div class="ana-form-group"><label>Tópico *</label><input id="gsTopico" required></div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div><label>Tempo (min)</label><input type="number" id="gsTempo" value="50"></div>
                            <div><label>Técnica</label><select id="gsTecnica">
                                <option value="PDF">PDF</option><option value="Video">Vídeo</option>
                                <option value="LeiSeca">Lei Seca</option><option value="Questoes">Questões</option>
                                <option value="Flashcards">Flashcards</option><option value="Simulado">Simulado</option>
                            </select></div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div><label>Foco (1-5)</label><select id="gsFoco">${opcoes1a5(4)}</select></div>
                            <div><label>Fadiga (1-5)</label><select id="gsFadiga">${opcoes1a5(2)}</select></div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div><label>Dificuldade (1-10)</label><input type="number" id="gsDificuldade" min="1" max="10" value="5"></div>
                            <div><label>Qualidade Sono (1-5)</label><select id="gsSono">${opcoes1a5(3)}</select></div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div><label>Nível Estresse (1-5)</label><select id="gsEstresse">${opcoes1a5(3)}</select></div>
                            <div><label>Atenção Plena (1-5)</label><select id="gsMindfulness">${opcoes1a5(3)}</select></div>
                        </div>
                        <div><label>Pontos de Dificuldade (separe por vírgula)</label><textarea id="gsPontos"></textarea></div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div><label>Questões (total/acertos)</label><input id="gsQuestoes" placeholder="Ex: 20/18"></div>
                            <div><label>Tempo de Pausa (min)</label><input type="number" id="gsPausa" value="0"></div>
                        </div>
                        <div style="display:flex; align-items:center; gap:10px; margin:10px 0;">
                            <input type="checkbox" id="gsRevisao"> <label>Revisão Espaçada</label>
                        </div>
                        <div><label>Observações</label><textarea id="gsObs"></textarea></div>
                        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                            <button type="button" class="ana-btn" style="background:#475569;" onclick="fecharModal()">Cancelar</button>
                            <button type="submit" class="ana-btn">Salvar Sessão</button>
                        </div>
                    </form>
                </div>
            </div>
            <input type="file" id="importFileInput" style="display:none;" accept=".json" />
        `;
        document.querySelector('.main-content').appendChild(page);

        document.getElementById('btnSalvarAgora').addEventListener('click', () => {
            const s = getState();
            saveState(s);
            alert('Dados salvos com sucesso!');
        });
        document.getElementById('btnExportar').addEventListener('click', exportarDados);
        document.getElementById('btnImportar').addEventListener('click', () => document.getElementById('importFileInput').click());
        document.getElementById('importFileInput').addEventListener('change', importarDados);
        document.getElementById('btnLimpar').addEventListener('click', limparDados);
        document.getElementById('sessionForm').addEventListener('submit', saveGranularSession);
    }

    function opcoes1a5(selected) {
        return [1,2,3,4,5].map(n => `<option value="${n}" ${n==selected?'selected':''}>${n}</option>`).join('');
    }

    // ========== CRUD SESSÕES ==========
    window.openAdvancedSessionModal = function(editId = null) {
        const modal = document.getElementById('granularSessionModal');
        document.getElementById('gsEditId').value = editId ? editId : '';
        if (editId) {
            const s = getState();
            const sessao = s.analyticsEngine.sessoesDetalhadas.find(s => s.id == editId);
            if (sessao) {
                document.getElementById('gsTopico').value = sessao.topico;
                document.getElementById('gsTempo').value = sessao.tempo;
                document.getElementById('gsTecnica').value = sessao.tecnica;
                document.getElementById('gsFoco').value = sessao.foco;
                document.getElementById('gsFadiga').value = sessao.fadiga;
                document.getElementById('gsDificuldade').value = sessao.dificuldade || 5;
                document.getElementById('gsSono').value = sessao.qualidadeSono || 3;
                document.getElementById('gsEstresse').value = sessao.nivelEstresse || 3;
                document.getElementById('gsMindfulness').value = sessao.atencaoPlena || 3;
                document.getElementById('gsPontos').value = sessao.pontosDificuldade || '';
                document.getElementById('gsQuestoes').value = sessao.questoes || '';
                document.getElementById('gsPausa').value = sessao.tempoPausa || 0;
                document.getElementById('gsRevisao').checked = sessao.revisaoEspacada || false;
                document.getElementById('gsObs').value = sessao.obs || '';
                document.getElementById('modalTitle').innerText = 'Editar Sessão';
            }
        } else {
            document.getElementById('sessionForm').reset();
            document.getElementById('modalTitle').innerText = 'Registro Detalhado de Sessão';
        }
        modal.style.display = 'flex';
    };

    window.fecharModal = function() {
        document.getElementById('granularSessionModal').style.display = 'none';
    };

    async function saveGranularSession(e) {
        e.preventDefault();
        const s = getState();
        const engine = s.analyticsEngine;
        const editId = document.getElementById('gsEditId').value;

        const dados = {
            id: editId ? parseInt(editId) : Date.now(),
            timestamp: editId ? (engine.sessoesDetalhadas.find(s=>s.id==editId)?.timestamp || new Date().toISOString()) : new Date().toISOString(),
            data: new Date().toLocaleDateString('pt-BR'),
            topico: document.getElementById('gsTopico').value,
            tempo: parseInt(document.getElementById('gsTempo').value),
            tecnica: document.getElementById('gsTecnica').value,
            foco: parseInt(document.getElementById('gsFoco').value),
            fadiga: parseInt(document.getElementById('gsFadiga').value),
            dificuldade: parseInt(document.getElementById('gsDificuldade').value),
            qualidadeSono: parseInt(document.getElementById('gsSono').value),
            nivelEstresse: parseInt(document.getElementById('gsEstresse').value),
            atencaoPlena: parseInt(document.getElementById('gsMindfulness').value),
            pontosDificuldade: document.getElementById('gsPontos').value,
            questoes: document.getElementById('gsQuestoes').value,
            tempoPausa: parseInt(document.getElementById('gsPausa').value),
            revisaoEspacada: document.getElementById('gsRevisao').checked,
            obs: document.getElementById('gsObs').value
        };

        if (editId) {
            const index = engine.sessoesDetalhadas.findIndex(s => s.id == editId);
            if (index !== -1) engine.sessoesDetalhadas[index] = dados;
        } else {
            engine.sessoesDetalhadas.push(dados);
        }

        saveState(s);
        fecharModal();
        window.renderAnalyticsDashboard();
    }

    // ========== EXPORTAÇÃO / IMPORTAÇÃO / LIMPEZA ==========
    function exportarDados() {
        const engine = getState().analyticsEngine || createDefaultEngine();
        const blob = new Blob([JSON.stringify(engine, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `studyos_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    }

    function importarDados(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const dados = JSON.parse(ev.target.result);
                if (!dados.sessoesDetalhadas) throw new Error();
                const s = getState();
                s.analyticsEngine = dados;
                saveState(s);
                alert('Dados importados!');
                window.renderAnalyticsDashboard();
            } catch { alert('Arquivo inválido.'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    function limparDados() {
        if (confirm('Apagar todos os dados de analytics?')) {
            const s = getState();
            s.analyticsEngine = createDefaultEngine();
            saveState(s);
            window.renderAnalyticsDashboard();
        }
    }

    // ========== RENDERIZAÇÃO DO DASHBOARD ==========
    window.renderAnalyticsDashboard = function() {
        const engine = getState().analyticsEngine || createDefaultEngine();
        const sessoes = engine.sessoesDetalhadas || [];
        const agora = new Date();

        // Cálculos
        const totalMin = sessoes.reduce((a,b) => a + b.tempo, 0);
        const horasLiq = (totalMin / 60).toFixed(1);
        const n = sessoes.length;
        const avgFoco = n ? (sessoes.reduce((a,b) => a + b.foco, 0) / n).toFixed(1) : 0;
        const avgFadiga = n ? (sessoes.reduce((a,b) => a + b.fadiga, 0) / n).toFixed(1) : 0;
        const avgDificuldade = n ? (sessoes.reduce((a,b) => a + (b.dificuldade||5), 0) / n).toFixed(1) : 5;
        const avgSono = n ? (sessoes.reduce((a,b) => a + (b.qualidadeSono||3), 0) / n).toFixed(1) : 3;

        document.getElementById('overviewCards').innerHTML = `
            <div class="ana-card"><div class="ana-title">⏱️ Horas Líquidas</div><div class="ana-value">${horasLiq}h</div><div class="ana-sub">${n} sessões</div></div>
            <div class="ana-card"><div class="ana-title">🧠 Foco Médio</div><div class="ana-value">${avgFoco}</div><div class="ana-sub">Fadiga: ${avgFadiga}</div></div>
            <div class="ana-card"><div class="ana-title">📚 Dificuldade Média</div><div class="ana-value">${avgDificuldade}</div></div>
            <div class="ana-card"><div class="ana-title">😴 Sono Médio</div><div class="ana-value">${avgSono}</div></div>
        `;

        // Meta semanal (similar à anterior, simplificada)
        document.getElementById('metasContainer').innerHTML = '<h2>🎯 Meta Semanal</h2><p style="color:#94a3b8;">Defina sua meta nos botões acima.</p>';

        // Registros automáticos
        const autoContainer = document.getElementById('autoRegistros');
        const registros = engine.registrosAutomaticos || [];
        if (registros.length === 0) {
            autoContainer.innerHTML = '<p style="color:#94a3b8;">Nenhuma aula concluída detectada.</p>';
        } else {
            autoContainer.innerHTML = registros.map(r => `
                <div style="display:flex; justify-content:space-between; background:#1e293b; padding:10px; border-radius:6px; margin-bottom:5px;">
                    <span>📘 ${r.nome} (${r.bloco}) - ${new Date(r.dataConclusao).toLocaleDateString()}</span>
                    <span class="ana-tag ${r.detalhado ? 'ana-tag-focus' : ''}">${r.detalhado ? 'Detalhado' : 'Pendente'}</span>
                </div>`).join('');
        }

        // Tabela de sessões (com botão editar)
        const tabela = document.getElementById('granularSessionsTableContainer');
        if (n === 0) tabela.innerHTML = '<p style="color:#94a3b8;">Nenhuma sessão.</p>';
        else {
            const html = sessoes.slice(-20).reverse().map(s => `
                <tr>
                    <td>${s.data}</td><td>${s.topico}</td><td>${s.tempo} min</td>
                    <td>${s.tecnica}</td><td>${s.foco}</td><td>${s.fadiga}</td>
                    <td>${s.dificuldade||5}</td><td>${s.qualidadeSono||3}</td>
                    <td><button class="ana-btn" style="padding:2px 8px; font-size:0.7rem;" onclick="window.openAdvancedSessionModal(${s.id})">✏️</button></td>
                </tr>`).join('');
            tabela.innerHTML = `<table class="ana-table"><thead><tr><th>Data</th><th>Tópico</th><th>Tempo</th><th>Técnica</th><th>Foco</th><th>Fadiga</th><th>Dific.</th><th>Sono</th><th></th></tr></thead><tbody>${html}</tbody></table>`;
        }

        // Gráficos (aguardar Chart.js estar disponível)
        if (window.Chart && n > 0) {
            gerarGraficos(sessoes);
        } else if (n > 0) {
            setTimeout(() => window.renderAnalyticsDashboard(), 500);
        }
    };

    function gerarGraficos(sessoes) {
        // Destroi gráficos antigos se existirem
        ['chartLinhaFoco', 'chartTecnicas', 'chartDificuldade', 'chartSonoFoco'].forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas.chartInstance) canvas.chartInstance.destroy();
        });

        const ultimas = sessoes.slice(-20);
        const labels = ultimas.map(s => s.data);
        const focoData = ultimas.map(s => s.foco);
        const fadigaData = ultimas.map(s => s.fadiga);

        new Chart(document.getElementById('chartLinhaFoco'), {
            type: 'line',
            data: {
                labels,
                datasets: [
                    { label: 'Foco', data: focoData, borderColor: '#38bdf8' },
                    { label: 'Fadiga', data: fadigaData, borderColor: '#f87171' }
                ]
            },
            options: { responsive: true, plugins: { legend: { labels: { color: '#fff' } } } }
        });

        const tecnicas = {};
        sessoes.forEach(s => tecnicas[s.tecnica] = (tecnicas[s.tecnica]||0)+1);
        new Chart(document.getElementById('chartTecnicas'), {
            type: 'pie',
            data: {
                labels: Object.keys(tecnicas),
                datasets: [{ data: Object.values(tecnicas), backgroundColor: ['#2563eb','#fbbf24','#4ade80','#f87171','#a78bfa'] }]
            }
        });

        const dificuldades = {};
        sessoes.forEach(s => {
            if (s.pontosDificuldade) {
                const pontos = s.pontosDificuldade.split(',').map(p => p.trim());
                pontos.forEach(p => { if(p) dificuldades[p] = (dificuldades[p]||0) + 1; });
            }
        });
        new Chart(document.getElementById('chartDificuldade'), {
            type: 'bar',
            data: {
                labels: Object.keys(dificuldades).slice(0,10),
                datasets: [{ label: 'Frequência', data: Object.values(dificuldades).slice(0,10), backgroundColor: '#fbbf24' }]
            },
            options: { scales: { y: { beginAtZero: true, ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } } }
        });

        const sonoFoco = sessoes.map(s => ({ x: s.qualidadeSono||3, y: s.foco }));
        new Chart(document.getElementById('chartSonoFoco'), {
            type: 'scatter',
            data: { datasets: [{ label: 'Sono x Foco', data: sonoFoco, backgroundColor: '#38bdf8' }] },
            options: { scales: { x: { title: { text: 'Sono', color: '#fff' }, ticks: { color: '#fff' } }, y: { title: { text: 'Foco', color: '#fff' }, ticks: { color: '#fff' } } } }
        });

        // Guarda referência para destruição posterior
        document.querySelectorAll('canvas').forEach(c => c.chartInstance = Chart.getChart(c));
    }

})();
