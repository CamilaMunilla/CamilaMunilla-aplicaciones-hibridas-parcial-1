import { SECTIONS } from "../utils/sections.js"
export function escape(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

export function sectionsMenu(active = "") {
    const items = SECTIONS.map((s) => `
        <li><a href="/projects/section/${s.slug}" class="${s.slug === active ? "active" : ""}">${s.name}</a></li>`).join("")

    return `
    <nav class="sections">
        <ul>
            <li><a href="/projects" class="${active === "all" ? "active" : ""}">Todos</a></li>${items}
        </ul>
    </nav>`
}

export function errorsList(errors = []) {
    if (!errors.length) return ""
    return `<div class="alert"><ul>${errors.map((e) => `<li>${escape(e)}</li>`).join("")}</ul></div>`
}

export function createPage(title, content) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escape(title)} | Portfolio</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <header class="topbar">
        <a href="/" class="brand">Portfolio</a>
        <nav>
            <a href="/projects">Proyectos</a>
            <a href="/clients">Clientes</a>
            <a href="/admin" class="btn">Administrar</a>
        </nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>Parcial 1 · Aplicaciones Híbridas</footer>
</body>
</html>`
}
