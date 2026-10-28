import { ObjectId } from "mongodb"
import { projectsCollection } from "../db/mongo.js"
import { validateProject } from "../schemas/project.schema.js"
import { clientExists } from "./clients.service.js"
import { SECTION_SLUGS } from "../utils/sections.js"
import { ValidationError, NotFoundError } from "../utils/errors.js"
function buildFilter({ section, technology, client_id } = {}) {
    const filter = {}

    if (section !== undefined && section !== "") {
        if (!SECTION_SLUGS.includes(section)) {
            throw new ValidationError([`"section" debe ser una de: ${SECTION_SLUGS.join(", ")}`])
        }
        filter.section = section
    }

    if (technology !== undefined && String(technology).trim() !== "") {
        const escaped = String(technology).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        filter.technologies = { $regex: `^${escaped}$`, $options: "i" }
    }

    if (client_id !== undefined) {
        if (!ObjectId.isValid(client_id)) throw new ValidationError([`"client_id" no es un ID válido`])
        filter.client_id = new ObjectId(client_id)
    }

    return filter
}

export async function getProjects(query = {}) {
    return projectsCollection.find(buildFilter(query)).sort({ name: 1 }).toArray()
}
export async function getProjectById(id) {
    if (!ObjectId.isValid(id)) return null

    const [project] = await projectsCollection.aggregate([
        { $match: { _id: new ObjectId(id) } },
        { $lookup: { from: "Clients", localField: "client_id", foreignField: "_id", as: "client" } },
        { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
    ]).toArray()

    return project ?? null
}

export async function createProject(data) {
    const { errors, value } = validateProject(data)
    if (errors.length) throw new ValidationError(errors)

    if (!(await clientExists(value.client_id))) {
        throw new ValidationError(["El cliente indicado en \"client_id\" no existe"])
    }

    const project = { ...value, created_at: new Date() }
    const result = await projectsCollection.insertOne(project)
    return { _id: result.insertedId, ...project }
}
export async function updateProject(id, data, { partial = true } = {}) {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Proyecto no encontrado")

    const { errors, value } = validateProject(data, { partial })
    if (errors.length) throw new ValidationError(errors)

    if (value.client_id && !(await clientExists(value.client_id))) {
        throw new ValidationError(["El cliente indicado en \"client_id\" no existe"])
    }

    const updated = await projectsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...value, updated_at: new Date() } },
        { returnDocument: "after" }
    )
    if (!updated) throw new NotFoundError("Proyecto no encontrado")
    return updated
}

export async function deleteProject(id) {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Proyecto no encontrado")

    const deleted = await projectsCollection.findOneAndDelete({ _id: new ObjectId(id) })
    if (!deleted) throw new NotFoundError("Proyecto no encontrado")
    return deleted
}
