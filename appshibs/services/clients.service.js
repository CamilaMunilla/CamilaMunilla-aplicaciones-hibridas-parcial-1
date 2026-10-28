import { ObjectId } from "mongodb"
import { clientsCollection, projectsCollection } from "../db/mongo.js"
import { validateClient } from "../schemas/client.schema.js"
import { ValidationError, NotFoundError } from "../utils/errors.js"

export async function getClients() {
    return clientsCollection.find().sort({ name: 1 }).toArray()
}

export async function getClientById(id) {
    if (!ObjectId.isValid(id)) return null
    return clientsCollection.findOne({ _id: new ObjectId(id) })
}

export async function clientExists(id) {
    if (!ObjectId.isValid(id)) return false
    const count = await clientsCollection.countDocuments({ _id: new ObjectId(id) }, { limit: 1 })
    return count > 0
}

export async function createClient(data) {
    const { errors, value } = validateClient(data)
    if (errors.length) throw new ValidationError(errors)

    const client = { ...value, created_at: new Date() }
    const result = await clientsCollection.insertOne(client)
    return { _id: result.insertedId, ...client }
}
export async function getClientProjects(id) {
    const client = await getClientById(id)
    if (!client) throw new NotFoundError("Cliente no encontrado")

    const projects = await projectsCollection.find({ client_id: client._id }).sort({ name: 1 }).toArray()
    return { client, projects }
}

export async function updateClient(id, data, { partial = true } = {}) {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Cliente no encontrado")

    const { errors, value } = validateClient(data, { partial })
    if (errors.length) throw new ValidationError(errors)

    const updated = await clientsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...value, updated_at: new Date() } },
        { returnDocument: "after" }
    )
    if (!updated) throw new NotFoundError("Cliente no encontrado")
    return updated
}
export async function deleteClient(id) {
    if (!ObjectId.isValid(id)) throw new NotFoundError("Cliente no encontrado")

    const _id = new ObjectId(id)
    const client = await clientsCollection.findOneAndDelete({ _id })
    if (!client) throw new NotFoundError("Cliente no encontrado")

    const { deletedCount } = await projectsCollection.deleteMany({ client_id: _id })
    return { client, deletedProjects: deletedCount }
}
export async function getClientsWithProjectCount() {
    return clientsCollection.aggregate([
        { $lookup: { from: "Projects", localField: "_id", foreignField: "client_id", as: "projects" } },
        { $addFields: { projectsCount: { $size: "$projects" } } },
        { $project: { projects: 0 } },
        { $sort: { name: 1 } },
    ]).toArray()
}
