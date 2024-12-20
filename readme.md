# CocineroVirtual 🧙‍♂️

CocineroVirtual es una aplicación web que utiliza inteligencia artificial para generar recetas personalizadas basadas en los ingredientes que tienes disponibles. La aplicación utiliza la API de Cohere para generar recetas creativas y detalladas.

## Características ✨

- Generación de recetas basadas en ingredientes disponibles
- Preferencias personalizables (vegetariano, sin gluten, etc.)
- Información nutricional detallada
- Pasos de preparación paso a paso
- Tips y consejos de cocina
- Interfaz responsiva y amigable

## Requisitos Previos 📋

- Node.js (v14 o superior)
- NPM (v6 o superior)
- Una cuenta en Cohere y una API key

## Instalación 🚀

1. Clona el repositorio o descarga el código fuente:
```bash
git clone https://github.com/tuusuario/cocinero-virtual.git
cd cocinero-virtual
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con tu API key de Cohere:
```env
COHERE_API_KEY=tu_api_key_aqui
```

## Configuración ⚙️

1. La aplicación está configurada para ejecutarse en el puerto 3001 por defecto. Puedes modificar esto en el archivo `app.js`:
```javascript
const PORT = 3001;
```

## Uso 💫

1. Inicia el servidor:
```bash
node app.js
```

2. Abre tu navegador y visita:
```
http://localhost:3001
```

3. Para generar una receta:
   - Ingresa los ingredientes que tienes disponibles
   - (Opcional) Añade preferencias especiales
   - Haz clic en "¡Crear Receta Mágica!"

## Estructura del Proyecto 📁

```
project/
├── app.js              # Servidor principal
├── public/             # Archivos estáticos
│   ├── css/
│   │   └── styles.css  # Estilos de la aplicación
│   ├── js/
│   │   └── script.js     # JavaScript del cliente
│   └── index.html      # Página principal
└── .env               # Variables de entorno
```

## API Endpoints 🛠️

### POST /generar_receta
Genera una nueva receta basada en los ingredientes proporcionados.

**Cuerpo de la solicitud:**
```json
{
    "ingredientes": ["arroz", "pollo", "zanahoria"],
    "preferencias": "sin gluten"
}
```

**Respuesta exitosa:**
```json
{
    "success": true,
    "receta": {
        "nombre": "Nombre de la receta",
        "tiempo_preparacion": "30 minutos",
        "dificultad": "fácil",
        "porciones": "4",
        "ingredientes": [...],
        "pasos": [...],
        "valor_nutricional": {...},
        "tips": [...]
    }
}
```

## Personalización 🎨

### Estilos
Los estilos principales se encuentran en `public/css/styles.css`. La aplicación utiliza variables CSS para los colores principales:

```css
:root {
    --primary-color: #6a1b9a;
    --secondary-color: #9c27b0;
    --accent-color: #e1bee7;
    --background-color: #f3e5f5;
    --text-color: #4a148c;
}
```

### Límites y Constantes
Puedes modificar el límite máximo de ingredientes en `app.js`:
```javascript
const MAX_INGREDIENTES = 20;
```

## Tecnologías Utilizadas 🛠️

- Express.js - Framework web
- Cohere API - Generación de recetas con IA
- Bootstrap 5 - Framework CSS
- Font Awesome - Iconos
- SweetAlert2 - Notificaciones
- Animate.css - Animaciones

## Consideraciones de Seguridad 🔒

1. Nunca subas tu archivo `.env` al control de versiones

## Solución de Problemas 🔍

1. **Error: API key no válida**
   - Verifica que tu API key de Cohere sea correcta en el archivo `.env`
   - Asegúrate de que el archivo `.env` esté en la raíz del proyecto

2. **Error: No se pueden generar recetas**
   - Verifica tu conexión a internet
   - Comprueba los logs del servidor
   - Asegúrate de que Cohere esté funcionando correctamente
