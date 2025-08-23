document.addEventListener('DOMContentLoaded', function() {
    // --- Referências dos Elementos ---
    const agendamentoPeriodoInput = document.getElementById('agendamento_periodo');
    const agendamentoHorarioInput = document.getElementById('agendamento_horario');
    const labelAgendamentoHorario = document.getElementById('label_agendamento_horario');
    const pontoAdicionalInput = document.getElementById('ponto_adicional');
    const alertaPontoAdicional = document.getElementById('alerta_ponto_adicional');
    const autorizadaExcecaoSimCheckbox = document.getElementById('autorizada_excecao_sim');
    const autorizadaExcecaoNaoCheckbox = document.getElementById('autorizada_excecao_nao');
    const campoAutorizadorDiv = document.getElementById('campo_autorizador');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');
    const operadorInput = document.getElementById('operador');

    // Agrupa todos os campos que precisam ser gerenciados
    const formFieldsToManage = document.querySelectorAll('.form input, .form textarea, .form select');

    // --- Funções de Local Storage ---

    function saveData() {
        formFieldsToManage.forEach(field => {
            // Não salva campos readonly
            if (field && field.id && !field.readOnly) {
                if (field.type === 'checkbox') {
                    localStorage.setItem(field.id, field.checked);
                } else {
                    localStorage.setItem(field.id, field.value);
                }
            }
        });
    }

    function loadData() {
        formFieldsToManage.forEach(field => {
            // Não carrega dados para campos readonly
            if (field && field.id && !field.readOnly) {
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
        pontoAdicionalInput.dispatchEvent(new Event('change'));
        autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
        autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
        gerarTexto();
    }

    // --- Funções Auxiliares e Principais ---

    function formatarData(data) {
        if (!data) return '';
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
        const adiantar = document.getElementById('adiantar').value.toUpperCase();
        const agendamentoData = formatarData(document.getElementById('agendamento_data').value);
        const agendamentoPeriodo = agendamentoPeriodoInput.value;
        const agendamentoHorario = agendamentoHorarioInput.value;
        const telefone = document.getElementById('telefone').value;
        const enderecoAtual = document.getElementById('endereco_atual').value;
        const novoEndereco = document.getElementById('novo_endereco').value;
        const refNovoEndereco = document.getElementById('ref_novo_endereco').value;
        const localizacaoMaps = document.getElementById('localizacao_maps').value;
        const comprovanteEndereco = document.getElementById('comprovante_endereco').value;
        const pontoAdicional = pontoAdicionalInput.value.toUpperCase();
        const interesseServicoMudanca = document.getElementById('interesse_servico_mudanca').value;
        const nomeAutorizador = document.getElementById('nome_autorizador').value;

        let agendamentoCompleto = agendamentoData;
        if (agendamentoPeriodo && agendamentoPeriodo !== "Horário Comercial") {
            agendamentoCompleto += ' - ' + agendamentoPeriodo.charAt(0).toUpperCase() + agendamentoPeriodo.slice(1);
            if (agendamentoPeriodo === 'apos' && agendamentoHorario) {
                agendamentoCompleto += ' (' + agendamentoHorario + ')';
            }
        } else if (agendamentoPeriodo === "Horário Comercial") {
             agendamentoCompleto += ' - ' + agendamentoPeriodo;
        }

        let texto = `> ATENDENTE: ${operadorInput.value}\n\n> PODE ADIANTAR? [${adiantar}]\n\n> SOLICITAÇÃO: MUDANÇA DE ENDEREÇO.\n> AGENDAMENTO: ${agendamentoCompleto}\n> TEL.: ${telefone}\n\n> ENDEREÇO ATUAL: ${enderecoAtual}\n> NOVO ENDEREÇO: ${novoEndereco}\n> REF. DO NOVO ENDEREÇO: ${refNovoEndereco}\n> LOCALIZAÇÃO MAPS: ${localizacaoMaps}\n\n> TAXA: ISENTO\n> CLIENTE CIENTE QUE TEM QUE LEVAR EQUIPAMENTOS ATÉ O NOVO LOCAL\n\n> COMPROVANTE DE ENDEREÇO: ${comprovanteEndereco}\n> CLIENTE TEM PONTO ADICIONAL: [${pontoAdicional}]`;
        if (pontoAdicional === 'SIM') {
            texto += '\nCLIENTE CIENTE QUE PONTO ADICIONAL SERÁ AVALIADO NA NOVA RESIDÊNCIA.';
        }
        texto += `\n\n-- ETECC RESOLVE --\n` + `> CLIENTE APRESENTOU INTERESSE NO SERVIÇO DE MUDANÇA? [${interesseServicoMudanca.toUpperCase()}]`;
        texto += `\n\n-- AUTORIZAÇÃO POR EXCEÇÃO --\n` + `> O.S AUTORIZADA COM EXCEÇÃO PELA TORRE DE SERVIÇOS? [${autorizadaExcecaoSimCheckbox.checked ? 'SIM' : 'NÃO'}]`;
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
        if (!isApos) {
            agendamentoHorarioInput.value = '';
        }
    });

    pontoAdicionalInput.addEventListener('change', function() {
        alertaPontoAdicional.style.display = (this.value === 'sim') ? 'block' : 'none';
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
        formFieldsToManage.forEach(field => {
            // Não limpa o operador NEM campos readonly
            if (field.id !== 'operador' && !field.readOnly) {
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
        pontoAdicionalInput.dispatchEvent(new Event('change'));
        autorizadaExcecaoSimCheckbox.dispatchEvent(new Event('change'));
        autorizadaExcecaoNaoCheckbox.dispatchEvent(new Event('change'));
        gerarTexto();
    });

    // Adiciona listeners para salvar e gerar texto em tempo real
    formFieldsToManage.forEach(field => {
        field.addEventListener('input', () => {
            saveData();
            gerarTexto();
        });
        field.addEventListener('change', () => { // Para selects e checkboxes
            saveData();
            gerarTexto();
        });
    });

    // --- INICIALIZAÇÃO E CORREÇÃO FINAL ---
    
    // **LINHA ADICIONADA:** Salva os dados uma última vez antes de sair da página.
    window.addEventListener('pagehide', saveData);

    // Carrega os dados salvos assim que a página é aberta
    loadData();
    document.getElementById('solicitacao').value = 'MUDANÇA DE ENDEREÇO';
});