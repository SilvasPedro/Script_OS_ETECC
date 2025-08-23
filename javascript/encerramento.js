document.addEventListener('DOMContentLoaded', function() {
    // --- Referências dos Elementos ---
    const problemaInput = document.getElementById('problema');
    const procedimentosInput = document.getElementById('procedimentos');
    const solucaoInput = document.getElementById('solucao');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');

    // Agrupa todos os campos que precisam ser salvos
    const formFieldsToSave = [problemaInput, procedimentosInput, solucaoInput];

    // --- Funções de Local Storage ---

    /**
     * Salva o valor de todos os campos do formulário no localStorage.
     */
    function saveData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) {
                localStorage.setItem(field.id, field.value);
            }
        });
    }

    /**
     * Carrega os valores salvos do localStorage para os campos do formulário.
     */
    function loadData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) {
                const savedValue = localStorage.getItem(field.id);
                if (savedValue !== null) {
                    field.value = savedValue;
                }
            }
        });
        gerarTexto(); // Atualiza a área de texto com os dados carregados
    }

    // --- Funções Principais ---

    /**
     * Gera o texto final do script com base nos dados do formulário.
     */
    function gerarTexto() {
        const problema = problemaInput.value;
        const procedimentos = procedimentosInput.value;
        const solucao = solucaoInput.value;

        // Gera o texto apenas se algum campo estiver preenchido
        if (problema || procedimentos || solucao) {
            textoGerado.textContent = `Problema relatado: ${problema}\n\nProcedimentos realizados:\n${procedimentos}\n\nSolução: ${solucao}`;
        } else {
            textoGerado.textContent = '';
        }
    }


    // --- Event Listeners ---

    // Botão para copiar o script gerado
    copiarButton.addEventListener('click', function() {
        gerarTexto(); // Garante que o texto está atualizado
        const texto = textoGerado.textContent;
        if (texto.trim() !== '' && texto !== 'Preencha todos os campos.') {
            navigator.clipboard.writeText(texto).then(() => {
                alert('Texto copiado para a área de transferência!');
            });
        } else {
             alert('Nada para copiar. Preencha os campos do formulário.');
        }
    });

    // Botão para limpar o formulário
    limparButton.addEventListener('click', function() {
        formFieldsToSave.forEach(field => {
            if (field) {
                field.value = '';
                localStorage.removeItem(field.id);
            }
        });
        gerarTexto(); // Limpa a área de texto gerado
    });

    // Salva e atualiza o script em tempo real a cada alteração nos campos
    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                saveData();
                gerarTexto();
            });
        }
    });

    // --- Inicialização ---
    // Carrega os dados salvos assim que a página é aberta
    loadData();
});