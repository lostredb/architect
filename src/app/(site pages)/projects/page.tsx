'use client'

import { api } from "@/server/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Loader } from "../../loader"
import { Header } from "../../header"
import Image from "next/image"
import { BsArrowRight, BsArrowLeft } from "react-icons/bs"
import { sliceTextByWords } from "../../page"
import { useState } from "react"
import { Footer } from "../../footer"

export default function ProjectsPage() {
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

    const [currentSlide, setCurrentSlide] = useState(0)

    if (isLoading) {
        return <Loader />
    }

    const projectGroups = [];
    if (projects) {
        for (let i = 0; i < projects.length; i += 3) {
            projectGroups.push(projects.slice(i, i + 3));
        }
    }

    const nextSlide = () => {
        setCurrentSlide((prev) => 
            prev === projectGroups.length - 1 ? 0 : prev + 1
        )
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => 
            prev === 0 ? projectGroups.length - 1 : prev - 1
        )
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="flex flex-col w-full max-w-[1170px] h-full mb-30">
                <Header active="projects"/>
                <div className="flex flex-col mt-15 gap-15">
                    <div className="flex flex-col">
                        <h1 className="flex text-[64px] font-light text-[#BDBDBD]">Our</h1>
                        <h1 className="flex text-[64px] font-bold -mt-8">Projects</h1>
                    </div>
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div 
                                className="flex transition-transform duration-400 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {projectGroups.map((group, groupIndex) => (
                                    <div 
                                        key={groupIndex} 
                                        className="w-full shrink-0 grid grid-cols h-fit auto-rows-auto gap-15 mr-px"
                                    >
                                        {group.map((project, projectIndex) => (
                                            <ProjectCard 
                                                key={projectIndex} 
                                                project={project} 
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-7 mt-15">
                            {projectGroups.length > 1 && (
                                <div className="flex gap-5 text-[#BDBDBD] items-center">
                                    <p className="text-xl">{currentSlide + 1 < 10 ? `0${currentSlide + 1}` : currentSlide + 1}</p>
                                    <p className="text-3xl font-light">/</p>
                                    <p className="text-xl">{projectGroups.length < 10 ? `0${projectGroups.length}` : `${projectGroups.length}`}</p>
                                </div>
                            )}
                            {projectGroups.length > 1 && (
                                <div className="flex justify-center gap-4">
                                    <button 
                                        onClick={prevSlide}
                                        className="p-3 bg-[#F9F9F9] text-white hover:bg-gray-200 transition-colors"
                                    >
                                        <BsArrowLeft size={20} className="text-black"/>
                                    </button>
                                    <button 
                                        onClick={nextSlide}
                                        className="p-3 bg-[#F9F9F9] text-white hover:bg-gray-200 transition-colors"
                                    >
                                        <BsArrowRight size={20} className="text-black"/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    ) 
}

function ProjectCard({ project }: { project: { id: string | number, title: string, description: string } }) {
    const { data: photos, isLoading } = useQuery({
        queryKey: ['photos', project.id],
        queryFn: async () => {
            const { data, error } = await api.photos({ id: project.id }).get()
            if (error) {
                throw new Error(String(error.status))
            }
            return data
        }
    })

    if (isLoading) {
        return (
            <div className="bg-[#FBFBFB] flex w-full">
                <Loader />
            </div>
        )
    }

    return (
        <div className="bg-[#FBFBFB] flex justify-between w-full min-h-[435px]">
            <Image 
                src={photos?.firstPhoto?.url.replace('/public', '') || '/notFound.png'}
                alt={project.title}
                width={670}
                height={435}
                className="max-h-[435px] h-full w-[670px] object-cover"
            />
            <div className="flex flex-col p-7 justify-between max-w-[500px] w-full">
                <h3 className="text-[40px] font-light text-[#BDBDBD] -mt-6">{project.title}</h3>
                <p className="text-[16px] whitespace-pre-line">{sliceTextByWords(project.description, 30)}</p>
                <button className="flex items-center gap-5 py-6 px-13 bg-white w-fit">
                    <span className="text-[12px] tracking-[3px]">VIEW MORE</span>
                    <BsArrowRight />
                </button>
            </div>
        </div>
    )
}