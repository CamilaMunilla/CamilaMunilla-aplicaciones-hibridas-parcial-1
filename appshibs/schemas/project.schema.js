import { ObjectId } from "mongodb"
import { SECTION_SLUGS } from "../utils/sections.js"

const isUrl = (value) => {
    if (typeof value !== "string") return false
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0
export function validateProject(data = {}, { partial = false } = {}) {
    const errors = []
    const value = {}

    const has = (field) => data[field] !== undefined
    const required = (field) => {
        if (!partial && !has(field)) errors.push(`El campo "${field}" es obligatorio`)
        return has(field)
    }

    if (required("name")) {
        if (!isNonEmptyString(data.name)) errors.push(`"name" debe ser un texto no vacío`)
        else value.name = data.name.trim()
    }

    if (required("description")) {
        if (!isNonEmptyString(data.description)) errors.push(`"description" debe ser un texto no vacío`)
        else value.description = data.description.trim()
    }

    if (required("link")) {
        if (!isUrl(data.link)) errors.push(`"link" debe ser una URL válida (http/https)`)
        else value.link = data.link.trim()
    }

    if (required("img")) {
        if (!isUrl(data.img)) errors.push(`"img" debe ser una URL válida (http/https)`)
        else value.img = data.img.trim()
    }

    if (required("technologies")) {
        const techs = Array.isArray(data.technologies)
            ? data.technologies
            : typeof data.technologies === "string"
                ? data.technologies.split(",")
                : null

        if (!techs || !techs.every((t) => typeof t === "string")) {
            errors.push(`"technologies" debe ser un array de textos`)
        } else {
            const clean = techs.map((t) => t.trim()).filter(Boolean)
            if (clean.length === 0) errors.push(`"technologies" debe tener al menos una tecnología`)
            else value.technologies = clean
        }
    }

    if (required("section")) {
        if (!SECTION_SLUGS.includes(data.section)) errors.push(`"section" debe ser una de: ${SECTION_SLUGS.join(", ")}`)
        else value.section = data.section
    }

    if (required("client_id")) {
        if (!ObjectId.isValid(data.client_id)) errors.push(`"client_id" no es un ID válido`)
        else value.client_id = new ObjectId(data.client_id)
    }

    if (partial && Object.keys(value).length === 0 && errors.length === 0) {
        errors.push("No se envió ningún campo válido para modificar")
    }

    return { errors, value }
}
