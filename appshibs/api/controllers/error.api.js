export function handleApiError(res, err) {
    if (err.status) {
        return res.status(err.status).json({ error: { message: err.message, details: err.errors } })
    }
    console.error(err)
    res.status(500).json({ error: { message: "Error interno del servidor" } })
}
