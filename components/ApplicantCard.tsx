//@ts-nocheck
import { FaFilePdf, FaGraduationCap, FaBriefcase, FaCode } from "react-icons/fa";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { Button } from "./ui/button";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

/**
 * Returns the first letter of the applicant's first and last name,
 * formatted as uppercase initials for display in avatars and badges.
 * Example: getApplicantInitials("Jane", "Doe") → "JD".
 */
export function getApplicantInitials(firstName: string, lastName: string): string {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  return `${f}${l}`;
}

/**
 * Resolves an applicant's status colour for the status badge.
 * Returns Tailwind colour classes mapped from status string.
 * Example: getApplicantStatusColor("hired") → "bg-green-100 text-green-700".
 */
export function getApplicantStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "hired":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "shortlisted":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/**
 * Formats a numeric experience-in-years value as a human-readable string.
 * Example: formatYearsOfExperience(0) → "Fresher", 1 → "1 year", 3 → "3 years".
 */
export function formatYearsOfExperience(years: number): string {
  if (years <= 0) return "Fresher";
  if (years === 1) return "1 year";
  return `${years} years`;
}

const ApplicantCard = ({ applicant }) => {
  const { session } = useSession()

  function createClerkSupabaseClient(): SupabaseClient {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {

          fetch: async (url: string, options: RequestInit = {}) => {
            const clerkToken = await session?.getToken({
              template: 'supabase',
            })

            const headers = new Headers(options.headers)
            headers.set('Authorization', `Bearer ${clerkToken}`)

            return fetch(url, {
              ...options,
              headers,
            })
          },
        },
      },
    )
  }

  const client = createClerkSupabaseClient()

  async function updateApplication(job_id, status) {
    const { data, error } = await client
      .from("applications")
      .update({ status })
      .eq("job_id", job_id)
      .select();
  
    if (error) {
      console.log("Error while updating status:", error);
      return null;
    }
  
    return data;
  }



  const handleStatusChange = (status) => {
    updateApplication(applicant.job_id, status);
  };


  return (
    <div className="p-6 border rounded-lg shadow-lg flex flex-col gap-4 bg-white">
      {/* Applicant Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{applicant.name}</h2>
        <div>
        <Select
            onValueChange={handleStatusChange}
            defaultValue={applicant.status}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
      </div>

      {/* Experience */}
      <div className="flex items-center gap-2 text-gray-700">
        <FaBriefcase className="text-lg" />
        <span>{applicant.experience} year(s) of experience</span>
      </div>

      {/* Education */}
      <div className="flex items-center gap-2 text-gray-700">
        <FaGraduationCap className="text-lg" />
        <span>{applicant.education}</span>
      </div>

      {/* Skills */}
      <div className="flex items-center gap-2 text-gray-700">
        <FaCode className="text-lg" />
        <span>Skills: {applicant.skills}</span>
      </div>

      {/* Resume */}
      <div className="flex items-center gap-2">
        <FaFilePdf className="text-lg text-red-500" />
        <a
          href={applicant.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View/Download Resume
        </a>
      </div>

      {/* Action Button */}
      <Button className="bg-blue-500 text-white hover:bg-blue-600">Contact Applicant</Button>
    </div>
  );
};

export default ApplicantCard;
