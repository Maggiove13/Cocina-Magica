const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai');

// Configuración
dotenv.config();
const app = express();
const PORT = 3001;

// Configurar Cohere
const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});


// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MAX_INGREDIENTES = 10;

//Funciones Controllers
function limpiarJSON(texto) {
    try {
        const jsonMatch = texto.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        return null;
    }
}


function validarReceta(receta) {
    const camposRequeridos = [
        'nombre', 'tiempo_preparacion', 'dificultad', 'porciones', 
        'ingredientes', 'pasos', 'valor_nutricional', 'tips'
    ];
    
    return camposRequeridos.every(campo => 
        receta.hasOwnProperty(campo) && 
        (!Array.isArray(receta[campo]) || receta[campo].length > 0)
    );
}


// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Generar receta con IA
app.post('/generar_receta', async (req, res) => {
    try {
        const ingredientesOriginales = req.body.ingredientes || [];
        const preferencias = req.body.preferencias || '';

        const ingredientes = [...new Set(
            ingredientesOriginales
                .map(ingrediente => ingrediente.trim().toUpperCase())
                .filter(ingrediente => ingrediente !== '')
        )];

        if (ingredientes.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Debe proporcionar al menos un ingrediente'
            });
        }

        if (ingredientes.length > MAX_INGREDIENTES) {
            return res.status(400).json({
                success: false,
                error: `Máximo ${MAX_INGREDIENTES} ingredientes permitidos`
            });
        }

        const prompt = `Como chef profesional, crea una receta usando SOLO estos ingredientes: ${ingredientes.join(', ')}.
La receta debe ser fácil de seguir para un principiante y entrega las instrucciones en idioma español.
${preferencias ? `Consideraciones especiales: ${preferencias}` : ''}

INSTRUCCIONES:
- La receta debe ser práctica y realizable
- Incluye cantidades específicas
- Proporciona instrucciones paso a paso claras
- Incluye tips útiles para principiantes

FORMATO JSON REQUERIDO:
{
    "nombre": "nombre corto y descriptivo",
    "tiempo_preparacion": "XX minutos",
    "dificultad": "fácil/media/difícil",
    "porciones": "número de porciones",
    "ingredientes": [
        "ingrediente 1 con cantidad exacta",
        "ingrediente 2 con cantidad exacta"
    ],
    "pasos": [
        "paso 1 detallado",
        "paso 2 detallado"
    ],
    "valor_nutricional": {
        "calorias": "cantidad aproximada",
        "proteinas": "gramos",
        "carbohidratos": "gramos",
        "grasas": "gramos"
    },
    "tips": [
        "consejo práctico 1",
        "consejo práctico 2"
    ]
}`;

        const response = await cohere.generate({
            model: 'command',
            prompt: prompt,
            max_tokens: 2000,
            temperature: 0.7,
            k: 0,
            stop_sequences: [],
            return_likelihoods: 'NONE'
        });

        if (!response.generations || response.generations.length === 0) {
            return res.status(500).json({
                success: false,
                error: 'No se recibió respuesta de Cohere'
            });
        }

        const recetaGenerada = limpiarJSON(response.generations[0].text);
        
        if (!recetaGenerada) {
            return res.status(500).json({
                success: false,
                error: 'No se pudo procesar la respuesta como JSON'
            });
        }

        if (!validarReceta(recetaGenerada)) {
            return res.status(500).json({
                success: false,
                error: 'La receta generada no contiene todos los campos requeridos'
            });
        }

        res.json({
            success: true,
            receta: recetaGenerada
        });

    } catch (error) {
        console.error('Error en generarReceta:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});