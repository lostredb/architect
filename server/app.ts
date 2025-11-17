import { db } from "@/server/db";
import { auth } from "@/server/auth/better-auth";
import Elysia from "elysia";
import { info, photos, projects } from "./db/schema";
import { MainSchema, ProjectsSchema } from "./lib/zod-schema";
import { eq } from "drizzle-orm";


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
    return await db.select().from(projects)
})
.post('/projects', async ({ body }) => {
    await db.insert(projects).values(body)
}, {
    body: ProjectsSchema
})
.delete('/projects/:id', async ({ params }) => {
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
