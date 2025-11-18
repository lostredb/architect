import { api } from "@/server/lib/api";
import { ApplicationSchema } from "@/server/lib/zod-schema";
import { useMutation } from "@tanstack/react-query";
import z from "zod";
import { queryClient } from "./queryClient";
import { Loader } from "./loader";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { BsArrowRight } from "react-icons/bs";


export function ContactBlock() {
    const ApplicationSchemaPartial = ApplicationSchema.partial({applicantName: true, applicationTitle: true})
    const createApplicationMutation = useMutation({
        mutationKey: ['applications'],
        mutationFn: async (input: z.infer<typeof ApplicationSchemaPartial>) => {
            const {error} = await api.applications.post(input)
            if (error) {
                throw new Error(String(error.status))
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['applications']})
        }
    })

    const form = useForm({
        defaultValues: {
            applicantName: '',
            applicantPhoneNumber: '',
            applicantEmail: '',
            applicationTitle: '',
            applicationMessage: ''
        },
        onSubmit: ({value, formApi}) => {
            const parsed = ApplicationSchema.parse(value)
            createApplicationMutation.mutateAsync(parsed)
            formApi.reset()
        }
    })

    const Field = form.Field

    if (createApplicationMutation.isPending) {
        return <Loader />
    }
    
    return (
        <div className="flex w-full gap-7 items-center">
            <div className="flex flex-col w-full gap-6 max-w-[400px] h-full">
                <h1 className="text-[64px] font-light text-[#BDBDBD]">Contact Us</h1>
                <form 
                onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}
                className="flex flex-col gap-2.5 w-full h-full select-none"
                >
                    <Field 
                    name="applicantName"
                    children={(f) => (
                        <div className="flex flex-col gap-2">
                            <Input 
                            id={f.name}
                            name={f.name}
                            placeholder="Name"
                            value={f.state.value}
                            onBlur={f.handleBlur}
                            onChange={(e) => f.handleChange(e.target.value)}
                            className="bg-[#F3F3F3] rounded-none px-6 h-11 text-[14px]"
                            />
                        </div>
                    )}
                    />
                    <Field 
                    name="applicantPhoneNumber"
                    children={(f) => (
                        <div className="flex flex-col gap-2">
                            <Input 
                            id={f.name}
                            name={f.name}
                            placeholder="Phone Number"
                            value={f.state.value}
                            onBlur={f.handleBlur}
                            onChange={(e) => f.handleChange(e.target.value)}
                            className="bg-[#F3F3F3] rounded-none px-6 h-11 text-[14px]"
                            />
                        </div>
                    )}
                    />
                    <Field 
                    name="applicantEmail"
                    children={(f) => (
                        <div className="flex flex-col gap-2">
                            <Input 
                            id={f.name}
                            name={f.name}
                            placeholder="E-mail"
                            value={f.state.value}
                            onBlur={f.handleBlur}
                            onChange={(e) => f.handleChange(e.target.value)}
                            className="bg-[#F3F3F3] rounded-none px-6 h-11 text-[14px]"
                            />
                        </div>
                    )}
                    />
                    <Field 
                    name="applicationTitle"
                    children={(f) => (
                        <div className="flex flex-col gap-2">
                            <Input 
                            id={f.name}
                            name={f.name}
                            placeholder="Interested in"
                            value={f.state.value}
                            onBlur={f.handleBlur}
                            onChange={(e) => f.handleChange(e.target.value)}
                            className="bg-[#F3F3F3] rounded-none px-6 h-11 text-[14px]"
                            />
                        </div>
                    )}
                    />
                    <Field 
                    name="applicationMessage"
                    children={(f) => (
                        <div className="flex flex-col gap-2">
                            <textarea 
                            id={f.name}
                            placeholder="Message"
                            value={f.state.value}
                            onBlur={f.handleBlur}
                            onChange={(e) => f.handleChange(e.target.value)}
                            className="resize-none px-6 py-4 bg-[#F3F3F3] rounded-none text-[14px] h-37 focus:outline-0"
                            />
                        </div>
                    )}
                    />
                    <button type="submit" className="flex gap-2 text-white px-10 py-6 bg-[#333333] w-fit mt-20"><span className="text-[12px] tracking-[3px]">SEND APPLICATION</span><BsArrowRight/></button>
                </form>
            </div>
            <Image 
            src='/contactImage.png'
            alt=""
            width={1024}
            height={1024}
            className="w-full pointer-events-none select-none"
            />
        </div>
    )
}