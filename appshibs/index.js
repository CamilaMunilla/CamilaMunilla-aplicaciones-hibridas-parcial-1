import express from "express"
import { connect } from "./db/mongo.js"

import ProjectsRoutes from "./routes/projects.routes.js"
import ClientsRoutes from "./routes/clients.routes.js"
import AdminRoutes from "./routes/admin.routes.js"
import ProjectsApiRoutes from "./api/routes/projects.api.routes.js"
import ClientsApiRoutes from "./api/routes/clients.api.routes.js"
import { notFoundPage } from "./views/projects.view.js"

const PORT = 3333
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use(ProjectsRoutes)
app.use(ClientsRoutes)
app.use(AdminRoutes)
app.use("/api", ProjectsApiRoutes)
app.use("/api", ClientsApiRoutes)

app.use("/api", (req, res) => res.status(404).json({ error: { message: "Endpoint no encontrado" } }))
app.use((req, res) => res.status(404).send(notFoundPage()))

app.use((err, req, res, next) => {
    console.error(err)
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: { message: "JSON inválido" } })
    }
    if (req.originalUrl.startsWith("/api")) {
        return res.status(500).json({ error: { message: "Error interno del servidor" } })
    }
    res.status(500).send("Error interno del servidor")
})

connect()
    .then(() => app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`)))
    .catch((err) => {
        console.error("No se pudo conectar a MongoDB:", err.message)
        process.exit(1)
    })
