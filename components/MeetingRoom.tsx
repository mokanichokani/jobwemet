import {  CallControls, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout } from '@stream-io/video-react-sdk';
import React from 'react'
import { useState } from 'react';
import { cn } from '@/lib/utils';
// import { ButtWhite } from './ButtWhite';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { FaChalkboardTeacher , FaCode} from "react-icons/fa";
import { LayoutList, Users } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';
const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const [layout , setLayout ] = useState<CallLayoutType>('speaker-left');
  const [showPart , setShowPart] =useState(false);

  const CallLayout = ()=>{
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout/>;
      case 'speaker-left':
        setLayout('speaker-left');
        return  <SpeakerLayout participantsBarPosition='left'/>
      default:
        return  <SpeakerLayout participantsBarPosition='right'/>
    }
  }
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 bg-black text-white">
      {/* <div>
        <Image src='/JOB__1_-removebg-previesssssssw.png' height={30} width={30}/>
      </div> */}
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">   
          <CallLayout/>       
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showPart,
          })}
        >
          <CallParticipantsList onClose={() => setShowPart(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls/>
        <a href="/whiteboard" target="_blank" rel="noopener noreferrer">
    <button className='bg-white p-2 rounded-md'>
        <FaChalkboardTeacher className='text-black'/>
    </button>
</a>
<a href="/cwm" target="_blank" rel="noopener noreferrer">
    <button className='bg-white p-2 rounded-md'>
        <FaCode className='text-black'/>
    </button>
</a>
{/* 
        <DropdownMenu>
        <div className='flex items-center'>
            <DropdownMenuTrigger>
              <LayoutList size={20} className='text-white bg-black' />
            </DropdownMenuTrigger>
        </div>
          <DropdownMenuContent className='bg-black text-white'>
            {['Grid','Speaker-left' ,'Speaker-Right'].map((item , index)=>(<div key={item}>
              <DropdownMenuItem onClick={()=>{setLayout(item.toLowerCase() as CallLayoutType)}}>
                {item}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </div>))}
          </DropdownMenuContent>
        </DropdownMenu>
        <ButtWhite/> */}
      </div>
    </section>
  )
}

export default MeetingRoom
