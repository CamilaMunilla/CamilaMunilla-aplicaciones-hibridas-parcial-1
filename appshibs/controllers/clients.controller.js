import * as service from "../services/clients.service.js"
import * as views from "../views/clients.view.js"
import { notFoundPage } from "../views/projects.view.js"

export async function getClients(req, res) {
    res.send(views.clientsListPage(await service.getClients()))
}

export async function getClientById(req, res) {
    try {
        const { client, projects } = await service.getClientProjects(req.params.id)
        res.send(views.clientDetailPage(client, projects))
    } catch (err) {
        if (err.status !== 404) throw err
        res.status(404).send(notFoundPage(err.message))
    }
}

export function createClientForm(req, res) {
    res.send(views.clientFormPage())
}

export async function createClient(req, res) {
    try {
        const client = await service.createClient(req.body)
        res.redirect(`/clients/${client._id}`)
    } catch (err) {
        if (err.status !== 400) throw err
        res.status(400).send(views.clientFormPage({ client: req.body, errors: err.errors }))
    }
}

export async function editClientForm(req, res) {
    const client = await service.getClientById(req.params.id)
    if (!client) return res.status(404).send(notFoundPage("Cliente no encontrado"))
    res.send(views.clientFormPage({ client, action: `/clients/${client._id}/edit`, title: "Editar cliente" }))
}

export async function editClient(req, res) {
    const { id } = req.params
    try {
        await service.updateClient(id, req.body, { partial: false })
        res.redirect(`/clients/${id}`)
    } catch (err) {
        if (err.status === 404) return res.status(404).send(notFoundPage(err.message))
        if (err.status !== 400) throw err
        res.status(400).send(views.clientFormPage({
            client: req.body, errors: err.errors, action: `/clients/${id}/edit`, title: "Editar cliente",
        }))
    }
}

export async function deleteClientForm(req, res) {
    try {
        const { client, projects } = await service.getClientProjects(req.params.id)
        res.send(views.clientDeletePage(client, projects.length))
    } catch (err) {
        if (err.status !== 404) throw err
        res.status(404).send(notFoundPage(err.message))
    }
}

export async function deleteClient(req, res) {
    try {
        await service.deleteClient(req.params.id)
        res.redirect("/admin")
    } catch (err) {
        if (err.status !== 404) throw err
        res.status(404).send(notFoundPage(err.message))
    }
}
