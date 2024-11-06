import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'

const MeetingSetup = ({setisSetupcomplete}: {setisSetupcomplete : (value:boolean)=>void}) => {
    const [isMicCam , setisMicCam]= useState(false);
    const call = useCall();


    if(!call) throw new Error("useCall ka issue horela hai");

    useEffect(()=>{
        if(isMicCam){
            call?.camera.disable();
            call?.microphone.disable();
        }
        else{
            call?.camera.enable();
            call?.microphone.enable();
        }
    },[isMicCam , call?.camera , call?.microphone]);
  return (
    <div className='flex bg-blue-300 items-center justify-center h-screen w-full flex-col '>
        {/* <div className='h-[600px]  w-[1000px]'> */}
        <VideoPreview className='h-[600px]  w-[1000px]'/>
        {/* </div> */}
        <div className='flex gap-2'>
        <div>
            <label ><input type='checkbox' checked={isMicCam} onChange={(e)=> setisMicCam(e.target.checked)} /> Turn on mic and cam</label>
         </div>
        <div className=''>
        <DeviceSettings/>
        </div>
        </div>
         <div>
            <button className='bg-green-400 rounded-md hover:bg-green-500 p-2' onClick={()=>{call.join();
                setisSetupcomplete(true)
            }}
                > Join Meeting</button>
         </div>
    </div>
  )
}

export default MeetingSetup
