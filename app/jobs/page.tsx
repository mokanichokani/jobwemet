//@ts-nocheck
'use client'
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { BarLoader } from 'react-spinners'
import JobCard from '@/components/JobCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Job {
  id: string
  title: string
  location: string
  company_id: string
}

interface LoadTasksParams {
  location?: string
  company_id?: string
  searchQuery?: string
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const { user , isLoaded } = useUser()
  const { session } = useSession()
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
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

    if(query) setSearchQuery(query)
      loadTasks({ searchQuery: query });
  }

  async function loadTasks({ location, company_id, searchQuery }: LoadTasksParams): Promise<void> {
    setLoading(true)
    let query = client.from('jobs').select('*, company:companies(name,logo_url), saved: saved_jobs(id)')
    if (location) {
      query = query.eq('location', location)
    }

    if (company_id) {
      query = query.eq('company_id', company_id)
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }
    const { data, error } = await query
    console.log(data);
    if (!error) setJobs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!user) return
    loadTasks({})
   
  }, [user , searchQuery , location , company_id , isLoaded])

  return (
    <div>
      {!isLoaded && <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>}
      <form onSubmit={handleQuery} className='flex gap-2 p-1'>
        <Input type="text" placeholder="Search jobs by title" name="search-query" />
        <Button type="submit" className='bg-blue-500'>Search</Button>
      </form>
        <div className='flex m-3 flex-wrap gap-2 p-3   '>
           {jobs.map((job) => (
            <JobCard job={job}/>
          ))} 
        </div>
    </div>
  )
}
