import {redis} from 'bun'

export async function RedisClient<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const cached = await redis.get(key)

    if (cached) {
        return JSON.parse(cached) as T
    }

    const result = await fn();
    await redis.set(key, JSON.stringify(result))
    return result
}