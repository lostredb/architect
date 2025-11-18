'use client'

import { api } from "@/server/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsArrowRight } from "react-icons/bs";


export function OurProjects() {
    const {data: projects} = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const {data, error} = await api.projects.get()
            if (error) {
                throw new Error(String(error.status))
            }
            return data
        }
    })
    const rt = useRouter()
    return (
        <div className="flex flex-col gap-20">
            <h1 className="text-[64px] font-light text-[#BDBDBD]">Our Projects</h1>
            <div className="flex flex-col gap-7">
                {projects && (
                    <div className="flex flex-col gap-7">
                        <div className="grid grid-cols-2 gap-7">
                            <div className="relative">
                                <Image 
                                src={projects[0]?.photos[0].url.replace('/public', '')}
                                alt=""
                                width={500}
                                height={500}
                                className="h-[255px] w-full object-cover pointer-events-none select-none"
                                />
                                <div className="absolute bg-[#333333]/60 px-20 py-12 w-full h-[255px] bottom-0 flex flex-col gap-2 justify-center">
                                    <h1 className="text-[64px] font-bold text-white -mt-4">Sample</h1>
                                    <h1 className="text-[64px] font-bold text-white -mt-12">Project</h1>
                                    <Link href={'/projects'}>
                                        <button className="flex items-center text-white gap-25 text-[12px]"><span className="tracking-[3px]">VIEW MORE</span><BsArrowRight className="h-5 w-10"/></button>
                                    </Link>
                                </div>
                            </div>
                            {projects?.slice(1, 2).map((project) => (
                                <Image
                                key={project.id}
                                src={project.photos[0].url.replace('/public', '')}
                                alt=""
                                width={500}
                                height={500}
                                className="h-[255px] w-full object-cover pointer-events-none select-none"
                                />
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-7">
                            {projects?.slice(2, 5).map((project) => (
                                <Image 
                                key={project.id}
                                src={project.photos[0].url.replace('/public', '')}
                                alt=""
                                width={500}
                                height={500}
                                className="h-[255px] w-full object-cover pointer-events-none select-none"
                                />
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex justify-end">
                    <button onClick={() => rt.push('/projects')} className="flex gap-2 text-white px-10 py-6 bg-[#333333]"><span className="text-[12px] tracking-[3px]">ALL PROJECTS</span><BsArrowRight/></button>
                </div>
            </div>
        </div>
    )
}