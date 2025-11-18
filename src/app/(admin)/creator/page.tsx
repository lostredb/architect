'use client'

import { api } from "@/server/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "../../loader"
import z from "zod"
import { MainSchema, userSchema } from "@/server/lib/zod-schema"
import { queryClient } from "../../queryClient"
import { useForm } from "@tanstack/react-form"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Header } from "../../header"
import { FaTrash } from "react-icons/fa";
import { authClient } from "../../auth-client"

export default function CreatorPage() {
    const router = useRouter()
    
    const {data: session, isLoading} = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const {data, error} = await api.me.get()

            if (error) {
                throw new Error(String(error.status))
            }
            return data
        }
    })

    const rt = useRouter()

    useEffect(() => {
        if (!session && !isLoading) {
            router.push('/')
        }
        if (session?.user?.role !== 'admin' && !isLoading) {
        return (
            router.push('/')
        )
    }
    }, [router, isLoading])

    if (isLoading) {
        return (
            <Loader />
        )
    }

    if (session?.user?.role === 'admin' && !isLoading) {
        return (
            <div className="flex flex-col flex-1 max-w-[1036px] gap-4">
                <Header active=""/>
                <div className="flex gap-4 items-center">
                    <h1 className="px-5 mb-2 tracking-[2px]">HELLO <span className="font-bold">{session.user.name.toUpperCase()}</span></h1>
                    <button className="flex gap-2 text-white px-4 py-2 bg-[#333333] w-fit" onClick={() => rt.push('/applications')}>Applications</button>
                    <button className="flex gap-2 text-white px-4 py-2 bg-[#333333] w-fit" onClick={() => rt.push('/sign/signout')}>Exit From Account</button>

                </div>
                <div className=" flex gap-2">
                    <CreateProject />
                    <ProjectsList />
                </div>
                <MainUpdate />
                <CreateModerator />
            </div>
        )
    }

    return <Loader />
}

function CreateProject() {
    const createProjectsMutation = useMutation({
        mutationKey: ['projects'],
        mutationFn: async (formData: FormData) => {
            const res = await fetch(`${process.env.BETTER_AUTH_URL || 'http://localhost:3000'}/api/projects`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            })

            if (!res.ok) {
                const text = await res.text()
                throw new Error(text)
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['projects']})
        }
    })

    const form = useForm({
        defaultValues: {
            title: '',
            description: '',
            images: [] as File[]
        },
        onSubmit: async ({value}) => {
            const formData = new FormData()

            formData.append('title', value.title),
            formData.append('description', value.description),
            value.images.forEach(image => formData.append('images', image))

            await createProjectsMutation.mutateAsync(formData)
        }
    })

    const Field = form.Field

    return (
        <div className="flex flex-col flex-1 gap-3 p-5">
            <h1 className="font-medium mb-2 tracking-[2px]">CREATE PROJECT</h1>
            <form
            onSubmit={(e) => {
                e.preventDefault(),
                form.handleSubmit()
            }}
            className="flex flex-col flex-1 gap-4"
            >
                <Field
                name="title"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">TITLE</Label>
                        <Input 
                        id={f.name}
                        name={f.name}
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className="bg-[#F3F3F3] rounded-none"
                        />
                    </div>
                )}
                />
                <Field 
                name="description"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">DESCRIPTION</Label>
                        <textarea 
                        key={f.name}
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        onBlur={f.handleBlur}
                        className="bg-[#F3F3F3] rounded-none resize-none h-24 px-3 py-2"
                        />
                    </div>
                )}
                />
                <Field 
                name="images"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">TITLE</Label>
                        <Input 
                        id={f.name}
                        name={f.name}
                        type="file"
                        multiple
                        accept="image/"
                        onBlur={f.handleBlur}
                        onChange={(e) => {
                            const files = e.target.files ? Array.from(e.target.files) : [];
                            f.handleChange(files)
                        }}
                        className="bg-[#F3F3F3] rounded-none"
                        />
                        {f.state.value.length > 0 && (
                        <span className="text-xs text-gray-500">
                            Выбрано файлов: {f.state.value.length}
                        </span>
                        )}
                    </div>
                )}
                />
                <button type="submit" className="bg-[#333333] text-white text-[12px] tracking-[4px] py-3">CREATE</button>
            </form>
        </div>
    )
}

function ProjectsList() {
    const {data: projects, isLoading} = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const {data, error} = await api.projects.get()
            if (error) {
                throw new Error(String(error.status))
            }
            return data
        }
    })

    const deleteProjectMutation = useMutation({
        mutationKey: ['projects'],
        mutationFn: async (id: string) => {
            const {error} = await api.projects({id}).delete()
            if (error) {
                throw new Error(String(error.status))
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['projects']
            })
        }
    })

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-60 py-5">
            {projects?.map((project, i) => (
                <div key={i} className="flex justify-between w-full">
                    <p>{project.title}</p>
                    <button onClick={() => deleteProjectMutation.mutateAsync(project.id)}><FaTrash /></button>
                </div>
            ))}
        </div>
    )
}

