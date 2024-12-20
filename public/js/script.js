function agregarIngrediente() {
    const input = document.getElementById('ingrediente');
    const ingrediente = input.value.trim();
    
    if (ingrediente) {
        const lista = document.getElementById('lista-ingredientes');
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeInLeft';
        li.textContent = ingrediente;
        lista.appendChild(li);
        input.value = '';
    }
}


function obtenerIngredientes() {
    return Array.from(document.getElementById('lista-ingredientes').children)
        .map(li => li.textContent.trim());
}