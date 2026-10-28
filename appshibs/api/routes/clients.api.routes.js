import { Router } from "express"
import * as controller from "../controllers/clients.api.controller.js"

const router = Router()

router.get("/clients", controller.getClients)
router.get("/clients/:id", controller.getClientById)
router.post("/clients", controller.createClient)
router.patch("/clients/:id", controller.updateClient)
router.delete("/clients/:id", controller.deleteClient)
router.get("/clients/:id/projects", controller.getClientProjects)
router.post("/clients/:id/projects", controller.createClientProject)

export default router
