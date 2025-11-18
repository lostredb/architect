import { treaty } from "@elysiajs/eden";
import { App } from "@/server/app";

export const { api } = treaty<typeof App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})

export const adminAPI = {
    createModerator: (data: {name: string, email: string, password: string}) => api.admin.moderators.post(data)
}