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


    if (isLoading || load) {
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
        <div className="flex flex-col w-full gap-5 max-w-[1036px] h-fit mb-20">
            <Header active=""/>
            <div className="flex flex-col gap-10">
                {applications?.map((app) => (
                    <div className="flex flex-col gap-7 p-5 rounded-lg bg-gray-100" key={app.id}>
                        <div className="flex justify-between items-center border-b border-b-gray-400 pb-4">
                            <div className="flex flex-col gap-4">
                                <h1 className="text-2xl font-bold">{app.applicationTitle}</h1>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-[20px] font-medium">Contacts:</h2>
                                    <p className="text-[12px]">Name: <span className="font-semibold">{app.applicantName}</span></p>
                                    <p className="text-[12px]">Phone Number: <span className="font-semibold">{app.applicantPhoneNumber}</span></p>
                                    <p className="text-[12px]">E-mail: <span className="font-semibold">{app.applicantEmail}</span></p>
                                </div>
                            </div>
                            <button className="p-3 group rounded-lg bg-gray-300 hover:bg-green-600 transition-colors duration-200 ease-in-out h-fit">
                                <MdOutlineTaskAlt className="group-hover:text-white text-black size-4 transition-colors duration-200 ease-in-out"/>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="text-2xl font-bold">Message</h1>
                            <p className="text-[14px] text-gray-500 whitespace-pre-line">{app.applicationMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}