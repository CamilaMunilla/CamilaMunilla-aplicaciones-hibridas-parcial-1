import * as service from "../../services/clients.service.js"
import * as projectsService from "../../services/projects.service.js"
import { handleApiError } from "./error.api.js"
export async function getClients(req, res) {
    try {
        res.status(200).json(await service.getClients())
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function getClientById(req, res) {
    try {
        const client = await service.getClientById(req.params.id)
        if (!client) return res.status(404).json({ error: { message: "Cliente no encontrado" } })
        res.status(200).json(client)
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function createClient(req, res) {
    try {
        res.status(201).json(await service.createClient(req.body))
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function getClientProjects(req, res) {
    try {
        const { projects } = await service.getClientProjects(req.params.id)
        res.status(200).json(projects)
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function createClientProject(req, res) {
    try {
        const project = await projectsService.createProject({ ...req.body, client_id: req.params.id })
        res.status(201).json(project)
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function updateClient(req, res) {
    try {
        res.status(200).json(await service.updateClient(req.params.id, req.body, { partial: true }))
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function deleteClient(req, res) {
    try {
        res.status(200).json(await service.deleteClient(req.params.id))
    } catch (err) {
        handleApiError(res, err)
    }
}
