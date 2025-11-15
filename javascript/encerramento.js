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

    function saveData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) {
                localStorage.setItem(field.id, field.value);
            }
        });
    }

    function loadData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) {
                const savedValue = localStorage.getItem(field.id);
                if (savedValue !== null) {
                    field.value = savedValue;
                }
            }
        });
        gerarTexto();
    }

    // --- Funções Principais ---

    function gerarTexto() {
        const problema = problemaInput.value;
        const procedimentos = procedimentosInput.value;
        const solucao = solucaoInput.value;

        if (problema || procedimentos || solucao) {
            textoGerado.textContent = `Problema relatado: ${problema}\n\nProcedimentos realizados:\n${procedimentos}\n\nSolução: ${solucao}`;
        } else {
            textoGerado.textContent = '';
        }
    }


    // --- Event Listeners ---

    copiarButton.addEventListener('click', function() {
        gerarTexto();
        const texto = textoGerado.textContent;
        if (texto.trim() !== '' && texto !== 'Preencha todos os campos.') {
            navigator.clipboard.writeText(texto).then(() => {
                alert('Texto copiado para a área de transferência!');
            });
        } else {
             alert('Nada para copiar. Preencha os campos do formulário.');
        }
    });

    limparButton.addEventListener('click', function() {
        if (confirm("Tem certeza que deseja limpar o formulário?")) {
            formFieldsToSave.forEach(field => {
                if (field) {
                    field.value = '';
                    localStorage.removeItem(field.id);
                }
            });
            gerarTexto();
        }
    });

    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                saveData();
                gerarTexto();
            });
        }
    });

    // --- Inicialização ---
    loadData();
});