'use client'

import { api } from "@/server/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader } from "../../loader"
import z from "zod"
import { MainSchema, ProjectsSchema } from "@/server/lib/zod-schema"
import { queryClient } from "../../queryClient"
import { useForm } from "@tanstack/react-form"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Header } from "../../header"
import { FaTrash } from "react-icons/fa";

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

    useEffect(() => {
        if (!session && !isLoading) {
            router.push('/')
        }
    }, [router, isLoading])

    if (isLoading) {
        return (
            <Loader />
        )
    }

    if (session?.user?.role !== 'admin') {
        return (
            <Loader />
        )
    }

    return (
        <div className="flex flex-col flex-1 max-w-[1036px] gap-4">
            <Header active=""/>
            <h1 className="px-5 mb-2 tracking-[2px]">HELLO <span className="font-bold">{session.user.name.toUpperCase()}</span></h1>
            <div className=" flex gap-2">
                <CreateProject />
                <ProjectsList />
            </div>
            <MainUpdate />
        </div>
    )
}

function CreateProject() {
    const createProjectMutation = useMutation({
        mutationKey: ['projects'],
        mutationFn: async (input: z.infer<typeof ProjectsSchema>) => {
            const {error} = await api.projects.post(input)
            if (error) {
                throw new Error(String(error.status))
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['projects']})
        }
    })

    const form = useForm({
        defaultValues: {
            title: '',
            description: ''
        },
        onSubmit: async ({value, formApi}) => {
            const parsed = ProjectsSchema.parse(value)
            await createProjectMutation.mutateAsync(parsed)
            formApi.reset()
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
        <div className="flex flex-col gap-2 w-full max-w-[240px] py-5">
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