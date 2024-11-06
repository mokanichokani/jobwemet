import MeetingTypeList from '@/components/MeetingTypeList';
import React from 'react'

const page = () => {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);
  return (
<section className="  ">

  <MeetingTypeList/>
    </section>
  )
}

export default page
