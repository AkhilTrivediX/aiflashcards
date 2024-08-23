'use client'

import { use, useEffect, useRef, useState } from "react"
import { BiRightArrow, BiSmile } from "react-icons/bi"
import localFont from 'next/font/local'
import Image from "next/image"
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SavedDecks from "./savedDecks"
import {Tomorrow} from 'next/font/google'
import { FaCaretRight, FaCheck, FaRegCircle } from "react-icons/fa"
import { FaXmark } from "react-icons/fa6"
import { MdCelebration, MdCheck, MdCircle, MdClose, MdOutlineCircle } from "react-icons/md"
import { IoMdCheckmark } from "react-icons/io"
import { IoHappy, IoSad, IoSkull } from "react-icons/io5"

const tomorrow = Tomorrow({ weight: ['300','700'], subsets: ['latin'] })

gsap.registerPlugin(useGSAP);

const Rondal = localFont({ src:  'Sterion.ttf'})

export default function FlashSlider() {

    const {contextSafe} = useGSAP();

    const [prompt, setPrompt] = useState('')
    const [difficulty, setDifficulty] = useState('beginner')
    const [testMode, setTestMode] = useState(false)
    const [currentState, setCurrentState] = useState('savedDecks')
    const [viewingCard, setViewingCard] = useState(-1)
    const [cards, setCards] = useState([])
    const [testScores, setTestScores] = useState<number[]>([])
    const [model, setModel] = useState('llama')
    const sliderRef = useRef(null)
    const promptInputRef = useRef(null)

    const [randomString, setRandomString] = useState('')

    const demoStatements = [
        {statement: 'The closest star to the Sun', reveal: 'Proxima Centauri'},
        {statement: 'A galaxy shaped like a flat disk with a central bulge', reveal: 'Spiral Galaxy'},
        {statement: 'The study of the universe and celestial objects', reveal: 'Astronomy'},
        {statement: 'A reusable spacecraft developed by SpaceX', reveal: 'Falcon 9'},
        {statement: 'The largest artificial satellite orbiting Earth', reveal: 'International Space Station'},
        {statement: 'The spacecraft that first landed on the Moon', reveal: 'Apollo 11'},
        {statement: 'The largest moon in the solar system', reveal: 'Ganymede'},
        {statement: 'The planet that has the most moons', reveal: 'Jupiter'},
        {statement: 'The planet that has the fewest moons', reveal: 'Uranus'},
        {statement: 'The smallest planet in the solar system', reveal: 'Mercury'},
    ]

    let revolvingTimeline = useRef(gsap.timeline({repeat: -1}))

    function hideQuizOptions(viewing:number){
        
        let quizOptions = document.getElementById('quizOptions');
        if(quizOptions){
            quizOptions.style.pointerEvents = 'none';
            quizOptions.style.opacity = '0';
        }

        setTimeout(()=>{setViewingCard(viewing)},150)
    }
    function getCards(count:number){

        if(currentState!='generated') return null;

        return (cards || []).map((card:{front:string, reveal:string},i:number) => <div key={i} style={{'--position': i, '--quantity': count, animationDelay: `${i/(cards.length)}s`} as React.CSSProperties} className={"flashCard absolute sharpCorner-tl p-[1px] bg-foreground removeJagged "+(testScores[i]!=-1?'revealedCard':'')} onClick={()=>{hideQuizOptions(i);}}>
            <div className="sharpCorner-tl bg-background w-full h-full removeJagged flex flex-col">
                <Image src='https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' layout="fill" objectFit="cover" objectPosition="center" alt="pattern" className="mix-blend-multiply opacity-90"></Image>
                <div className="absolute w-full h-full bg-foreground mix-blend-color-burn z-[9]"></div>
                
                <div className={"w-full h-full p-2 text-foreground text-opacity-80 text-8xs flex justify-center items-center scale-[0.7] flex-col gap-2 z-20 "+tomorrow.className} style={{textRendering:'optimizeLegibility'}}>
                    {(card as any).front}
                    {!testMode?<div className="py-1 px-2 bg-foreground sharpCorner-tl text-background cursor-pointer hover:bg-bglight hover:text-foreground" onClick={(e)=>{revealCard(e)}}>Reveal</div>:null}
                </div>

                    <div className={"absolute h-full w-full bg-foreground z-[20] opacity-100 radialMask flex justify-center items-center text-background "+tomorrow.className+" "+(!testMode?'font-[700]':'')} onClick={(e)=>{if(!testMode)hideCard(e)}}>
                        {testScores[i]!=-1?<div className={"testScoreBG "+(testScores[i]==0?'checkedBG':'crossedBG')}></div>:null}
                        <div className="text-[0.7rem] w-[80%] z-10 " >{!testMode?card.reveal:card.front}</div>
                    </div>
            </div>
        </div>)
    }

    function revealCard(e: React.MouseEvent){
        let target = e.target as HTMLElement;
        let card = target.closest('.flashCard');

        console.log('Revealing card', card)
        if(!card) return;
        card.classList.add('revealedCard');
    }

    function hideCard(e: React.MouseEvent){
        let target = e.target as HTMLElement;
        let card = target.closest('.flashCard');

        console.log('Hiding card', card)
        if(!card) return;
        card.classList.remove('revealedCard');
    }

    async function processPrompt(){
         if(currentState!='prompt') return;
         setCurrentState('loadingCards')
    }

    useEffect(()=>{

        if(currentState=='prompt')
            focusPromptInput();
        if(currentState=='loadingCards')
        setTimeout(()=>{setCurrentState('waitingCards')},4000)

        if(currentState=='waitingCards')
            generateCards();
    },[currentState])

    async function generateCards()
    {
        console.log('Generating with prompt:', prompt)
        let res = await fetch('api/generateCards',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({topic:prompt, count: 15, difficulty, model})
        })

        let json = await res.json()
        if(json.error) return;
        console.log('Generated Cards:',json)
        setCards(JSON.parse(json).cards)
        setCurrentState('generated')
    }

    useEffect(()=>{
        if(cards){
            let randomOptionString = Array(cards.length).fill(0).map(()=>Math.round(Math.random()*2)).join('');
            setRandomString(randomOptionString)
            setTestScores(Array(cards.length).fill(-1) as any)
        }
    },[cards])

    function getLoadingText(){
        let chars = prompt.split('')
        let f = chars.map((c,i) => <div key={i} className="flex flex-col text-transparent">
        {([chars[i]]).map((c,j) => <div className="flex w-[75px] justify-center" key={j}>{c!=' '?c:'\u00A0'}</div>)}
    </div>)

        let ySpacing = -Math.round(((chars.length)*100/(chars.length+1))*100)/100 +'%';
        let s = chars.map((c,i) => <div key={i} className={"flex flex-col "+(currentState!='generated'?'loadingTextSlider':'loadingTextSliderPulse')} >
            {( i%2==0 ? [...(chars.slice(i).concat(chars.slice(0,i))), chars[i]] :  [...(chars.slice(i).concat(chars.slice(0,i))), chars[i]].reverse()).map((c,j) => <div className="flex w-[75px] justify-center" key={j}>{c!=' '?c:'\u00A0'}</div>)}
        </div>)
        //+(['loadingCards', 'waitingCards', 'generated'].includes(currentState)?"scaledVisible":"scaledInvisible")
        return (
            <div className={"flex relative text-8xl text-foreground p-0 "+(Rondal.className)+" overflow-hidden scale-[5] opacity-0 "+(['loadingCards', 'waitingCards', 'generated'].includes(currentState)?"scaledVisible":"")} key={chars.length} onClick={()=>{setViewingCard(-1)}}>
                <div className="flex">{f}</div>
                <div className="flex absolute w-full" style={{'--ySpacing':ySpacing} as React.CSSProperties}>{s}</div>
            </div>
        )
    }


    useGSAP(() => {
        //revolvingTimeline.current.set('#slider', {rotateX: -16})
        
        if(!['loadingCards', 'waitingCards', 'generated'].includes(currentState)) return;
        const slider = document.getElementById('slider') as HTMLElement;
        if(!slider) return
        const revValue = (slider.style.transform)?{X:slider.style.transform.split('rotateX(')[1].split('deg')[0],Y:slider.style.transform.split('rotateY(')[1].split('deg)')[0]}:{X:-16,Y:0}
        console.log('Got Rev Value: ',revValue)
        revolvingTimeline.current.clear();

        revolvingTimeline.current.to(revValue, {X:"-16deg", duration:1,repeat: 0, ease:'expo.inOut', onUpdate:()=>{
            slider.style.transform = `perspective(1000px) rotateX(${revValue.X}) rotateY(${revValue.Y as any%360}deg)`

        }})

        revolvingTimeline.current.to(revValue, {Y:"+=360", duration:20, ease:'none', onUpdate:()=>{
            slider.style.transform = `perspective(1000px) rotateX(${revValue.X}) rotateY(${revValue.Y as any%360}deg)`

        }
    })
    }, [viewingCard, currentState])

    useGSAP(()=>{
        
        console.log('Paused Cards')
        revolvingTimeline.current.paused(viewingCard!=-1)
        if(viewingCard!=-1)
        {
            let slider = document.getElementById('slider') as HTMLElement;
            let quizOptions = document.getElementById('quizOptions') as HTMLElement;
            let cardCount = cards.length;
            if(!slider) return;
            const currentXY = {X:slider.style.transform.split('rotateX(')[1].split('deg')[0],Y:slider.style.transform.split('rotateY(')[1].split('deg)')[0]}
            gsap.to(currentXY, {X:-5, Y:-((viewingCard+(cardCount-1))%cardCount)*(360/cardCount), duration:1, ease:'expo.inOut', onUpdate:()=>{
                console.log('Pausing card: ',currentXY)
                slider.style.transform = `perspective(1000px) rotateX(${currentXY.X}deg) rotateY(${parseInt(currentXY.Y)%360}deg)`
            }, onComplete:()=>{
                if(quizOptions){
                    quizOptions.style.pointerEvents = 'auto';
                    quizOptions.style.opacity = '1';
                }
            }})
        }
    },[viewingCard])

    function focusPromptInput(){
        if(promptInputRef.current) (promptInputRef.current as HTMLElement).focus()
    }

    function getTCEmoji(){
        let correct = testScores.filter(s=>s==0).length
        if(correct==0)
            return <IoSkull/>
        else if(correct<5)
            return <IoSad/>
        else if(correct<9)
            return <IoHappy/>
        else
            return <MdCelebration/>
    }

    return(
        <div className="w-full h-full text-green relative overflow-hidden flex items-center justify-center" style={{textAlign:'center'}}>
            <div className={"absolute top-[20px] smoothTransition "+(currentState=='savedDecks'?'left-1/2 -translate-x-1/2':'left-[5px] scale-[0.5] opacity-80')}>
                <Image src='/10Cards.svg' width={182.4} height={76.8} alt="logo"/>
            </div>
            <div className={"absolute w-screen h-screen flex flex-col z-[15] top-0 "+(currentState=='savedDecks'?'left-0':'-left-full opacity-0')} style={{transition:'all 1s ease'}}>
                <SavedDecks setCurrentState={setCurrentState} setPrompt={setPrompt}/>
            </div>
            <div className={"promptInput border-b-2 border-foreground flex text-foreground absolute -translate-x-1/2 -translate-y-1/2 left-1/2 z-10  "+(currentState=='prompt'?'top-1/2':'-top-[40%]')} style={{transition:'all 0.3s ease, top 1s ease'}}>
                <input ref={promptInputRef} type="text" placeholder="Enter topic here" value={prompt} className="noDefaultInput" onChange={(e)=>{setPrompt(e.target.value.substring(0,15))}} onKeyDownCapture={(e)=>{if(e.key=='Enter'){processPrompt()}}}/>
                <BiRightArrow className="cursor-pointer hover:scale-110" onClick={()=>{processPrompt()}}/>
                <div className="absolute top-full left-1/2 -translate-x-1/2 flex mt-4 bg-foreground p-[2px] octagonDiv">
                    <div className="bg-background flex cursor-pointer octagonDiv">
                        <div className={"flex px-2 py-1 border-r-[2px] border-foreground font-chivo text-opacity-70 smoothTransition "+(difficulty=='beginner'?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setDifficulty('beginner')}}>Beginner</div>
                        <div className={"flex px-2 py-1 border-r-[2px] border-foreground font-chivo text-opacity-70 smoothTransition "+(difficulty=='general'?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setDifficulty('general')}}>General</div>
                        <div className={"flex px-2 py-1 border-foreground font-chivo text-opacity-70 smoothTransition "+(difficulty=='advanced'?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setDifficulty('advanced')}}>Advanced</div>
                    </div>
                </div>
                <div className="absolute top-[300%] left-1/2 -translate-x-1/2 flex mt-4 bg-foreground p-[2px] octagonDiv">
                    <div className="bg-background flex cursor-pointer octagonDiv">
                        <div className={"flex px-2 py-1 border-r-[2px] border-foreground font-chivo text-opacity-70 smoothTransition "+(!testMode?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setTestMode(false)}}>
                            <div>Learn</div>
                            <div className={"overflow-hidden "+(testMode?'max-w-[0px] ml-[0px]':'max-w-[100px] ml-2')}>Mode</div>
                        </div>
                        <div className={"flex px-2 py-1 border-r-[2px] border-foreground font-chivo text-opacity-70 smoothTransition "+(testMode?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setTestMode(true)}}>
                            <div>Test</div>
                            <div className={"overflow-hidden "+(!testMode?'max-w-[0px] ml-[0px]':'max-w-[100px] ml-2')}>Mode</div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-[500%] left-1/2 -translate-x-1/2 flex mt-4 bg-foreground p-[2px] octagonDiv">
                    <div className="bg-background flex cursor-pointer octagonDiv">
                        <div className={"flex px-2 py-1 border-r-[2px] border-foreground font-chivo text-opacity-70 smoothTransition "+(model=='llama'?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setModel('llama')}}>Llama</div>
                        <div className={"flex px-2 py-1 border-r-[2px] border-foreground font-chivo text-opacity-70 smoothTransition "+(model=='gemma'?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setModel('gemma')}}>Gemma</div>
                        <div className={"flex px-2 py-1 border-foreground font-chivo text-opacity-70 smoothTransition "+(model=='mistral'?'bg-foreground text-background ':'bg-background text-foreground')} onClick={()=>{setModel('mistral')}}>Mistral</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center relative" style={{transition:'top 1s ease',top:(viewingCard==-1?'0px':'200px')}}>
                {getLoadingText()}
                <div className="flex relative w-full justify-center">
                    <div className={"mt-4 w-[50px] h-[5px] bg-foreground relative translate-x-1/2 "+(currentState=='waitingCards'?'animateLeftToFro':'opacity-0 pointer-events-none noAnimation')}></div>
                    <div className={"mt-4 w-[50px] h-[5px] bg-foreground relative -translate-x-1/2 "+(currentState=='waitingCards'?'animateRightToFro':'opacity-0 pointer-events-none noAnimation')}></div>
                    <div className="font-chivo text-foreground absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1 overflow-hidden">
                        <div className={(currentState=='waitingCards'?"YTextAnimation":"opacity-0 noAnimation")}>
                            GENERATING
                        </div>
                    </div>
                </div>
            </div>
            <div id='slider'>
                {getCards(cards.length)}
            </div>
            <div className={"flex absolute bottom-[50px] "+(viewingCard==-1?'opacity-0':'opacity-100')} style={{transition:'all 4s ease'}}>
                {(testMode && cards.length!=0 && viewingCard!=-1 && "wrongs" in cards[viewingCard])?<div id="quizOptions" className={"flex justify-around items-center gap-16 smoothTransition "}>
                    <div className={tomorrow.className+' font-bold'}>Pick correct option:</div>
                    {parseInt(randomString.charAt(viewingCard))==0?<div className=" octagonDivMax p-[1px] bg-foreground cursor-pointer " onClick={(e)=>{if(testScores[viewingCard]==-1){let temp = [...testScores] as number[];temp[viewingCard]=0;setTestScores(temp)}}}>
                        <div className={"octagonDivMax bg-background px-2 py-1 text-xl flex items-center gap-2 "+tomorrow.className+" "+(testScores[viewingCard]==0?"bg-foreground text-background":"bg-background")}>{testScores[viewingCard]==-1?<FaCaretRight size={14}/>:<FaCheck size={14}/>}{(cards[viewingCard] as any).reveal}</div>
                    </div>:null}

                    <div className=" octagonDivMax p-[1px] bg-foreground cursor-pointer " onClick={(e)=>{if(testScores[viewingCard]==-1){let temp = [...testScores] as number[];temp[viewingCard]=1;setTestScores(temp)}}}>
                        <div className={"octagonDivMax bg-background px-2 py-1 text-xl flex items-center gap-2 "+tomorrow.className+" "+(testScores[viewingCard]==1?"bg-foreground text-background":"bg-background")}>{testScores[viewingCard]==-1?<FaCaretRight size={14}/>:<FaXmark size={14}/>}{(cards[viewingCard] as any).wrongs[0]}</div>
                    </div>

                    {parseInt(randomString.charAt(viewingCard))==1?<div className=" octagonDivMax p-[1px] bg-foreground cursor-pointer " onClick={(e)=>{if(testScores[viewingCard]==-1){let temp = [...testScores] as number[];temp[viewingCard]=0;setTestScores(temp)}}}>
                        <div className={"octagonDivMax bg-background px-2 py-1 text-xl flex items-center gap-2 "+tomorrow.className+" "+(testScores[viewingCard]==0?"bg-foreground text-background":"bg-background")}>{testScores[viewingCard]==-1?<FaCaretRight size={14}/>:<FaCheck size={14}/>}{(cards[viewingCard] as any).reveal}</div>
                    </div>:null}

                    <div className=" octagonDivMax p-[1px] bg-foreground cursor-pointer " onClick={(e)=>{if(testScores[viewingCard]==-1){let temp = [...testScores] as number[];temp[viewingCard]=2;setTestScores(temp)}}}>
                    <div className={"octagonDivMax bg-background px-2 py-1 text-xl flex items-center gap-2 "+tomorrow.className+" "+(testScores[viewingCard]==2?"bg-foreground text-background":"bg-background")}>{testScores[viewingCard]==-1?<FaCaretRight size={14}/>:<FaXmark size={14}/>}{(cards[viewingCard] as any).wrongs[1]}</div>
                    </div>

                    {parseInt(randomString.charAt(viewingCard))==2?<div className=" octagonDivMax p-[1px] bg-foreground cursor-pointer " onClick={(e)=>{if(testScores[viewingCard]==-1){let temp = [...testScores] as number[];temp[viewingCard]=0;setTestScores(temp)}}}>
                        <div className={"octagonDivMax bg-background px-2 py-1 text-xl flex items-center gap-2 "+tomorrow.className+" "+(testScores[viewingCard]==0?"bg-foreground text-background":"bg-background")}>{testScores[viewingCard]==-1?<FaCaretRight size={14}/>:<FaCheck size={14}/>}{(cards[viewingCard] as any).reveal}</div>
                    </div>:null}

                </div>:null}
            </div>
            <div className={"absolute top-5 right-5 flex gap-2 items-center "+tomorrow.className+" "+(cards.length>0 && testMode?'opacity-80':'opacity-0 pointer-events-none')}>
                <div className={"relative overflow-hidden smoothTransition "+(cards.length>0 && testScores.filter(s=>s!=-1).length==cards.length?'max-w-[200px]':'max-w-[0px]')}>
                    <div className="flex gap-1 items-center text-nowrap">Test Completed {getTCEmoji()}</div>
                </div>
                <div className={"h-[3rem] bg-white smoothTransition "+(cards.length>0 && testScores.filter(s=>s!=-1).length==cards.length?'w-[1px]':'w-[0px]')}></div>
                <div className="flex flex-col text-lg">
                    <div className="flex cursor-pointer ">{Array(cards.length/2).fill(0).map((_,i)=>{
                        if(testScores[i]==-1)
                            return <MdOutlineCircle key={i} onClick={()=>setViewingCard(i)}/>
                        else if(testScores[i]==0)
                            return <IoMdCheckmark key={i} onClick={()=>setViewingCard(i)}/>
                        else
                            return <MdClose key={i} onClick={()=>setViewingCard(i)}/>
                    })}</div>
                    <div className="flex cursor-pointer">{Array(cards.length/2).fill(0).map((_,i)=>{
                        i=i+cards.length/2
                        if(testScores[i]==-1)
                            return <MdOutlineCircle key={i} onClick={()=>setViewingCard(i)}/>
                        else if(testScores[i]==0)
                            return <IoMdCheckmark key={i} onClick={()=>setViewingCard(i)}/>
                        else
                            return <MdClose key={i} onClick={()=>setViewingCard(i)}/>
                    })}</div>
                </div>
                <div className="w-[1px] h-[3rem] bg-white"></div>
                <div className="flex flex-col">
                    <div className="font-bold text-3xl">{testScores.filter(x=>x==0).length}/{cards.length}</div>
                    <div className="w-full h-[2px] bg-white mt-1"></div>
                    <div>Correct</div>
                </div>
            </div>
        </div>
    )
}