document.addEventListener('DOMContentLoaded', function () {
    // --- Element References ---
    // Agendamento
    const agendamentoDataInput = document.getElementById('agendamento_data');
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');
    const notificacaoHorarioP = document.getElementById('notificacao-horario');

    // Informações do Cliente
    const roteadorInput = document.getElementById('roteador');
    const onuInput = document.getElementById('onu');
    const contatoInput = document.getElementById('contato');
    const clienteDesdeInput = document.getElementById('cliente_desde');

    // Detalhes O.S
    const solicitacaoInput = document.getElementById('solicitacao');

    // Custo
    const cienteCustoSimCheckbox = document.getElementById('ciente_custo_sim');
    const cienteCustoNaoCheckbox = document.getElementById('ciente_custo_nao');

    // Atendente
    const operadorInput = document.getElementById('operador');

    // Autorização por Exceção
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
            return `${dia}/${mes}/${ano}`;
        }
        return '';
    }

    function gerarTexto() {
        const agendamentoData = agendamentoDataInput.value;
        const agendamentoPeriodo = agendamentoPeriodoInput.value;
        const agendamentoHorario = agendamentoHorarioInput.value;
        const roteador = roteadorInput.value;
        const onu = onuInput.value;
        const contato = contatoInput.value;
        const clienteDesde = clienteDesdeInput.value;
        const solicitacao = solicitacaoInput.value;
        const operador = operadorInput.value;

        const cienteCustoSim = cienteCustoSimCheckbox.checked;
        const cienteCustoNao = cienteCustoNaoCheckbox.checked;

        const autorizadaExcecaoSim = autorizadaExcecaoSimCheckbox.checked;
        const autorizadaExcecaoNao = autorizadaExcecaoNaoCheckbox.checked;
        const nomeAutorizador = nomeAutorizadorInput.value;

        const agendamentoDataFormatada = formatarData(agendamentoData);
        // const clienteDesdeFormatada = formatarData(clienteDesde); // Not needed for text input, but kept for consistency if needed

        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ` (${agendamentoHorario})`;
            }
        }

        let texto = `OPERADOR: ${operador}\n\nAGENDAMENTO: ${agendamentoCompleto}\n\n-- INFORMAÇÕES DO CLIENTE --\n> ROTEADOR: [${roteador.toUpperCase()}]\n> ONU: [${onu.toUpperCase()}]\n> CONTATO: ${contato}\n> CLIENTE DESDE: ${clienteDesde}\n\n-- DETALHES O.S --\n> SOLICITAÇÃO: ${solicitacao}`;

        texto += `\n\n-- CUSTO --\n> CLIENTE CIENTE QUE PODERÁ SER GERADO CUSTO? [${cienteCustoSim ? 'SIM' : (cienteCustoNao ? 'NÃO' : '')}]`;

        texto += `\n\n-- AUTORIZAÇÃO POR EXCEÇÃO --\n` +
                 `> O.S AUTORIZADA COM EXCEÇÃO PELA TORRE DE SERVIÇOS? [${autorizadaExcecaoSim ? 'SIM' : (autorizadaExcecaoNao ? 'NÃO' : '')}]`;

        if (autorizadaExcecaoSim) {
            texto += `\n> NOME DE QUEM AUTORIZOU: ${nomeAutorizador}`;
        }

        textoGerado.textContent = texto;
    }

    // --- Event Listeners ---

    // Agendamento Periodo and Horario
    if (agendamentoPeriodoInput && notificacaoHorarioP && agendamentoHorarioInput && labelAgendamentoHorario) {
        agendamentoPeriodoInput.addEventListener('change', function () {
            const periodoSelecionado = this.value;

            if (periodoSelecionado === 'apos') {
                agendamentoHorarioInput.style.display = 'inline-block';
                labelAgendamentoHorario.style.display = 'inline-block';
            } else {
                agendamentoHorarioInput.style.display = 'none';
                labelAgendamentoHorario.style.display = 'none';
                agendamentoHorarioInput.value = '';
            }

            if (periodoSelecionado === 'ultima' || periodoSelecionado === 'apos') {
                notificacaoHorarioP.style.display = 'block';
            } else {
                notificacaoHorarioP.style.display = 'none';
            }
            gerarTexto();
        });
    }

    // Ciente Custo Checkbox
    if (cienteCustoSimCheckbox && cienteCustoNaoCheckbox) {
        cienteCustoSimCheckbox.addEventListener('change', function() {
            if (this.checked) {
                cienteCustoNaoCheckbox.checked = false;
            }
            gerarTexto();
        });

        cienteCustoNaoCheckbox.addEventListener('change', function() {
            if (this.checked) {
                cienteCustoSimCheckbox.checked = false;
            }
            gerarTexto();
        });
    }


    // Autorização por Exceção
    if (autorizadaExcecaoSimCheckbox && autorizadaExcecaoNaoCheckbox && campoAutorizadorDiv && nomeAutorizadorInput) {
        autorizadaExcecaoSimCheckbox.addEventListener('change', function() {
            if (this.checked) {
                autorizadaExcecaoNaoCheckbox.checked = false;
                campoAutorizadorDiv.style.display = 'block';
            } else {
                campoAutorizadorDiv.style.display = 'none';
                nomeAutorizadorInput.value = '';
            }
            gerarTexto();
        });

        autorizadaExcecaoNaoCheckbox.addEventListener('change', function() {
            if (this.checked) {
                autorizadaExcecaoSimCheckbox.checked = false;
                campoAutorizadorDiv.style.display = 'none';
                nomeAutorizadorInput.value = '';
            }
            gerarTexto();
        });
    }


    // Copiar e Limpar Botões
    if (copiarButton) {
        copiarButton.addEventListener('click', function () {
            gerarTexto();
            const texto = textoGerado.textContent;
            if (texto) {
                navigator.clipboard.writeText(texto).then(() => {
                    alert('Texto copiado para a área de transferência!');
                }, (err) => {
                    console.error('Erro ao copiar texto: ', err);
                    alert('Erro ao copiar texto. Verifique as permissões do navegador.');
                });
            } else {
                alert('Nada para copiar.');
            }
        });
    }

    if (limparButton) {
        limparButton.addEventListener('click', function () {
            document.querySelectorAll('.content .form input[type="text"], .content .form input[type="date"], .content .form input[type="time"], .content .form input[type="tel"], .content .form textarea, .content .form select').forEach(el => {
                if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0;
                } else {
                    el.value = '';
                }
            });

            document.querySelectorAll('.content .form input[type="checkbox"]').forEach(el => {
                el.checked = false;
            });

            textoGerado.textContent = '';

            // Reset conditional displays
            if (notificacaoHorarioP) notificacaoHorarioP.style.display = 'none';
            if (agendamentoHorarioInput) agendamentoHorarioInput.style.display = 'none';
            if (labelAgendamentoHorario) labelAgendamentoHorario.style.display = 'none';
            if (campoAutorizadorDiv) campoAutorizadorDiv.style.display = 'none';

            // Dispatch change events to ensure correct initial state after clearing
            if (agendamentoPeriodoInput) agendamentoPeriodoInput.dispatchEvent(new Event('change'));
            if (cienteCustoSimCheckbox) cienteCustoSimCheckbox.dispatchEvent(new Event('change')); // Trigger to clear
            if (cienteCustoNaoCheckbox) cienteCustoNaoCheckbox.dispatchEvent(new Event('change')); // Trigger to clear
            if (autorizadaExcecaoSimCheckbox) autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
            if (autorizadaExcecaoNaoCheckbox) autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));

            // gerarTexto(); // Optional: to show empty/default text
        });
    }

    // Dynamic Text Update
    document.querySelectorAll('.content .form input, .content .form textarea, .content .form select').forEach(input => {
        input.addEventListener('change', gerarTexto);
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', gerarTexto);
        }
    });

    // Initial State Setup
    if (agendamentoPeriodoInput) agendamentoPeriodoInput.dispatchEvent(new Event('change'));
    if (cienteCustoSimCheckbox) cienteCustoSimCheckbox.dispatchEvent(new Event('change'));
    if (cienteCustoNaoCheckbox) cienteCustoNaoCheckbox.dispatchEvent(new Event('change'));
    if (autorizadaExcecaoSimCheckbox) autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
    if (autorizadaExcecaoNaoCheckbox) autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
    gerarTexto();
});