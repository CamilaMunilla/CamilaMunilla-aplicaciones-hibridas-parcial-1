import { Router } from "express"
import * as controller from "../controllers/projects.api.controller.js"

const router = Router()

router.get("/projects", controller.getProjects)
router.get("/projects/:id", controller.getProjectById)
router.post("/projects", controller.createProject)
router.put("/projects/:id", controller.replaceProject)
router.patch("/projects/:id", controller.updateProject)
router.delete("/projects/:id", controller.deleteProject)

export default router
