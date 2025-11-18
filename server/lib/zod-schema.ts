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

export const ApplicationSchema = z.object({
    applicantName: z.string().min(2, 'Имя должно быть более 2-х символов'),
    applicantPhoneNumber: z.string().min(11, 'Номер должен состоять из 11 цифр').max(11, 'Номер должен состоять из 11 цифр').regex(/^\d+$/, {message: 'Номер должен состоять из цифр'}),
    applicantEmail: z.email('Неверный формат почты'),
    applicationTitle: z.string().min(4, 'Заголовок должен состоять минимально из 4 символов'),
    applicationMessage: z.string().min(10, 'Сообщение должно состоять минимально из 10 символов')
})