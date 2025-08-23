document.addEventListener('DOMContentLoaded', function () {
    // --- Referências dos Elementos ---
    const problemaInput = document.getElementById('problema');
    const telefoneInput = document.getElementById('telefone');
    const operadorInput = document.getElementById('operador');
    const nomeClienteInput = document.getElementById('nomeCliente');
    const cpfCnpjInput = document.getElementById('cpfCnpj');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');
    const copiarCpfCnpjButton = document.getElementById('copiarCpfCnpj');

    // Seleciona todos os campos que devem ser salvos
    const formFieldsToSave = [problemaInput, telefoneInput, operadorInput, nomeClienteInput, cpfCnpjInput];

    // --- Funções de Local Storage ---

    /**
     * Salva o valor de todos os campos do formulário no localStorage.
     */
    function saveData() {
        formFieldsToSave.forEach(field => {
            if (field && field.id) { // Garante que o campo e o ID existam
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
        gerarTexto(); // Atualiza o script gerado com os dados carregados
    }

    // --- Funções Principais ---

    /**
     * Formata o valor do campo para CPF ou CNPJ.
     * @param {string} valor O valor a ser formatado.
     * @returns {string} O valor formatado.
     */
    function formatarCpfCnpj(valor) {
        valor = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (valor.length <= 11) { // Formata como CPF
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else { // Formata como CNPJ
            valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        return valor;
    }

    /**
     * Gera o texto final do script com base nos dados do formulário.
     */
    function gerarTexto() {
        const problema = problemaInput.value;
        const telefone = telefoneInput.value;
        const operador = operadorInput.value;
        const nomeCliente = nomeClienteInput.value;

        if (problema || telefone || nomeCliente) {
             textoGerado.textContent = `Relato: ${problema}\nTel: ${telefone} - ${nomeCliente}\n\nOperador: ${operador}`;
        } else {
            textoGerado.textContent = '';
        }
    }


    // --- Event Listeners ---

    // Formata o CPF/CNPJ enquanto o usuário digita
    cpfCnpjInput.addEventListener('input', function () {
        this.value = formatarCpfCnpj(this.value);
    });

    // Botão para copiar o script gerado
    copiarButton.addEventListener('click', function () {
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
    limparButton.addEventListener('click', function () {
        formFieldsToSave.forEach(field => {
            // A condição principal: não limpa o campo do operador
            if (field && field.id !== 'operador') {
                field.value = '';
                localStorage.removeItem(field.id);
            }
        });
        gerarTexto(); // Limpa também a área de texto gerado
    });

    // Botão para copiar apenas o CPF/CNPJ
    copiarCpfCnpjButton.addEventListener('click', function () {
        const cpfCnpj = cpfCnpjInput.value;
        if (cpfCnpj) {
            navigator.clipboard.writeText(cpfCnpj).then(() => {
                alert('CPF/CNPJ copiado para a área de transferência!');
            });
        } else {
            alert('Preencha o campo CPF/CNPJ.');
        }
    });

    // Salva e atualiza o script em tempo real a cada alteração nos campos
    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', saveData);
        }
    });
     // Atualiza o texto gerado em tempo real, separado do save.
    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', gerarTexto);
        }
    });


    // --- INICIALIZAÇÃO E CORREÇÃO ---
    
    // **NOVA LINHA:** Salva os dados uma última vez antes de sair da página.
    window.addEventListener('pagehide', saveData);

    // Carrega os dados salvos assim que a página é aberta
    loadData();
});