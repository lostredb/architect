'use client'

import { api } from "@/server/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "../../loader";
import { Header } from "../../header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MdOutlineTaskAlt } from "react-icons/md";
import { queryClient } from "../../queryClient";


export default function ApplicationsPage() {
    const rt = useRouter()

    const {data: me, isLoading: load} = useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const {data, error} = await api.me.get()
            if (error) {
                rt.push('/')
                throw new Error(String(error.status))
            }
            return (data)
        }
    })
    const { data: applications, isLoading } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const { data, error } = await api.applications.get()
            if (error) {
                throw new Error(String(error.status))
            }
            return data
        }
    })

    const deleteApplictionMutation = useMutation({
        mutationKey: ['applications'],
        mutationFn: async (id: string) => {
            const {error} = await api.applications({id}).delete()
            if (error) {
                throw new Error(String(error.status))
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['applications']})
        }
    })


    if (isLoading && load) {
        return <Loader />
    }

    if (!me && !load) {
            return (
            <div className="max-w-[1170px] flex-1 flex flex-col justify-center items-center gap-4">
                <h2 className="text-[64px] text-[#BDBDBD] font-light">You Havent Account Sign In</h2>
                <button className="flex gap-2 text-white px-10 py-6 bg-[#333333] w-fit" onClick={() => rt.push('/sign/signin')}>Sign in</button>
            </div>
            )
        }

    return (
        <div className="flex flex-col w-full gap-5 max-w-[1036px] h-fit">
            <Header active=""/>
            <div className="flex flex-col gap-4">
                {applications?.map((app) => (
                    <div key={app.id} className="flex bg-[#FBFBFB] justify-between p-6 items-center rounded-lg">
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold">{app.applicationTitle}</h1>
                            <div className="flex gap-3">
                                <h2 className="text-[16px] font-medium">{app.applicantPhoneNumber}</h2>
                                <h2 className="text-[16px] font-medium">{app.applicantEmail}</h2>
                            </div>
                            <p className="text-gray-600 whitespace-pre-line">{app.applicationMessage}</p>
                        </div>
                        <div className="flex gap-6 items-center">
                            <p className="font-medium">{app.createdAt.toLocaleDateString()}</p>
                            <button className="p-3 bg-gray-300 rounded-lg hover:text-green-500 hover:bg-green-800 transition-all duration-200" onClick={() => deleteApplictionMutation.mutateAsync(app.id)}>
                                <MdOutlineTaskAlt className="size-6 "/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}