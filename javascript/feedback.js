document.addEventListener('DOMContentLoaded', function() {
    // --- Referências dos Elementos ---
    const nomeClienteInput = document.getElementById('nome_do_cliente');
    const telefoneClienteInput = document.getElementById('telefone_do_cliente');
    const relatoClienteTextarea = document.getElementById('relato_do_cliente');
    const conexaoEstabilidadeTextarea = document.querySelector('textarea[name="conexao_e_estabilidade"]');
    const avaliacaoAtendimentoTextarea = document.querySelector('textarea[name="avaliacao_de_atendimento"]');
    const sugestoesMelhoriaTextarea = document.querySelector('textarea[name="sugestoes_melhoria"]');
    const atendenteResponsavelInput = document.querySelector('input[name="atendente_responsavel"]');
    const dataAtendimentoInput = document.querySelector('input[name="data_atendimento"]');
    const aceitouAvaliacaoCheckbox = document.getElementById('avaliacao_google_sim');
    const naoAceitouAvaliacaoCheckbox = document.getElementById('avaliacao_google_nao');
    const avaliacaoGoogleFieldset = naoAceitouAvaliacaoCheckbox.closest('fieldset');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGeradoParagrafo = document.getElementById('texto-gerado');

    // Agrupa todos os campos que precisam ser salvos
    const formFieldsToSave = [
        nomeClienteInput, telefoneClienteInput, relatoClienteTextarea,
        conexaoEstabilidadeTextarea, avaliacaoAtendimentoTextarea, sugestoesMelhoriaTextarea,
        atendenteResponsavelInput, dataAtendimentoInput, aceitouAvaliacaoCheckbox, naoAceitouAvaliacaoCheckbox
    ];

    // --- Funções de Local Storage ---

    function saveData() {
        formFieldsToSave.forEach(field => {
            if (field) {
                const key = field.id || field.name;
                if (field.type === 'checkbox') {
                    localStorage.setItem(key, field.checked);
                } else {
                    localStorage.setItem(key, field.value);
                }
            }
        });
        // Salva o campo dinâmico separadamente
        const motivoTextarea = document.getElementById('motivo_da_recusa');
        if (motivoTextarea) {
            localStorage.setItem('motivo_da_recusa', motivoTextarea.value);
        }
    }

    function loadData() {
        formFieldsToSave.forEach(field => {
            if (field) {
                const key = field.id || field.name;
                const savedValue = localStorage.getItem(key);
                if (savedValue !== null) {
                    if (field.type === 'checkbox') {
                        field.checked = (savedValue === 'true');
                    } else {
                        field.value = savedValue;
                    }
                }
            }
        });
        // Dispara o evento para garantir que a UI seja atualizada e o texto gerado
        if (naoAceitouAvaliacaoCheckbox.checked) {
            criarCampoMotivo();
        }
        gerarTexto();
    }

    // --- Funções de UI e Geração de Texto ---

    function criarCampoMotivo() {
        if (document.getElementById('motivo_recusa_fieldset')) {
            return;
        }
        const motivoRecusaFieldset = document.createElement('fieldset');
        motivoRecusaFieldset.id = 'motivo_recusa_fieldset';
        const motivoRecusaLabel = document.createElement('label');
        motivoRecusaLabel.textContent = 'Motivo da recusa:';
        motivoRecusaLabel.setAttribute('for', 'motivo_da_recusa');
        const motivoRecusaTextarea = document.createElement('textarea');
        motivoRecusaTextarea.id = 'motivo_da_recusa';
        motivoRecusaTextarea.name = 'motivo_da_recusa';
        
        // Listener para salvar e atualizar texto em tempo real
        motivoRecusaTextarea.addEventListener('input', () => {
            saveData();
            gerarTexto();
        });
        
        // Carrega o valor salvo
        motivoRecusaTextarea.value = localStorage.getItem('motivo_da_recusa') || '';

        motivoRecusaFieldset.appendChild(motivoRecusaLabel);
        motivoRecusaFieldset.appendChild(motivoRecusaTextarea);
        avaliacaoGoogleFieldset.parentNode.insertBefore(motivoRecusaFieldset, avaliacaoGoogleFieldset.nextSibling);
    }

    function removerCampoMotivo() {
        const motivoExistente = document.getElementById('motivo_recusa_fieldset');
        if (motivoExistente) {
            motivoExistente.parentNode.removeChild(motivoExistente);
            localStorage.removeItem('motivo_da_recusa');
        }
    }

    function gerarTexto() {
        const motivoTextarea = document.getElementById('motivo_da_recusa');
        let motivoRecusa = '';
        if (naoAceitouAvaliacaoCheckbox.checked && motivoTextarea) {
            motivoRecusa = `\n> Motivo da recusa: ${motivoTextarea.value}`;
        }

        const scriptFormatado =
`- INFORMAÇÕES DO CLIENTE -
> Nome do cliente: ${nomeClienteInput.value}
> Telefone: ${telefoneClienteInput.value}
> Relato inicial: ${relatoClienteTextarea.value}

- PONTOS DE ANALISE -
> Conexão e estabilidade: ${conexaoEstabilidadeTextarea.value}
> Avaliação do atendimento: ${avaliacaoAtendimentoTextarea.value}
> Sugestões e pontos de melhoria: ${sugestoesMelhoriaTextarea.value}

- AVALIAÇÃO DO GOOGLE -
> Cliente aceitou avaliação do Google? [${aceitouAvaliacaoCheckbox.checked ? 'Sim' : 'Não'}]${motivoRecusa}

- DETALHES DO ATENDIMENTO -
> Atendente responsável: ${atendenteResponsavelInput.value}
> Data do atendimento: ${dataAtendimentoInput.value}`;

        textoGeradoParagrafo.textContent = scriptFormatado.trim();
    }

    // --- Event Listeners ---

    aceitouAvaliacaoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            naoAceitouAvaliacaoCheckbox.checked = false;
            removerCampoMotivo();
        }
        saveData();
        gerarTexto();
    });

    naoAceitouAvaliacaoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            aceitouAvaliacaoCheckbox.checked = false;
            criarCampoMotivo();
        } else {
            removerCampoMotivo();
        }
        saveData();
        gerarTexto();
    });

    copiarButton.addEventListener('click', function() {
        gerarTexto(); // Garante atualização
        navigator.clipboard.writeText(textoGeradoParagrafo.textContent)
            .then(() => {
                alert('Script copiado para a área de transferência!');
            })
            .catch(err => {
                console.error('Erro ao copiar o texto: ', err);
                alert('Erro ao copiar o script.');
            });
    });

    limparButton.addEventListener('click', function() {
        if (confirm("Tem certeza que deseja limpar o formulário?")) {
            formFieldsToSave.forEach(field => {
                const key = field.id || field.name;
                if (key !== 'atendente_responsavel') {
                    if (field.type === 'checkbox') {
                        field.checked = false;
                    } else {
                        field.value = '';
                    }
                    localStorage.removeItem(key);
                }
            });
            removerCampoMotivo();
            textoGeradoParagrafo.textContent = '';
        }
    });
    
    // Adiciona listeners para salvar e gerar texto automaticamente
    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', () => { saveData(); gerarTexto(); });
            field.addEventListener('change', () => { saveData(); gerarTexto(); });
        }
    });

    // --- Inicialização ---
    loadData();
});