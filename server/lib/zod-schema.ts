import z from "zod";


export const userSchema = z.object({
    name: z.string().min(2, 'Имя должно быть более 1 символа'),
    email: z.email(),
    password: z.string().min(6, 'Пароль должен быть более 6 символов')
})

export const ProjectsSchema = z.object({
    title: z.string().min(4, 'Заголовок должен состоять минимально из 4 символов'),
    description: z.string().min(10, 'Описание должно состоять минимально из 10 символов'),
    images: z.array(z.file()),
})

export const MainSchema = z.object({
    about: z.string(),
    mainFocusOne: z.string(),
    mainFocusTwo: z.string()
})