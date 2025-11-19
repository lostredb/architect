'use client'

import { useQuery } from "@tanstack/react-query"
import { api } from "@/server/lib/api"
import { Header } from "./header"
import { Loader } from "./loader"
import { BsArrowRight, BsArrowLeft } from "react-icons/bs"
import { useState } from "react"
import Image from "next/image"
import { MainSchema } from "@/server/lib/zod-schema"
import z from "zod"
import { OurProjects } from "./ourprojects"
import { ContactBlock } from "./contactus"
import { Footer } from "./footer"

export default function Page() {
  const [index, setIndex] = useState(0)

  const {data: projects, isLoading: DataLoading} = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const {data, error} = await api.projects.get()
      if (error) {
        throw new Error(String(error.status))
      }
      return data
    }
  })

  if (DataLoading) {
    return <Loader />
  }

  const next = () => {
    if (!projects) return
    setIndex((i) => (i === projects.length - 1 ? 0 : i + 1))
  }

  const prev = () => {
    if (!projects) return
    setIndex((i) => (i === 0 ? projects.length - 1 : i - 1))
  }
  
  return (
    <div className="flex flex-col w-full gap-5 items-center">
      <div className="w-full sticky">
        <Header active="main"/>
      </div>
      <div className="w-full overflow-hidden max-w-[1170px] ">
        <div
          className="flex w-full transition-transform duration-400 ease-in-out items-center"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {projects?.map((project, i) => (
            <div key={i} className={`flex w-full shrink-0 h-fit items-center py-10 pr-1`}>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col">
                  <h1 className="text-[64px] text-[#BDBDBD] font-light">PROJECT</h1>
                  <h1 className="text-[64px] font-bold max-w-[360px] min-w-[280px] -mt-8">{project.title}</h1>
                </div>
                <div className={`flex-col gap-20 w-full shrink-0 h-fit ${projects?.length > 1 ? 'flex' : 'hidden'}`}>
                  <div className="flex gap-5">
                    <button
                      className="border border-[#F2F2F2] bg-[#F9F9F9] p-5 h-fit w-fit"
                      onClick={() => prev()}
                    >
                      <BsArrowLeft />
                    </button>
                    <button
                      className="border border-[#F2F2F2] bg-[#F9F9F9] p-5 h-fit w-fit"
                      onClick={() => next()}
                    >
                      <BsArrowRight />
                    </button>
                  </div>
                  <div className="flex gap-5 text-[#BDBDBD] items-center">
                    <p className="text-xl">{i + 1 < 10 ? `0${i + 1}` : `${i + 1}`}</p>
                    <p className="text-3xl font-light">/</p>
                    <p className="text-xl">{projects.length < 10 ? `0${projects.length}` : `${projects.length}`}</p>
                  </div>
                </div>
              </div>
              <div className="relative w-full">
                <Image 
                src={project?.photos[0]?.url.replace('/public', '') || '/notFound.png'}
                alt=''
                width={400}
                height={400}
                className={`flex-1 w-full h-full object-cover pl-[122px] select-none pointer-events-none`}
                />
                <button className="py-6 px-9 absolute flex gap-4 items-center bg-white bottom-0 left-[120px]"><span className="tracking-[3px]">VIEW PROJECT</span><BsArrowRight/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full gap-5 items-center max-w-[1170px] mb-20">
        <AboutBlock />
        <OurProjects />
        <ContactBlock />
      </div>
      <Footer />
    </div>
  )
}

function AboutBlock() {
  type MainData = z.infer<typeof MainSchema>
  
  const {data: main} = useQuery<MainData | null>({
    queryKey: ['main'],
    queryFn: async () => {
      const {data, error} = await api.main.get()
      if (error) throw new Error(String(error.status))
      return data as MainData | null
    }
  })
  
  return (
  <div className="w-full flex flex-col gap-51 mt-12">
    <div className="w-full bg-[#FBFBFB] h-fit flex justify-end xl:grid xl:grid-cols-[570px_1fr] p-7 gap-20">
      
      <div className="relative w-full max-w-[570px] pointer-events-none select-none h-[495px]">
        <Image 
          src='/Rectangle 8.png'
          alt=""
          width={270}
          height={255}
          className="absolute left-0 top-0"
        />
        <Image 
          src='/Rectangle 9.png'
          alt=""
          width={270}
          height={255}
          className="absolute left-[52%] top-[10%] hidden xl:block"
        />
        <Image 
          src='/Rectangle 10.png'
          alt=""
          width={270}
          height={255}
          className="absolute bottom-[15%]"
        />
      </div>

      <div className="flex flex-col gap-5 h-fit max-w-[400px] xl:max-w-[560px]">
        <h1 className="text-[40px] md:text-[64px] font-light text-[#BDBDBD] -mt-5">About</h1>
        <p className="font-light">{sliceTextByWords(main?.about, 50)}</p>
        <button className="flex items-center gap-5 py-6 px-13 bg-white w-fit">
          <span className="text-[12px] tracking-[3px]">READ MORE</span>
          <BsArrowRight />
        </button>
      </div>

    </div>
    <div className="flex flex-col gap-15 -z-20">
      <h1 className="text-[64px] font-light text-[#BDBDBD] -mt-29">Main Focus/Mission Statement</h1>
      <div className="flex justify-between -mt-29">
        <div className="flex gap-12 items-center w-full max-w-[424px]">
          <h1 className="text-[200px] font-black text-[#F2F2F2] select-none">1</h1>
          <p className="text-[22px] text-[#333333] whitespace-pre-line">{main?.mainFocusOne}</p>
        </div>
        <div className="flex gap-12 items-center w-full max-w-[570px] -z-20">
          <h1 className="text-[200px] font-black text-[#F2F2F2] select-none">2</h1>
          <p className="text-[22px] text-[#333333] whitespace-pre-line">{main?.mainFocusTwo}</p>
        </div>
      </div>
    </div>
  </div>
)
}


export function sliceTextByWords(text?: string, maxWords?: number) {
  if (!text || !maxWords) return
  const words = text.split(' ')
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + '...'
}
