'use client'

import { api } from "@/server/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../../loader";
import { Header } from "../../header";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Footer } from "../../footer";

export default function GalleryPage() {
    const {data: photos, isLoading} = useQuery({
        queryKey: ['photos'],
        queryFn: async () => {
            const {data, error} = await api.photos.get()
            if (error) {
                throw new Error(String(error.status))
            }
            return (data)
        }
    })

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className="flex flex-col flex-1 justify-between items-center min-h-screen h-full">
            <div className="flex flex-col gap-15 w-full max-w-[1170px] mb-20">
                <Header active='gallery'/>
                <div>
                    <h1 className="flex text-[64px] font-light text-[#BDBDBD]">Photo</h1>
                    <h1 className="flex text-[64px] font-bold -mt-8">Gallery</h1>
                </div>
                <div className="grid grid-cols-5 w-full gap-[30px] select-none">
                    {photos?.map((p) => (
                        <Dialog key={p.id}>
                            <DialogTrigger>
                                <Image
                                key={p.id}
                                src={p.url.replace('/public', '')}
                                alt=""
                                width={210}
                                height={260}
                                className="object-cover h-[260px] w-[210px]"
                                />
                            </DialogTrigger>
                            <DialogContent className="p-0 rounded-3xl" showCloseButton={false}>
                                <DialogHeader className="hidden">
                                    <DialogTitle>

                                    </DialogTitle>
                                </DialogHeader>
                                <Image
                                src={p.url.replace('/public', '')}
                                alt=""
                                width={210}
                                height={260}
                                className="object-contain h-full w-full rounded-3xl"
                                />
                            </DialogContent>    
                        </Dialog>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}