document.addEventListener('DOMContentLoaded', function() {
    const aceitouAvaliacaoCheckbox = document.getElementById('avaliacao_google_sim');
    const naoAceitouAvaliacaoCheckbox = document.querySelector('#avaliacao_google_nao');
    const motivoRecusaFieldset = document.createElement('fieldset');
    const motivoRecusaLabel = document.createElement('label');
    const motivoRecusaTextarea = document.createElement('textarea');
    const avaliacaoGoogleFieldset = naoAceitouAvaliacaoCheckbox.closest('fieldset');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const nomeClienteInput = document.getElementById('nome_do_cliente');
    const telefoneClienteInput = document.getElementById('telefone_do_cliente');
    const relatoClienteTextarea = document.getElementById('relato_do_cliente');
    const conexaoEstabilidadeTextarea = document.querySelector('textarea[name="conexao_e_estabilidade"]');
    const avaliacaoAtendimentoTextarea = document.querySelector('textarea[name="avaliacao_de_atendimento"]');
    const sugestoesMelhoriaTextarea = document.querySelector('textarea[name="sugestoes_melhoria"]');
    const atendenteResponsavelInput = document.querySelector('input[name="atendente_responsavel"]');
    const dataAtendimentoInput = document.querySelector('input[name="data_atendimento"]');
    const textoGeradoParagrafo = document.getElementById('texto-gerado');

    // 1. Desmarcar "Não aceitou avaliação" ao marcar "Aceitou avaliação"
    aceitouAvaliacaoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            naoAceitouAvaliacaoCheckbox.checked = false;
            // Remove o campo de motivo se existir
            const motivoExistente = avaliacaoGoogleFieldset.querySelector('#motivo_recusa_fieldset');
            if (motivoExistente) {
                avaliacaoGoogleFieldset.parentNode.removeChild(motivoExistente);
            }
        }
    });

    // 2. Exibir campo de motivo ao marcar "Não aceitou avaliação"
    naoAceitouAvaliacaoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            aceitouAvaliacaoCheckbox.checked = false;
            // Cria e adiciona o campo de motivo
            motivoRecusaFieldset.id = 'motivo_recusa_fieldset';
            motivoRecusaLabel.textContent = 'Motivo da recusa:';
            motivoRecusaLabel.setAttribute('for', 'motivo_da_recusa');
            motivoRecusaTextarea.id = 'motivo_da_recusa';
            motivoRecusaTextarea.name = 'motivo_da_recusa';

            motivoRecusaFieldset.appendChild(motivoRecusaLabel);
            motivoRecusaFieldset.appendChild(motivoRecusaTextarea);
            avaliacaoGoogleFieldset.parentNode.insertBefore(motivoRecusaFieldset, avaliacaoGoogleFieldset.nextSibling);
        } else {
            // Remove o campo de motivo se desmarcado
            const motivoExistente = avaliacaoGoogleFieldset.querySelector('#motivo_recusa_fieldset');
            if (motivoExistente) {
                avaliacaoGoogleFieldset.parentNode.removeChild(motivoExistente);
            }
        }
    });

    // 3. Formatar e copiar script-
    copiarButton.addEventListener('click', function() {
        const nomeCliente = nomeClienteInput.value;
        const telefoneCliente = telefoneClienteInput.value;
        const relatoInicial = relatoClienteTextarea.value;
        const conexaoEstabilidade = conexaoEstabilidadeTextarea.value;
        const avaliacaoAtendimento = avaliacaoAtendimentoTextarea.value;
        const sugestoesMelhoria = sugestoesMelhoriaTextarea.value;
        const atendenteResponsavel = atendenteResponsavelInput.value;
        const dataAtendimento = dataAtendimentoInput.value;
        let aceitouAvaliacao = aceitouAvaliacaoCheckbox.checked ? 'Sim' : 'Não';
        let motivoRecusa = '';

        const motivoTextarea = document.getElementById('motivo_da_recusa');
        if (naoAceitouAvaliacaoCheckbox.checked && motivoTextarea) {
            motivoRecusa = `\n> Motivo da recusa: ${motivoTextarea.value}`;
        }

        const scriptFormatado =
            `- INFORMAÇÕES DO CLIENTE -
> Nome do cliente: ${nomeCliente}
> Telefone: ${telefoneCliente}
> Relato inicial: ${relatoInicial}

- PONTOS DE ANALISE -
> Conexão e estabilidade: ${conexaoEstabilidade}
> Avaliação do atendimento: ${avaliacaoAtendimento}
> Sugestões e pontos de melhoria: ${sugestoesMelhoria}

- AVALIAÇÃO DO GOOGLE -
> Cliente aceitou avaliação do Google? [${aceitouAvaliacao}]${motivoRecusa}

- DETALHES DO ATENDIMENTO -
> Atendente responsável: ${atendenteResponsavel}
> Data do atendimento: ${dataAtendimento}
`;

        // Copiar para a área de transferência
        navigator.clipboard.writeText(scriptFormatado)
            .then(() => {
                textoGeradoParagrafo.textContent = 'Script copiado para a área de transferência!';
            })
            .catch(err => {
                console.error('Erro ao copiar o texto: ', err);
                textoGeradoParagrafo.textContent = 'Erro ao copiar o script.';
            });
    });

    // 4. Limpar formulário (mantendo a funcionalidade existente)
    limparButton.addEventListener('click', function() {
        const formElements = document.querySelectorAll('.form input[type="text"], .form input[type="date"], .form textarea, .form input[type="checkbox"]');
        formElements.forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        });
        // Remove o campo de motivo de recusa se existir ao limpar o formulário
        const motivoExistente = avaliacaoGoogleFieldset.querySelector('#motivo_recusa_fieldset');
        if (motivoExistente) {
            avaliacaoGoogleFieldset.parentNode.removeChild(motivoExistente);
        }
        textoGeradoParagrafo.textContent = '';
    });
});