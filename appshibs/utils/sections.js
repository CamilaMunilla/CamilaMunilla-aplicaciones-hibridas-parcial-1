export const SECTIONS = [
    { slug: "mobile", name: "Mobile" },
    { slug: "landing", name: "LandingPage" },
    { slug: "webapp", name: "Web App" },
    { slug: "ecommerce", name: "e-Commerce" },
    { slug: "game", name: "Games" },
]

export const SECTION_SLUGS = SECTIONS.map((s) => s.slug)

export function getSection(slug) {
    return SECTIONS.find((s) => s.slug === slug)
}
