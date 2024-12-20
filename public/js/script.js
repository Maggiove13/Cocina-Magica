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


function mostrarReceta(receta) {
    if (!receta || !receta.nombre || !receta.ingredientes || !receta.pasos || !receta.valor_nutricional || !receta.tips) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La receta generada está incompleta'
        });
        return;
    }

    const resultadoReceta = document.getElementById('resultado-receta');
    resultadoReceta.classList.remove('d-none');

    document.getElementById('receta-titulo').textContent = receta.nombre;
    document.getElementById('tiempo-preparacion').textContent = `Tiempo: ${receta.tiempo_preparacion}`;
    document.getElementById('dificultad').textContent = `Dificultad: ${receta.dificultad}`;
    document.getElementById('porciones').textContent = `Porciones: ${receta.porciones}`;
    document.getElementById('calorias').textContent = `Calorías: ${receta.valor_nutricional.calorias}`;

    document.getElementById('receta-ingredientes').innerHTML = receta.ingredientes
        .map(ingrediente => `<li class="list-group-item">${ingrediente}</li>`)
        .join('');

    document.getElementById('valor-nutricional').innerHTML = `
        <p>Proteínas: ${receta.valor_nutricional.proteinas}</p>
        <p>Carbohidratos: ${receta.valor_nutricional.carbohidratos}</p>
        <p>Grasas: ${receta.valor_nutricional.grasas}</p>
    `;

    document.getElementById('receta-pasos').innerHTML = receta.pasos
        .map(paso => `<li>${paso}</li>`)
        .join('');

    document.getElementById('receta-tips').innerHTML = receta.tips
        .map(tip => `<li>${tip}</li>`)
        .join('');
}