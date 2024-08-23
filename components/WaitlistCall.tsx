import { Tomorrow } from "next/font/google"
import { FaLink } from "react-icons/fa"
import { IoSparkles } from "react-icons/io5"


const tomorrow = Tomorrow({ weight: ['300','600'], subsets: ['latin'] })

export default function WaitlistCall(){
    return (<div className="flex flex-col w-screen h-screen relative overflow-hidden items-center justify-between">
        <div className="flex gap-4">
            <a href="/waitlist" >
            <div className={"mt-4 bg-foreground text-background font-bold w-[max-content] px-4 py-2 sharpCorner-tl relative flex items-center gap-2 "+(tomorrow.className)}>
                    <div className=" testScoreBG tenCardsBG"></div>
                    Join Waitlist <IoSparkles/>
            </div></a>
            <a href="https://youtu.be/xz9mEDCByqI" target="_blank">
            <div className={"mt-4 bg-foreground text-background font-bold w-[max-content] px-4 py-2 sharpCorner-tl relative flex items-center gap-2 "+(tomorrow.className)}>
                    Demo Video <FaLink/>
            </div></a>
        </div>
        <div className="w-full h-full bg-background ">
            <iframe src={"https://player.vimeo.com/video/1001945210?background=1"} className={"w-full h-full object-cover "}></iframe>
        </div>
        
    </div>)
}