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


async function generarReceta() {
    try {
        const ingredientes = obtenerIngredientes();
        if (ingredientes.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: '¡Ups!',
                text: 'Por favor, agrega al menos un ingrediente'
            });
            return;
        }

        const loadingMessages = [
            'Consultando al chef mágico... ',
            'Mezclando ingredientes... ',
            'Añadiendo un toque de magia... ',
            'Probando el sabor... '
        ];
        let messageIndex = 0;
        const loadingElement = document.getElementById('loading');
        
        loadingElement.classList.remove('d-none');
        document.getElementById('resultado-receta').classList.remove('d-none');
        
        const messageInterval = setInterval(() => {
            loadingElement.innerHTML = `
                <div class="text-center my-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Generando...</span>
                    </div>
                    <p class="mt-2">${loadingMessages[messageIndex]}</p>
                </div>
            `;
            messageIndex = (messageIndex + 1) % loadingMessages.length;
        }, 2000);

        const response = await fetch('/generar_receta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ingredientes: ingredientes,
                preferencias: document.getElementById('preferencias').value
            })
        });

        clearInterval(messageInterval);

        const data = await response.json();
        if (data.success) {
            mostrarReceta(data.receta);
            document.getElementById('lista-ingredientes').innerHTML = '';
            document.getElementById('ingrediente').value = '';
            document.getElementById('preferencias').value = '';
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Hubo un error al generar la receta'
        });
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}