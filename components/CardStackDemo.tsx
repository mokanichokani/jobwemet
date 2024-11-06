"use client";
import { CardStack } from "./ui/card-stack";
import { cn } from "@/lib/utils";
export function CardStackDemo() {
  return (
    <div className=" flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-yellow-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 1,
    name: "Jane Doe",
    designation: "HR Specialist at Acme Corp",
    content: (
      <p>
        Job We Met has streamlined our hiring process at Acme Corp. Its easy-to-use
        interface and efficient candidate matching have saved us time and improved
        the quality of hires. <Highlight>Highly recommended</Highlight>!
      </p>
    ),
  },
  {
    id: 2,
    name: "John Smith",
    designation: "Software Engineer at Tech Innovators",
    content: (
      <p>
        I landed my dream job quickly with <Highlight>Job We Met</Highlight>. The
        platform's filters and job alerts are spot-on. It’s a great tool for job
        seekers!
      </p>
    ),
  },
  {
    id: 3,
    name: "Emily Johnson",
    designation: "Recruitment Manager at Future Enterprises",
    content: (
      <p>
        <Highlight>Job We Met</Highlight> has been a huge asset for Future Enterprises.
        The candidate pool is excellent, and the platform’s filters save us tons of
        time. A must-use for hiring!
      </p>
    ),
  },
  {
    id: 4,
    name: "Michael Lee",
    designation: "Marketing Director at Creative Solutions",
    content: (
      <p>
        <Highlight>Job We Met</Highlight> has greatly helped us at Creative Solutions.
        We found top-notch professionals quickly and efficiently. It’s our go-to for
        all hiring needs.
      </p>
    ),
  },
  {
    id: 5,
    name: "Sophia Martinez",
    designation: "Job Seeker",
    content: (
      <p>
        <Highlight>Job We Met</Highlight> made my job search effortless. I found
        relevant opportunities fast, and the job alerts were incredibly helpful.
        Highly recommended for job seekers!
      </p>
    ),
  },
    
];
