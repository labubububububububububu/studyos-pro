// ================================================================
// studyos-extras.js – Módulo de extensão do StudyOS Pro
// Adiciona: estatísticas avançadas, calendário, metas diárias,
// lembretes, relatórios e widgets.
// ================================================================
(function() {
    'use strict';

    // Verifica se o AppState global existe
    if (typeof AppState === 'undefined') {
        console.warn('StudyOS Extras: AppState não encontrado. Aguardando...');
        setTimeout(arguments.callee, 500);
        return;
    }

    // ----- INICIALIZAÇÃO DO ESTADO EXTRA -----
    if (!AppState.extras) {
        AppState.extras = {
            metasDiarias: {
                aulas: 3,
                questoes: 20,
                cumprido: false
            },
            historicoDiario: {}, // data -> { aulas: n, questoes: n }
            lembretes: [],
            calendario: {}, // data -> atividades
            preferencias: {
                notificacoes: true,
                tema: 'dark'
            }
        };
        saveState();
    }

    // ----- HELPERS -----
    function hoje() { return new Date().toISOString().slice(0, 10); }

    function getTotalAulasConcluidas() {
        const all = getAllLessonsFlat();
        return all.filter(i => AppState.checks[i.key]).length;
    }

    function getTotalQuestoesFeitas() {
        let total = 0;
        Object.values(AppState.questoesAulas || {}).forEach(q => { total += q.feitas || 0; });
        return total;
    }

    // Atualiza o histórico diário
    function atualizarHistoricoDiario() {
        const data = hoje();
        if (!AppState.extras.historicoDiario[data]) {
            AppState.extras.historicoDiario[data] = { aulas: 0, questoes: 0 };
        }
        // Conta as aulas concluídas no dia
        const hojeAulas = AppState.diario.filter(e => e.data === new Date().toLocaleDateString('pt-BR')).length;
        // Conta questões feitas no dia (baseado no diário, mas aproximado)
        // Vamos usar o total de questões registradas hoje
        let questoesHoje = 0;
        Object.entries(AppState.questoesAulas || {}).forEach(([key, q]) => {
            // Se não temos data, consideramos que foram feitas hoje se a aula foi concluída hoje
            const aulaConcluida = AppState.diario.some(e => {
                const parts = key.split('|');
                if (parts.length === 3) {
                    const block = AppState.data.find(b => b.id === parts[0]);
                    if (block) {
                        const disc = block.disciplines[parseInt(parts[1])];
                        if (disc) {
                            return e.aula === disc.lessons[parseInt(parts[2])] && e.data === new Date().toLocaleDateString('pt-BR');
                        }
                    }
                }
                return false;
            });
            if (aulaConcluida) {
                questoesHoje += q.feitas || 0;
            }
        });
        AppState.extras.historicoDiario[data].aulas = hojeAulas;
        AppState.extras.historicoDiario[data].questoes = questoesHoje;
        saveState();
    }

    // ----- RENDERIZAÇÃO DAS ESTATÍSTICAS -----
    function renderEstatisticas() {
        const container = document.getElementById('estatisticasContainer');
        if (!container) return;

        const totalAulas = getAllLessonsFlat().length;
        const concluidas = getTotalAulasConcluidas();
        const pct = Math.round((concluidas / totalAulas) * 100);

        const totalQuestoes = getTotalQuestoesFeitas();
        const totalAcertos = Object.values(AppState.questoesAulas || {}).reduce((s, q) => s + (q.acertos || 0), 0);
        const taxaAcerto = totalQuestoes > 0 ? Math.round((totalAcertos / totalQuestoes) * 100) : 0;

        // Dados por disciplina
        const discStats = {};
        AppState.data.forEach(block => {
            block.disciplines.forEach((disc, di) => {
                const key = `${block.id}|${di}`;
                const aulas = disc.lessons.length;
                const concluidasDisc = disc.lessons.filter((_, li) => AppState.checks[`${block.id}|${di}|${li}`]).length;
                const questoesDisc = Object.entries(AppState.questoesAulas || {})
                    .filter(([k]) => k.startsWith(`${block.id}|${di}`))
                    .reduce((s, [, q]) => s + (q.feitas || 0), 0);
                const acertosDisc = Object.entries(AppState.questoesAulas || {})
                    .filter(([k]) => k.startsWith(`${block.id}|${di}`))
                    .reduce((s, [, q]) => s + (q.acertos || 0), 0);
                const taxa = questoesDisc > 0 ? Math.round((acertosDisc / questoesDisc) * 100) : 0;
                discStats[disc.name] = {
                    aulas,
                    concluidas: concluidasDisc,
                    questoes: questoesDisc,
                    acertos: acertosDisc,
                    taxa
                };
            });
        });

        // HTML
        let html = `
            <div class="card">
                <h3>📊 Estatísticas Avançadas</h3>
                <div class="indicators-grid">
                    <div class="indicator-card"><div class="number">${pct}%</div><div class="label">Edital concluído</div></div>
                    <div class="indicator-card"><div class="number">${totalQuestoes}</div><div class="label">Questões feitas</div></div>
                    <div class="indicator-card"><div class="number">${taxaAcerto}%</div><div class="label">Taxa de acerto</div></div>
                    <div class="indicator-card"><div class="number">${AppState.student.gamificacao.nivel}</div><div class="label">Nível</div></div>
                </div>
            </div>
            <div class="card">
                <h4>📈 Desempenho por disciplina</h4>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${Object.entries(discStats).sort((a,b) => b[1].taxa - a[1].taxa).map(([nome, stats]) => `
                        <div style="background:rgba(255,255,255,0.02); border-radius:12px; padding:12px;">
                            <strong style="font-size:0.85rem;">${nome}</strong>
                            <div style="font-size:0.75rem; color:#6b7280;">${stats.concluidas}/${stats.aulas} aulas</div>
                            <div style="font-size:0.75rem; color:#6b7280;">${stats.acertos}/${stats.questoes} questões (${stats.taxa}%)</div>
                            <div class="goal-progress"><div class="goal-progress-fill" style="width:${stats.taxa}%; background:${stats.taxa >= 70 ? '#4ade80' : stats.taxa >= 50 ? '#fbbf24' : '#f87171'};"></div></div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="card">
                <h4>📅 Histórico diário (últimos 7 dias)</h4>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    ${(() => {
                        const dias = [];
                        for (let i = 6; i >= 0; i--) {
                            const d = new Date(Date.now() - i * 86400000);
                            const ds = d.toISOString().slice(0,10);
                            const data = AppState.extras.historicoDiario[ds] || { aulas: 0, questoes: 0 };
                            const diaSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()];
                            dias.push(`<div style="background:rgba(255,255,255,0.02); border-radius:12px; padding:8px; text-align:center; min-width:60px;">
                                <div style="font-size:0.7rem; color:#6b7280;">${diaSemana}</div>
                                <div style="font-size:1.2rem; font-weight:700; color:${data.aulas > 0 ? '#4ade80' : '#6b7280'};">${data.aulas}</div>
                                <div style="font-size:0.6rem; color:#6b7280;">aulas</div>
                                <div style="font-size:0.8rem; color:#a78bfa;">${data.questoes} Q</div>
                            </div>`);
                        }
                        return dias.join('');
                    })()}
                </div>
            </div>
            <div class="card">
                <h4>🎯 Metas Diárias</h4>
                <div style="display:flex; gap:20px; align-items:center; flex-wrap:wrap;">
                    <div>
                        <label style="font-size:0.8rem;">Aulas/dia</label>
                        <input type="number" id="metaDiariaAulas" value="${AppState.extras.metasDiarias.aulas}" min="1" max="20" style="width:60px; padding:4px; background:rgba(0,0,0,0.2); border:var(--border-light); color:#d1d5db; border-radius:8px;" />
                    </div>
                    <div>
                        <label style="font-size:0.8rem;">Questões/dia</label>
                        <input type="number" id="metaDiariaQuestoes" value="${AppState.extras.metasDiarias.questoes}" min="5" max="100" style="width:60px; padding:4px; background:rgba(0,0,0,0.2); border:var(--border-light); color:#d1d5db; border-radius:8px;" />
                    </div>
                    <button class="btn-glass primary" onclick="window.salvarMetasDiarias()">Salvar</button>
                </div>
                <div style="margin-top:12px;">
                    <span>Hoje: </span>
                    <span class="value ${AppState.extras.historicoDiario[hoje()]?.aulas >= AppState.extras.metasDiarias.aulas ? 'success' : 'warning'}">
                        ${AppState.extras.historicoDiario[hoje()]?.aulas || 0} / ${AppState.extras.metasDiarias.aulas} aulas
                    </span>
                    <span style="margin-left:20px;">
                        <span class="value ${AppState.extras.historicoDiario[hoje()]?.questoes >= AppState.extras.metasDiarias.questoes ? 'success' : 'warning'}">
                            ${AppState.extras.historicoDiario[hoje()]?.questoes || 0} / ${AppState.extras.metasDiarias.questoes} questões
                        </span>
                    </span>
                    ${AppState.extras.historicoDiario[hoje()]?.aulas >= AppState.extras.metasDiarias.aulas && AppState.extras.historicoDiario[hoje()]?.questoes >= AppState.extras.metasDiarias.questoes ? ' ✅ Meta cumprida!' : ''}
                </div>
            </div>
            <div class="card">
                <h4>📋 Relatórios</h4>
                <button class="btn-glass primary" onclick="window.exportarRelatorioCSV()">📥 Baixar relatório CSV</button>
                <button class="btn-glass" onclick="window.exportarRelatorioJSON()">📥 Baixar relatório JSON</button>
            </div>
        `;
        container.innerHTML = html;

        // Atualiza histórico
        atualizarHistoricoDiario();
    }

    // ----- METAS DIÁRIAS -----
    window.salvarMetasDiarias = function() {
        const aulas = parseInt(document.getElementById('metaDiariaAulas')?.value) || 3;
        const questoes = parseInt(document.getElementById('metaDiariaQuestoes')?.value) || 20;
        AppState.extras.metasDiarias.aulas = Math.max(1, aulas);
        AppState.extras.metasDiarias.questoes = Math.max(5, questoes);
        saveState();
        renderEstatisticas();
    };

    // ----- EXPORTAÇÃO DE RELATÓRIOS -----
    window.exportarRelatorioCSV = function() {
        const all = getAllLessonsFlat();
        const linhas = [
            ['Disciplina', 'Aula', 'Concluída', 'Questões Feitas', 'Acertos', 'Última Revisão']
        ];
        all.forEach(aula => {
            const key = aula.key;
            const concluida = AppState.checks[key] ? 'Sim' : 'Não';
            const q = AppState.questoesAulas[key] || { feitas: 0, acertos: 0 };
            const revDatas = AppState.revisaoDatas[key] || {};
            const ultimaRev = Object.values(revDatas).filter(Boolean).sort().pop() || '';
            linhas.push([
                aula.disciplineName,
                aula.title,
                concluida,
                q.feitas || 0,
                q.acertos || 0,
                ultimaRev.slice(0,10)
            ]);
        });
        const csv = linhas.map(row => row.join(';')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_studyos_${hoje()}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    window.exportarRelatorioJSON = function() {
        const dados = {
            exportadoEm: new Date().toISOString(),
            progresso: {
                aulasConcluidas: getTotalAulasConcluidas(),
                totalAulas: getAllLessonsFlat().length,
                questoesFeitas: getTotalQuestoesFeitas(),
                xp: AppState.student.gamificacao.xp,
                nivel: AppState.student.gamificacao.nivel,
                streak: AppState.student.gamificacao.streak
            },
            disciplinas: AppState.data.map(block => ({
                bloco: block.name,
                disciplinas: block.disciplines.map(disc => ({
                    nome: disc.name,
                    aulas: disc.lessons.map((title, li) => {
                        const key = `${block.id}|${block.disciplines.indexOf(disc)}|${li}`;
                        return {
                            titulo: title,
                            concluida: !!AppState.checks[key],
                            questoes: AppState.questoesAulas[key] || {}
                        };
                    })
                }))
            })),
            sessoes: AppState.sessoes,
            simulados: AppState.simulados,
            flashcards: AppState.flashcards
        };
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `relatorio_studyos_${hoje()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    // ----- SISTEMA DE LEMBRETES -----
    function verificarLembretes() {
        const lembretes = [];

        // 1. Revisões pendentes (aulas com mais de 15 dias sem revisão)
        const all = getAllLessonsFlat();
        all.forEach(aula => {
            if (AppState.checks[aula.key]) {
                const dias = DecisionEngine._diasSemRevisao(aula.key);
                if (dias > 15) {
                    lembretes.push(`📚 Revisão pendente: "${aula.title}" (${dias} dias)`);
                }
            }
        });

        // 2. Flashcards pendentes
        const flashcardsPendentes = AppState.flashcards.filter(f => !f.proximaRevisao || new Date(f.proximaRevisao) <= new Date());
        if (flashcardsPendentes.length > 5) {
            lembretes.push(`🃏 ${flashcardsPendentes.length} flashcards aguardando revisão`);
        }

        // 3. Leis pendentes
        const leisPendentes = AppState.leis.filter(l => l.status !== 'concluido');
        if (leisPendentes.length > 0) {
            lembretes.push(`📜 ${leisPendentes.length} leis para ler`);
        }

        // 4. Metas diárias não cumpridas
        const meta = AppState.extras.metasDiarias;
        const hojeStr = hoje();
        const hojeData = AppState.extras.historicoDiario[hojeStr] || { aulas: 0, questoes: 0 };
        if (hojeData.aulas < meta.aulas) {
            lembretes.push(`🎯 Meta de aulas: ${hojeData.aulas}/${meta.aulas}`);
        }
        if (hojeData.questoes < meta.questoes) {
            lembretes.push(`🎯 Meta de questões: ${hojeData.questoes}/${meta.questoes}`);
        }

        // Armazena no estado
        AppState.extras.lembretes = lembretes.slice(0, 5);
        saveState();

        // Exibe no topo (se houver)
        const container = document.getElementById('lembretesContainer');
        if (container) {
            if (lembretes.length) {
                container.innerHTML = `<div style="background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.15); border-radius:16px; padding:10px 16px; margin-bottom:12px;">
                    <span style="font-weight:600; color:#fbbf24;">🔔 Lembretes</span>
                    <ul style="margin-top:4px; list-style:none; padding:0; font-size:0.85rem;">
                        ${lembretes.map(l => `<li>• ${l}</li>`).join('')}
                    </ul>
                </div>`;
            } else {
                container.innerHTML = '';
            }
        }

        // Notificação do navegador (se permitido)
        if (AppState.extras.preferencias.notificacoes && lembretes.length > 0 && Notification.permission === 'granted') {
            new Notification('StudyOS Pro', {
                body: lembretes.slice(0, 3).join('\n'),
                icon: '📚'
            });
        }
    }

    // ----- CALENDÁRIO (simples) -----
    // Será integrado na página de estatísticas por enquanto

    // ----- INICIALIZAÇÃO DOS ELEMENTOS DA UI -----
    function initExtrasUI() {
        // Adiciona container de lembretes no topo (após top-bar)
        const topBar = document.querySelector('.top-bar');
        if (topBar) {
            const div = document.createElement('div');
            div.id = 'lembretesContainer';
            div.style.width = '100%';
            topBar.parentNode.insertBefore(div, topBar.nextSibling);
        }

        // Adiciona a página de estatísticas no main-content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const page = document.createElement('div');
            page.id = 'page-estatisticas';
            page.className = 'page';
            page.innerHTML = '<div id="estatisticasContainer"></div>';
            mainContent.appendChild(page);

            // Adiciona no menu
            const navList = document.getElementById('navList');
            if (navList) {
                const li = document.createElement('li');
                li.dataset.page = 'page-estatisticas';
                li.innerHTML = '<span class="icon">📈</span> Estatísticas';
                navList.appendChild(li);
            }
        }

        // Aciona renderização quando a página for clicada
        document.querySelectorAll('#navList li').forEach(li => {
            li.addEventListener('click', function() {
                if (this.dataset.page === 'page-estatisticas') {
                    renderEstatisticas();
                }
            });
        });

        // Verificar lembretes a cada 5 minutos
        setInterval(verificarLembretes, 300000);
        // Primeira verificação
        setTimeout(verificarLembretes, 2000);

        // Solicitar permissão para notificações
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // ----- SOBRESCREVER SAVE STATE PARA INCLUIR EXTRAS -----
    const originalSave = saveState;
    saveState = function() {
        originalSave();
        // Não precisa fazer mais nada, pois AppState.extras já está incluído
    };

    // ----- EXPOR FUNÇÕES GLOBAIS -----
    window.renderEstatisticas = renderEstatisticas;
    window.verificarLembretes = verificarLembretes;
    window.atualizarHistoricoDiario = atualizarHistoricoDiario;

    // ----- INICIALIZAR -----
    // Aguarda o DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExtrasUI);
    } else {
        initExtrasUI();
    }

    // Hook para atualizar histórico quando uma aula é concluída
    const originalToggle = window.toggleLessonDirect;
    window.toggleLessonDirect = function(key, checked) {
        originalToggle(key, checked);
        if (checked) {
            atualizarHistoricoDiario();
            verificarLembretes();
        }
    };

    // Hook para quando questões são atualizadas
    const originalAtualizarQ = window.atualizarQuestoesAula;
    window.atualizarQuestoesAula = function(key, campo, valor) {
        originalAtualizarQ(key, campo, valor);
        atualizarHistoricoDiario();
        verificarLembretes();
    };

    // Hook para simulado
    const originalSim = window.salvarSimulado;
    window.salvarSimulado = function() {
        originalSim();
        atualizarHistoricoDiario();
        verificarLembretes();
    };

    console.log('✅ StudyOS Extras carregado com sucesso!');
})();