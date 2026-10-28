import * as service from "../services/projects.service.js"
import * as clientsService from "../services/clients.service.js"
import * as views from "../views/projects.view.js"
import { getSection } from "../utils/sections.js"

export function home(req, res) {
    res.send(views.homePage())
}

export async function getProjects(req, res) {
    const projects = await service.getProjects()
    res.send(views.projectsListPage(projects))
}

export async function getProjectsBySection(req, res) {
    const { section } = req.params
    if (!getSection(section)) return res.status(404).send(views.notFoundPage("La sección no existe"))

    const projects = await service.getProjects({ section })
    res.send(views.projectsListPage(projects, section))
}

export async function getProjectById(req, res) {
    const project = await service.getProjectById(req.params.id)
    if (!project) return res.status(404).send(views.notFoundPage("Proyecto no encontrado"))
    res.send(views.projectDetailPage(project))
}

export async function createProjectForm(req, res) {
    const clients = await clientsService.getClients()
    res.send(views.projectFormPage({ clients, action: "/projects/new", title: "Nuevo proyecto" }))
}

export async function createProject(req, res) {
    try {
        const project = await service.createProject(req.body)
        res.redirect(`/projects/${project._id}`)
    } catch (err) {
        if (err.status !== 400) throw err
        const clients = await clientsService.getClients()
        res.status(400).send(views.projectFormPage({
            project: req.body, clients, errors: err.errors, action: "/projects/new", title: "Nuevo proyecto",
        }))
    }
}

export async function editProjectForm(req, res) {
    const project = await service.getProjectById(req.params.id)
    if (!project) return res.status(404).send(views.notFoundPage("Proyecto no encontrado"))

    const clients = await clientsService.getClients()
    res.send(views.projectFormPage({
        project, clients, action: `/projects/${project._id}/edit`, title: "Editar proyecto",
    }))
}

export async function editProject(req, res) {
    const { id } = req.params
    try {
        await service.updateProject(id, req.body, { partial: false })
        res.redirect(`/projects/${id}`)
    } catch (err) {
        if (err.status === 404) return res.status(404).send(views.notFoundPage(err.message))
        if (err.status !== 400) throw err
        const clients = await clientsService.getClients()
        res.status(400).send(views.projectFormPage({
            project: req.body, clients, errors: err.errors, action: `/projects/${id}/edit`, title: "Editar proyecto",
        }))
    }
}

export async function deleteProjectForm(req, res) {
    const project = await service.getProjectById(req.params.id)
    if (!project) return res.status(404).send(views.notFoundPage("Proyecto no encontrado"))
    res.send(views.projectDeletePage(project))
}

export async function deleteProject(req, res) {
    try {
        await service.deleteProject(req.params.id)
        res.redirect("/admin")
    } catch (err) {
        if (err.status !== 404) throw err
        res.status(404).send(views.notFoundPage(err.message))
    }
}
