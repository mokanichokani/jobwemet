///@ts-nocheck
'use client';   
import { SignInButton , SignedIn , SignIn, UserButton , SignedOut } from '@clerk/nextjs';
import  { useState } from 'react';
import Image from 'next/image';
import { MdOutlineScreenShare, MdPostAdd } from "react-icons/md";
import { FaBriefcase, FaHeart } from "react-icons/fa";
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const Navbar = () => {

  const {user} = useUser();

  return (
    <div className='flex items-center gap-[500px] p-2'>
        <div className='px-14 '>
            <a href='/'>
            <Image src='/JOB_2.png'  alt='logo' width={120} height={120} />
            </a>
        </div>
        <div className='flex ml-[100px] gap-8 items-center'>
          <a  href="/scraping">
          <FlyoutLink >
        Scrape
      </FlyoutLink>
          </a>
          <a href="/about">
          <FlyoutLink >
        About
      </FlyoutLink>
          </a>
      <FlyoutLink FlyoutContent={productContent} >
            
      </FlyoutLink>
          <SignedOut>
       <Link href="/sign-in">
       <button  className='bg-[#ffd105] p-3 flex items-center gap-2 hover:bg-yellow-500 px-4 rounded-md'>Login</button></Link>
      </SignedOut>
      <SignedIn>
        {user?.unsafeMetadata?.role==='recruiter' &&
        <Link href="/jwmeet">
                            <button className='bg-[#ffd105] p-3 flex items-center gap-2 hover:bg-yellow-500 px-4 rounded-md'>
                  <MdPostAdd/>
                  Job we meet</button>
        </Link>
        }
          <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<FaBriefcase size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<FaHeart size={15} />}
                  href="/saved-jobs"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
    </SignedIn>
    </div>

    </div>
    
  )
};

const FlyoutLink = ({children  , href , FlyoutContent}) =>{
    const [isOpen, setIsOpen] = useState(false);

    const showFlyout = isOpen && FlyoutContent;

    return (
        <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)} 
        className='relative h-fit w-fit '>
            <a href={href} className={`${isOpen ? 'text-[#ffd105] cursor-pointer' : 'text-black'} relative font-work`}>{children}
                <span 
                style={{
                    transform: isOpen ? 'scaleX(1)' : 'scaleX(0)'
                }}
                className='absolute -bottom-2 -left-2 -right-2 bg-[#ffd105] h-1 rounded-full origin-left transition-transform
                duration-300 ease-out'/>
            </a>
            { showFlyout && <div className='absolute left-1/2 top-12 '>
                <div className='bg-transparent absolute -left-1/2 -top-6 right-[8rem] h-6 z-10' />
            <FlyoutContent/></div>}
        </div>
    )
};


const productContent = () => {
    return (
        <div className='flex font-bold   font-sans h-[17rem] w-[30rem] bg-white p-6 shadow-xl -translate-x-1/2'>
          <div className='flex-1  p-2 border-yellow-200 border-r-2'>
            <h1 className='font-sans hover:cursor-pointer hover:text-[#ffd105]'>HIRE SUITE</h1>

            <ContentMaker/>
            <ContentMaker/>
            


          </div>
          <div className='flex-1 p-2 pl-10'>
          <h1 className='font-sans hover:cursor-pointer hover:text-[#ffd105]'>DEVELOP SUITE</h1>
            <ContentMaker/>
            <ContentMaker/>
          </div>
        </div>
    )
}
const ContentMaker=()=>{
  return (
            <div className='flex mt-4'>    
            <div className='flex gap-2 p-2'>
            <MdOutlineScreenShare style={{ fontSize:'25px' }}/>
            </div>
            <div>
            <h1 className='hover:cursor-pointer hover:text-[#ffd105]'>Pre-screen</h1>
              <p className='font-normal text-sm '>Hire the top   talent</p>
            </div>
            </div>
  );
}

export default Navbar
