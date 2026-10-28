import { randomUUID } from "node:crypto"
export function randomImage(width, height = width) {
    return `https://picsum.photos/seed/${randomUUID().slice(0, 8)}/${width}/${height}`
}
