import FlashSlider from "@/components/flashSlider";
import Image from "next/image";
import Waitlist from "@/components/Waitlist";
import { SignIn } from "@clerk/nextjs";
import WaitlistCall from "@/components/WaitlistCall";

export default function Home() {
  return (
    <main className="w-screen h-screen absolute z-[1] top-0">
        <div className="absolute w-full h-full gridBG hidden">
          <div className="animateBGDownwards w-full h-full opacity-20"></div>
          <div className="bg-foreground w-full h-full opacity-10 absolute top-0 left-0"></div>
        </div>
        <div className="w-full h-full z-[10]">
          <WaitlistCall/>
        </div>
    </main>
  );
}
