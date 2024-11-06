//@ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { BarLoader } from 'react-spinners'
import { useParams } from 'next/navigation'
import { FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation'
import AppllyNow from '@/components/AppllyNow'
import ApplicantCard from '@/components/ApplicantCard'
// import { AppllyNow } from '@/components/AppllyNow'
interface LoadTasksParams {
  location?: string
  company_id?: string
  searchQuery?: string
}

export default function Home() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const { user , isLoaded } = useUser()
  const { session } = useSession()
  const router = useRouter()
  const params = useParams<{ id: string }>()
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

  const handleQuery=(e: any)=>{
    e.preventDefault();
    let formdata = new FormData(e.target);

    const query = formdata.get("search-query")
  }

  const handleOpening =async (isOpen : boolean)=>{
    let query = client.from('jobs').update({isOpen}).eq("id" ,jobs[0].id)
    const { data, error } = await query
    router.refresh();
  }

  async function loadTasks(): Promise<void> {
    setLoading(true)
    let query = client.from('jobs').select('*, company:companies(name,logo_url), applications:applications(*)').eq("id" ,params.id)
    const { data, error } = await query
    console.log(typeof(params.id))
    console.log(data);
    console.log(user.id)  
    if (!error) setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!user) return
    loadTasks()
   
  }, [user  , isLoaded])

  return (
    <div>
      {!isLoaded && <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>}


      {jobs.length > 0 ? (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        {/* Loader */}
        {!isLoaded && (
          <div className="fixed top-0 left-0 right-0">
            <BarLoader width={"100%"} color="#36d7b7" />
          </div>
        )}
        
        <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="relative">
            {/* Company logo and title */}
            <div className="flex items-center p-8 bg-gradient-to-r from-blue-500 to-blue-800">
              <img
                className=" w-40 bg-black p-2 rounded-md  border-2 border-white shadow-md"
                src={jobs[0].company.logo_url}
                alt={jobs[0].company.name + " logo"}
              />
              <div className="ml-6">
                <h1 className="text-4xl font-bold text-white">{jobs[0].title}</h1>
                <p className="text-lg text-gray-200">{jobs[0].company.name}</p>
                {jobs[0].recruiter_id=== user.id && (jobs[0].isOpen ? <a href={`/job/${params.id}`}><button onClick={()=>{handleOpening(false)}} className='bg-red-500 text-white mt-5 font-bold text-xl p-3 rounded-md'>Close Application</button></a> : <a href={`/job/${params.id}`}><button onClick={()=>{handleOpening(true)}} className='bg-green-500 mt-5 text-white font-bold text-xl p-3 rounded-md'>Open Application</button></a>)}
              </div>
              
            </div>

           
            {/* Job description */}
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800">Job Description</h2>
              <p className="text-gray-600 mt-2">{jobs[0].description}</p>
  
              {/* Requirements Section */}
              <h2 className="text-2xl font-semibold text-gray-800 mt-6">Requirements</h2>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                {jobs[0].requirements.split("\n").map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
  
              {/* Job Details */}
              <h2 className="text-2xl font-semibold text-gray-800 mt-6">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
                    <FaMapMarkerAlt className="text-blue-600 mr-3" size={24} />
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Location</h3>
                      <p className="text-gray-600">{jobs[0].location}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
                    <FaCalendarAlt className="text-blue-600 mr-3" size={24} />
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Posted On</h3>
                      <p className="text-gray-600">{new Date(jobs[0].created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
                    <FaBuilding className="text-blue-600 mr-3" size={24} />
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Company</h3>
                      <p className="text-gray-600">{jobs[0].company.name}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center">
                    {jobs[0].isOpen ? (
                      <FaCheckCircle className="text-blue-500 mr-3" size={24} />
                    ) : (
                      <FaTimesCircle className="text-red-500 mr-3" size={24} />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Is Open</h3>
                      <p className={`${jobs[0].isOpen ? "text-green-500 font-bold text-xl" : "text-red-500 font-bold text-xl" }`}>
                        {jobs[0].isOpen ? 'Open for Applications' : 'Closed'}
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
  
          {/* Footer */}

          {jobs[0].recruiter_id !== user.id ?
          <div className='flex justify-center items-center mb-32'>
            <AppllyNow 
                job={jobs[0]}              
                applied={jobs[0]?.applications?.find((ap)=>ap.candidate_id===user.id)}
                user={user}
                fetchJob={loadTasks}
                />
          </div> : <div>
            {jobs[0]?.applications.map((applicant)=>
            <ApplicantCard
             key={applicant.id} 
             applicant={applicant}/>)}
            </div>
          }

        </div>
      </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
