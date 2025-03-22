document.addEventListener('DOMContentLoaded', function() {
    const agendamentoDataInput = document.getElementById('agendamento_data');
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');

    // Campos do formulário
    const roteadorInput = document.getElementById('roteador');
    const onuInput = document.getElementById('onu');
    const contatoInput = document.getElementById('contato');
    const clienteDesdeInput = document.getElementById('cliente_desde');

    const solicitacaoInput = document.getElementById('solicitacao');
    const sinalInput = document.getElementById('sinal');
    const quedasInput = document.getElementById('quedas');
    const atendimentoInput = document.getElementById('atendimento');
    const tipoOsInput = document.getElementById('tipo_os');
    const dataOsInput = document.getElementById('data_os');
    const encerramentoOsInput = document.getElementById('encerramento_os');

    // Novo
    const camposUltimaOS = document.getElementById('campos-ultima-os');

    // Nova notificação
    const notificacaoHorario = document.getElementById('notificacao-horario');

    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');

    // Função para formatar a data
    function formatarData(data) {
        if (!data) return '';
        const dataObj = new Date(data);
        const dia = String(dataObj.getDate() + 1).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        return `${dia}-${mes}-${ano}`;
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

        const agendamentoDataFormatada = formatarData(agendamentoData);
        const clienteDesdeFormatada = formatarData(clienteDesde);

        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ' (' + agendamentoHorario + ')';
            }
        }

        let texto = `O.S GERAL\n\nAGENDAMENTO: ${agendamentoCompleto}\n\n-- INFORMAÇÕES DO CLIENTE --\n> ROTEADOR: [${roteador.toUpperCase()}]\n> ONU: [${onu.toUpperCase()}]\n> CONTATO: ${contato}\n> CLIENTE DESDE: ${clienteDesdeFormatada}\n\n-- DETALHES O.S --\n> SOLICITAÇÃO: ${solicitacao}\n\n-- INFORMAÇÕES TÉCNICAS --\n> SINAL / STATUS ONU: ${sinal}\n> HISTÓRICO DE QUEDAS:\n${quedas}`;

        // Adiciona informações da última O.S se "Teve atendimento..." for "Sim"
        if (atendimento === 'sim') {
            texto += `\n\n-- ÚLTIMA O.S --\n> TEVE ATENDIMENTO OU O.S DE SUPORTE RECENTEMENTE? [${atendimento.toUpperCase()}]\n> TIPO DE O.S: ${tipoOs}\n> DATA: ${dataOs}\n> ENCERRAMENTO: ${encerramentoOs}`;
        } else {
             texto += `\n\n-- ÚLTIMA O.S --\n> TEVE ATENDIMENTO OU O.S DE SUPORTE RECENTEMENTE? [${atendimento.toUpperCase()}]`;
        }

        textoGerado.textContent = texto;
    }

    copiarButton.addEventListener('click', function() {
        gerarTexto();
        const texto = textoGerado.textContent;
        navigator.clipboard.writeText(texto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    });

    limparButton.addEventListener('click', function() {
        // Limpar todos os campos
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.value = '';
        });
        textoGerado.textContent = '';
    });

    // Event listeners para os campos de agendamento
    agendamentoPeriodoInput.addEventListener('change', function() {
        if (this.value === 'apos') {
            agendamentoHorarioInput.style.display = 'inline-block';
            labelAgendamentoHorario.style.display = 'inline-block';
        } else {
            agendamentoHorarioInput.style.display = 'none';
            labelAgendamentoHorario.style.display = 'none';
        }

        // Mostra a notificação se for "última" ou "após", oculta caso contrário
        if (this.value === 'ultima' || this.value === 'apos') {
            notificacaoHorario.style.display = 'block';
        } else {
            notificacaoHorario.style.display = 'none';
        }

        gerarTexto();
    });

    agendamentoDataInput.addEventListener('change', gerarTexto);
    agendamentoHorarioInput.addEventListener('change', gerarTexto);
    clienteDesdeInput.addEventListener('change', gerarTexto);

    // Adiciona event listeners para os outros campos para regenerar o texto
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('change', gerarTexto);
    });

    // Event listener para o campo "Teve atendimento..."
    atendimentoInput.addEventListener('change', function() {
        if (this.value === 'nao') {
            camposUltimaOS.style.display = 'none';
        } else {
            camposUltimaOS.style.display = 'block';
        }
        gerarTexto();
    });

    // Chamada inicial para definir o estado dos campos
    atendimentoInput.dispatchEvent(new Event('change'));

    // Chamada inicial para o campo de período
    agendamentoPeriodoInput.dispatchEvent(new Event('change'));
});