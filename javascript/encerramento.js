document.addEventListener('DOMContentLoaded', function() {
    const problemaInput = document.getElementById('problema');
    const procedimentosInput = document.getElementById('procedimentos');
    const solucaoInput = document.getElementById('solucao');
    const copiarButton = document.getElementById('copiar');
    const limparButton = document.getElementById('limpar');
    const textoGerado = document.getElementById('texto-gerado');

    function gerarTexto() {
        const problema = problemaInput.value;
        const procedimentos = procedimentosInput.value;
        const solucao = solucaoInput.value;

        if (problema && procedimentos && solucao) {
            textoGerado.textContent = `Problema relatado: ${problema}\n\nProcedimentos realizados:\n${procedimentos}\n\nSolução: ${solucao}`;
        } else {
            textoGerado.textContent = 'Preencha todos os campos.';
        }
    }

    copiarButton.addEventListener('click', function() {
        gerarTexto();
        const texto = textoGerado.textContent;
        navigator.clipboard.writeText(texto).then(() => {
            alert('Texto copiado para a área de transferência!');
        });
    });

    limparButton.addEventListener('click', function() {
        problemaInput.value = '';
        procedimentosInput.value = '';
        solucaoInput.value = '';
        textoGerado.textContent = '';
    });
});