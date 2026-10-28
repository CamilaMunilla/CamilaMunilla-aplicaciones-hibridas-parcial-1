import { Router } from "express"
import * as controller from "../controllers/admin.controller.js"

const router = Router()

router.get("/admin", controller.admin)

export default router
