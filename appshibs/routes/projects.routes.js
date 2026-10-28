import { Router } from "express"
import * as controller from "../controllers/projects.controller.js"

const router = Router()

router.get("/", controller.home)

router.get("/projects", controller.getProjects)
router.get("/projects/section/:section", controller.getProjectsBySection)

router.get("/projects/new", controller.createProjectForm)
router.post("/projects/new", controller.createProject)

router.get("/projects/:id", controller.getProjectById)

router.get("/projects/:id/edit", controller.editProjectForm)
router.post("/projects/:id/edit", controller.editProject)

router.get("/projects/:id/delete", controller.deleteProjectForm)
router.post("/projects/:id/delete", controller.deleteProject)

export default router
