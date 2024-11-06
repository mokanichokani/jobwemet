'use client';
import { useState } from 'react';

import React from 'react';
import { FaPlus } from "react-icons/fa";
import { SlUserFollow, SlCalender } from "react-icons/sl";
import { IoMdVideocam } from "react-icons/io";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import MeetingModal from './MeetingModal';

const MeetingTypeList = () => {

  let [meetingState, setMeetingState] = useState<'isInstantMeeting' | 'isScheduleMeeting'| 'isJoiningMeeting' | undefined>();
  const router = useRouter();

  const { user }  =useUser();
  const client = useStreamVideoClient();

  const [values , setValues] = useState({
    dateTime: new Date() ,
    description :'',
    Link:''
  });

  const [callDetails , setcallDetails] = useState<Call>()
  
  const createMeeting= async()=>{
    if (!user ) {
      console.error('User is not initialized');
      return;
    }
    if (!user || !client) {
      console.error('client is not initialized');
      return;
    } 
    try {
      const id = crypto.randomUUID();
      const call =  client.call('default' , id);
      if(!call) throw new Error('Failed to create call');

      const startsAt = values.dateTime.toISOString()  || new Date(Date.now()).toISOString();
      new Date(Date.now()).toISOString;

      const description = values.description ||  "Instant meeting";
     

      await call.getOrCreate({
        data:{
          starts_at:startsAt,
          custom:{
            description
          }
        }
      })

      setcallDetails(call);

      if(!values.description){
        router.push(`/jwmeet/meeting/${call.id}`);
      }


    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className='flex justify-around'>
      <MeetingOption 
        bgColor='bg-purple-600' 
        icon={FaPlus} 
        title='New Meeting' 
        description='Set up a new recording' 
        handleClick={() => setMeetingState('isInstantMeeting')}
      />

      {!callDetails ?  
      <MeetingModal 
      isOpen = {meetingState==='isScheduleMeeting'}
      onClose ={()=>setMeetingState(undefined)}
      title ="Create Meeting"
      className="text-center"
      buttonText="Create"
      handleClick={createMeeting}      
      /> : 
      <MeetingModal 
      isOpen = {meetingState==='isScheduleMeeting'}
      onClose ={()=>setMeetingState(undefined)}
      title ="Start an instant meeting"
      className="text-center"
      buttonText="Copy Meetings"
      handleClick={createMeeting}      
      />
      }

      <MeetingModal 
      isOpen = {meetingState==='isInstantMeeting'}
      onClose ={()=>setMeetingState(undefined)}
      title ="Start an instant meeting"
      className="text-center"
      buttonText="Start meeting"
      handleClick={createMeeting}      
      />
    </section>
  );
};

const MeetingOption = ({ bgColor, icon: Icon, title, description , handleClick }: { bgColor: string, icon: React.ElementType, title: string, description: string , handleClick? : ()=>void}) => {


  return (
    <div className={`${bgColor} w-[18rem] p-5 flex flex-col gap-10 rounded-lg cursor-pointer`}  onClick={handleClick}>
      <div className='bg-white w-fit p-2 opacity-75 rounded-md'>
        <Icon className='text-black' />
      </div>
      <div>
        <h1 className='font-bold text-2xl'>{title}</h1>
        <p className='text-black font-semibold'>{description}</p>
      </div>
    </div>
  );
};

export default MeetingTypeList;
