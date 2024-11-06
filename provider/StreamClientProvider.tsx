'use client';

import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
  } from '@stream-io/video-react-sdk';
  import { useEffect, useState } from 'react';
  import { useUser  } from '@clerk/nextjs';
  import { tokenProvider } from '@/actions/stream.action';
import Loader from '@/components/Loader';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  
  export const StreamVideoProvider = ({children}:{children:React.ReactNode}) => {
    let  [videoClient , setvideoClient]=useState<StreamVideoClient>();
    const {user , isLoaded} = useUser();

    useEffect(()=>{
        if(!user || !isLoaded) return;
        if(!apiKey) throw new Error('Stream API key is not provided');

        const client = new StreamVideoClient({
            apiKey ,
            user:{
                id:user?.id,
                name:user?.username || user?.id,
                image:user?.imageUrl,  
            },
            tokenProvider
    });
    
    setvideoClient(client);
    
    },[user , isLoaded]);

    if(!videoClient) return <Loader/>;
    return ( 
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
  };