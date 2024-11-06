//@ts-nocheck

'use client'
import { useEffect, useState } from 'react'
import { useSession, useUser } from '@clerk/nextjs'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { BarLoader } from 'react-spinners'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

export default function Home() {
  const [loading, setLoading] = useState(true)
  const { user , isLoaded } = useUser()
  const { session } = useSession()
  const [companies, setCompanies] = useState<any[]>([]); 
  const router = useRouter(); 
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: { title:"", description:"", location: "", company_id: "", requirements: "" },
    resolver: zodResolver(schema),
  });

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

  const onSubmit = (data) => {
    console.log("KYA SCENE")
    addNewJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });

    router.push("/jobs")
  };

  async function addNewJob(jobData) {
    const { data, error } = await client
      .from("jobs")
      .insert([jobData])
      .select();
  
    if (error) {
      console.error(error);
      throw new Error("Error Creating Job");
    }
    console.log(data);
    return data;
  }

  async function getCompanies(){
    const { data, error } = await client.from("companies").select("*");
  
    if (error) {
      console.error("Error fetching Companies:", error);
      return null;
    }
    setCompanies(data);
  }

  async function addCompany(companyData) {
    
    const random = Math.floor(Math.random() * 90000);
    const fileName = `logo-${random}-${companyData.name}`;

    const { error: storageError } = await client.storage
      .from("company-logo")
      .upload(fileName, companyData.logo);

    if (storageError) {
      console.log("storagerror");
      return null;
    }
    const logo_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/company-logo/${fileName}`;
    const { data, error } = await client
      .from("companies")
      .insert([
        {
          name:companyData.name,
          logo_url,
        }
      ])
      .select();

    if (error) {
      console.log("insering madhe error");
      return null;
    }
    return data;
  }

  useEffect(() => {
    if (!user) return
    getCompanies();
  }, [user , isLoaded])

  return (
    <div>
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='flex p-4 flex-col gap-2'>
        
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        
        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        
        <Textarea placeholder="Job Requirements" {...register("requirements")} />
        {errors.requirements && (
            <p className="text-red-500">{errors.requirements.message}</p>
          )}

        <Input placeholder="Location" {...register("location")} />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}

        
        {companies.length > 0 && (
        <Controller
        name="company_id"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Company">
                {field.value
                  ? companies?.find((com) => com.id === Number(field.value))
                      ?.name
                  : "Company"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companies?.map(({ name, id }) => (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      )}
      {errors.company_id && (
        <p className="text-red-500">{errors.company_id.message}</p>
      )}

        <Button type="submit" size="lg" className="mt-2">
          Submit
        </Button>
      </form>   
    </div>
  )
}
