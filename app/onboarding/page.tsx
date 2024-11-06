"use client"
import {useEffect} from 'react'
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { useUser } from '@clerk/nextjs';
import {BarLoader} from 'react-spinners'
import { handleClientScriptLoad } from 'next/script';
import { useRouter } from 'next/navigation'
const page = () => {
  const router = useRouter()
  const {user , isLoaded } = useUser();

  const navigateUser = (currRole : String) => {
    currRole === "recruiter" ? router.push("/post-job") : router.push("/jobs")
  };

  const handleRoleSelection =async (role : String)=>{
    try {
      await user?.update({unsafeMetadata:{role}})
      console.log(`role updated to ${role}`);
      navigateUser(role);
    } catch (error) {
      console.error("error onboarding mein" , error);
    }
  }

  useEffect(()=>{
    if(user?.unsafeMetadata?.role){
      user?.unsafeMetadata?.role === "recruiter" ? router.push("/post-job") : router.push("/jobs")
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className='h-[600px]'>
      <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
      >
       <p className='text-white font-extrabold'> I am a ....</p><br /> 
       <button onClick={()=>handleRoleSelection('candidate')} 
       className='text-black font-bold text-[50px] m-4  hover:bg-yellow-500 rounded-md bg-yellow-400 py-3 px-5 '>
        Candidate
        </button> 
        <button onClick={()=>handleRoleSelection('recruiter')} 
        className='text-black text-[50px] m-4  font-bold hover:bg-blue-500 rounded-md bg-blue-400 py-3 px-5 '>
          Recruiter
        </button> 
      </motion.h1>
    </LampContainer>
    </div>
  )
}

export default page
