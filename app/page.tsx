import React from 'react'
import { CoverDemo } from '@/components/CoverDemo'
import { CardStackDemo } from '@/components/CardStackDemo'
import Marquee from '@/components/magicui/marquee';
import { MarqueeDemo } from '@/components/MarqueeDemo';
import Link from 'next/link';
import Jobks from '@/components/Jobks';
import Navbar from '@/components/Navbar';
const page = () => {
  return (
    <div>
      <Navbar/>
          <div>
    <div className='flex items-center justify-evenly  h-[32rem]'>
      <div className=''>
        <CoverDemo/>
            <Jobks/>
        </div>
      <div className='w-fit h-fit'><CardStackDemo/></div>
    </div>
    <MarqueeDemo/>
    </div>
    </div>
  );
}

export default page