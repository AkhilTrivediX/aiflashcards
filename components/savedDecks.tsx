import localFont from 'next/font/local'
import Image from "next/image";
const Sterion = localFont({ src:  'Sterion.ttf'})
import {Tomorrow} from 'next/font/google'
import { PiPlus } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa';

const tomorrow = Tomorrow({ weight: ['300', '600'], subsets: ['latin'] })

const cards = [{
    name: 'SPACE',
    backgroundImg: 'https://images.pexels.com/photos/2644734/pexels-photo-2644734.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    statements: ['Nearest star after the Sun', 'Planet also called Evening star']
},{
    name: 'REACT',
    backgroundImg: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    statements: ['What is JSX?', 'Creators of React']
}]

export default function SavedDecks({
    setCurrentState,
    setPrompt
}:{
    setCurrentState: Function,
    setPrompt: Function
}) {
    return(
        <div className="w-full flex flex-col justify-center p-4 px-16 pt-28">
            <div className={tomorrow.className+" text-lg mb-2"}>Welcome back <strong>Akhil Trivedi</strong>,</div>
            <div className={"text-5xl font-600 text-foreground font-bold "+tomorrow.className}>Saved Decks</div>
            <div className="flex flex-wrap py-4  mt-8 gap-16">
                {cards.map((card, cardIndex) => (
                    <div className="card w-[250px] h-[350px] relative cursor-pointer" style={{perspective:'1000px'}} key={cardIndex} onClick={()=>{
                        setPrompt(card.name)
                        setCurrentState('loadingCards')
                    }}>
                    <div className="front sharpCorner-tl w-full h-full absolute top-0 left-0 z-[3] p-2 cardFrontBG">
                        <div className="w-full h-full sharpCorner-tl relative">
                            <Image src={card.backgroundImg} layout="fill" objectFit="cover" objectPosition="center" alt="pattern" className="mix-blend-multiply opacity-90"></Image>
                            <div className="w-full h-full absolute top-0 left-0 cardFrontBG mix-blend-color"></div>
                            <div className='relative z-[2] w-full h-full flex justify-center items-center'>
                                <div className={Sterion.className+" text-4xl text-foreground flex"}>{card.name}</div>
                            </div>
                        </div>
                        </div>
                        <div className={"mid1 w-1/2 aspect-square top-4 left-0 absolute z-[2] bg-foreground cutIcon-tr text-background  p-2 text-sm "+tomorrow.className}>
                            {card.statements[0]}
                        </div>
                        <div className={"mid3 w-1/2 h-1/2 top-4 right-0 absolute z-[2] bg-foreground cutIcon-tr text-background font-chivo p-2 text-sm "+tomorrow.className}>
                            {card.statements[1]}
                        </div>
                        <div className={"mid2 w-1/2 h-1/2 top-10 left-1/2 -translate-x-1/2 absolute z-[2] bg-bglight p-2 text-center font-semibold rounded-xl "+tomorrow.className}>
                            View Cards
                        </div>

                        <div className="back w-full h-full z-[1] cardFrontBG sharpCorner-tl">
                            <div className='w-full h-full absolute top-0 left-0 bg-black bg-opacity-50'></div>
                        </div>
                    </div>
                ))}
                <div className="card w-[250px] h-[350px] relative cursor-pointer sharpCorner-tl cardFrontBG p-2 hover:p-1 smoothTransition" style={{perspective:'1000px'}} key={'createCard'} onClick={()=>{
                        setCurrentState('prompt')
                    }}>
                        <div className='w-full h-full sharpCorner-tl bg-background bg-opacity-80'>
                            <div className={'w-full h-full justify-center items-center flex text-foreground text-2xl font-600 font-bold flex-col gap-2 animationParent '+tomorrow.className}>
                                <FaPlus size={32} className='animateScale animateOpacity'/>
                                <div className='animateScale animateOpacity'>Create New<br/> Deck</div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    )
}