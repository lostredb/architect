'use client'

import { userSchema } from "@/server/lib/zod-schema";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { authClient } from "../../auth-client";
import { Loader } from "../../loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export default function SignUpPage() {
    const router = useRouter()

    const { isPending } = authClient.useSession()

    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        },
        onSubmit: async ({value}) => {
            const parsed = userSchema.parse(value)
            await authClient.signUp.email(
                {
                    name: parsed.name,
                    email: parsed.email,
                    password: parsed.password
                },
                {
                    onSuccess: () => {
                        router.push('/creator')
                    },
                    onError: (error) => {
                        console.error(error.error.message)
                    }
                }
            )
        }
    })

    if (isPending) {
        return <Loader />
    }

    const Field = form.Field

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="flex flex-col gap-3 max-w-[420px] p-6 rounded-xl w-full shadow-lg"
            >
                <h1 className="text-center font-medium mb-2 tracking-[2px]">CREATE ACCOUNT</h1>
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