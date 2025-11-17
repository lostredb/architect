import Image from "next/image";


export function Loader() {
    return (
        <div className="flex w-full h-screen justify-center items-center">
            <div className="flex flex-col gap-12">
                <Image 
                src={'/loading.png'}
                alt=""
                width={100}
                height={100}
                className="animate-spin"
                />
                <p className="text-[24px] font-medium">loading<span className="animate-bounce">.</span><span className="animate-bounce delay-[0.1s]">.</span><span className="animate-bounce delay-[0.2s]">.</span></p>
            </div>
        </div>
    )
}