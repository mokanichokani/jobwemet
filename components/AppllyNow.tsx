//@ts-nocheck

"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useState } from "react"; // Import useState for error and loading management
import BarLoader from "react-spinners/BarLoader"; // You can replace this with your desired loader

const schema = z.object({
  experience: z.number().min(0, { message: "Experience must be at least 0" }).int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file instanceof FileList &&
        file.length > 0 &&
        (file[0].type === "application/pdf" || file[0].type === "application/msword"),
      { message: "Only pdf or Word documents are allowed" }
    ),
});

const ApplyNow = ({ user, job, applied = false, fetchJob }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { session } = useSession();
  const [loadingApply, setLoadingApply] = useState(false); // State to track loading
  const [errorApply, setErrorApply] = useState(null); // State to track error

  if (!session) {
    return <p>Loading...</p>;
  }

  function createClerkSupabaseClient(): SupabaseClient {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: async (url: string, options: RequestInit = {}) => {
            const clerkToken = await session?.getToken({
              template: "supabase",
            });

            const headers = new Headers(options.headers);
            headers.set("Authorization", `Bearer ${clerkToken}`);

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

  async function applytoJob(jobData) {
    setLoadingApply(true); // Start loading
    setErrorApply(null); // Reset error before new submission
    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${jobData.candidate_id}`;

    const { error: storageError } = await client.storage
      .from("resumes")
      .upload(fileName, jobData.resume[0]);

    if (storageError) {
      setErrorApply("Error occurred during file upload.");
      setLoadingApply(false); // Stop loading if error
      return null;
    }

    const resume = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;
    const { data, error } = await client
      .from("applications")
      .insert([
        {
          ...jobData,
          resume,
        },
      ])
      .select();

    if (error) {
      setErrorApply("Error occurred during job application.");
      setLoadingApply(false); // Stop loading if error
      return null;
    }

    setLoadingApply(false); // Stop loading on success
    return data;
  }

  const onSubmit = (data) => {
    applytoJob({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume,
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer>

      <DrawerTrigger asChild>
        <Button
          size="lg"
          className={`bg-blue-500 text-lg ${
            job?.isOpen ? "bg-blue-500" : "bg-teal-600 hover:bg-teal-600 cursor-not-allowed"
          }`}
          disabled={!job?.isOpen || applied}
        >
          {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Apply for {job.title} at {job.company.name}</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
          <Input
            type="number"
            placeholder="Years of experience"
            className="flex-1"
            {...register("experience", {
              valueAsNumber: true,
            })}
          />
          {errors.experience && (
            <p className="text-red-500">{errors.experience.message}</p>
          )}

          <Input
            type="text"
            placeholder="Skills,(Comma Separated)"
            className="flex-1"
            {...register("skills")}
          />
          {errors.skills && (
            <p className="text-red-500">{errors.skills.message}</p>
          )}

          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Graduate" id="graduate" />
                  <Label htmlFor="graduate">Graduate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Post Graduate" id="post-graduate" />
                  <Label htmlFor="post-graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-red-500">{errors.education.message}</p>
          )}

          <Input
            type="file"
            accept=".pdf, .doc, .docx"
            className="flex-1 file:text-gray-500"
            {...register("resume")}
          />
          {errors.resume && (
            <p className="text-red-500">{errors.resume.message}</p>
          )}

          {/* Show error message */}
          {errorApply && (
            <p className="text-red-500">{errorApply}</p>
          )}

          {/* Show loading bar when applying */}
          {loadingApply && <BarLoader width={"100%"} color="#36d7b7" />}

          <Button type="submit" className="bg-blue-500" size="lg" disabled={loadingApply || applied}>
            Apply
          </Button>
        </form>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyNow;
