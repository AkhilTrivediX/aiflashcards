'use client'

import { SignIn, SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect } from "react";

export default function Waitlist(){

    useEffect(()=>{
        changeClerkContent()
    })

    async function changeClerkContent(){
        setTimeout(()=>{
        let header = document.getElementsByClassName("cl-headerTitle")[0];
        if(header) header.innerHTML = "Join Our Waitlist";

        let subHeader = document.getElementsByClassName("cl-headerSubtitle")[0];
        if(subHeader) subHeader.innerHTML = "Get notified when we launch";

        if(!header || !subHeader) changeClerkContent();
        },10)
    }
    return(
        <main className="w-screen h-screen bg-background relative z-[1]">
        <div className="absolute w-full h-full gridBG">
          <div className="animateBGDownwards w-full h-full opacity-20"></div>
          <div className="bg-foreground w-full h-full opacity-10 absolute top-0 left-0"></div>
        </div>
        <div className="w-full h-full flex z-[10] justify-center items-center">
          <div className="p-[2px] bg-foreground sharpCorner-tl rounded-xl">
            <div className="w-[max-content] sharpCorner-tl">
                <SignUp appearance={{baseTheme:dark, layout:{
                logoImageUrl:"/10Cards.svg",
                }, variables:{
                    colorPrimary:"white",
                    colorBackground: "black"
                }}}/>
            </div>
          </div>
        </div>
    </main>
    )
}