import Elysia from "elysia";
import { db } from "./db";
import { applications, info } from './db/schema/index'
import { ApplicationSchema, MainSchema } from "./lib/zod-schema";
import { eq } from "drizzle-orm";
import { RedisClient } from "./lib/redis";
import { redis } from "bun";

export const infoServices = new Elysia({
    name: 'infoServices'
})
.put('/main', async ({body}) => {
    redis.del('main')
    const existingInfo = await db.query.info.findMany()

    if (existingInfo.length > 0) {
        await db.update(info).set(body)
    } else {
        await db.insert(info).values(body)
    }
    RedisClient('main', async () => {
        return await db.query.info.findFirst()
    })
}, {
    body: MainSchema.partial()
})

.get('/main', async () => {
    return RedisClient('main', async () => {
        return await db.query.info.findFirst()
    })
})
.get('/applications', async () => {
    return RedisClient('applications', async () => {
        return await db.query.applications.findMany()
    })
})
.post('/applications', async ({body}) => {
    redis.del('applications')
    await db.insert(applications).values(body)
    RedisClient('applications', async () => {
        return await db.query.applications.findMany()
    })
}, {
    body: ApplicationSchema.partial({applicantName: true, applicationTitle: true})
})
.delete('/applications/:id', async ({params}) => {
    redis.del('applications')
    await db.delete(applications).where(eq(applications.id, params.id))
    RedisClient('applications', async () => {
        return await db.query.applications.findMany()
    })
})