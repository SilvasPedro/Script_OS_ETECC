document.addEventListener('DOMContentLoaded', function() {
    const adiantarInput = document.getElementById('adiantar');
    const agendamentoDataInput = document.getElementById('agendamento_data');
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');

    const telefoneInput = document.getElementById('telefone');
    const enderecoAtualInput = document.getElementById('endereco_atual');
    const novoEnderecoInput = document.getElementById('novo_endereco');
    const refNovoEnderecoInput = document.getElementById('ref_novo_endereco');
    const localizacaoMapsInput = document.getElementById('localizacao_maps');
    const comprovanteEnderecoInput = document.getElementById('comprovante_endereco');
    const pontoAdicionalInput = document.getElementById('ponto_adicional');
    const clienteDesdeInput = document.getElementById('cliente_desde');
    const operador = document.getElementById('operador');

    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');
    const alertaPontoAdicional = document.getElementById('alerta_ponto_adicional'); // Obtém a div de alerta

    // Novos campos para Autorização por Exceção
    const autorizadaExcecaoSimCheckbox = document.getElementById('autorizada_excecao_sim');
    const autorizadaExcecaoNaoCheckbox = document.getElementById('autorizada_excecao_nao');
    const campoAutorizadorDiv = document.getElementById('campo_autorizador');
    const nomeAutorizadorInput = document.getElementById('nome_autorizador');


    // Função para formatar a data
    function formatarData(data) {
        if (!data) return '';
        // Ajuste para garantir que a data seja interpretada corretamente como local
        // ou use Date.UTC para evitar problemas de fuso horário se a entrada for YYYY-MM-DD
        const parts = data.split('-');
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
        const adiantar = adiantarInput.value.toUpperCase();
        const agendamentoData = agendamentoDataInput.value;
        const agendamentoPeriodo = agendamentoPeriodoInput.value;
        const agendamentoHorario = agendamentoHorarioInput.value;

        const telefone = telefoneInput.value;
        const enderecoAtual = enderecoAtualInput.value;
        const novoEndereco = novoEnderecoInput.value;
        const refNovoEndereco = refNovoEnderecoInput.value;
        const localizacaoMaps = localizacaoMapsInput.value;
        const comprovanteEndereco = comprovanteEnderecoInput.value;
        const pontoAdicional = pontoAdicionalInput.value.toUpperCase();
        const clienteDesde = clienteDesdeInput.value;

        // Novos campos de autorização por exceção
        const autorizadaExcecaoSim = autorizadaExcecaoSimCheckbox.checked;
        const autorizadaExcecaoNao = autorizadaExcecaoNaoCheckbox.checked;
        const nomeAutorizador = nomeAutorizadorInput.value;

        const agendamentoDataFormatada = formatarData(agendamentoData);
        const clienteDesdeFormatada = formatarData(clienteDesde);

        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ' (' + agendamentoHorario + ')';
            }
        }

        let texto = `> ATENDENTE: ${operador.value}\n\n> PODE ADIANTAR? [${adiantar}]\n\n> SOLICITAÇÃO: MUDANÇA DE ENDEREÇO.\n> AGENDAMENTO: ${agendamentoCompleto}\n> TEL.: ${telefone}\n\n> ENDEREÇO ATUAL: ${enderecoAtual}\n> NOVO ENDEREÇO: ${novoEndereco}\n> REF. DO NOVO ENDEREÇO: ${refNovoEndereco}\n> LOCALIZAÇÃO MAPS: ${localizacaoMaps}\n\n> TAXA: ISENTO\n> CLIENTE CIENTE QUE TEM QUE LEVAR EQUIPAMENTOS ATÉ O NOVO LOCAL\n\n> COMPROVANTE DE ENDEREÇO: ${comprovanteEndereco}\n> CLIENTE TEM PONTO ADICIONAL: [${pontoAdicional}]`;

        if (pontoAdicional === 'SIM') {
            texto += '\nCLIENTE CIENTE QUE PONTO ADICIONAL SERÁ AVALIADO NA NOVA RESIDÊNCIA.';
        }

        // Adiciona a nova seção para Autorização por Exceção
        texto += `\n\n-- AUTORIZAÇÃO POR EXCEÇÃO --\n` +
                 `> O.S AUTORIZADA COM EXCEÇÃO PELA TORRE DE SERVIÇOS? [${autorizadaExcecaoSim ? 'SIM' : (autorizadaExcecaoNao ? 'NÃO' : '')}]`;

        if (autorizadaExcecaoSim) {
            texto += `\n> NOME DE QUEM AUTORIZOU: ${nomeAutorizador}`;
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
            if (input.type === 'checkbox') {
                input.checked = false; // Limpa checkboxes
            } else if (input.tagName === 'SELECT') {
                input.selectedIndex = 0; // Reseta selects
            }
            else {
                input.value = '';
            }
        });
        textoGerado.textContent = '';
        campoAutorizadorDiv.style.display = 'none'; // Garante que o campo do autorizador esteja oculto
    });

    // Event listeners para os campos de agendamento e outros
    agendamentoPeriodoInput.addEventListener('change', function() {
        if (this.value === 'apos') {
            agendamentoHorarioInput.style.display = 'inline-block';
            labelAgendamentoHorario.style.display = 'inline-block';
        } else {
            agendamentoHorarioInput.style.display = 'none';
            labelAgendamentoHorario.style.display = 'none';
            agendamentoHorarioInput.value = ''; // Limpa o horário se mudar
        }
        gerarTexto();
    });

    // Event listener para o campo "Cliente tem ponto adicional?"
    pontoAdicionalInput.addEventListener('change', function() {
        if (this.value === 'sim') {
            alertaPontoAdicional.style.display = 'block'; // Mostra o alerta
        } else {
            alertaPontoAdicional.style.display = 'none'; // Esconde o alerta
        }
        gerarTexto(); // Atualiza o texto
    });

    // Nova lógica para autorização por exceção
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

    // Adiciona event listeners para os outros campos para regenerar o texto
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('change', gerarTexto);
        if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
            input.addEventListener('input', gerarTexto); // Para resposta mais rápida
        }
    });

    // Configuração do estado inicial ao carregar a página
    agendamentoPeriodoInput.dispatchEvent(new Event('change')); // Para definir o estado inicial do horário
    pontoAdicionalInput.dispatchEvent(new Event('change')); // Para definir o estado inicial do alerta de ponto adicional
    autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change')); // Para definir o estado inicial do campo de autorização
    autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change')); // Para garantir que "Não" não exiba o campo
    gerarTexto(); // Gera o texto inicial
});