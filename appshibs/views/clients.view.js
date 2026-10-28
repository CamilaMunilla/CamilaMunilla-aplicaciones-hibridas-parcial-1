import { createPage, escape, errorsList } from "./layout.js"
import { projectsGrid } from "./projects.view.js"
import { randomImage } from "../utils/images.js"

export function clientsListPage(clients) {
    const list = clients.length
        ? `<div class="grid">${clients.map((c) => `
            <article class="card client">
                <a href="/clients/${c._id}"><img src="${escape(c.photo)}" alt="Foto de ${escape(c.name)}" loading="lazy"></a>
                <div class="card-body">
                    <h3><a href="/clients/${c._id}">${escape(c.name)}</a></h3>
                    <p>${escape(c.description)}</p>
                </div>
            </article>`).join("")}</div>`
        : `<p class="empty">Todavía no hay clientes.</p>`

    return createPage("Clientes", `
        <h1>Clientes</h1>
        ${list}`)
}

export function clientDetailPage(client, projects) {
    return createPage(client.name, `
        <article class="detail client">
            <img src="${escape(client.photo)}" alt="Foto de ${escape(client.name)}">
            <div>
                <h1>${escape(client.name)}</h1>
                <p>${escape(client.description)}</p>
            </div>
        </article>
        <h2>Proyectos realizados (${projects.length})</h2>
        ${projectsGrid(projects)}`)
}
export function clientFormPage({ client = {}, errors = [], action = "/clients/new", title = "Nuevo cliente" } = {}) {
    return createPage(title, `
        <h1>${escape(title)}</h1>
        ${errorsList(errors)}
        <form method="POST" action="${action}" class="form">
            <label>Nombre <input type="text" name="name" value="${escape(client.name ?? "")}" required></label>
            <label>Foto (URL) <input type="url" name="photo" value="${escape(client.photo ?? randomImage(200))}" required></label>
            <label>Descripción <textarea name="description" rows="4" required>${escape(client.description ?? "")}</textarea></label>
            <button type="submit" class="btn">Guardar</button>
        </form>`)
}

export function clientDeletePage(client, projectsCount) {
    const warning = projectsCount
        ? `<div class="alert">Este cliente tiene <strong>${projectsCount}</strong> proyecto(s). Se van a eliminar también, porque cada proyecto pertenece a un cliente.</div>`
        : ""

    return createPage("Eliminar cliente", `
        <h1>Eliminar cliente</h1>
        ${warning}
        <p>¿Seguro que querés eliminar a <strong>${escape(client.name)}</strong>? Esta acción no se puede deshacer.</p>
        <form method="POST" action="/clients/${client._id}/delete" class="actions">
            <button type="submit" class="btn danger">Sí, eliminar</button>
            <a class="btn secondary" href="/admin">Cancelar</a>
        </form>`)
}
