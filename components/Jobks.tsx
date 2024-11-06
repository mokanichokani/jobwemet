//@ts-nocheck
"use client";
import { useUser } from '@clerk/nextjs';
import Link from 'next/link'

const Jobks = () => {

    const {isSignedIn,  user} = useUser();
    const role = user?.unsafeMetadata?.role
  return (
    <div className='flex gap-10 mt-10'>
        <div className='flex gap-4'>
            {isSignedIn ? (<>{role==='recruiter' ? (<><Link href="/post-job"><button className='border-2 hover:bg-blue-800 rounded-md border-blue-400 font-bold text-xl py-[11px] px-[24px]'>Post a job</button> </Link> </>)  : (<> <Link href="/jobs"><button className='bg-blue-500 hover:bg-blue-700 rounded-md py-[12px] font-bold text-xl px-[24px]'>Find a Job</button></Link></> )}</>) : (<>
                <Link href="/jobs"><button className='bg-blue-500 hover:bg-blue-700 rounded-md py-[12px] font-bold text-xl px-[24px]'>Find a Job</button></Link>
                <Link href="/post-job"><button className='border-2 hover:bg-blue-800 rounded-md border-blue-400 font-bold text-xl py-[11px] px-[24px]'>Post a job</button> </Link> </>)}
        </div>
    </div>

  )
}

export default Jobks
