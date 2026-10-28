import { Router } from "express"
import * as controller from "../controllers/clients.controller.js"

const router = Router()

router.get("/clients", controller.getClients)
router.get("/clients/new", controller.createClientForm)
router.post("/clients/new", controller.createClient)
router.get("/clients/:id", controller.getClientById)

router.get("/clients/:id/edit", controller.editClientForm)
router.post("/clients/:id/edit", controller.editClient)

router.get("/clients/:id/delete", controller.deleteClientForm)
router.post("/clients/:id/delete", controller.deleteClient)

export default router
