# Proyecto Héroes y Mascotas

Este proyecto es una API REST para gestionar superhéroes y mascotas, usando Node.js, Express y MongoDB Atlas.

## Requisitos
- Node.js (v18 o superior recomendado)
- npm

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Entra a la carpeta del proyecto:
   ```bash
   cd "proyecto heroes/api-superheroes"
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución
Para iniciar el servidor:
```bash
node app.js
```

La API estará disponible en `http://localhost:3001` (o el puerto que definas en tu código).

## Estructura de carpetas
```
api-superheroes/
  app.js
  controllers/
  models/
  repositories/
  services/
  superheroes.json
  pets.json
  package.json
  ...
```

## Conexión a MongoDB
La cadena de conexión a MongoDB Atlas ya está incluida directamente en el código (`app.js`). No necesitas configurar variables de entorno para conectarte.

## Notas
- Los archivos `superheroes.json` y `pets.json` se conservan como respaldo, pero la API ya no depende de ellos.
- Todos los datos se gestionan directamente en MongoDB Atlas.

## Endpoints principales
- `/api/heroes` — CRUD de héroes
- `/api/pets` — CRUD de mascotas
- Endpoints personalizados para alimentar, pasear, dormir, etc.

---

¡Listo para usar y modificar según tus necesidades! 