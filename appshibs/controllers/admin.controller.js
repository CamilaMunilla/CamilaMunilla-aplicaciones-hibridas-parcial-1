import * as projectsService from "../services/projects.service.js"
import * as clientsService from "../services/clients.service.js"
import { adminPage } from "../views/admin.view.js"

export async function admin(req, res) {
    const [projects, clients] = await Promise.all([
        projectsService.getProjects(),
        clientsService.getClientsWithProjectCount(),
    ])
    res.send(adminPage(projects, clients))
}
