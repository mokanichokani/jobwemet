import React, { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  instantMeeting?: boolean;
  image?: string;
  buttonClassName?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  instantMeeting,
  image,
  buttonClassName,
  buttonIcon,
}: MeetingModalProps)=> {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
  {/* <DialogTrigger>Open</DialogTrigger> */}
  <DialogContent className='text-2xl font-bold'>
    {title}
    <button className='bg-yellow-400 text-sm font-semibold p-4 rounded-lg w-fit' onClick={handleClick}>{buttonText}</button>
  </DialogContent>
</Dialog>
    </div>
  ) 
}

export default MeetingModal
