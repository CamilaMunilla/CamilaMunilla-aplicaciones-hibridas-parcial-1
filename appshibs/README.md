# Parcial 1 – Aplicaciones Híbridas

Portfolio de proyectos y clientes hecho con **Express**, el **driver nativo de MongoDB** y **ECMAScript modules**. Corre en el puerto **3333**.

## Cómo levantarlo

Requisitos: Node 18+ y MongoDB corriendo en `mongodb://127.0.0.1:27017` (se puede cambiar con la variable `MONGO_URI`).

```bash
npm install
npm run seed   # opcional: carga clientes y proyectos de ejemplo
npm start      # http://localhost:3333
```

## Base de datos `AH20232CP1`

**Clients**
```js
{ _id: ObjectId(), name: "Café Aroma", photo: "https://picsum.photos/200", description: "..." }
```

**Projects**
```js
{
  _id: ObjectId(),
  name: "Aroma App",
  description: "...",
  link: "https://github.com/...",
  img: "https://picsum.photos/400/225",
  technologies: ["React Native", "Node"],
  section: "mobile",          // mobile | landing | webapp | ecommerce | game
  client_id: ObjectId()       // referencia a Clients._id
}
```

Relación uno a muchos por referencia: cada proyecto se crea para un cliente (`client_id` es obligatorio y se verifica que exista); un cliente puede no tener proyectos. Al eliminar un cliente se eliminan también sus proyectos.

Para las imágenes se usan URLs de picsum con *seed* (`https://picsum.photos/seed/<algo>/400/225`); `https://picsum.photos/400/225` devuelve una imagen distinta en cada carga.

## Páginas

| Ruta | Descripción |
| --- | --- |
| `/` | Menú de secciones |
| `/admin` | Panel de administración: alta, edición y baja de proyectos y clientes |
| `/projects` | Todos los proyectos |
| `/projects/section/:section` | Proyectos de una sección |
| `/projects/:id` | Detalle de un proyecto |
| `/projects/new` | Alta |
| `/projects/:id/edit` | Modificación |
| `/projects/:id/delete` | Baja |
| `/clients`, `/clients/:id` | Listado y detalle (con sus proyectos) de clientes |
| `/clients/new`, `/clients/:id/edit`, `/clients/:id/delete` | Alta, modificación y baja de clientes |

## API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/projects?section=&technology=` | Todos los proyectos, con filtro opcional por sección y/o tecnología |
| GET | `/api/projects/:id` | Un proyecto (incluye datos del cliente) |
| POST | `/api/projects` | Crear proyecto (requiere `client_id`) |
| PUT | `/api/projects/:id` | Modificar proyecto (todos los campos) |
| PATCH | `/api/projects/:id` | Modificar proyecto (solo los campos enviados) |
| DELETE | `/api/projects/:id` | Eliminar proyecto |
| GET | `/api/clients` | Todos los clientes |
| GET | `/api/clients/:id` | Un cliente |
| POST | `/api/clients` | Crear cliente |
| PATCH | `/api/clients/:id` | Modificar cliente |
| DELETE | `/api/clients/:id` | Eliminar cliente (y sus proyectos) |
| GET | `/api/clients/:id/projects` | Proyectos de un cliente |
| POST | `/api/clients/:id/projects` | Crear un proyecto para ese cliente |

Los datos recibidos se validan en `schemas/`: se exigen los campos obligatorios, se verifican tipos/URLs/sección y se descarta cualquier campo que el sistema no use. Los errores devuelven `400` con el detalle.

Ejemplo:
```bash
curl -X POST http://localhost:3333/api/clients -H "Content-Type: application/json" \
  -d '{"name":"Nuevo cliente","photo":"https://picsum.photos/200","description":"Descripción"}'
```

## Estructura

```
index.js              # app Express, puerto 3333
db/                   # conexión MongoDB (driver nativo)
schemas/              # validación de los datos recibidos
services/             # acceso a datos / lógica
controllers/          # controllers de las páginas
views/                # generación de HTML dinámico
routes/               # rutas de las páginas
api/controllers/      # controllers de la API (JSON)
api/routes/           # rutas de la API
scripts/seed.js       # datos de ejemplo
```
