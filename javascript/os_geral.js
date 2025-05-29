// javascript/os_geral.js

document.addEventListener('DOMContentLoaded', function () {
    // --- Element References ---
    // Bairros de Risco
    const verBairrosRiscoButton = document.getElementById('ver-bairros-risco');
    const listaBairrosRiscoDiv = document.getElementById('lista-bairros-risco');

    // Agendamento
    const agendamentoDataInput = document.getElementById('agendamento_data');
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');
    const notificacaoHorarioP = document.getElementById('notificacao-horario'); // Referência para notificação

    // Formulário Geral
    const roteadorInput = document.getElementById('roteador');
    const onuInput = document.getElementById('onu');
    const contatoInput = document.getElementById('contato');
    const clienteDesdeInput = document.getElementById('cliente_desde');
    const solicitacaoInput = document.getElementById('solicitacao');
    const sinalInput = document.getElementById('sinal');
    const quedasInput = document.getElementById('quedas');
    const operador = document.getElementById('operador');

    // Última O.S
    const atendimentoInput = document.getElementById('atendimento');
    const camposUltimaOsDiv = document.getElementById('campos-ultima-os'); // Referência para o container div
    const tipoOsInput = document.getElementById('tipo_os');
    const dataOsInput = document.getElementById('data_os');
    const encerramentoOsInput = document.getElementById('encerramento_os');

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
    // Função para formatar a data (DD/MM/AAAA) tratando timezone
    function formatarData(dataString) {
        if (!dataString) return '';
        // A entrada 'date' (YYYY-MM-DD) é interpretada como UTC 00:00:00
        // Criamos o objeto Date corretamente para evitar problemas de timezone
        const parts = dataString.split('-');
        if (parts.length === 3) {
            // Criar data em UTC para não ter deslocamento de fuso horário
            const dataObj = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
            const dia = String(dataObj.getUTCDate()).padStart(2, '0');
            const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0'); // Mês é 0-indexado
            const ano = dataObj.getUTCFullYear();
            return `${dia}/${mes}/${ano}`;
        }
        return ''; // Retorna vazio se a string não estiver no formato esperado
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
        const sinal = sinalInput.value;
        const quedas = quedasInput.value;
        const atendimento = atendimentoInput.value;
        const tipoOs = tipoOsInput.value;
        const dataOs = dataOsInput.value;
        const encerramentoOs = encerramentoOsInput.value;

        // Novos campos de autorização por exceção
        const autorizadaExcecaoSim = autorizadaExcecaoSimCheckbox.checked;
        const autorizadaExcecaoNao = autorizadaExcecaoNaoCheckbox.checked;
        const nomeAutorizador = nomeAutorizadorInput.value;

        // Usa a função formatarData atualizada
        const agendamentoDataFormatada = formatarData(agendamentoData);
        const clienteDesdeFormatada = formatarData(clienteDesde);
        const dataOsFormatada = formatarData(dataOs); // Formata a data da OS também

        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ` (${agendamentoHorario})`;
            }
        }

        let texto = `OPERADOR: ${operador.value}\n\nAGENDAMENTO: ${agendamentoCompleto}\n\n-- INFORMAÇÕES DO CLIENTE --\n> ROTEADOR: [${roteador.toUpperCase()}]\n> ONU: [${onu.toUpperCase()}]\n> CONTATO: ${contato}\n> CLIENTE DESDE: ${clienteDesde}\n\n-- DETALHES O.S --\n> SOLICITAÇÃO: ${solicitacao}\n\n-- INFORMAÇÕES TÉCNICAS --\n> SINAL / STATUS ONU: ${sinal}\n> HISTÓRICO DE QUEDAS:\n${quedas}`;

        texto += `\n\n-- ÚLTIMA O.S --\n> TEVE ATENDIMENTO OU O.S DE SUPORTE RECENTEMENTE? [${atendimento.toUpperCase()}]`;
        // Adiciona detalhes apenas se 'sim' estiver selecionado E os campos estiverem visíveis (redundante, mas seguro)
        if (atendimento === 'sim' && camposUltimaOsDiv.style.display !== 'none') {
            texto += `\n> TIPO DE O.S: ${tipoOs}\n> DATA: ${dataOs}\n> ENCERRAMENTO: ${encerramentoOs}`;
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

    // Requisito 1: Alternar visibilidade dos Bairros de Risco
    if (verBairrosRiscoButton && listaBairrosRiscoDiv) {
        // Define o estado inicial como escondido
        listaBairrosRiscoDiv.style.display = 'none';
        verBairrosRiscoButton.textContent = 'Ver Bairros de Risco'; // Texto inicial do botão

        verBairrosRiscoButton.addEventListener('click', function () {
            const isHidden = listaBairrosRiscoDiv.style.display === 'none';
            listaBairrosRiscoDiv.style.display = isHidden ? 'block' : 'none';
            // Atualiza o texto do botão
            verBairrosRiscoButton.textContent = isHidden ? 'Ocultar Bairros de Risco' : 'Ver Bairros de Risco';
        });
    }

    // Requisito 2 e Lógica existente: Mudança no Período de Agendamento
    if (agendamentoPeriodoInput && notificacaoHorarioP && agendamentoHorarioInput && labelAgendamentoHorario) {
        agendamentoPeriodoInput.addEventListener('change', function () {
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

    // Requisito 3: Mudança na seleção de "Teve atendimento..."
    if (atendimentoInput && camposUltimaOsDiv) {
        atendimentoInput.addEventListener('change', function () {
            if (this.value === 'nao') {
                camposUltimaOsDiv.style.display = 'none';
                // Opcional: Limpar os campos ao esconder
                // tipoOsInput.value = '';
                // dataOsInput.value = '';
                // encerramentoOsInput.value = '';
            } else { // Se for 'sim' ou outro valor
                camposUltimaOsDiv.style.display = 'block'; // Garante que esteja visível
            }
            gerarTexto(); // Atualiza o texto sempre que esta seleção muda
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


    // --- Botões Copiar e Limpar (Mantidos como no original, com pequenas melhorias) ---
    if (copiarButton) {
        copiarButton.addEventListener('click', function () {
            gerarTexto(); // Garante que o texto está atualizado antes de copiar
            const texto = textoGerado.textContent;
            if (texto && texto !== 'Preencha todos os campos.') { // Evita copiar placeholders
                navigator.clipboard.writeText(texto).then(() => {
                    alert('Texto copiado para a área de transferência!');
                }, (err) => {
                    console.error('Erro ao copiar texto: ', err);
                    alert('Erro ao copiar texto. Verifique as permissões do navegador.');
                });
            } else {
                alert('Nada para copiar ou campos obrigatórios não preenchidos.');
            }
        });
    }

    if (limparButton) {
        limparButton.addEventListener('click', function () {
            // Seleciona todos os inputs, textareas e selects dentro da div .form no .content
            document.querySelectorAll('.content .form input[type="text"], .content .form input[type="date"], .content .form input[type="time"], .content .form input[type="tel"], .content .form input[type="url"], .content .form textarea, .content .form select').forEach(el => {
                if (el.tagName === 'SELECT') {
                    el.selectedIndex = 0; // Reseta select para a primeira opção
                } else {
                    el.value = ''; // Limpa valor de inputs e textareas
                }
            });

            // Limpa os checkboxes
            document.querySelectorAll('.content .form input[type="checkbox"]').forEach(el => {
                el.checked = false;
            });


            textoGerado.textContent = ''; // Limpa a área de resultado

            // Garante que os elementos controlados por JS voltem ao estado inicial
            if (listaBairrosRiscoDiv) listaBairrosRiscoDiv.style.display = 'none';
            if (verBairrosRiscoButton) verBairrosRiscoButton.textContent = 'Ver Bairros de Risco';
            if (notificacaoHorarioP) notificacaoHorificacaoHorarioP.style.display = 'none';
            if (agendamentoHorarioInput) agendamentoHorarioInput.style.display = 'none';
            if (labelAgendamentoHorario) labelAgendamentoHorario.style.display = 'none';
            // camposUltimaOsDiv será resetado pelo trigger abaixo

            // Dispara os eventos 'change' para que a visibilidade seja redefinida corretamente
            if (agendamentoPeriodoInput) agendamentoPeriodoInput.dispatchEvent(new Event('change'));
            if (atendimentoInput) atendimentoInput.dispatchEvent(new Event('change'));
            if (autorizadaExcecaoSimCheckbox) autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
            if (autorizadaExcecaoNaoCheckbox) autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));

            // Opcional: Regenerar o texto (será baseado nos campos vazios/padrão)
            // gerarTexto();
        });
    }

    // --- Atualização Dinâmica do Texto (Mantido) ---
    // Adiciona listeners para atualizar o texto gerado conforme o usuário preenche
    document.querySelectorAll('.content .form input, .content .form textarea, .content .form select').forEach(input => {
        // Adiciona listener genérico 'change'
        input.addEventListener('change', gerarTexto);
        // Adiciona listener 'input' para resposta mais rápida em campos de texto
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', gerarTexto);
        }
    });

    // --- Configuração do Estado Inicial ---
    // Garante que a página carregue com a visibilidade correta dos elementos
    // (O listener de Bairros já define o estado inicial)
    if (notificacaoHorarioP) notificacaoHorarioP.style.display = 'none'; // Começa escondido
    // Dispara os eventos 'change' dos selects ao carregar a página
    // para definir a visibilidade inicial dos elementos dependentes
    if (agendamentoPeriodoInput) agendamentoPeriodoInput.dispatchEvent(new Event('change'));
    if (atendimentoInput) atendimentoInput.dispatchEvent(new Event('change'));
    if (autorizadaExcecaoSimCheckbox) autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
    if (autorizadaExcecaoNaoCheckbox) autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
    gerarTexto(); // Gera o texto inicial

});