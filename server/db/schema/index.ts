import { relations } from 'drizzle-orm'
import * as pg from 'drizzle-orm/pg-core'
export * from './auth-schema'

export const projects = pg.pgTable('projects', {
    id: pg
        .varchar('id', { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    title: pg
        .text('title')
        .notNull(),
    description: pg
        .text('description')
        .notNull(),
})

export const projectPohotosRelation = relations(projects, ({ many }) => ({
    photos: many(photos),
}))

export const photos = pg.pgTable('photos', {
    id: pg
        .varchar('id', { length: 255 })
        .notNull()
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: pg
        .varchar('project_id', { length: 255 })
        .notNull()
        .references(() => projects.id),

    url: pg
        .text('url')
        .notNull()
})

export const photoProjectRelation = relations(photos, ({ one }) => ({
    project: one(projects, {
        fields: [photos.projectId],
        references: [projects.id],
    }),
}))

export const info = pg.pgTable('info', {
    about: pg
        .text()
        .default(''),
    mainFocusOne: pg
        .text()
        .default(''),
    mainFocusTwo: pg
        .text()
        .default('')
})
