(function() {
    'use strict';

    setTimeout(initStudyOSAnalytics, 3000);

    // =========================================================================
    // 📚 TAXONOMIA DE ESTUDOS (EDITAL / CONTEÚDO PROGRAMÁTICO)
    // =========================================================================
    const taxonomiaEstudo = {
        "CONHECIMENTOS BÁSICOS": {
            "LÍNGUA PORTUGUESA": [
                "Interpretação de texto: decodificação de mensagens",
                "Compreensão de texto: significados textuais",
                "Características básicas da textualidade",
                "Estruturas linguísticas e classes de palavras",
                "Pragmática na linguagem e significado contextual",
                "Semântica vocabular (sinônimos, antônimos, homônimos)",
                "Modos de organização discursiva",
                "Organização das frases nas situações comunicativas",
                "Linguagem lógica e figurada",
                "Diversos níveis de linguagem",
                "Tipos de discurso (direto, indireto, livre)",
                "Funções da linguagem"
            ],
            "LÍNGUA INGLESA": [
                "Estratégias de leitura em língua inglesa",
                "Aspectos sintático-gramaticais e tempos verbais"
            ],
            "POLÍTICAS PÚBLICAS E GESTÃO": [
                "Políticas públicas e ciclo de políticas",
                "Processos participativos de gestão pública",
                "Governo Aberto (Decreto nº 10.160/2019)",
                "Governo Digital (Decreto nº 10.332/2020)",
                "Planejamento nas organizações públicas e PDCA",
                "Gestão por resultados na produção de serviços",
                "Princípios de governabilidade e governança",
                "Corrupção e fatores nas políticas públicas",
                "Papel das instituições e indicadores"
            ]
        },
        "CONHECIMENTOS ESPECÍFICOS": {
            "DIREITO CONSTITUCIONAL": [
                "Constituição Federal de 1988 e Princípios fundamentais",
                "Aplicabilidade das normas constitucionais",
                "Direitos e garantias fundamentais",
                "Organização político-administrativa do Estado",
                "Administração Pública e servidores",
                "Poder Executivo: atribuições e responsabilidades",
                "Poder Legislativo: estrutura e processo legislativo",
                "Poder Judiciário e Conselho Nacional de Justiça",
                "Funções essenciais à justiça",
                "Ordem Econômica e Financeira"
            ],
            "DIREITO ADMINISTRATIVO": [
                "Estado, governo e Administração Pública",
                "Direito administrativo: conceito e fontes",
                "Ato administrativo: requisitos, espécies e extinção",
                "Agentes públicos e Lei nº 8.112/1990",
                "Poderes da Administração Pública",
                "Princípios expressos e implícitos",
                "Responsabilidade civil do Estado",
                "Serviços públicos e Lei nº 13.460/2018",
                "Organização administrativa (Direta, Indireta, Estatais)",
                "Controle da Administração Pública e Improbidade (Lei nº 8.429/1992)",
                "Processo administrativo (Lei nº 9.784/1999)",
                "Licitações e contratos (Lei nº 8.666/1993 e Lei nº 14.133/2021)",
                "Ética Pública (Decretos nº 1.171/1994, 6.029/2007 e Lei nº 12.813/2013)",
                "LINDB (Decreto-Lei nº 4.657/1942 e Decreto nº 9.830/2019)",
                "Acesso à informação (LAI) e Tratamento de dados (LGPD)"
            ],
            "ADMINISTRAÇÃO FINANCEIRA E ORÇAMENTÁRIA": [
                "Orçamento Público: conceitos e princípios",
                "Orçamento na CF/88 (PPA, LDO, LOA)",
                "Lei de Responsabilidade Fiscal - LRF",
                "Classificação econômica da Receita e da Despesa",
                "Conceito e estágios da Receita e da Despesa",
                "Gestão organizacional das finanças (Lei nº 10.180/2001)"
            ],
            "FUNDAMENTOS DE AUDITORIA GOVERNAMENTAL": [
                "Sistema de Controle Interno do Executivo Federal",
                "Manual de Orientações Técnicas (MOT 2017)",
                "Instrução Normativa SFC nº 3/2017"
            ],
            "CONTROLADORIA-GERAL DA UNIÃO": [
                "Estrutura e competência da CGU (Leis e Decretos)",
                "Sistemas estruturantes (Controle, Correição, Ouvidorias, Integridade)"
            ]
        },
        "CONHECIMENTOS ESPECIALIZADOS (AUDITORIA E FISCALIZAÇÃO)": {
            "AUDITORIA GOVERNAMENTAL E CONTROLE INTERNO": [
                "Controle Interno Federal, MOT 2017 e IN SFC nº 3/2019",
                "Orientações Práticas: Relatório de Auditoria e Contas",
                "NBC TA Estrutura Conceitual para Trabalhos de Asseguração",
                "IPPF/IIA e Gestão de Riscos (Modelo de Três Linhas)"
            ],
            "CONTABILIDADE APLICADA AO SETOR PÚBLICO": [
                "NBC TSP Estrutura Conceitual e Demonstrações Contábeis",
                "Lei nº 4.320/1964, NBC TSP 11 e MCASP (9ª Edição)",
                "Plano de Contas Aplicado ao Setor Público (PCASP)",
                "Tópicos da Lei Complementar nº 101/2000 na Contabilidade",
                "Procedimentos contábeis orçamentários e patrimoniais",
                "Sistema de Informações de Custos (NBC T 16.11)"
            ],
            "AVALIAÇÃO DE POLÍTICAS PÚBLICAS": [
                "Análise Ex Ante (Guia Prático Casa Civil/IPEA)",
                "Análise Ex Post (Guia Prático Casa Civil)",
                "Conselho de Monitoramento e Avaliação - CMAP"
            ],
            "FINANÇAS PÚBLICAS": [
                "Funções do Estado e financiamento dos gastos públicos",
                "Tributação, equidade e federalismo fiscal",
                "Orçamento público no Brasil e Créditos Adicionais",
                "Plano Proritário (PPA) e Lei de Diretrizes Orçamentárias",
                "Classificações e Ciclo Orçamentário",
                "Déficit público, sustentabilidade e Resultados Fiscais (NFSP)",
                "Gestão fiscal responsável (LC nº 101/2000)"
            ]
        }
    };

    function obterBlocoDaDisciplina(disciplina) {
        for (const [bloco, discObj] of Object.entries(taxonomiaEstudo)) {
            if (discObj[disciplina]) return bloco;
        }
        return "OUTROS";
    }

    function initStudyOSAnalytics() {
        console.log("🧠 StudyOS Brain Center inicializado com Nomenclatura Personalizada de Backup.");
        verificarSetupAnalitico();
        injectAnalyticsStyles();
        injectAnalyticsUI();
        
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            document.head.appendChild(script);
        }

        window.addEventListener('storage', function(e) {
            if (e.key === 'studyos_cross_tab_event' && e.newValue) {
                try {
                    const dados = JSON.parse(e.newValue);
                    registrarSessaoPendenteAutomatica(dados.origem, dados.topico);
                } catch(err) { console.error("StudyOS Error", err); }
            }
        });
    }

    // =========================================================================
    // 💾 DADOS, PERSISTÊNCIA, EXPORTAÇÃO E IMPORTAÇÃO DE BACKUP
    // =========================================================================
    function getState() {
        try {
            const data = localStorage.getItem('studyos_pro_data_v6');
            return data ? JSON.parse(data) : null;
        } catch(e) { return null; }
    }

    function saveState(state) {
        try { localStorage.setItem('studyos_pro_data_v6', JSON.stringify(state)); } 
        catch(e) { alert("⚠️ Erro ao salvar dados."); }
    }

    function verificarSetupAnalitico() {
        let s = getState();
        if (!s || !s.analyticsEngine) {
            s = { analyticsEngine: { sessoesDetalhadas: [] } };
            saveState(s);
        }
    }

    window.exportarBackupStudyOS = function() {
        const dadosAtuais = getState();
        if (!dadosAtuais) {
            alert("⚠️ Nenhum dado encontrado para exportar.");
            return;
        }
        
        const agora = new Date();
        const dia = String(agora.getDate()).padStart(2, '0');
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const ano = agora.getFullYear();
        const hora = String(agora.getHours()).padStart(2, '0');
        const minuto = String(agora.getMinutes()).padStart(2, '0');
        const nomeArquivo = `registrogranular_${dia}-${mes}-${ano}_${hora}-${minuto}.json`;

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dadosAtuais, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", nomeArquivo);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    window.importarBackupStudyOS = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dadosImportados = JSON.parse(e.target.result);
                if (dadosImportados && dadosImportados.analyticsEngine) {
                    if (confirm("⚠️ Importar este backup substituirá os dados atuais do subsistema. Deseja continuar?")) {
                        saveState(dadosImportados);
                        alert("✅ Backup importado com sucesso!");
                        window.renderAnalyticsDashboard();
                    }
                } else {
                    alert("⚠️ O arquivo selecionado não é um backup válido do StudyOS.");
                }
            } catch(err) {
                alert("⚠️ Erro ao processar o arquivo JSON de backup.");
                console.error(err);
            }
            event.target.value = '';
        };
        reader.readAsText(file);
    };

    // =========================================================================
    // 🧠 METRICS E NEUROCIÊNCIA
    // =========================================================================
    function calcularNeuroMetricas(foco, fadiga, carga) {
        let retencao = 85 + (foco * 5) - (fadiga * 4) - (Math.abs(carga - 3) * 2);
        retencao = Math.max(10, Math.min(100, retencao)); 
        let diasParaRevisao = (carga >= 4) ? 1 : ((carga === 3 || foco <= 2) ? 3 : 7);
        const dataRevisao = new Date();
        dataRevisao.setDate(dataRevisao.getDate() + diasParaRevisao);
        return { retencao: retencao.toFixed(1) + '%', revisao: dataRevisao.toLocaleDateString('pt-BR') };
    }

    function parseDataBR(dataStr) {
        const [d, m, y] = dataStr.split('/');
        return new Date(y, m - 1, d).getTime();
    }

    function registrarSessaoPendenteAutomatica(origem, topico) {
        const s = getState();
        s.analyticsEngine.sessoesDetalhadas.push({
            id: Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            topico: `${origem} - ${topico}`,
            tempo: 0, tecnica: 'Indefinida', foco: 3, fadiga: 3, carga: 3,
            paginas: 0, questoes: "", obs: "", status: 'pendente'
        });
        saveState(s);
        const page = document.getElementById('page-advanced-analytics');
        if (page && page.classList.contains('active')) window.renderAnalyticsDashboard();
    }

    function gerarInsightsAcionaveis(sessoes) {
        if (sessoes.length < 3) return `<p style="color:#94a3b8;">Registre mais sessões para gerar insights precisos de tendência por matéria.</p>`;
        
        let insights = [];
        const materias = {};
        
        sessoes.forEach(s => {
            const mat = s.topico.split('-')[0].trim();
            if(!materias[mat]) materias[mat] = { fadiga:0, carga:0, foco:0, count:0 };
            materias[mat].fadiga += s.fadiga;
            materias[mat].carga += s.carga;
            materias[mat].foco += s.foco;
            materias[mat].count++;
        });

        for (const [mat, dados] of Object.entries(materias)) {
            const medFadiga = dados.fadiga / dados.count;
            const medCarga = dados.carga / dados.count;
            const medFoco = dados.foco / dados.count;

            if (medFadiga >= 3.5) insights.push({ tipo: 'danger', texto: `🚨 <strong>Fadiga Crítica em ${mat}:</strong> Nível de exaustão alto detectado nesta disciplina. Considere estudá-la em horários de maior energia ou usar o método Pomodoro.` });
            if (medCarga >= 4.0) insights.push({ tipo: 'warning', texto: `⚠️ <strong>Carga Cognitiva Alta em ${mat}:</strong> A dificuldade do conteúdo está no limite. Considere alternar a técnica (ex: teoria para flashcards ou questões) para absorção.` });
            if (medFoco <= 2.5) insights.push({ tipo: 'info', texto: `📉 <strong>Baixo Foco em ${mat}:</strong> Atenção dispersa neste conteúdo. Intercalar com resolução de questões comentadas pode estimular o estudo ativo.` });
        }

        if (insights.length === 0) insights.push({ tipo: 'success', texto: `✅ <strong>Ritmo Ideal:</strong> Seus estudos do edital estão balanceados! Carga e Foco dentro da zona de desempenho desejável.` });

        return insights.map(i => {
            const colors = { 'danger': '#f87171', 'warning': '#fbbf24', 'info': '#38bdf8', 'success': '#34d399' };
            const bg = { 'danger': 'rgba(248,113,113,0.1)', 'warning': 'rgba(251,191,36,0.1)', 'info': 'rgba(56,189,248,0.1)', 'success': 'rgba(52,211,153,0.1)' };
            return `<div style="background:${bg[i.tipo]}; border-left:4px solid ${colors[i.tipo]}; padding:15px; margin-bottom:15px; border-radius:6px; color:#f8fafc; font-size:0.95rem;">${i.texto}</div>`;
        }).join('');
    }

    // =========================================================================
    // 🎨 UI E ESTILOS
    // =========================================================================
    function injectAnalyticsStyles() {
        if(document.getElementById('studyos-brain-styles')) return;
        const style = document.createElement('style');
        style.id = 'studyos-brain-styles';
        style.innerHTML = `
            .studyos-container { width: 100%; max-width: 100%; margin: 0 auto; padding: 15px; box-sizing: border-box; }
            .sub-nav { display: flex; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #334155; padding-bottom: 10px; overflow-x: auto; width: 100%; }
            .sub-tab-btn { background: transparent; border: none; color: #94a3b8; font-size: 1rem; font-weight: bold; cursor: pointer; padding: 10px 15px; border-bottom: 3px solid transparent; transition: 0.3s; white-space: nowrap; }
            .sub-tab-btn:hover { color: #f8fafc; }
            .sub-tab-btn.active { color: #38bdf8; border-bottom-color: #38bdf8; }
            .sub-tab-content { display: none; animation: fadeIn 0.4s ease; width: 100%; box-sizing: border-box; }
            .sub-tab-content.active { display: block; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

            .brain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 25px; width: 100%; box-sizing: border-box; }
            .brain-card { background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; box-sizing: border-box; }
            .brain-card.warning { border-left-color: #fbbf24; }
            .brain-card.danger { border-left-color: #f87171; }
            .brain-title { font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; margin-bottom: 8px; }
            .brain-value { font-size: 2rem; font-weight: 800; color: #f8fafc; }
            
            .brain-filter { background: #1e293b; color: #f8fafc; border: 1px solid #475569; padding: 8px 15px; border-radius: 6px; font-weight: bold; cursor: pointer; box-sizing: border-box; }
            .brain-btn { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; box-sizing: border-box; }
            .brain-btn:hover { background: #1d4ed8; }
            
            .brain-table-container { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 20px; overflow-x: auto; width: 100%; box-sizing: border-box; }
            .brain-table { width: 100%; border-collapse: collapse; color: #cbd5e1; font-size: 0.85rem; }
            .brain-table th { text-align: left; padding: 12px; border-bottom: 2px solid #334155; color: #fbbf24; }
            .brain-table td { padding: 12px; border-bottom: 1px solid #1e293b; vertical-align: top;}
            .brain-table tr:hover { background: #1e293b; }
            
            .chart-box { background: #1e293b; border: 1px solid #334155; padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; }
            .chart-container-fluid { position: relative; width: 100%; height: 350px; box-sizing: border-box; }
            
            .brain-form-group { margin-bottom: 15px; }
            .brain-form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px; font-weight: bold; }
            .brain-form-group input, .brain-form-group select, .brain-form-group textarea { width: 100%; padding: 10px; background: #1e293b; border: 1px solid #475569; border-radius: 6px; color: #fff; box-sizing: border-box; font-size:0.95rem; }
        `;
        document.head.appendChild(style);
    }

    function injectAnalyticsUI() {
        const navList = document.getElementById('navList') || document.querySelector('ul');
        if (navList) {
            const li = document.createElement('li');
            li.dataset.page = 'page-advanced-analytics';
            li.innerHTML = '<span class="icon" style="color:#38bdf8;">🧠</span> Analytics & Dados';
            li.style.borderLeft = '3px solid #38bdf8';
            li.style.background = 'rgba(56, 189, 248, 0.1)';
            navList.appendChild(li);

            li.addEventListener('click', function() {
                document.querySelectorAll('#navList li, ul li').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                const myPage = document.getElementById('page-advanced-analytics');
                if (myPage) {
                    myPage.classList.add('active');
                    window.renderAnalyticsDashboard(); 
                }
            });
        }

        const page = document.createElement('div');
        page.id = 'page-advanced-analytics';
        page.className = 'page'; 

        page.innerHTML = `
            <div class="studyos-container">
                
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom: 20px; width:100%;">
                    <div>
                        <h1 style="color:#f8fafc; margin:0; font-size:2rem;">StudyOS Painel de Dados</h1>
                        <p style="color:#94a3b8; margin:5px 0 0 0;">Matriz Analítica & Subsistema de BI Adaptativo.</p>
                    </div>
                    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                        <select id="filtroData" class="brain-filter" onchange="window.renderAnalyticsDashboard()">
                            <option value="7">Últimos 7 Dias</option>
                            <option value="30" selected>Últimos 30 Dias</option>
                            <option value="all">Todo o Período</option>
                        </select>
                        <input type="file" id="studyosImportInput" accept=".json" style="display:none;" onchange="window.importarBackupStudyOS(event)">
                        <button class="brain-btn" style="background:#475569;" onclick="document.getElementById('studyosImportInput').click()">📤 Importar Backup</button>
                        <button class="brain-btn" style="background:#475569;" onclick="window.exportarBackupStudyOS()">📥 Exportar Backup</button>
                        <button class="brain-btn" style="background:#10b981;" onclick="window.abrirFormularioRegistro()">+ Registrar Aula</button>
                    </div>
                </div>

                <!-- SUB NAVEGAÇÃO COM ABA FIXA DE REGISTRO -->
                <div class="sub-nav">
                    <button class="sub-tab-btn active" onclick="window.changeSubTab('tab-resumo', this)">Visão Geral & Histórico</button>
                    <button class="sub-tab-btn" onclick="window.changeSubTab('tab-registro', this)">Novo Registro Granular ✍️</button>
                    <button class="sub-tab-btn" onclick="window.changeSubTab('tab-bi', this)">Matriz BI Dinâmica 📊</button>
                    <button class="sub-tab-btn" onclick="window.changeSubTab('tab-decisao', this)">Central de Tendências 🧠</button>
                </div>

                <!-- ABA 1: RESUMO -->
                <div id="tab-resumo" class="sub-tab-content active">
                    <div class="brain-grid">
                        <div class="brain-card"><div class="brain-title">Horas Estudadas</div><div class="brain-value" id="valHorasLiq">0h</div></div>
                        <div class="brain-card warning"><div class="brain-title">Retenção Estimada</div><div class="brain-value" id="valRetencao">0%</div></div>
                        <div class="brain-card danger"><div class="brain-title">Carga Cognitiva</div><div class="brain-value" id="valCargaCognitiva">0.0</div></div>
                        <div class="brain-card"><div class="brain-title">Aulas Pendentes</div><div class="brain-value" id="valPendentes" style="color:#fbbf24;">0</div></div>
                    </div>
                    <div class="brain-table-container">
                        <h2 style="color:#f8fafc; margin-top:0;">Histórico Detalhado (Filtrado)</h2>
                        <div id="tableContainer"></div>
                    </div>
                </div>

                <!-- ABA 2: NOVO REGISTRO GRANULAR (EM ABA FIXA) -->
                <div id="tab-registro" class="sub-tab-content">
                    <div style="background:#1e293b; border:1px solid #334155; padding:30px; border-radius:12px; width:100%; box-sizing:border-box;">
                        <h2 style="color:#fbbf24; margin-top:0; border-bottom: 1px solid #334155; padding-bottom: 10px;" id="gsFormTitle">Novo Registro Granular de Sessão</h2>
                        <form onsubmit="window.saveGranularSession(event)">
                            <input type="hidden" id="gsId">
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; width:100%; box-sizing:border-box; margin-bottom:15px;">
                                <div class="brain-form-group" style="margin:0;">
                                    <label>Bloco / Categoria</label>
                                    <select id="gsBloco" required onchange="window.atualizarDisciplinasModal()">
                                        <option value="">Selecione o Bloco...</option>
                                    </select>
                                </div>
                                <div class="brain-form-group" style="margin:0;">
                                    <label>Disciplina do Edital</label>
                                    <select id="gsDisciplina" required onchange="window.atualizarSubtopicosModal()">
                                        <option value="">Selecione a Disciplina...</option>
                                    </select>
                                </div>
                            </div>

                            <div class="brain-form-group">
                                <label>Tópico Específico</label>
                                <select id="gsSubtopico" required>
                                    <option value="">Selecione o Tópico...</option>
                                </select>
                            </div>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; width:100%; box-sizing:border-box;">
                                <div class="brain-form-group">
                                    <label>Tempo Líquido (Minutos)</label>
                                    <input type="number" id="gsTempo" required min="1" value="50">
                                </div>
                                <div class="brain-form-group">
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

                            <!-- MÉTRICAS DE NEUROCIÊNCIA -->
                            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:15px; background:#0f172a; padding:15px; border-radius:6px; margin-bottom:15px; border: 1px solid #334155; width:100%; box-sizing:border-box;">
                                <div class="brain-form-group" style="margin:0;">
                                    <label style="color:#38bdf8;">Nível de Foco (1-5)</label>
                                    <select id="gsFoco"><option value="5">5 - Extremo</option><option value="4" selected>4 - Bom</option><option value="3">3 - Moderado</option><option value="2">2 - Distraído</option><option value="1">1 - Improdutivo</option></select>
                                </div>
                                <div class="brain-form-group" style="margin:0;">
                                    <label style="color:#f87171;">Nível de Fadiga (1-5)</label>
                                    <select id="gsFadiga"><option value="1">1 - Descansado</option><option value="2" selected>2 - Normal</option><option value="3">3 - Cansado</option><option value="4">4 - Exausto</option><option value="5">5 - Esgotado</option></select>
                                </div>
                                <div class="brain-form-group" style="margin:0;">
                                    <label style="color:#fbbf24;">Carga Cognitiva (1-5)</label>
                                    <select id="gsCarga"><option value="1">1 - Muito Fácil</option><option value="2">2 - Fácil</option><option value="3" selected>3 - Médio</option><option value="4">4 - Difícil</option><option value="5">5 - Complexo</option></select>
                                </div>
                            </div>

                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px; width:100%; box-sizing:border-box;">
                                <div class="brain-form-group">
                                    <label>Páginas Lidas</label>
                                    <input type="number" id="gsPaginas" value="0">
                                </div>
                                <div class="brain-form-group">
                                    <label>Questões Feitas / Acertos</label>
                                    <input type="text" id="gsQuestoes" placeholder="Ex: 20/18">
                                </div>
                            </div>

                            <div class="brain-form-group">
                                <label>Dificuldade Específica / Observações</label>
                                <textarea id="gsObs" rows="3" placeholder="Onde tive mais dificuldade, dúvidas pendentes..."></textarea>
                            </div>

                            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
                                <button type="button" class="brain-btn" style="background:transparent; border:1px solid #475569;" onclick="window.changeSubTab('tab-resumo', document.querySelector('.sub-tab-btn'))">Cancelar</button>
                                <button type="submit" class="brain-btn" style="background:#10b981;">Salvar Registro</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- ABA 3: MATRIZ BI DINÂMICA (SUBSISTEMA) -->
                <div id="tab-bi" class="sub-tab-content">
                    <div style="background:#1e293b; padding:20px; border-radius:8px; border:1px solid #334155; margin-bottom:20px; width:100%; box-sizing:border-box;">
                        <h3 style="color:#38bdf8; margin-top:0;">Filtros e Variáveis do Subsistema de BI</h3>
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:15px; margin-bottom:15px; width:100%; box-sizing:border-box;">
                            <div>
                                <label style="color:#94a3b8; font-size:0.8rem; font-weight:bold;">Filtrar Bloco</label>
                                <select id="biBloco" class="brain-filter" style="width:100%;" onchange="window.atualizarBiDisciplinas()">
                                    <option value="all">Todos os Blocos</option>
                                </select>
                            </div>
                            <div>
                                <label style="color:#94a3b8; font-size:0.8rem; font-weight:bold;">Filtrar Disciplina</label>
                                <select id="biDisciplina" class="brain-filter" style="width:100%;" onchange="window.atualizarBiAssuntos()">
                                    <option value="all">Todas as Disciplinas</option>
                                </select>
                            </div>
                            <div>
                                <label style="color:#94a3b8; font-size:0.8rem; font-weight:bold;">Filtrar Assunto/Tópico</label>
                                <select id="biAssunto" class="brain-filter" style="width:100%;">
                                    <option value="all">Todos os Assuntos</option>
                                </select>
                            </div>
                            <div>
                                <label style="color:#94a3b8; font-size:0.8rem; font-weight:bold;">Perspectiva de Análise</label>
                                <select id="biTipoAnalise" class="brain-filter" style="width:100%;" onchange="window.renderBiDashboard()">
                                    <option value="geral">Visão Geral & KPIs Estatísticos</option>
                                    <option value="carga_fadiga">Correlação: Carga Cognitiva vs. Fadiga</option>
                                    <option value="retencao">Probabilidade de Retenção & Curva</option>
                                    <option value="questoes">Aproveitamento e Erros em Questões</option>
                                    <option value="tecnicas">Eficiência Comparativa por Técnica</option>
                                    <option value="radar_gargalos">Matriz Radar de Gargalos</option>
                                </select>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:flex-end;">
                            <button class="brain-btn" style="background:#2563eb;" onclick="window.renderBiDashboard()">⚡ Executar Análise Dinâmica</button>
                        </div>
                    </div>

                    <div class="brain-grid" id="biKpisGrid"></div>

                    <div class="chart-box" style="margin-top:20px;">
                        <h3 style="color:#f8fafc; margin-top:0;" id="biChartTitle">Visualização Gráfica Dinâmica</h3>
                        <div class="chart-container-fluid">
                            <canvas id="chartBiDynamic"></canvas>
                        </div>
                    </div>

                    <div id="biReportContainer" style="margin-top:20px; background:#1e293b; padding:20px; border-radius:8px; border:1px solid #334155; color:#cbd5e1; width:100%; box-sizing:border-box;"></div>
                </div>

                <!-- ABA 4: DECISÃO (IA LOCAL) -->
                <div id="tab-decisao" class="sub-tab-content">
                    <div style="background:#1e293b; padding:25px; border-radius:12px; border:1px solid #334155; width:100%; box-sizing:border-box;">
                        <h2 style="color:#38bdf8; margin-top:0;">Análise de Padrões e Sugestões</h2>
                        <p style="color:#94a3b8; margin-bottom:25px;">O sistema cruza dados de Carga, Foco e Fadiga por disciplina do edital para apontar onde estão seus gargalos de aprendizado.</p>
                        <div id="insightsContainer"></div>
                    </div>
                </div>

            </div>
        `;
        
        document.querySelector('.main-content').appendChild(page);
        inicializarOpcoesBlocos();
        inicializarFiltrosBi();
    }

    // =========================================================================
    // ⚙️ LÓGICA DE CASCATA PARA OS SELETORES DO EDITAL & BI
    // =========================================================================
    function inicializarOpcoesBlocos() {
        const blocoSelect = document.getElementById('gsBloco');
        if(!blocoSelect) return;
        blocoSelect.innerHTML = '<option value="">Selecione o Bloco...</option>';
        Object.keys(taxonomiaEstudo).forEach(bloco => {
            const opt = document.createElement('option');
            opt.value = bloco;
            opt.textContent = bloco;
            blocoSelect.appendChild(opt);
        });
    }

    function inicializarFiltrosBi() {
        const blocoSelect = document.getElementById('biBloco');
        if(!blocoSelect) return;
        blocoSelect.innerHTML = '<option value="all">Todos os Blocos</option>';
        Object.keys(taxonomiaEstudo).forEach(bloco => {
            const opt = document.createElement('option');
            opt.value = bloco;
            opt.textContent = bloco;
            blocoSelect.appendChild(opt);
        });
        window.atualizarBiDisciplinas();
    }

    window.atualizarBiDisciplinas = function() {
        const bloco = document.getElementById('biBloco').value;
        const discSelect = document.getElementById('biDisciplina');
        const subSelect = document.getElementById('biAssunto');
        
        discSelect.innerHTML = '<option value="all">Todas as Disciplinas</option>';
        subSelect.innerHTML = '<option value="all">Todos os Assuntos</option>';

        let disciplinas = [];
        if (bloco === 'all') {
            Object.values(taxonomiaEstudo).forEach(obj => {
                disciplinas.push(...Object.keys(obj));
            });
        } else if (taxonomiaEstudo[bloco]) {
            disciplinas = Object.keys(taxonomiaEstudo[bloco]);
        }

        disciplinas.forEach(disc => {
            const opt = document.createElement('option');
            opt.value = disc;
            opt.textContent = disc;
            discSelect.appendChild(opt);
        });
        window.atualizarBiAssuntos();
    };

    window.atualizarBiAssuntos = function() {
        const bloco = document.getElementById('biBloco').value;
        const disc = document.getElementById('biDisciplina').value;
        const subSelect = document.getElementById('biAssunto');
        
        subSelect.innerHTML = '<option value="all">Todos os Assuntos</option>';

        let assuntos = [];
        if (disc !== 'all') {
            for (const [bKey, discObj] of Object.entries(taxonomiaEstudo)) {
                if (bloco === 'all' || bloco === bKey) {
                    if (discObj[disc]) {
                        assuntos.push(...discObj[disc]);
                    }
                }
            }
        } else if (bloco !== 'all' && taxonomiaEstudo[bloco]) {
            Object.values(taxonomiaEstudo[bloco]).forEach(arr => assuntos.push(...arr));
        }

        assuntos.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            subSelect.appendChild(opt);
        });
    };

    window.atualizarDisciplinasModal = function() {
        const bloco = document.getElementById('gsBloco').value;
        const discSelect = document.getElementById('gsDisciplina');
        const subSelect = document.getElementById('gsSubtopico');
        
        discSelect.innerHTML = '<option value="">Selecione a Disciplina...</option>';
        subSelect.innerHTML = '<option value="">Selecione o Tópico...</option>';

        if(bloco && taxonomiaEstudo[bloco]) {
            Object.keys(taxonomiaEstudo[bloco]).forEach(disc => {
                const opt = document.createElement('option');
                opt.value = disc;
                opt.textContent = disc;
                discSelect.appendChild(opt);
            });
        }
    };

    window.atualizarSubtopicosModal = function() {
        const bloco = document.getElementById('gsBloco').value;
        const disc = document.getElementById('gsDisciplina').value;
        const subSelect = document.getElementById('gsSubtopico');
        
        subSelect.innerHTML = '<option value="">Selecione o Tópico...</option>';

        if(bloco && disc && taxonomiaEstudo[bloco][disc]) {
            taxonomiaEstudo[bloco][disc].forEach(sub => {
                const opt = document.createElement('option');
                opt.value = sub;
                opt.textContent = sub;
                subSelect.appendChild(opt);
            });
        }
    };

    window.changeSubTab = function(tabId, btnElement) {
        document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
        document.querySelectorAll('.sub-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        if(tabId === 'tab-bi') {
            window.renderBiDashboard();
        }
    };

    // =========================================================================
    // ⚙️ LÓGICA DO FORMULÁRIO DE REGISTRO (ABERTO VIA ABA)
    // =========================================================================
    window.abrirFormularioRegistro = function(id = null) {
        inicializarOpcoesBlocos();
        document.getElementById('gsId').value = '';
        document.getElementById('gsBloco').value = '';
        document.getElementById('gsDisciplina').innerHTML = '<option value="">Selecione a Disciplina...</option>';
        document.getElementById('gsSubtopico').innerHTML = '<option value="">Selecione o Tópico...</option>';
        document.getElementById('gsTempo').value = 50;
        document.getElementById('gsPaginas').value = 0;
        document.getElementById('gsQuestoes').value = '';
        document.getElementById('gsObs').value = '';
        document.getElementById('gsFormTitle').innerText = 'Novo Registro Granular de Sessão';

        if (id) {
            const sessao = getState().analyticsEngine.sessoesDetalhadas.find(x => x.id === id);
            if (sessao) { 
                document.getElementById('gsFormTitle').innerText = 'Completar / Editar Registro de Sessão';
                document.getElementById('gsId').value = sessao.id; 
                if(sessao.tempo) document.getElementById('gsTempo').value = sessao.tempo;
                if(sessao.tecnica) document.getElementById('gsTecnica').value = sessao.tecnica;
                if(sessao.paginas !== undefined) document.getElementById('gsPaginas').value = sessao.paginas;
                if(sessao.questoes) document.getElementById('gsQuestoes').value = sessao.questoes;
                if(sessao.obs) document.getElementById('gsObs').value = sessao.obs;

                const partes = sessao.topico.split(' - ');
                if (partes.length >= 2) {
                    const disciplinaSalva = partes[0].trim();
                    const topicoSalvo = partes.slice(1).join(' - ').trim();

                    for (const [blocoKey, discObj] of Object.entries(taxonomiaEstudo)) {
                        if (discObj[disciplinaSalva]) {
                            document.getElementById('gsBloco').value = blocoKey;
                            window.atualizarDisciplinasModal();
                            document.getElementById('gsDisciplina').value = disciplinaSalva;
                            window.atualizarSubtopicosModal();
                            document.getElementById('gsSubtopico').value = topicoSalvo;
                            break;
                        }
                    }
                }
            }
        }

        const btnTab = document.querySelectorAll('.sub-tab-btn')[1]; // Aba "Novo Registro Granular"
        window.changeSubTab('tab-registro', btnTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.saveGranularSession = function(event) {
        event.preventDefault();
        const s = getState();
        const idEdit = document.getElementById('gsId').value;
        
        const disciplina = document.getElementById('gsDisciplina').value;
        const subtopico = document.getElementById('gsSubtopico').value;
        const topicoFinal = `${disciplina} - ${subtopico}`;

        const foco = parseInt(document.getElementById('gsFoco').value);
        const fadiga = parseInt(document.getElementById('gsFadiga').value);
        const carga = parseInt(document.getElementById('gsCarga').value);
        const metricas = calcularNeuroMetricas(foco, fadiga, carga);
        
        const dados = {
            id: idEdit ? parseInt(idEdit) : Date.now(),
            data: new Date().toLocaleDateString('pt-BR'),
            topico: topicoFinal,
            tempo: parseInt(document.getElementById('gsTempo').value),
            tecnica: document.getElementById('gsTecnica').value,
            foco: foco, fadiga: fadiga, carga: carga,
            paginas: parseInt(document.getElementById('gsPaginas').value || 0),
            questoes: document.getElementById('gsQuestoes').value || "-",
            obs: document.getElementById('gsObs').value || "",
            retencao: metricas.retencao,
            revisao: metricas.revisao,
            status: 'ok'
        };

        if (idEdit) {
            const index = s.analyticsEngine.sessoesDetalhadas.findIndex(x => x.id == idEdit);
            if (index > -1) s.analyticsEngine.sessoesDetalhadas[index] = { ...s.analyticsEngine.sessoesDetalhadas[index], ...dados };
        } else {
            s.analyticsEngine.sessoesDetalhadas.push(dados);
        }
        
        saveState(s);
        
        const btnResumo = document.querySelectorAll('.sub-tab-btn')[0];
        window.changeSubTab('tab-resumo', btnResumo);
        window.renderAnalyticsDashboard();
    };

    window.excluirSessao = function(id) {
        if(confirm("Apagar este registro permanentemente?")) {
            const s = getState();
            s.analyticsEngine.sessoesDetalhadas = s.analyticsEngine.sessoesDetalhadas.filter(x => x.id !== id);
            saveState(s); window.renderAnalyticsDashboard();
        }
    };

    // =========================================================================
    // 📊 SUBSISTEMA DE BI DINÂMICO & RENDERIZAÇÃO GERAL RESPONSIVA
    // =========================================================================
    let activeCharts = {};

    function destroyChart(key) {
        if (activeCharts[key]) {
            activeCharts[key].destroy();
            activeCharts[key] = null;
        }
    }

    window.renderBiDashboard = function() {
        const s = getState();
        const allSessoes = s.analyticsEngine?.sessoesDetalhadas || [];
        
        const diasFiltro = document.getElementById('filtroData').value;
        const blocoFiltro = document.getElementById('biBloco').value;
        const discFiltro = document.getElementById('biDisciplina').value;
        const assuntoFiltro = document.getElementById('biAssunto').value;
        const tipoAnalise = document.getElementById('biTipoAnalise').value;

        const agora = Date.now();
        let sessoesFiltradas = allSessoes.filter(sess => sess.status === 'ok');

        if (diasFiltro !== 'all') {
            const limiteTempo = parseInt(diasFiltro) * 24 * 60 * 60 * 1000;
            sessoesFiltradas = sessoesFiltradas.filter(sess => (agora - parseDataBR(sess.data)) <= limiteTempo);
        }

        sessoesFiltradas = sessoesFiltradas.filter(sess => {
            const partes = sess.topico.split(' - ');
            const disc = partes[0] ? partes[0].trim() : "";
            const ass = partes.slice(1).join(' - ').trim();
            const blocoDaSessao = obterBlocoDaDisciplina(disc);

            if (blocoFiltro !== 'all' && blocoDaSessao !== blocoFiltro) return false;
            if (discFiltro !== 'all' && disc !== discFiltro) return false;
            if (assuntoFiltro !== 'all' && ass !== assuntoFiltro) return false;
            return true;
        });

        const totalMin = sessoesFiltradas.reduce((a, b) => a + b.tempo, 0);
        const totalQuestoesFeitas = sessoesFiltradas.reduce((a, b) => {
            if(!b.questoes || b.questoes === '-') return a;
            const parts = b.questoes.split('/');
            return a + (parseInt(parts[0]) || 0);
        }, 0);
        const totalQuestoesAcertos = sessoesFiltradas.reduce((a, b) => {
            if(!b.questoes || b.questoes === '-') return a;
            const parts = b.questoes.split('/');
            return a + (parseInt(parts[1]) || 0);
        }, 0);
        const taxaAcerto = totalQuestoesFeitas > 0 ? ((totalQuestoesAcertos / totalQuestoesFeitas) * 100).toFixed(1) + '%' : '0.0%';
        const mediaFoco = sessoesFiltradas.length > 0 ? (sessoesFiltradas.reduce((a,b)=>a+b.foco,0)/sessoesFiltradas.length).toFixed(1) : '0.0';
        const mediaCarga = sessoesFiltradas.length > 0 ? (sessoesFiltradas.reduce((a,b)=>a+b.carga,0)/sessoesFiltradas.length).toFixed(1) : '0.0';
        const mediaFadiga = sessoesFiltradas.length > 0 ? (sessoesFiltradas.reduce((a,b)=>a+b.fadiga,0)/sessoesFiltradas.length).toFixed(1) : '0.0';

        document.getElementById('biKpisGrid').innerHTML = `
            <div class="brain-card"><div class="brain-title">Volume Filtrado</div><div class="brain-value">${(totalMin/60).toFixed(1)}h</div></div>
            <div class="brain-card warning"><div class="brain-title">Aproveitamento Questões</div><div class="brain-value">${taxaAcerto}</div></div>
            <div class="brain-card"><div class="brain-title">Foco Médio (1-5)</div><div class="brain-value" style="color:#34d399;">${mediaFoco}</div></div>
            <div class="brain-card danger"><div class="brain-title">Fadiga Média (1-5)</div><div class="brain-value">${mediaFadiga}</div></div>
        `;

        destroyChart('chartBiDynamic');
        let chartConfig = {};
        let relatorioHTML = '';

        if (tipoAnalise === 'geral') {
            document.getElementById('biChartTitle').innerText = 'Evolução do Tempo de Estudo no Filtro Selecionado';
            const histMap = {};
            sessoesFiltradas.forEach(s => { histMap[s.data] = (histMap[s.data] || 0) + s.tempo; });
            
            chartConfig = {
                type: 'bar',
                data: { labels: Object.keys(histMap), datasets: [{ label: 'Minutos', data: Object.values(histMap), backgroundColor: '#38bdf8', borderRadius:4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins:{legend:{display:false}}, scales: { x:{grid:{display:false}, ticks:{color:'#cbd5e1'}}, y:{grid:{color:'#334155'}, ticks:{color:'#cbd5e1'}} } }
            };
            relatorioHTML = `<h4>📋 Relatório Estatístico Geral</h4><p>Total de sessões analisadas: <strong>${sessoesFiltradas.length}</strong>. Carga cognitiva média de <strong>${mediaCarga}</strong>. Total de páginas lidas: <strong>${sessoesFiltradas.reduce((a,b)=>a+(b.paginas||0),0)}</strong>.</p>`;

        } else if (tipoAnalise === 'carga_fadiga') {
            document.getElementById('biChartTitle').innerText = 'Correlação Estatística: Carga Cognitiva vs. Fadiga Mental';
            const correlacaoMap = { 'Fácil (1-2)': 0, 'Médio (3)': 0, 'Difícil (4-5)': 0 };
            sessoesFiltradas.forEach(s => {
                if (s.carga <= 2) correlacaoMap['Fácil (1-2)'] += s.fadiga;
                else if (s.carga === 3) correlacaoMap['Médio (3)'] += s.fadiga;
                else correlacaoMap['Difícil (4-5)'] += s.fadiga;
            });
            chartConfig = {
                type: 'radar',
                data: {
                    labels: Object.keys(correlacaoMap),
                    datasets: [{ label: 'Índice de Fadiga Acumulada', data: Object.values(correlacaoMap), borderColor: '#f87171', backgroundColor: 'rgba(248,113,113,0.2)' }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { r: { grid: {color:'#334155'}, ticks:{display:false} } }, plugins:{legend:{labels:{color:'#fff'}}} }
            };
            relatorioHTML = `<h4>🧠 Análise de Exaustão Cognitiva</h4><p>Mostra como o esforço mental se traduz em desgaste para o filtro selecionado.</p>`;

        } else if (tipoAnalise === 'retencao') {
            document.getElementById('biChartTitle').innerText = 'Probabilidade de Retenção & Curva de Esquecimento Estimada';
            const retencaoMap = {};
            sessoesFiltradas.forEach(s => {
                retencaoMap[s.topico.split('-')[0].trim()] = parseFloat(s.retencao) || 85;
            });
            const labels = Object.keys(retencaoMap);
            chartConfig = {
                type: 'line',
                data: { labels: labels, datasets: [{ label: 'Retenção Média %', data: labels.map(l => retencaoMap[l]), borderColor: '#34d399', backgroundColor:'rgba(52,211,153,0.1)', fill:true, tension:0.2 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins:{legend:{display:false}}, scales: { x:{grid:{display:false}, ticks:{color:'#cbd5e1', font:{size:9}}}, y:{grid:{color:'#334155'}, ticks:{color:'#cbd5e1'}, max:100, min:0} } }
            };
            relatorioHTML = `<h4>📈 Previsão Probabilística de Retenção</h4><p>Baseada na neurociência do esquecimento (foco e carga).</p>`;

        } else if (tipoAnalise === 'questoes') {
            document.getElementById('biChartTitle').innerText = 'Desempenho de Questões (Feitas vs Acertos)';
            const qMap = {};
            sessoesFiltradas.forEach(s => {
                if(s.questoes && s.questoes !== '-') {
                    const mat = s.topico.split('-')[0].trim();
                    const parts = s.questoes.split('/').map(Number);
                    if(!qMap[mat]) qMap[mat] = {feitas:0, acertos:0};
                    qMap[mat].feitas += (parts[0] || 0);
                    qMap[mat].acertos += (parts[1] || 0);
                }
            });
            const matKeys = Object.keys(qMap);
            chartConfig = {
                type: 'bar',
                data: {
                    labels: matKeys,
                    datasets: [
                        { label: 'Feitas', data: matKeys.map(m => qMap[m].feitas), backgroundColor: '#38bdf8' },
                        { label: 'Acertos', data: matKeys.map(m => qMap[m].acertos), backgroundColor: '#34d399' }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { x:{grid:{display:false}, ticks:{color:'#cbd5e1'}}, y:{grid:{color:'#334155'}, ticks:{color:'#cbd5e1'}} }, plugins:{legend:{labels:{color:'#fff'}}} }
            };
            relatorioHTML = `<h4>🎯 Auditoria de Resolução de Questões</h4><p>Total geral de questões resolvidas: <strong>${totalQuestoesFeitas}</strong> com taxa de acerto global de <strong>${taxaAcerto}</strong>.</p>`;

        } else if (tipoAnalise === 'tecnicas') {
            document.getElementById('biChartTitle').innerText = 'Eficiência Comparativa por Técnica de Estudo';
            const tecMap = {};
            sessoesFiltradas.forEach(s => {
                tecMap[s.tecnica] = (tecMap[s.tecnica] || 0) + s.tempo;
            });
            chartConfig = {
                type: 'doughnut',
                data: { labels: Object.keys(tecMap), datasets: [{ data: Object.values(tecMap), backgroundColor: ['#38bdf8','#fbbf24','#f87171','#34d399','#c084fc'], borderWidth:0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels:{color:'#fff'} } } }
            };
            relatorioHTML = `<h4>⚙️ Análise de Métodos</h4><p>Identifica qual abordagem domina o seu tempo de estudo atual.</p>`;

        } else if (tipoAnalise === 'radar_gargalos') {
            document.getElementById('biChartTitle').innerText = 'Matriz Multidimensional de Gargalos (Dificuldade vs Fadiga)';
            const radarMap = {};
            sessoesFiltradas.forEach(s => {
                const mat = s.topico.split('-')[0].trim();
                if(!radarMap[mat]) radarMap[mat] = { carga:[], fadiga:[] };
                radarMap[mat].carga.push(s.carga);
                radarMap[mat].fadiga.push(s.fadiga);
            });
            const rLabels = Object.keys(radarMap);
            chartConfig = {
                type: 'radar',
                data: {
                    labels: rLabels,
                    datasets: [
                        { label: 'Carga Cognitiva', data: rLabels.map(m => (radarMap[m].carga.reduce((a,b)=>a+b,0)/radarMap[m].carga.length).toFixed(1)), borderColor: '#f87171', backgroundColor:'rgba(248,113,113,0.2)' },
                        { label: 'Fadiga Mental', data: rLabels.map(m => (radarMap[m].fadiga.reduce((a,b)=>a+b,0)/radarMap[m].fadiga.length).toFixed(1)), borderColor: '#fbbf24', backgroundColor:'rgba(251,191,36,0.2)' }
                    ]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { r: { grid: {color:'#334155'}, ticks:{display:false, max:5, min:0} } }, plugins:{legend:{labels:{color:'#fff'}}} }
            };
            relatorioHTML = `<h4>🚨 Mapeamento de Pontos Críticos</h4><p>Cruzamento estrito de matérias que apresentam alta exigência mental.</p>`;
        }

        activeCharts['chartBiDynamic'] = new Chart(document.getElementById('chartBiDynamic'), chartConfig);
        document.getElementById('biReportContainer').innerHTML = relatorioHTML;

        window.renderAnalyticsDashboardGeneral(sessoesFiltradas);
    };

    window.renderAnalyticsDashboardGeneral = function(sessoesOk) {
        const totalMin = sessoesOk.reduce((acc, curr) => acc + curr.tempo, 0);
        document.getElementById('valHorasLiq').innerText = (totalMin / 60).toFixed(1) + 'h';
        document.getElementById('valPendentes').innerText = getState().analyticsEngine.sessoesDetalhadas.filter(x => x.status === 'pendente').length;

        if (sessoesOk.length > 0) {
            document.getElementById('valRetencao').innerText = (sessoesOk.reduce((acc, curr) => acc + parseFloat(curr.retencao), 0) / sessoesOk.length).toFixed(1) + '%';
            document.getElementById('valCargaCognitiva').innerText = (sessoesOk.reduce((acc, curr) => acc + curr.carga, 0) / sessoesOk.length).toFixed(1);
        } else {
            document.getElementById('valRetencao').innerText = '0%'; document.getElementById('valCargaCognitiva').innerText = '0.0';
        }

        const container = document.getElementById('tableContainer');
        if (sessoesOk.length === 0) {
            container.innerHTML = '<p style="color:#94a3b8;">Sem registros no período selecionado.</p>';
        } else {
            container.innerHTML = `
                <table class="brain-table">
                    <thead>
                        <tr>
                            <th>Situação</th>
                            <th>Disciplina / Tópico do Edital</th>
                            <th>Tempo / Método</th>
                            <th>Qtd (Págs/Qts)</th>
                            <th>Foco/Fadiga/Carga</th>
                            <th>Próx. Revisão</th>
                            <th>Observações</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sessoesOk.slice().reverse().map(sess => `
                            <tr>
                                <td>${sess.status==='pendente'?`<span style="background:rgba(245,158,11,0.2);color:#fbbf24;padding:4px 8px;border-radius:4px;cursor:pointer;font-weight:bold;" onclick="window.abrirFormularioRegistro(${sess.id})">⚠️ Preencher</span>`:`<span style="color:#34d399;font-weight:bold;">✓ Salvo</span>`}</td>
                                <td style="color:#f8fafc; font-weight:bold;">${sess.topico}</td>
                                <td>${sess.status==='pendente'?'-':`<span style="color:#38bdf8;">${sess.tempo}m</span><br><small style="color:#94a3b8;">${sess.tecnica}</small>`}</td>
                                <td>${sess.status==='pendente'?'-':`Págs: ${sess.paginas || 0}<br>Qts: ${sess.questoes || '-'}`}</td>
                                <td>${sess.status==='pendente'?'-':`🎯 ${sess.foco} <br>🔋 ${sess.fadiga} <br>🧠 ${sess.carga}`}</td>
                                <td style="color:#fbbf24;">${sess.status==='pendente'?'-':sess.revisao}</td>
                                <td style="max-width:180px; font-size:0.8rem; color:#94a3b8;">${sess.obs || '-'}</td>
                                <td>
                                    <button style="background:transparent; border:none; cursor:pointer;" onclick="window.abrirFormularioRegistro(${sess.id})" title="Editar">✏️</button>
                                    <button style="background:transparent; border:none; cursor:pointer; color:#f87171;" onclick="window.excluirSessao(${sess.id})" title="Excluir">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        document.getElementById('insightsContainer').innerHTML = gerarInsightsAcionaveis(sessoesOk);
    };

    window.renderAnalyticsDashboard = function() {
        window.renderBiDashboard();
    };

})();
