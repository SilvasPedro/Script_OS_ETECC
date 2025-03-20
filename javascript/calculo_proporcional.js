document.addEventListener('DOMContentLoaded', function() {
    const planoAtualSelect = document.getElementById('plano_atual');
    const novoPlanoSelect = document.getElementById('novo_plano');
    const vencimentoInput = document.getElementById('vencimento');

    const valorPorDia = document.getElementById('valor_por_dia');
    const diferencaValorDia = document.getElementById('diferenca_valor_dia');
    const diasFaltantes = document.getElementById('dias_faltantes');
    const valorProporcional = document.getElementById('valor_proporcional');

    const valoresPlanos = {
        "100": 79.90,
        "600": 99.90,
        "800": 129.90,
        "1000": 149.90
    };

    function calcularProporcional() {
        const planoAtual = planoAtualSelect.value;
        const novoPlano = novoPlanoSelect.value;
        const vencimento = new Date(vencimentoInput.value);
        const hoje = new Date();

        // Impedir calculo caso a data de vencimento seja menor que a data atual.
        if (vencimento < hoje) {
            alert("A data de vencimento não pode ser anterior à data atual.");
            limparCampos();
            return;
        }

        const valorPlanoAtual = valoresPlanos[planoAtual];
        const valorNovoPlano = valoresPlanos[novoPlano];

        const valorDiaPlanoAtual = valorPlanoAtual / 30; // Considerando meses com 30 dias para simplificar
        const valorDiaNovoPlano = valorNovoPlano / 30;

        const diferencaValorDiaPlanos = valorDiaNovoPlano - valorDiaPlanoAtual;

        const diffEmMs = vencimento.getTime() - hoje.getTime();
        const diffEmDias = Math.ceil(diffEmMs / (1000 * 3600 * 24));

        const proporcional = diferencaValorDiaPlanos * diffEmDias;

        valorPorDia.textContent = `Valor por dia do plano atual: R$ ${valorDiaPlanoAtual.toFixed(2)}`;
        diferencaValorDia.textContent = `Diferença de valor por dia: R$ ${diferencaValorDiaPlanos.toFixed(2)}`;
        diasFaltantes.textContent = `Dias faltantes para o vencimento: ${diffEmDias}`;
        valorProporcional.textContent = `Valor proporcional a ser cobrado: R$ ${proporcional.toFixed(2)}`;
    }

    function limparCampos() {
        valorPorDia.textContent = "";
        diferencaValorDia.textContent = "";
        diasFaltantes.textContent = "";
        valorProporcional.textContent = "";
    }

    // Adiciona event listeners para os campos de entrada
    planoAtualSelect.addEventListener('change', calcularProporcional);
    novoPlanoSelect.addEventListener('change', calcularProporcional);
    vencimentoInput.addEventListener('change', calcularProporcional);
});