import { mkdir, writeFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"


export async function uploadToStorage(file: File) {
    console.log("IMAGE FILE:", file)
    if (!file.type.startsWith('image/')) {
        throw new Error('Загрузить можно только изображение')
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
        throw new Error('Размер файла не должен превышать 5 МБ')
    }

    console.log("FILE IN STORAGE:", {
    name: file.name,
    type: file.type,
    size: file.size,
    extension: path.extname(file.name)
})

    const uploadDir = './public/uploads'
    if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, {recursive: true})
    }

    const fileEtxension = path.extname(file.name) || '.jpg'
    const fileName = `img-${Date.now()}-${Math.random().toString(36).substring(2)}${fileEtxension}`
    const filePath = path.join(uploadDir, fileName)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    return `/public/uploads/${fileName}`
}