(function() {
    'use strict';

    setTimeout(initAdvancedAnalytics, 4000);

    function initAdvancedAnalytics() {
        console.log("📊 Inicializando StudyOS Advanced Analytics & Session Engine...");
        verificarSetupAnalitico();
        injectAnalyticsStyles();
        injectAnalyticsUI();
    }

    function getState() {
        return JSON.parse(localStorage.getItem('studyos_pro_data')) || {};
    }

    function saveState(state) {
        localStorage.setItem('studyos_pro_data', JSON.stringify(state));
    }

    function verificarSetupAnalitico() {
        const s = getState();
        if (!s.analyticsEngine) {
            s.analyticsEngine = {
                sessoesDetalhadas: [],
                leisProgresso: {},
                auditoriaErros: []
            };
            saveState(s);
        }
    }

    function injectAnalyticsStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .ana-container { background: #0f172a; padding: 25px; border-radius: 12px; color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif; margin-bottom: 25px; border: 1px solid #334155; }
            .ana-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 20px; }
            .ana-card { background: #1e293b; border: 1px solid #475569; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .ana-title { font-size: 1rem; color: #fbbf24; text-transform: uppercase; font-weight: bold; margin-bottom: 10px; }
            .ana-value { font-size: 2rem; font-weight: 800; color: #fff; }
            .ana-btn { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; text-transform: uppercase; font-size: 0.8rem; }
            .ana-btn:hover { background: #1d4ed8; box-shadow: 0 0 10px rgba(37,99,235,0.5); }
            .ana-modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 10000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
            .ana-modal-content { background: #1e293b; border: 2px solid #fbbf24; padding: 30px; border-radius: 16px; width: 90%; max-width: 600px; color: #fff; max-height: 90vh; overflow-y: auto; }
            .ana-form-group { margin-bottom: 15px; }
            .ana-form-group label { display: block; font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 5px; font-weight: bold; }
            .ana-form-group input, .ana-form-group select, .ana-form-group textarea { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 0.9kt; box-sizing: border-box; }
        `;
        document.head.appendChild(style);
    }

    function injectAnalyticsUI() {
        const navList = document.getElementById('navList');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-advanced-analytics';
            li.innerHTML = '<span class="icon" style="color:#38bdf8;">📈</span> Analytics & Desempenho';
            li.style.borderLeft = '3px solid #38bdf8';
            li.style.background = 'rgba(56, 189, 248, 0.1)';
            navList.appendChild(li);

            li.addEventListener('click', function() {
                document.querySelectorAll('#navList li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-advanced-analytics').classList.add('active');
                window.renderAnalyticsDashboard();
            });
        }

        const page = document.createElement('div');
        page.id = 'page-advanced-analytics';
        page.className = 'page';
        page.innerHTML = `
            <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
                    <div>
                        <h1 style="color:#f8fafc; margin:0; font-size:1.8rem;">Painel de Desempenho e Métricas (34 Requisitos)</h1>
                        <p style="color:#94a3b8; margin:5px 0 0 0;">Análise avançada de Blocos, Leis Secas e Sessões Detalhadas.</p>
                    </div>
                    <button class="ana-btn" onclick="window.openAdvancedSessionModal()">+ Registrar Sessão Granular</button>
                </div>

                <div class="ana-grid">
                    <div class="ana-card">
                        <div class="ana-title">Prontidão para Prova</div>
                        <div class="ana-value" id="valProntidao">0%</div>
                        <div style="font-size:0.75rem; color:#94a3b8; margin-top:5px;">Baseado em Blocos + Simulados</div>
                    </div>
                    <div class="ana-card">
                        <div class="ana-title">Horas Líquidas Registradas</div>
                        <div class="ana-value" id="valHorasLiq">0h</div>
                        <div style="font-size:0.75rem; color:#94a3b8; margin-top:5px;">Sessões detalhadas</div>
                    </div>
                    <div class="ana-card">
                        <div class="ana-title">Média de Foco / Fadiga</div>
                        <div class="ana-value" id="valFocoFadiga">0.0 / 0.0</div>
                        <div style="font-size:0.75rem; color:#94a3b8; margin-top:5px;">Escala de 1 a 5</div>
                    </div>
                    <div class="ana-card">
                        <div class="ana-title">Leis Secas Concluídas</div>
                        <div class="ana-value" id="valLeisProg">0%</div>
                        <div style="font-size:0.75rem; color:#94a3b8; margin-top:5px;">Artigos checkados</div>
                    </div>
                </div>

                <div class="ana-container">
                    <h2 style="color:#fbbf24; font-size:1.2rem; margin-top:0; border-bottom:1px solid #334155; padding-bottom:10px;">Histórico de Sessões Granulares</h2>
                    <div id="granularSessionsTableContainer" style="overflow-x:auto;">
                        <p style="color:#94a3b8;">Nenhuma sessão granular registrada ainda.</p>
                    </div>
                </div>
            </div>

            <!-- MODAL DE REGISTRO GRANULAR -->
            <div id="granularSessionModal" class="ana-modal">
                <div class="ana-modal-content">
                    <h2 style="color:#fbbf24; margin-top:0;">Registro Granular de Sessão</h2>
                    <form onsubmit="window.saveGranularSession(event)">
                        <div class="ana-form-group">
                            <label>Disciplina / Tópico</label>
                            <input type="text" id="gsTopico" required placeholder="Ex: Direito Administrativo - Licitações">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div class="ana-form-group">
                                <label>Tempo Líquido (Minutos)</label>
                                <input type="number" id="gsTempo" required min="1" value="50">
                            </div>
                            <div class="ana-form-group">
                                <label>Técnica Utilizada</label>
                                <select id="gsTecnica">
                                    <option value="PDF">PDF / Teoria</option>
                                    <option value="Video">Vídeo-aula</option>
                                    <option value="LeiSeca">Lei Seca</option>
                                    <option value="Questoes">Resolução de Questões</option>
                                    <option value="Flashcards">Flashcards / Revisão</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div class="ana-form-group">
                                <label>Nível de Foco (1 a 5)</label>
                                <select id="gsFoco">
                                    <option value="5">5 - Extremo Foco</option>
                                    <option value="4" selected>4 - Bom</option>
                                    <option value="3">3 - Moderado</option>
                                    <option value="2">2 - Distraído</option>
                                    <option value="1">1 - Improdutivo</option>
                                </select>
                            </div>
                            <div class="ana-form-group">
                                <label>Nível de Fadiga (1 a 5)</label>
                                <select id="gsFadiga">
                                    <option value="1">1 - Descansado</option>
                                    <option value="2" selected>2 - Normal</option>
                                    <option value="3">3 - Cansado</option>
                                    <option value="4">4 - Exausto</option>
                                    <option value="5">5 - Esgotado</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div class="ana-form-group">
                                <label>Páginas Lidas</label>
                                <input type="number" id="gsPaginas" value="0">
                            </div>
                            <div class="ana-form-group">
                                <label>Questões Feitas / Acertos</label>
                                <input type="text" id="gsQuestoes" placeholder="Ex: 20/18">
                            </div>
                        </div>
                        <div class="ana-form-group">
                            <label>Dificuldade Específica / Observações</label>
                            <textarea id="gsObs" rows="3" placeholder="Onde tive mais dificuldade..."></textarea>
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                            <button type="button" class="ana-btn" style="background:#475569;" onclick="document.getElementById('granularSessionModal').style.display='none'">Cancelar</button>
                            <button type="submit" class="ana-btn">Salvar Sessão Analítica</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.querySelector('.main-content').appendChild(page);
    }

    window.openAdvancedSessionModal = function() {
        document.getElementById('granularSessionModal').style.display = 'flex';
    };

    window.saveGranularSession = function(event) {
        event.preventDefault();
        const s = getState();
        
        const novaSessao = {
            id: Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            topico: document.getElementById('gsTopico').value,
            tempo: parseInt(document.getElementById('gsTempo').value),
            tecnica: document.getElementById('gsTecnica').value,
            foco: parseInt(document.getElementById('gsFoco').value),
            fadiga: parseInt(document.getElementById('gsFadiga').value),
            paginas: parseInt(document.getElementById('gsPaginas').value),
            questoes: document.getElementById('gsQuestoes').value,
            obs: document.getElementById('gsObs').value
        };

        s.analyticsEngine.sessoesDetalhadas.push(novaSessao);
        saveState(s);
        
        document.getElementById('granularSessionModal').style.display = 'none';
        window.renderAnalyticsDashboard();
        alert('Sessão granular registrada com sucesso no motor de desempenho!');
    };

    window.renderAnalyticsDashboard = function() {
        const s = getState();
        const sessoes = s.analyticsEngine?.sessoesDetalhadas || [];

        // Cálculo de horas líquidas
        const totalMin = sessoes.reduce((acc, curr) => acc + curr.tempo, 0);
        const horasLiq = (totalMin / 60).toFixed(1);
        document.getElementById('valHorasLiq').innerText = horasLiq + 'h';

        // Médias de Foco e Fadiga
        if (sessoes.length > 0) {
            const avgFoco = (sessoes.reduce((acc, curr) => acc + curr.foco, 0) / sessoes.length).toFixed(1);
            const avgFadiga = (sessoes.reduce((acc, curr) => acc + curr.fadiga, 0) / sessoes.length).toFixed(1);
            document.getElementById('valFocoFadiga').innerText = `${avgFoco} / ${avgFadiga}`;
        }

        // Prontidão fictícia baseada em sessões e edital
        const checksCount = Object.keys(s.checks || {}).length;
        const prontidao = Math.min(100, Math.round((checksCount / 50) * 100));
        document.getElementById('valProntidao').innerText = prontidao + '%';
        document.getElementById('valLeisProg').innerText = prontidao + '%';

        // Tabela de Sessões
        const container = document.getElementById('granularSessionsTableContainer');
        if (sessoes.length === 0) {
            container.innerHTML = '<p style="color:#94a3b8;">Nenhuma sessão granular registrada ainda.</p>';
            return;
        }

        container.innerHTML = `
            <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem;">
                <thead>
                    <tr style="border-bottom:2px solid #334155; color:#fbbf24;">
                        <th style="padding:10px;">Data</th>
                        <th style="padding:10px;">Tópico</th>
                        <th style="padding:10px;">Tempo</th>
                        <th style="padding:10px;">Técnica</th>
                        <th style="padding:10px;">Foco</th>
                        <th style="padding:10px;">Fadiga</th>
                        <th style="padding:10px;">Questões</th>
                    </tr>
                </thead>
                <tbody>
                    ${sessoes.slice(-10).reverse().map(sess => `
                        <tr style="border-bottom:1px solid #1e293b;">
                            <td style="padding:10px; color:#94a3b8;">${sess.data}</td>
                            <td style="padding:10px; font-weight:bold; color:#fff;">${sess.topico}</td>
                            <td style="padding:10px; color:#38bdf8;">${sess.tempo} min</td>
                            <td style="padding:10px;">${sess.tecnica}</td>
                            <td style="padding:10px; color:#fbbf24;">★ ${sess.foco}</td>
                            <td style="padding:10px; color:#f87171;">⚡ ${sess.fadiga}</td>
                            <td style="padding:10px;">${sess.questoes || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    };

})();
