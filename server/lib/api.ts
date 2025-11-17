import { treaty } from "@elysiajs/eden";
import { App } from "@/server/app";

export const { api } = treaty<typeof App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})