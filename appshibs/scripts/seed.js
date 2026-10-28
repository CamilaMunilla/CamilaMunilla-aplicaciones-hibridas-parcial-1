import { client, connect, clientsCollection, projectsCollection } from "../db/mongo.js"

const img = (seed, w = 400, h = 225) => `https://picsum.photos/seed/${seed}/${w}/${h}`

const clients = [
    { name: "Café Aroma", photo: img("cafe-aroma", 200, 200), description: "Cadena de cafeterías de especialidad en Buenos Aires." },
    { name: "FitLife", photo: img("fitlife", 200, 200), description: "Red de gimnasios que busca digitalizar la experiencia de sus socios." },
    { name: "Pixel Studio", photo: img("pixel-studio", 200, 200), description: "Estudio independiente de videojuegos." },
    { name: "Librería Austral", photo: img("libreria-austral", 200, 200), description: "Librería con más de 30 años de historia, todavía sin proyectos." },
]

async function seed() {
    await connect()

    await projectsCollection.deleteMany({})
    await clientsCollection.deleteMany({})

    const { insertedIds } = await clientsCollection.insertMany(clients.map((c) => ({ ...c, created_at: new Date() })))
    const [cafe, fit, pixel] = Object.values(insertedIds)

    const projects = [
        { name: "Aroma App", description: "App para pedir café por adelantado y sumar puntos.", technologies: ["React Native", "Expo", "Node"], section: "mobile", client_id: cafe },
        { name: "FitLife Tracker", description: "Seguimiento de rutinas y reservas de clases.", technologies: ["Flutter", "Firebase"], section: "mobile", client_id: fit },
        { name: "Aroma Landing", description: "Landing para el lanzamiento de la nueva sucursal.", technologies: ["HTML", "CSS", "JavaScript"], section: "landing", client_id: cafe },
        { name: "FitLife Promo", description: "Landing de la campaña de verano con formulario de contacto.", technologies: ["Astro", "Tailwind"], section: "landing", client_id: fit },
        { name: "Panel de socios", description: "Web app para administrar socios, cuotas y asistencias.", technologies: ["Vue", "Express", "MongoDB"], section: "webapp", client_id: fit },
        { name: "Gestor de stock", description: "Sistema interno de stock de insumos por sucursal.", technologies: ["React", "Node", "MongoDB"], section: "webapp", client_id: cafe },
        { name: "Aroma Shop", description: "Tienda online de café en grano y accesorios.", technologies: ["Next.js", "Stripe", "MongoDB"], section: "ecommerce", client_id: cafe },
        { name: "FitStore", description: "E-commerce de suplementos y ropa deportiva.", technologies: ["PHP", "Laravel", "Vue"], section: "ecommerce", client_id: fit },
        { name: "Neon Runner", description: "Endless runner con estética synthwave.", technologies: ["Unity", "C#"], section: "game", client_id: pixel },
        { name: "Dungeon Cards", description: "Juego de cartas roguelike para navegador.", technologies: ["Phaser", "JavaScript"], section: "game", client_id: pixel },
    ].map((p, i) => ({
        ...p,
        link: `https://github.com/portfolio/${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        img: img(`project-${i}`),
        created_at: new Date(),
    }))

    await projectsCollection.insertMany(projects)
    await projectsCollection.createIndex({ section: 1 })
    await projectsCollection.createIndex({ client_id: 1 })

    console.log(`Insertados ${clients.length} clientes y ${projects.length} proyectos`)
}

seed()
    .catch((err) => {
        console.error(err)
        process.exitCode = 1
    })
    .finally(() => client.close())
