//@ts-nocheck
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession, useUser } from '@clerk/nextjs';

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user , isLoaded } = useUser();
  const { session } = useSession();

  function createClerkSupabaseClient(): SupabaseClient {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url: string, options: RequestInit = {}) => {
            const clerkToken = await session?.getToken({
              template: 'supabase',
            });

            const headers = new Headers(options.headers);
            headers.set('Authorization', `Bearer ${clerkToken}`);

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      }
    );
  }

  const client = createClerkSupabaseClient();

  async function saveJob(alreadySaved: boolean, saveData: any) {
    if (alreadySaved) {
      
      const { data, error: deleteError } = await client
        .from("saved_jobs")
        .delete()
        .eq("job_id", saveData.job_id)
        .eq("user_id", saveData.user_id); 
      if (deleteError) {
        console.error("Error removing saved job:", deleteError);
        return;
      }
      return data;
    } else {
      
      const { data, error: insertError } = await client
        .from("saved_jobs")
        .insert([saveData]);

      if (insertError) {
        console.error("Error saving job:", insertError);
        return;
      }
      return data;
    }
  }

  const handleSave = async () => {
    if (!isLoaded || !user) return;

    const saveData = {
      job_id: job.id,
      user_id: user.id, // Save the job for the specific user
    };

    // Call saveJob function
    const data = await saveJob(saved, saveData);

    // Update the UI
    setSaved(!saved);

    // Trigger any callback after saving/removing
    onJobAction();
  };

  return (
    <div className="w-[450px]">
      <Card className="flex h-[300px] flex-col">
        <CardHeader className="flex">
          <CardTitle className="flex justify-between font-bold">
            {job.title}
            {isMyJob && (
              <Trash2Icon
                fill="red"
                size={18}
                className="text-red-300 cursor-pointer"
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
          <div className="flex justify-between">
            {job.company && <img src={job.company.logo_url} className="w-24 bg-black rounded-md p-2 " />}
            <div className="flex gap-2 items-center">
              <MapPinIcon size={15} /> {job.location}
            </div>
          </div>
          <hr />
          {job.description.substring(0, job.description.indexOf("."))}.
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href={`/job/${job.id}`} className="flex-1">
            <Button variant="secondary" className="w-full bg-blue-400 hover:bg-blue-500">
              More Details
            </Button>
          </Link>
          {!isMyJob && (
            <Button
              variant="outline"
              className="w-15"
              onClick={handleSave} // Add onClick handler
            >
              {saved ? (
                <Heart size={20} fill="red" stroke="red" />
              ) : (
                <Heart size={20} />
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default JobCard;
