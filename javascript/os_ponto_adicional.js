document.addEventListener('DOMContentLoaded', function() {
    const agendamentoDataInput = document.getElementById('agendamento_data');
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');

    const solicitacaoInput = document.getElementById('solicitacao');
    const telefoneInput = document.getElementById('telefone');
    const planoInput = document.getElementById('plano');
    const roteadorInput = document.getElementById('roteador');
    const onuInput = document.getElementById('onu');
    const clienteDesdeInput = document.getElementById('cliente_desde');

    const upgradeInput = document.getElementById('upgrade');
    const roteadorAdicionalInput = document.getElementById('roteador_adicional');
    const valorTaxaInput = document.getElementById('valor_taxa');
    const cienteTaxaInput = document.getElementById('ciente_taxa');
    const vencimentoTaxaInput = document.getElementById('vencimento_taxa');

    // Novos campos
    const avaliacaoTecnicaInput = document.getElementById('avaliacao_tecnica');
    const baixaAvaliacaoInput = document.getElementById('baixa_avaliacao');
    const labelBaixaAvaliacao = document.getElementById('label_baixa_avaliacao');

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
    
        const solicitacao = solicitacaoInput.value;
        const telefone = telefoneInput.value;
        const plano = planoInput.value;
        const roteador = roteadorInput.value.toUpperCase();
        const onu = onuInput.value.toUpperCase();
        const clienteDesde = clienteDesdeInput.value;
    
        const upgrade = upgradeInput.value.toUpperCase();
        const roteadorAdicional = roteadorAdicionalInput.value.toUpperCase();
        const valorTaxa = valorTaxaInput.value;
        const cienteTaxa = cienteTaxaInput.value.toUpperCase();
        const vencimentoTaxa = vencimentoTaxaInput.value;
    
        const porMetro = document.getElementById('por_metro').checked; // Verifica se o checkbox está marcado
    
        const agendamentoDataFormatada = formatarData(agendamentoData);
        const clienteDesdeFormatada = formatarData(clienteDesde);
    
        let agendamentoCompleto = agendamentoDataFormatada;
        if (agendamentoPeriodo) {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ' (' + agendamentoHorario + ')';
            }
        }
    
        let valorTaxaFormatado = 'R$ ' + valorTaxa;
        if (porMetro) {
            valorTaxaFormatado = 'R$' + valorTaxa + '/metro'; // Formata o valor com "por metro"
        }
    
        let texto = `> AGENDAMENTO: ${agendamentoCompleto}\n\n` +
                    `> SOLICITAÇÃO: ${solicitacao}\n\n` +
                    `> INFORMAÇÕES DO CLIENTE <·\n\n` +
                    `> TEL.: ${telefone}\n` +
                    `> PLANO: ${plano}\n` +
                    `> ROTEADOR: [${roteador}]\n` +
                    `> ONU: [${onu}]\n` +
                    `> CLIENTE DESDE: ${clienteDesdeFormatada}\n\n` +
                    `> INFORMAÇÕES DA O.S <·\n\n` +
                    `> CLIENTE REALIZOU UPGRADE? [${upgrade}]\n` +
                    `> ROTEADOR DO PONTO ADICIONAL: [${roteadorAdicional}]\n` +
                    `> VALOR DA TAXA/PROPORCIONAL: ${valorTaxaFormatado}\n\n` + // Usa a variável formatada
                    `> CLIENTE CIENTE DA TAXA/PROPORCIONAL? [${cienteTaxa}]\n` +
                    `> VENCIMENTO DA TAXA/PROPORCIONAL: ${vencimentoTaxa}`;
    
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
        gerarTexto();
    });

    agendamentoDataInput.addEventListener('change', gerarTexto);
    agendamentoHorarioInput.addEventListener('change', gerarTexto);
    clienteDesdeInput.addEventListener('change', gerarTexto);

    // Adiciona event listeners para os outros campos para regenerar o texto
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('change', gerarTexto);
    });

    // Event listener para o campo "Já foi feita avaliação técnica?"
    avaliacaoTecnicaInput.addEventListener('change', function() {
        if (this.value === 'sim') {
            baixaAvaliacaoInput.style.display = 'block';
            labelBaixaAvaliacao.style.display = 'block';
        } else {
            baixaAvaliacaoInput.style.display = 'none';
            labelBaixaAvaliacao.style.display = 'none';
        }
        gerarTexto();
    });

    // Chamada inicial para definir o estado dos campos
    avaliacaoTecnicaInput.dispatchEvent(new Event('change'));
});