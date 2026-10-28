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
export function validateClient(data = {}, { partial = false } = {}) {
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

    if (required("photo")) {
        if (!isUrl(data.photo)) errors.push(`"photo" debe ser una URL válida (http/https)`)
        else value.photo = data.photo.trim()
    }

    if (required("description")) {
        if (!isNonEmptyString(data.description)) errors.push(`"description" debe ser un texto no vacío`)
        else value.description = data.description.trim()
    }

    if (partial && Object.keys(value).length === 0 && errors.length === 0) {
        errors.push("No se envió ningún campo válido para modificar")
    }

    return { errors, value }
}
