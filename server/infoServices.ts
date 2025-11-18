import Elysia from "elysia";
import { db } from "./db";
import { applications, info } from './db/schema/index'
import { ApplicationSchema, MainSchema } from "./lib/zod-schema";
import { eq } from "drizzle-orm";

export const infoServices = new Elysia({
    name: 'infoServices'
})
.put('/main', async ({body}) => {
    const existingInfo = await db.query.info.findMany()

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
.get('/applications', async () => {
    return await db.query.applications.findMany()
})
.post('/applications', async ({body}) => {
    await db.insert(applications).values(body)
}, {
    body: ApplicationSchema.partial({applicantName: true, applicationTitle: true})
})
.delete('/applications/:id', async ({params}) => {
    await db.delete(applications).where(eq(applications.id, params.id))
})