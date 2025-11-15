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

    function formatarCpfCnpj(valor) {
        valor = valor.replace(/\D/g, '');
        if (valor.length <= 11) {
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else {
            valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        return valor;
    }

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

    cpfCnpjInput.addEventListener('input', function () {
        this.value = formatarCpfCnpj(this.value);
    });

    copiarButton.addEventListener('click', function () {
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

    limparButton.addEventListener('click', function () {
        if (confirm("Tem certeza que deseja limpar o formulário?")) {
            formFieldsToSave.forEach(field => {
                if (field && field.id !== 'operador') {
                    field.value = '';
                    localStorage.removeItem(field.id);
                }
            });
            gerarTexto();
        }
    });

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

    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', saveData);
        }
    });

    formFieldsToSave.forEach(field => {
        if (field) {
            field.addEventListener('input', gerarTexto);
        }
    });

    // --- INICIALIZAÇÃO ---
    window.addEventListener('pagehide', saveData);
    loadData();
});