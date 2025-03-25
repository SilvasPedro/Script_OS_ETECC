document.addEventListener('DOMContentLoaded', function () {
    const problemaInput = document.getElementById('problema');
    const telefoneInput = document.getElementById('telefone');
    const operadorInput = document.getElementById('operador');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');

    // Novos campos e botão
    const nomeClienteInput = document.getElementById('nomeCliente');
    const cpfCnpjInput = document.getElementById('cpfCnpj');
    const copiarCpfCnpjButton = document.getElementById('copiarCpfCnpj');

    // Função para formatar CPF/CNPJ
    function formatarCpfCnpj(valor) {
        valor = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
        if (valor.length <= 11) { // CPF
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
        } else { // CNPJ
            valor = valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
        }
        return valor;
    }

    // Atualiza a formatação do CPF/CNPJ enquanto o usuário digita
    cpfCnpjInput.addEventListener('input', function () {
        this.value = formatarCpfCnpj(this.value);
    });

    function gerarTexto() {
        const problema = problemaInput.value;
        const telefone = telefoneInput.value;
        const operador = operadorInput.value;
        // Novo campo
        const nomeCliente = nomeClienteInput.value;

        if (problema && telefone && operador) {
            textoGerado.textContent = `Relato: ${problema}\nTel: ${telefone} - ${nomeCliente}\n\nOperador: ${operador}`;
        } else {
            textoGerado.textContent = 'Preencha todos os campos.';
        }
    }

    copiarButton.addEventListener('click', function () {
        gerarTexto();
        const texto = textoGerado.textContent;
        navigator.clipboard.writeText(texto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    });

    limparButton.addEventListener('click', function () {
        problemaInput.value = '';
        telefoneInput.value = '';
        operadorInput.value = '';
        textoGerado.textContent = '';
        // Novos campos
        nomeClienteInput.value = '';
        cpfCnpjInput.value = '';
    });

    // Event listener para o botão de copiar CPF/CNPJ
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
});