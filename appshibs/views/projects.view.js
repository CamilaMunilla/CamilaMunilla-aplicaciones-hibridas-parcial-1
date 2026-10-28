import { createPage, escape, sectionsMenu, errorsList } from "./layout.js"
import { SECTIONS, getSection } from "../utils/sections.js"
import { randomImage } from "../utils/images.js"

function sectionName(slug) {
    return getSection(slug)?.name ?? slug
}

function projectCard(project) {
    return `
    <article class="card">
        <a href="/projects/${project._id}"><img src="${escape(project.img)}" alt="Preview de ${escape(project.name)}" loading="lazy"></a>
        <div class="card-body">
            <span class="tag">${escape(sectionName(project.section))}</span>
            <h3><a href="/projects/${project._id}">${escape(project.name)}</a></h3>
            <p>${escape(project.description)}</p>
            <ul class="techs">${project.technologies.map((t) => `<li>${escape(t)}</li>`).join("")}</ul>
            <a href="${escape(project.link)}" target="_blank" rel="noopener">Ver repositorio →</a>
        </div>
    </article>`
}

export function projectsGrid(projects) {
    if (!projects.length) return `<p class="empty">No hay proyectos para mostrar.</p>`
    return `<div class="grid">${projects.map(projectCard).join("")}</div>`
}

export function homePage() {
    const cards = SECTIONS.map((s) => `
        <a class="section-card" href="/projects/section/${s.slug}">
            <img src="https://picsum.photos/seed/${s.slug}/400/225" alt="">
            <span>${s.name}</span>
        </a>`).join("")

    return createPage("Inicio", `
        <h1>Mis proyectos</h1>
        <p>Elegí una sección para ver los proyectos que pertenecen a ella.</p>
        <div class="sections-grid">${cards}</div>`)
}

export function projectsListPage(projects, section) {
    const title = section ? sectionName(section) : "Todos los proyectos"
    return createPage(title, `
        ${sectionsMenu(section ?? "all")}
        <h1>${escape(title)}</h1>
        ${projectsGrid(projects)}`)
}

export function projectDetailPage(project) {
    const client = project.client
        ? `<p><strong>Cliente:</strong> <a href="/clients/${project.client._id}">${escape(project.client.name)}</a></p>`
        : ""

    return createPage(project.name, `
        ${sectionsMenu(project.section)}
        <article class="detail">
            <img src="${escape(project.img)}" alt="Preview de ${escape(project.name)}">
            <div>
                <span class="tag">${escape(sectionName(project.section))}</span>
                <h1>${escape(project.name)}</h1>
                <p>${escape(project.description)}</p>
                ${client}
                <p><strong>Tecnologías:</strong></p>
                <ul class="techs">${project.technologies.map((t) => `<li>${escape(t)}</li>`).join("")}</ul>
                <p><a href="${escape(project.link)}" target="_blank" rel="noopener">Ver repositorio →</a></p>
            </div>
        </article>`)
}
export function projectFormPage({ project = {}, clients = [], errors = [], action, title }) {
    const technologies = Array.isArray(project.technologies) ? project.technologies.join(", ") : project.technologies ?? ""
    const sectionOptions = SECTIONS.map((s) =>
        `<option value="${s.slug}" ${project.section === s.slug ? "selected" : ""}>${s.name}</option>`).join("")
    const clientOptions = clients.map((c) =>
        `<option value="${c._id}" ${String(project.client_id) === String(c._id) ? "selected" : ""}>${escape(c.name)}</option>`).join("")

    const noClients = clients.length
        ? ""
        : `<div class="alert">Primero tenés que <a href="/clients/new">crear un cliente</a>: cada proyecto se realiza para un cliente.</div>`

    return createPage(title, `
        <h1>${escape(title)}</h1>
        ${noClients}
        ${errorsList(errors)}
        <form method="POST" action="${action}" class="form">
            <label>Nombre <input type="text" name="name" value="${escape(project.name ?? "")}" required></label>
            <label>Descripción <textarea name="description" rows="4" required>${escape(project.description ?? "")}</textarea></label>
            <label>Tecnologías (separadas por coma) <input type="text" name="technologies" value="${escape(technologies)}" placeholder="React, Node, MongoDB" required></label>
            <label>Link al repositorio <input type="url" name="link" value="${escape(project.link ?? "")}" placeholder="https://github.com/usuario/repo" required></label>
            <label>Imagen (URL) <input type="url" name="img" value="${escape(project.img ?? randomImage(400, 225))}" required></label>
            <label>Sección
                <select name="section" required><option value="">Elegir…</option>${sectionOptions}</select>
            </label>
            <label>Cliente
                <select name="client_id" required><option value="">Elegir…</option>${clientOptions}</select>
            </label>
            <button type="submit" class="btn">Guardar</button>
        </form>`)
}

export function projectDeletePage(project) {
    return createPage("Eliminar proyecto", `
        <h1>Eliminar proyecto</h1>
        <p>¿Seguro que querés eliminar <strong>${escape(project.name)}</strong>? Esta acción no se puede deshacer.</p>
        <form method="POST" action="/projects/${project._id}/delete" class="actions">
            <button type="submit" class="btn danger">Sí, eliminar</button>
            <a class="btn secondary" href="/admin">Cancelar</a>
        </form>`)
}

export function notFoundPage(message = "Página no encontrada") {
    return createPage("No encontrado", `<h1>404</h1><p>${escape(message)}</p><p><a href="/">Volver al inicio</a></p>`)
}
