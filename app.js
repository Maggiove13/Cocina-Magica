const express = require('express');
const path = require('path');
const dotenv = require('dotenv');


// Configuración
dotenv.config();
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));





app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});