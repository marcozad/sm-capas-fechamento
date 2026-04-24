// Função para formatar valores em Real
function formatarReal(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Processar JSON e enviar para Netlify Forms
document.getElementById('processBtn').addEventListener('click', async function() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const preview = document.getElementById('preview');
    
    if (!jsonInput) {
        alert('❌ Cole o JSON primeiro!');
        return;
    }
    
    try {
        // Parse do JSON
        const dados = JSON.parse(jsonInput);
        
        // Validar campos obrigatórios
        if (!dados.data || dados.total_liquido === undefined) {
            alert('❌ JSON inválido! Faltam campos obrigatórios (data, total_liquido)');
            return;
        }
        
        // Mostrar preview
        mostrarPreview(dados);
        
        // Preencher o formulário oculto
        const form = document.querySelector('form[name="fechamento"]');
        form.querySelector('input[name="data"]').value = dados.data;
        form.querySelector('input[name="total_liquido"]').value = dados.total_liquido;
        form.querySelector('input[name="dinheiro"]').value = dados.dinheiro;
        form.querySelector('input[name="cartao_bruto"]').value = dados.cartao_bruto;
        form.querySelector('input[name="cartao_liquido"]').value = dados.cartao_liquido;
        form.querySelector('input[name="pix"]').value = dados.pix;
        form.querySelector('input[name="aparelhos"]').value = dados.aparelhos;
        form.querySelector('input[name="assistencia"]').value = dados.assistencia;
        form.querySelector('input[name="custo"]').value = dados.custo;
        form.querySelector('input[name="lucro"]').value = dados.lucro;
        form.querySelector('input[name="compras"]').value = dados.compras || 0;
        form.querySelector('input[name="gastos"]').value = dados.gastos || 0;
        form.querySelector('input[name="devolucao"]').value = dados.devolucao || 0;
        
        // Enviar o formulário
        const formData = new FormData(form);
        
        const response = await fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        });
        
        if (response.ok) {
            alert('✅ Fechamento salvo com sucesso!');
            document.getElementById('jsonInput').value = '';
            preview.classList.add('hidden');
            
            // Adicionar à lista
            adicionarFechamentoNaLista(dados);
        } else {
            throw new Error('Erro ao enviar: ' + response.status);
        }
        
    } catch (error) {
        alert('❌ Erro: ' + error.message + '\n\nVerifique se o JSON está formatado corretamente.');
        console.error('Erro completo:', error);
    }
});

// Mostrar preview dos dados
function mostrarPreview(dados) {
    const preview = document.getElementById('preview');
    
    preview.innerHTML = `
        <h3>📋 Preview do Fechamento</h3>
        <div class="preview-grid">
            <div class="preview-item">
                <span class="preview-label">Data:</span>
                <span class="preview-value">${dados.data}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Total Líquido:</span>
                <span class="preview-value">${formatarReal(dados.total_liquido)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Dinheiro:</span>
                <span class="preview-value">${formatarReal(dados.dinheiro)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Cartão Bruto:</span>
                <span class="preview-value">${formatarReal(dados.cartao_bruto)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Cartão Líquido:</span>
                <span class="preview-value">${formatarReal(dados.cartao_liquido)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Pix:</span>
                <span class="preview-value">${formatarReal(dados.pix)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Aparelhos:</span>
                <span class="preview-value">${formatarReal(dados.aparelhos)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Assistência:</span>
                <span class="preview-value">${formatarReal(dados.assistencia)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Custo:</span>
                <span class="preview-value">${formatarReal(dados.custo)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">💰 Lucro:</span>
                <span class="preview-value" style="color: #28a745; font-size: 1.2em;">${formatarReal(dados.lucro)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Compras:</span>
                <span class="preview-value">${formatarReal(dados.compras || 0)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Gastos:</span>
                <span class="preview-value">${formatarReal(dados.gastos || 0)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Devolução:</span>
                <span class="preview-value">${formatarReal(dados.devolucao || 0)}</span>
            </div>
        </div>
    `;
    
    preview.classList.remove('hidden');
}

// Adicionar fechamento na lista
function adicionarFechamentoNaLista(dados) {
    const lista = document.getElementById('fechamentosList');
    
    // Remover mensagem de vazio
    const emptyState = lista.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }
    
    const card = document.createElement('div');
    card.className = 'fechamento-card';
    card.innerHTML = `
        <div class="fechamento-header">
            <span class="fechamento-data">📅 ${dados.data}</span>
            <span class="fechamento-lucro">💰 ${formatarReal(dados.lucro)}</span>
        </div>
        <div class="fechamento-details">
            <div class="detail-item">
                <span class="detail-label">Total Líquido:</span>
                <span class="detail-value">${formatarReal(dados.total_liquido)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Dinheiro:</span>
                <span class="detail-value">${formatarReal(dados.dinheiro)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Cartão:</span>
                <span class="detail-value">${formatarReal(dados.cartao_liquido)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Pix:</span>
                <span class="detail-value">${formatarReal(dados.pix)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Aparelhos:</span>
                <span class="detail-value">${formatarReal(dados.aparelhos)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Assistência:</span>
                <span class="detail-value">${formatarReal(dados.assistencia)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Custo:</span>
                <span class="detail-value">${formatarReal(dados.custo)}</span>
            </div>
        </div>
    `;
    
    lista.insertBefore(card, lista.firstChild);
}

// Carregar fechamentos salvos
window.addEventListener('load', function() {
    console.log('Sistema SM Capas carregado!');
});
