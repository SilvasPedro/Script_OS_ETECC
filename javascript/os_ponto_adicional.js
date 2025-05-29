// javascript/os_ponto_adicional.js

document.addEventListener('DOMContentLoaded', function() {
    // --- Element References ---
    // Agendamento
    const agendamentoDataInput = document.getElementById('agendamento_data');
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');
    const notificacaoHorarioP = document.getElementById('notificacao-horario'); // Referência para notificação

    // Detalhes Solicitação e Cliente
    const solicitacaoInput = document.getElementById('solicitacao');
    const telefoneInput = document.getElementById('telefone');
    const planoInput = document.getElementById('plano');
    const roteadorInput = document.getElementById('roteador');
    const onuInput = document.getElementById('onu');
    const clienteDesdeInput = document.getElementById('cliente_desde');
    const operador = document.getElementById('operador');

    // Informações da O.S e Proporcional
    const upgradeInput = document.getElementById('upgrade');
    const roteadorAdicionalInput = document.getElementById('roteador_adicional');
    const gerouProporcionalCheckbox = document.getElementById('gerou_proporcional');
    const camposProporcionalDiv = document.getElementById('campos_proporcional'); // Container Div
    const cienteTaxaInput = document.getElementById('ciente_taxa');
    const valorTaxaInput = document.getElementById('valor_taxa');
    const porMetroCheckbox = document.getElementById('por_metro');
    const vencimentoTaxaInput = document.getElementById('vencimento_taxa');

    // Avaliação Técnica (Requirement 2 Elements)
    const avaliacaoTecnicaSelect = document.getElementById('avaliacao_tecnica');
    const labelBaixaAvaliacao = document.getElementById('label_baixa_avaliacao');
    const baixaAvaliacaoTextarea = document.getElementById('baixa_avaliacao');

    // Novos campos para Autorização por Exceção
    const autorizadaExcecaoSimCheckbox = document.getElementById('autorizada_excecao_sim');
    const autorizadaExcecaoNaoCheckbox = document.getElementById('autorizada_excecao_nao');
    const campoAutorizadorDiv = document.getElementById('campo_autorizador');
    const nomeAutorizadorInput = document.getElementById('nome_autorizador');

    // Botões e Resultado
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');

    // --- Helper Functions ---
    function formatarData(dataString) {
        if (!dataString) return '';
        const parts = dataString.split('-');
        if (parts.length === 3) {
            const dataObj = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
            const dia = String(dataObj.getUTCDate()).padStart(2, '0');
            const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
            const ano = dataObj.getUTCFullYear();
            if (!isNaN(dia) && !isNaN(mes) && !isNaN(ano)) { // Verifica se a data é válida
                return `${dia}/${mes}/${ano}`;
            }
        }
        return ''; // Retorna vazio se a data for inválida ou formato incorreto
    }

    function gerarTexto() {
        // Coleta todos os valores dos campos
        const agendamentoData = agendamentoDataInput.value;
        const agendamentoPeriodo = agendamentoPeriodoInput.value;
        const agendamentoHorario = agendamentoHorarioInput.value;
        const solicitacao = solicitacaoInput.value;
        const telefone = telefoneInput.value;
        const plano = planoInput.value;
        const roteador = roteadorInput.value.toUpperCase();
        const onu = onuInput.value.toUpperCase();
        const clienteDesde = clienteDesdeInput.value;
        const upgrade = upgradeInput.value.toUpperCase();
        const roteadorAdicional = roteadorAdicionalInput.value.toUpperCase();
        const gerouProporcional = gerouProporcionalCheckbox.checked;

        // Valores proporcionais (só são relevantes se o checkbox estiver marcado)
        const cienteTaxa = cienteTaxaInput.value;
        const valorTaxa = valorTaxaInput.value;
        const porMetro = porMetroCheckbox.checked;
        const vencimentoTaxa = vencimentoTaxaInput.value;

        // Valores da avaliação
        const avaliacaoTecnica = avaliacaoTecnicaSelect.value.toUpperCase();
        const baixaAvaliacao = baixaAvaliacaoTextarea.value;

        // Novos campos de autorização por exceção
        const autorizadaExcecaoSim = autorizadaExcecaoSimCheckbox.checked;
        const autorizadaExcecaoNao = autorizadaExcecaoNaoCheckbox.checked;
        const nomeAutorizador = nomeAutorizadorInput.value;


        // Formata as datas
        const agendamentoDataFormatada = formatarData(agendamentoData);
        const clienteDesdeFormatada = formatarData(clienteDesde);
        const vencimentoTaxaFormatada = formatarData(vencimentoTaxa);

        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ` (${agendamentoHorario})`;
            }
        }

        // Constrói a string de texto
        let texto = `> OPERADOR: ${operador.value}\n\n> AGENDAMENTO: ${agendamentoCompleto}\n\n` +
                    `> SOLICITAÇÃO: ${solicitacao}\n\n` +
                    `-- INFORMAÇÕES DO CLIENTE --\n` +
                    `> TEL.: ${telefone}\n` +
                    `> PLANO: ${plano}\n` +
                    `> ROTEADOR PRINCIPAL: [${roteador}]\n` +
                    `> ONU: [${onu}]\n` +
                    `> CLIENTE DESDE: ${clienteDesdeInput.value}\n\n` +
                    `-- INFORMAÇÕES DA O.S --\n` +
                    `> CLIENTE REALIZOU UPGRADE? [${upgrade}]\n` +
                    `> ROTEADOR DO PONTO ADICIONAL: [${roteadorAdicional}]\n\n` +
                    `> FOI GERADO VALOR PROPORCIONAL? [${gerouProporcional ? 'SIM' : 'NÃO'}]`;

        // Adiciona detalhes proporcionais APENAS se o checkbox estiver marcado
        if (gerouProporcional) {
            let valorTaxaFormatado = valorTaxa ? `R$ ${parseFloat(valorTaxa).toFixed(2)}` : 'R$ 0.00';
            if (porMetro) {
                valorTaxaFormatado = valorTaxa ? `R$ ${parseFloat(valorTaxa).toFixed(2)} por metro` : 'Não informado por metro';
            }
            texto += `\n> CLIENTE CIENTE DA TAXA/PROPORCIONAL? [${cienteTaxa.toUpperCase()}]` +
                     `\n> VALOR DA TAXA/PROPORCIONAL: ${valorTaxaFormatado}` +
                     `\n> VENCIMENTO DA TAXA/PROPORCIONAL: ${vencimentoTaxaFormatada}`;
        }

         // Adiciona Seção de Avaliação Técnica
         texto += `\n\n-- AVALIAÇÃO TÉCNICA --\n` +
                  `> JÁ FOI FEITA AVALIAÇÃO TÉCNICA? [${avaliacaoTecnica}]`;

        // Adiciona detalhes da baixa APENAS se 'SIM' estiver selecionado
         if (avaliacaoTecnica === 'SIM' && baixaAvaliacaoTextarea.style.display !== 'none') { // Verifica também se está visível
             texto += `\n> BAIXA DA AVALIAÇÃO:\n${baixaAvaliacao}`;
         }

        // Nova seção para Autorização por Exceção
        texto += `\n\n-- AUTORIZAÇÃO POR EXCEÇÃO --\n` +
                 `> O.S AUTORIZADA COM EXCEÇÃO PELA TORRE DE SERVIÇOS? [${autorizadaExcecaoSim ? 'SIM' : (autorizadaExcecaoNao ? 'NÃO' : '')}]`;

        if (autorizadaExcecaoSim) {
            texto += `\n> NOME DE QUEM AUTORIZOU: ${nomeAutorizador}`;
        }

        textoGerado.textContent = texto;
    }

    // --- Event Listeners ---

    // Listener para período de agendamento (Mantido)
    if (agendamentoPeriodoInput && agendamentoHorarioInput && labelAgendamentoHorario) {
        agendamentoPeriodoInput.addEventListener('change', function() {
            const isApos = this.value === 'apos';
            agendamentoHorarioInput.style.display = isApos ? 'inline-block' : 'none';
            labelAgendamentoHorario.style.display = isApos ? 'inline-block' : 'none';
            if (!isApos) {
                agendamentoHorarioInput.value = '';
            }
            gerarTexto();
        });
    }

    
    // Requisito 2 e Lógica existente: Mudança no Período de Agendamento
    if (agendamentoPeriodoInput && notificacaoHorarioP && agendamentoHorarioInput && labelAgendamentoHorario) {
        agendamentoPeriodoInput.addEventListener('change', function() {
            const periodoSelecionado = this.value;

            // Lógica existente para mostrar/esconder campo de horário "Após"
            if (periodoSelecionado === 'apos') {
                agendamentoHorarioInput.style.display = 'inline-block';
                labelAgendamentoHorario.style.display = 'inline-block';
            } else {
                agendamentoHorarioInput.style.display = 'none';
                labelAgendamentoHorario.style.display = 'none';
                agendamentoHorarioInput.value = ''; // Limpa o horário se mudar para outro período
            }

            // Requisito 2: Mostrar/esconder a notificação de horário limite
            if (periodoSelecionado === 'ultima' || periodoSelecionado === 'apos') {
                notificacaoHorarioP.style.display = 'block';
            } else {
                notificacaoHorarioP.style.display = 'none';
            }

            gerarTexto(); // Atualiza o texto sempre que o período muda
        });
    }

    // Requisito 1: Listener para checkbox 'gerou_proporcional' (Lógica já existente, verificada)
    if (gerouProporcionalCheckbox && camposProporcionalDiv) {
         gerouProporcionalCheckbox.addEventListener('change', function() {
             const isChecked = this.checked;
             camposProporcionalDiv.style.display = isChecked ? 'block' : 'none';
             // Limpa os campos relacionados quando escondidos
             if (!isChecked) {
                 if (cienteTaxaInput) cienteTaxaInput.selectedIndex = 0;
                 if (valorTaxaInput) valorTaxaInput.value = '';
                 if (porMetroCheckbox) porMetroCheckbox.checked = false;
                 if (vencimentoTaxaInput) vencimentoTaxaInput.value = '';
             }
             gerarTexto();
         });
    }

    // Requisito 2: Listener para select 'avaliacao_tecnica' (Novo)
    if (avaliacaoTecnicaSelect && labelBaixaAvaliacao && baixaAvaliacaoTextarea) {
         avaliacaoTecnicaSelect.addEventListener('change', function() {
             const isSim = this.value === 'sim';
             // Mostra ou esconde o label e o textarea da baixa
             labelBaixaAvaliacao.style.display = isSim ? 'block' : 'none';
             baixaAvaliacaoTextarea.style.display = isSim ? 'block' : 'none';
             // Limpa o textarea quando escondido
             if (!isSim) {
                 baixaAvaliacaoTextarea.value = '';
             }
             gerarTexto(); // Atualiza o texto gerado
         });
    }

    // Nova lógica para autorização por exceção
    if (autorizadaExcecaoSimCheckbox && autorizadaExcecaoNaoCheckbox && campoAutorizadorDiv && nomeAutorizadorInput) {
        autorizadaExcecaoSimCheckbox.addEventListener('change', function() {
            if (this.checked) {
                autorizadaExcecaoNaoCheckbox.checked = false; // Desmarca "Não"
                campoAutorizadorDiv.style.display = 'block'; // Mostra o campo do nome
            } else {
                campoAutorizadorDiv.style.display = 'none'; // Esconde se "Sim" for desmarcado
                nomeAutorizadorInput.value = ''; // Limpa o campo
            }
            gerarTexto(); // Atualiza o texto gerado
        });

        autorizadaExcecaoNaoCheckbox.addEventListener('change', function() {
            if (this.checked) {
                autorizadaExcecaoSimCheckbox.checked = false; // Desmarca "Sim"
                campoAutorizadorDiv.style.display = 'none'; // Esconde o campo do nome
                nomeAutorizadorInput.value = ''; // Limpa o campo
            }
            gerarTexto(); // Atualiza o texto gerado
        });
    }

    // Botões Copiar e Limpar (Mantidos e atualizados)
    if (copiarButton) {
        copiarButton.addEventListener('click', function() {
            gerarTexto(); // Garante texto atualizado
            const texto = textoGerado.textContent;
             if (texto) {
                navigator.clipboard.writeText(texto).then(() => {
                    alert('Texto copiado para a área de transferência!');
                }, (err) => {
                    console.error('Erro ao copiar texto: ', err);
                    alert('Erro ao copiar texto.');
                });
             } else {
                alert('Nada para copiar.');
             }
        });
    }

    if (limparButton) {
        limparButton.addEventListener('click', function() {
            // Limpa todos os elementos de formulário dentro da área de conteúdo
            document.querySelectorAll('.content .form input[type="text"], .content .form input[type="date"], .content .form input[type="time"], .content .form input[type="tel"], .content .form input[type="number"], .content .form textarea, .content .form select, .content .form input[type="checkbox"]').forEach(el => {
                if (el.type === 'checkbox') {
                    el.checked = false;
                } else if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0; // Reseta para a primeira opção
                } else {
                    el.value = ''; // Limpa outros inputs e textareas
                }
            });

            textoGerado.textContent = ''; // Limpa resultado

            // Dispara eventos 'change' para resetar a visibilidade dos campos condicionais
            if (agendamentoPeriodoInput) agendamentoPeriodoInput.dispatchEvent(new Event('change'));
            if (gerouProporcionalCheckbox) gerouProporcionalCheckbox.dispatchEvent(new Event('change'));
            if (avaliacaoTecnicaSelect) avaliacaoTecnicaSelect.dispatchEvent(new Event('change')); // Adicionado trigger
            if (autorizadaExcecaoSimCheckbox) autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
            if (autorizadaExcecaoNaoCheckbox) autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));


            // Opcional: gerarTexto(); // Para mostrar o texto vazio/padrão
        });
    }


    // --- Listeners para Atualização Dinâmica do Texto ---
    document.querySelectorAll('.content .form input, .content .form textarea, .content .form select').forEach(input => {
         input.addEventListener('change', gerarTexto);
         if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
             input.addEventListener('input', gerarTexto); // Para resposta mais rápida
         }
    });

    // --- Configuração do Estado Inicial ---
    // Garante que a visibilidade inicial esteja correta ao carregar
    if (agendamentoPeriodoInput) agendamentoPeriodoInput.dispatchEvent(new Event('change'));
    if (gerouProporcionalCheckbox) gerouProporcionalCheckbox.dispatchEvent(new Event('change'));
    if (avaliacaoTecnicaSelect) avaliacaoTecnicaSelect.dispatchEvent(new Event('change')); // Garante estado inicial da avaliação
    if (autorizadaExcecaoSimCheckbox) autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
    if (autorizadaExcecaoNaoCheckbox) autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
    gerarTexto(); // Gera o texto inicial

});