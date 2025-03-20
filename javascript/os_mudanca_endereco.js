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

        const agendamentoDataFormatada = formatarData(agendamentoData);
        const clienteDesdeFormatada = formatarData(clienteDesde);

        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ' (' + agendamentoHorario + ')';
            }
        }

        textoGerado.textContent = `> PODE ADIANTAR? [${adiantar}]\n\n> SOLICITAÇÃO: MUDANÇA DE ENDEREÇO.\n> AGENDAMENTO: ${agendamentoCompleto}\n> TEL.: ${telefone}\n\n> ENDEREÇO ATUAL: ${enderecoAtual}\n> NOVO ENDEREÇO: ${novoEndereco}\n> REF. DO NOVO ENDEREÇO: ${refNovoEndereco}\n> LOCALIZAÇÃO MAPS: ${localizacaoMaps}\n\n> TAXA: ISENTO\n> CLIENTE CIENTE QUE TEM QUE LEVAR EQUIPAMENTOS ATÉ O NOVO LOCAL\n\n> COMPROVANTE DE ENDEREÇO: ${comprovanteEndereco}\n> CLIENTE TEM PONTO ADICIONAL: [${pontoAdicional}]`;
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
        gerarTexto();
    });

    agendamentoDataInput.addEventListener('change', gerarTexto);
    agendamentoHorarioInput.addEventListener('change', gerarTexto);
    clienteDesdeInput.addEventListener('change', gerarTexto);

    // Adiciona event listeners para os outros campos para regenerar o texto
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('change', gerarTexto);
    });
});