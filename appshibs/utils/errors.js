export class ValidationError extends Error {
    constructor(errors) {
        super("Datos inválidos")
        this.status = 400
        this.errors = errors
    }
}

export class NotFoundError extends Error {
    constructor(message = "Recurso no encontrado") {
        super(message)
        this.status = 404
    }
}
