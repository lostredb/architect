import { db } from "@/server/db";
import { auth } from "@/server/auth/better-auth";
import Elysia from "elysia";
import { info, photos, projects } from "./db/schema";
import { MainSchema, ProjectsSchema } from "./lib/zod-schema";
import { eq } from "drizzle-orm";
import { uploadToStorage } from "./utils/upload";
import path from "path";
import fs from "fs";


export const App = new Elysia({
    name: 'app',
    prefix: '/api'
})
.mount(auth.handler)
.derive({as: 'global'}, async ({request: { headers } }) => {
    return {
        session: await auth.api.getSession({headers})
    }
})
.macro({ auth: {
    async resolve({ status, request: { headers } }) {
    const session = await auth.api.getSession({
        headers,
    });
    if (!session) return status(401);
    return {
        session
    }
    },
},
})
.get('/me', async ({ session }) => {
    return session
})
.get('/projects', async () => {
    return await db.query.projects.findMany({
        with: {
            photos: true
        }
    })
})
.post('/projects', async ({ request }) => {
    const formData = await request.formData()

    const title = formData.get('title') as string
    const description = formData.get('description') as string

    const imageFiles = formData.getAll('images') as File[]

    const [project] = await db.insert(projects).values({
        title,
        description
    }).returning()

    for (const file of imageFiles) {
        const imageUrl = await uploadToStorage(file)
        console.log(imageUrl)
        await db.insert(photos).values({
            projectId: project.id,
            url: imageUrl
        })
    }

    return {
        ok: true
    }
})
.delete('/projects/:id', async ({ params }) => {
    const photoList = await db.query.photos.findMany({
        where: eq(photos.projectId, params.id)
    })

    for (const p of photoList) {
        if (p.url) {
            const filePath = path.join(process.cwd(), p.url.replace(/^\//, ''))

            try {
                fs.promises.unlink(filePath)
                console.log("Удалён файл:", filePath)
            }
            catch (error) {
                console.error("Не удалось удалить файл:", filePath, error)
            }
        }
    }
    await db.delete(photos).where(eq(photos.projectId, params.id))
    await db.delete(projects).where(eq(projects.id, params.id))
})
.get('/photos/:id', async ({ params }) => {
    const firstPhoto = await db.query.photos.findFirst({
        where: eq(photos.projectId, params.id)
    })
    const allPhotos = await db.query.photos.findMany({
        where: eq(photos.projectId, params.id)
    })

    return {
        firstPhoto,
        allPhotos
    }
})
.get('/photos', async () => {
    return await db.query.photos.findMany()
})
.put('/main', async ({body}) => {
    const existingInfo = await db.select().from(info)

    if (existingInfo.length > 0) {
        await db.update(info).set(body)
    } else {
        await db.insert(info).values(body)
    }
}, {
    body: MainSchema.partial()
})

.get('/main', async () => {
    return await db.query.info.findFirst()
})
