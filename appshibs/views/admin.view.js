import { createPage, escape } from "./layout.js"
import { getSection } from "../utils/sections.js"

export function adminPage(projects, clients) {
    const clientName = Object.fromEntries(clients.map((c) => [String(c._id), c.name]))

    const projectRows = projects.map((p) => `
        <tr>
            <td><img src="${escape(p.img)}" alt=""></td>
            <td><a href="/projects/${p._id}">${escape(p.name)}</a></td>
            <td>${escape(getSection(p.section)?.name ?? p.section)}</td>
            <td>${escape(clientName[String(p.client_id)] ?? "—")}</td>
            <td class="row-actions">
                <a class="btn" href="/projects/${p._id}/edit">Editar</a>
                <a class="btn danger" href="/projects/${p._id}/delete">Eliminar</a>
            </td>
        </tr>`).join("")

    const clientRows = clients.map((c) => `
        <tr>
            <td><img src="${escape(c.photo)}" alt=""></td>
            <td><a href="/clients/${c._id}">${escape(c.name)}</a></td>
            <td>${c.projectsCount}</td>
            <td class="row-actions">
                <a class="btn" href="/clients/${c._id}/edit">Editar</a>
                <a class="btn danger" href="/clients/${c._id}/delete">Eliminar</a>
            </td>
        </tr>`).join("")

    const empty = (cols, text) => `<tr><td colspan="${cols}" class="empty">${text}</td></tr>`

    return createPage("Administrar", `
        <h1>Administrar</h1>

        <div class="heading">
            <h2>Proyectos</h2>
            <a class="btn" href="/projects/new">+ Proyecto</a>
        </div>
        <div class="table-wrap">
            <table class="admin">
                <thead><tr><th></th><th>Nombre</th><th>Sección</th><th>Cliente</th><th></th></tr></thead>
                <tbody>${projectRows || empty(5, "No hay proyectos.")}</tbody>
            </table>
        </div>

        <div class="heading">
            <h2>Clientes</h2>
            <a class="btn" href="/clients/new">+ Cliente</a>
        </div>
        <div class="table-wrap">
            <table class="admin">
                <thead><tr><th></th><th>Nombre</th><th>Proyectos</th><th></th></tr></thead>
                <tbody>${clientRows || empty(4, "No hay clientes.")}</tbody>
            </table>
        </div>`)
}
