'use client';

import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetcallbyid } from '@/hooks/useGetcallbyId';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import '@stream-io/video-react-sdk/dist/css/styles.css'
const Meeting = ({params : {id}}: {params : {id : string}}) => {

  const {user , isLoaded } = useUser();
  const [isSetupcomplete , setisSetupcomplete] = useState(false);
  const {call , isCallLoading } = useGetcallbyid(id);

  if(!isLoaded || isCallLoading) return <div className='flex justify-center item'>Loader</div>

  return (
    <main className='h-screen w-full'>
      <StreamCall call={call}>
        <StreamTheme>
          {isSetupcomplete ? 
          <MeetingRoom/>:<MeetingSetup setisSetupcomplete ={setisSetupcomplete} /> }
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting
