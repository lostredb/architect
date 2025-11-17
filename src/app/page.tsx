'use client'

import { useQuery } from "@tanstack/react-query"
import { api } from "@/server/lib/api"
import { useRouter } from "next/navigation"
import { Header } from "./header"
import { Loader } from "./loader"
import { BsArrowRight, BsArrowLeft } from "react-icons/bs"
import { useState } from "react"
import Image from "next/image"
import { MainSchema } from "@/server/lib/zod-schema"
import z from "zod"

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

  const router = useRouter()

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
    <div className="flex flex-col w-full gap-5 max-w-[1036px] h-fit">
      <Header active="main"/>
      <div className="w-full overflow-hidden">
        <div
          className="flex w-full transition-transform duration-200 items-center"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {projects?.map((project, i) => (
            <div key={i} className="flex w-full shrink-0 h-fit items-center py-10">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col">
                  <h2 className="text-[32px] text-[#BDBDBD] font-light">PROJECT</h2>
                  <h1 className="text-[32px] text-black font-black max-w-[360px]">{project.title}</h1>
                </div>
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
          ))}
        </div>
      </div>
      <AboutBlock />
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
  <div className="w-full bg-[#FBFBFB] flex justify-end xl:grid xl:grid-cols-[570px_1fr] p-7 gap-20 mt-12 h-fit">
    
    <div className="relative w-full h-[500px] max-w-[570px]">
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

    <div className="flex flex-col justify-between max-w-[400px] xl:max-w-[560px]">
      <h1 className="text-[40px] md:text-[64px] font-light text-[#BDBDBD] -mt-5">About</h1>
      <p className="font-light">{sliceTextByWords(main?.about, 50)}</p>
      <button className="flex items-center gap-5 py-6 px-13 bg-white w-fit">
        <span className="text-[12px] tracking-[3px]">READ MORE</span>
        <BsArrowRight />
      </button>
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