function MainUpdate() {
    type MainData = z.infer<typeof MainSchema>
      
    const {data: main} = useQuery<MainData | null>({
    queryKey: ['main'],
    queryFn: async () => {
        const {data, error} = await api.main.get()
        if (error) {
        throw new Error(String(error.status))
        }
        return data as MainData | null
    }
    })

    const updateMainMutation = useMutation({
        mutationKey: ['main'],
        mutationFn: async (input: z.infer<typeof MainSchema>) => {
            const {error} = await api.main.put(input)
            if (error) {
                throw new Error(String(error.status))
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['main']})
        }
    })

    const form = useForm({
        defaultValues: {
            about: main?.about === undefined ? '' : main.about,
            mainFocusOne: main?.mainFocusOne === undefined ? '' : main.mainFocusOne,
            mainFocusTwo: main?.mainFocusTwo === undefined ? '' : main.mainFocusTwo
        },
        onSubmit: async ({value, formApi}) => {
            const parsed = MainSchema.parse(value)
            updateMainMutation.mutateAsync(parsed)
            formApi.reset()
        }
    })

    const Field = form.Field

    return (
        <div className="flex flex-col flex-1 gap-3 p-5">
            <h1 className="font-medium mb-2 tracking-[2px]">EDIT MAIN</h1>
            <form
            onSubmit={(e) => {
                e.preventDefault(),
                form.handleSubmit()
            }}
            className="flex flex-col flex-1 gap-4"
            >
                <Field
                name="about"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">ABOUT</Label>
                        <textarea 
                        key={f.name}
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        onBlur={f.handleBlur}
                        className="bg-[#F3F3F3] rounded-none resize-none h-24 px-3 py-2"
                        />
                    </div>
                )}
                />
                <div className="flex gap-3">
                    <Field 
                    name="mainFocusOne"
                    children={(f) => (
                        <div className="flex flex-col gap-2 w-full">
                            <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">MAIN FOCUS 1</Label>
                            <textarea 
                            key={f.name}
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className="bg-[#F3F3F3] rounded-none resize-none h-24 px-3 py-2"
                            />
                        </div>
                    )}
                    />
                    <Field 
                    name="mainFocusTwo"
                    children={(f) => (
                        <div className="flex flex-col gap-2 w-full">
                            <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">MAIN FOCUS 1</Label>
                            <textarea 
                            key={f.name}
                            value={f.state.value}
                            onChange={(e) => f.handleChange(e.target.value)}
                            onBlur={f.handleBlur}
                            className="bg-[#F3F3F3] rounded-none resize-none h-24 px-3 py-2"
                            />
                        </div>
                    )}
                    />
                </div>
                <button type="submit" className="bg-[#333333] text-white text-[12px] tracking-[4px] py-3">UPDATE</button>
            </form>
        </div>
    )
}

function CreateModerator() {
    const createModeratorMutation = useMutation({
        mutationKey: ['moderators'],
        mutationFn: async (input: z.infer<typeof userSchema>) => {
            const {error} = await api.admin.moderators.post(input)
            if (error) {
                throw new Error(String(error.status))
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['moderators']
            })
        }
    })

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
        onSubmit: async ({value, formApi}) => {
            const parsed = userSchema.parse(value)
            createModeratorMutation.mutateAsync(parsed)
            formApi.reset()
        }
    })

    const isPending = createModeratorMutation.isPending

    if (isPending) {
        return <Loader />
    }

    const Field = form.Field

    return (
        <div className="w-full">
            <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-3 p-6 rounded-xl w-full"
            >
                <h1 className="font-medium mb-2 tracking-[2px]">CREATE MODERATOR</h1>
                <Field 
                name="name"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">NAME</Label>
                        <Input 
                        id={f.name}
                        name={f.name}
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className="bg-[#F3F3F3] rounded-none"
                        />
                    </div>
                )}
                />
                <Field 
                name="email"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">EMAIL</Label>
                        <Input 
                        id={f.name}
                        name={f.name}
                        type="email"
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className="bg-[#F3F3F3] rounded-none"
                        />
                    </div>
                )}
                />
                <Field 
                name="password"
                children={(f) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor={f.name} className="text-[8px] font-normal tracking-[4px]">PASSWORD</Label>
                        <Input 
                        id={f.name}
                        name={f.name}
                        value={f.state.value}
                        type="password"
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                        className="bg-[#F3F3F3] rounded-none"
                        />
                    </div>
                )}
                />
                <button type="submit" className="bg-[#333333] text-white text-[12px] tracking-[4px] py-3">REGISTRATION</button>
            </form>
        </div>
    )
}