import { db } from "@/server/db";
import { auth } from "@/server/auth/better-auth";
import Elysia, { t } from "elysia";
import { info, photos, projects } from "./db/schema";
import { MainSchema, ProjectsSchema, userSchema } from "./lib/zod-schema";
import { eq } from "drizzle-orm";
import { uploadToStorage } from "./utils/upload";
import path from "path";
import fs from "fs";
import { projectsServices } from "./projectsServices";
import { infoServices } from "./infoServices";


export const App = new Elysia({
    name: 'app',
    prefix: '/api'
})
.use(projectsServices)
.use(infoServices)
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
.group('/admin', (app) => {
    return app.post('/moderators', async ({ body, session, set }) => {
    if (session?.user?.role !== 'admin') {
      set.status = 403
      return { error: 'Forbidden' }
    }
    
    await auth.api.signUpEmail({
        body: {
            ...body,
            role: 'moderator'
        }
    })    
  }, {
    body: userSchema
  })
})
