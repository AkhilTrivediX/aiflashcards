import { Tomorrow } from "next/font/google"


const tomorrow = Tomorrow({ weight: ['300','600'], subsets: ['latin'] })

export default function WaitlistCall(){
    return (<div className="flex flex-col w-screen h-screen relative overflow-hidden items-center justify-between">
            
        <div className="w-full h-full bg-background ">
            <iframe src={"https://player.vimeo.com/video/1001945210?background=1"} className={"w-full h-full object-cover "}></iframe>
        </div>
        <a href="/waitlist" >
        <div className={"mb-4 bg-foreground text-background font-bold w-[max-content] px-4 py-2 sharpCorner-tl relative "+(tomorrow.className)}>
                <div className=" testScoreBG tenCardsBG"></div>
                Join Waitlist
        </div></a>
    </div>)
}