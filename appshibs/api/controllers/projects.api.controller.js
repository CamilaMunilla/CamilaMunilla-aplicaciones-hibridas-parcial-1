import * as service from "../../services/projects.service.js"
import { handleApiError } from "./error.api.js"
export async function getProjects(req, res) {
    try {
        const { section, technology } = req.query
        res.status(200).json(await service.getProjects({ section, technology }))
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function getProjectById(req, res) {
    try {
        const project = await service.getProjectById(req.params.id)
        if (!project) return res.status(404).json({ error: { message: "Proyecto no encontrado" } })
        res.status(200).json(project)
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function createProject(req, res) {
    try {
        res.status(201).json(await service.createProject(req.body))
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function replaceProject(req, res) {
    try {
        res.status(200).json(await service.updateProject(req.params.id, req.body, { partial: false }))
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function updateProject(req, res) {
    try {
        res.status(200).json(await service.updateProject(req.params.id, req.body, { partial: true }))
    } catch (err) {
        handleApiError(res, err)
    }
}
export async function deleteProject(req, res) {
    try {
        res.status(200).json(await service.deleteProject(req.params.id))
    } catch (err) {
        handleApiError(res, err)
    }
}
