import FlashSlider from "@/components/flashSlider";
import Image from "next/image";
import Waitlist from "@/components/Waitlist";
import { SignIn } from "@clerk/nextjs";
import WaitlistCall from "@/components/WaitlistCall";

export default function Home() {
  return (
    <main className="w-screen h-screen absolute z-[1] top-0">
        <FlashSlider/>
    </main>
  );
}
