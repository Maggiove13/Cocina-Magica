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


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MAX_INGREDIENTES = 10;


function limpiarJSON(texto) {
    try {
        const jsonMatch = texto.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        return null;
    }
}


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});