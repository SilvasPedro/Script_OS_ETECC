document.addEventListener('DOMContentLoaded', function() {
    // --- Referências dos Elementos ---
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');
    const notificacaoHorarioP = document.getElementById('notificacao-horario');
    const gerouProporcionalCheckbox = document.getElementById('gerou_proporcional');
    const camposProporcionalDiv = document.getElementById('campos_proporcional');
    const avaliacaoTecnicaSelect = document.getElementById('avaliacao_tecnica');
    const labelBaixaAvaliacao = document.getElementById('label_baixa_avaliacao');
    const baixaAvaliacaoTextarea = document.getElementById('baixa_avaliacao');
    const autorizadaExcecaoSimCheckbox = document.getElementById('autorizada_excecao_sim');
    const autorizadaExcecaoNaoCheckbox = document.getElementById('autorizada_excecao_nao');
    const campoAutorizadorDiv = document.getElementById('campo_autorizador');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');
    const operadorInput = document.getElementById('operador');
    const resultadoDiv = document.querySelector('.resultado');

    // Agrupa todos os campos que precisam ser salvos
    const formFieldsToSave = document.querySelectorAll('.form input, .form textarea, .form select');

    // --- Funções de Local Storage ---

    function saveData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) {
                if (field.type === 'checkbox') {
                    localStorage.setItem(field.id, field.checked);
                } else {
                    localStorage.setItem(field.id, field.value);
                }
            }
        });
    }

    function loadData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) {
                const savedValue = localStorage.getItem(field.id);
                if (savedValue !== null) {
                    if (field.type === 'checkbox') {
                        field.checked = (savedValue === 'true');
                    } else {
                        field.value = savedValue;
                    }
                }
            }
        });
        // Dispara eventos para a UI refletir os dados carregados
        agendamentoPeriodoInput.dispatchEvent(new Event('change'));
        gerouProporcionalCheckbox.dispatchEvent(new Event('change'));
        avaliacaoTecnicaSelect.dispatchEvent(new Event('change'));
        autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
        autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
        
        if(resultadoDiv) resultadoDiv.classList.remove('hidden');

        gerarTexto();
    }

    // --- Funções Auxiliares e Principais ---

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
        // Coleta de valores
        const agendamentoData = formatarData(document.getElementById('agendamento_data').value);
        const agendamentoPeriodo = agendamentoPeriodoInput.value;
        const agendamentoHorario = agendamentoHorarioInput.value;
        const solicitacao = document.getElementById('solicitacao').value;
        const telefone = document.getElementById('telefone').value;
        const plano = document.getElementById('plano').value;
        const roteador = document.getElementById('roteador').value.toUpperCase();
        const onu = document.getElementById('onu').value.toUpperCase();
        const clienteDesde = document.getElementById('cliente_desde').value;
        const upgrade = document.getElementById('upgrade').value.toUpperCase();
        const roteadorAdicional = document.getElementById('roteador_adicional').value.toUpperCase();
        const cienteTaxa = document.getElementById('ciente_taxa').value;
        const valorTaxa = document.getElementById('valor_taxa').value;
        const porMetro = document.getElementById('por_metro').checked;
        const vencimentoTaxa = formatarData(document.getElementById('vencimento_taxa').value);
        const baixaAvaliacao = baixaAvaliacaoTextarea.value;
        const nomeAutorizador = document.getElementById('nome_autorizador').value;

        // Lógica de construção do texto
        let agendamentoCompleto = agendamentoData;
        if (agendamentoPeriodo && agendamentoPeriodo !== "Horário Comercial") {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ` (${agendamentoHorario})`;
            }
        } else if (agendamentoPeriodo === "Horário Comercial"){
            agendamentoCompleto += ' - ' + agendamentoPeriodo;
        }

        let texto = `> OPERADOR: ${operadorInput.value}\n\n> AGENDAMENTO: ${agendamentoCompleto}\n\n` +
                    `> SOLICITAÇÃO: ${solicitacao}\n\n` +
                    `-- INFORMAÇÕES DO CLIENTE --\n` +
                    `> TEL.: ${telefone}\n` +
                    `> PLANO: ${plano}\n` +
                    `> ROTEADOR PRINCIPAL: [${roteador}]\n` +
                    `> ONU: [${onu}]\n` +
                    `> CLIENTE DESDE: ${clienteDesde}\n\n` +
                    `-- INFORMAÇÕES DA O.S --\n` +
                    `> CLIENTE REALIZOU UPGRADE? [${upgrade}]\n` +
                    `> ROTEADOR DO PONTO ADICIONAL: [${roteadorAdicional}]\n\n` +
                    `> FOI GERADO VALOR PROPORCIONAL? [${gerouProporcionalCheckbox.checked ? 'SIM' : 'NÃO'}]`;

        if (gerouProporcionalCheckbox.checked) {
            let valorTaxaFormatado = valorTaxa ? `R$ ${parseFloat(valorTaxa).toFixed(2)}` : 'R$ 0.00';
            if (porMetro) {
                valorTaxaFormatado = valorTaxa ? `R$ ${parseFloat(valorTaxa).toFixed(2)} por metro` : 'Não informado por metro';
            }
            texto += `\n> CLIENTE CIENTE DA TAXA/PROPORCIONAL? [${cienteTaxa.toUpperCase()}]` +
                     `\n> VALOR DA TAXA/PROPORCIONAL: ${valorTaxaFormatado}` +
                     `\n> VENCIMENTO DA TAXA/PROPORCIONAL: ${vencimentoTaxa}`;
        }
         texto += `\n\n-- AVALIAÇÃO TÉCNICA --\n` +
                  `> JÁ FOI FEITA AVALIAÇÃO TÉCNICA? [${avaliacaoTecnicaSelect.value.toUpperCase()}]`;
         if (avaliacaoTecnicaSelect.value === 'sim') {
             texto += `\n> BAIXA DA AVALIAÇÃO:\n${baixaAvaliacao}`;
         }
        texto += `\n\n-- AUTORIZAÇÃO POR EXCEÇÃO --\n` +
                 `> O.S AUTORIZADA COM EXCEÇÃO PELA TORRE DE SERVIÇOS? [${autorizadaExcecaoSimCheckbox.checked ? 'SIM' : 'NÃO'}]`;
        if (autorizadaExcecaoSimCheckbox.checked) {
            texto += `\n> NOME DE QUEM AUTORIZOU: ${nomeAutorizador}`;
        }
        textoGerado.textContent = texto;
    }

    // --- Event Listeners ---
    agendamentoPeriodoInput.addEventListener('change', function() {
        const isApos = this.value === 'apos';
        agendamentoHorarioInput.style.display = isApos ? 'inline-block' : 'none';
        labelAgendamentoHorario.style.display = isApos ? 'inline-block' : 'none';
        notificacaoHorarioP.style.display = (this.value === 'ultima' || isApos) ? 'block' : 'none';
        if (!isApos) {
            agendamentoHorarioInput.value = '';
        }
    });

    gerouProporcionalCheckbox.addEventListener('change', function() {
        camposProporcionalDiv.style.display = this.checked ? 'block' : 'none';
    });

    avaliacaoTecnicaSelect.addEventListener('change', function() {
        const isSim = this.value === 'sim';
        labelBaixaAvaliacao.style.display = isSim ? 'block' : 'none';
        baixaAvaliacaoTextarea.style.display = isSim ? 'block' : 'none';
    });

    autorizadaExcecaoSimCheckbox.addEventListener('change', function() {
        if (this.checked) {
            autorizadaExcecaoNaoCheckbox.checked = false;
            campoAutorizadorDiv.style.display = 'block';
        } else {
            campoAutorizadorDiv.style.display = 'none';
        }
    });

    autorizadaExcecaoNaoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            autorizadaExcecaoSimCheckbox.checked = false;
            campoAutorizadorDiv.style.display = 'none';
        }
    });

    copiarButton.addEventListener('click', function() {
        gerarTexto();
        if (textoGerado.textContent.trim()) {
            navigator.clipboard.writeText(textoGerado.textContent).then(() => {
                alert('Texto copiado para a área de transferência!');
            });
        } else {
            alert('Nada para copiar.');
        }
    });

    limparButton.addEventListener('click', function() {
        if (confirm("Tem certeza que deseja limpar o formulário?")) {
            formFieldsToSave.forEach(field => {
                if (field.id !== 'operador') {
                    if (field.type === 'checkbox') {
                        field.checked = false;
                    } else if (field.tagName === 'SELECT') {
                        field.selectedIndex = 0;
                    } else {
                        field.value = '';
                    }
                    localStorage.removeItem(field.id);
                }
            });
            // Dispara eventos para resetar a UI e o texto
            agendamentoPeriodoInput.dispatchEvent(new Event('change'));
            gerouProporcionalCheckbox.dispatchEvent(new Event('change'));
            avaliacaoTecnicaSelect.dispatchEvent(new Event('change'));
            autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
            autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
            gerarTexto();
        }
    });

    // Adiciona listeners para salvar e gerar texto em tempo real
    formFieldsToSave.forEach(field => {
        field.addEventListener('input', () => {
            saveData();
            gerarTexto();
        });
        field.addEventListener('change', () => { // Para selects e checkboxes
            saveData();
            gerarTexto();
        });
    });

    // --- Inicialização ---
    loadData();
});