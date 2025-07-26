"use client";
import React, { useState,useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModal";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import {v4 as uuidv4} from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading,setLoading]=useState(false);
  const [jsonResponse,setJsonResponse]=useState([]);
  const {user}=useUser();
  const router=useRouter();
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Job Details:", jobDesc, jobExperience, jobPosition);

    
    const inputPrompt = "Job Position:"+jobPosition+", Job Description: "+ jobDesc+", Years of Experience: "+jobExperience+". Depends on this information Please provide"+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions with answers in JSON format. Give question and answer field in JSON."
    try {
      const result = await chatSession.sendMessage(inputPrompt);
      // console.log("Raw Response:", JSON.stringify(result, null, 2));
      if (result.response.candidates && result.response.candidates.length > 0) {
        let content = result.response.candidates[0]?.content?.parts?.[0]?.text;
        // console.log("Extracted Content:", content);

       
        const cleanContent = content.replace(/```json|```/g, "").trim(); // Remove markdown
        try {
          const parsedResponse = JSON.parse(cleanContent);
          console.log("Parsed JSON:", parsedResponse);
          setJsonResponse(cleanContent);
          console.log("Json responce:", jsonResponse)
          if(cleanContent)
          {
            const resp=await db.insert(MockInterview)
            .values({
              mockId:uuidv4(),
              jsonMockResp:cleanContent,
              jobPosition:jobPosition,
              jobDescription:jobDesc,
              jobExperience:jobExperience,
              createdBy:user?.primaryEmailAddress?.emailAddress,
              createdAt:moment().format('DD-MM-yyyy'),
                    }).returning({mockId:MockInterview.mockId});
            console.log("Inserted Id:",resp);
            if(resp)
            {
              setOpenDialog(false);
              router.push('/dashboard/interview/'+resp[0]?.mockId)
            }
          }
          else{
            console.log("Error");
          }
         
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
        }
      } else {
        console.error("No candidates received in response.");
      }
    } catch (error) {
      console.error("Error fetching response from Gemini API:", error);
    }
    setLoading(false);
  };
  
  return (
    <div>
      <div
        onClick={() => setOpenDialog(true)}
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-lg cursor-pointer transition-all"
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-w-2xl">
          <form onSubmit={onSubmitHandler}>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Tell Us More About Your Job Interview
              </DialogTitle>
            </DialogHeader>

            <div>
              <h2 className="text-lg font-semibold">
                Add Details about your job position/role, Job description, and
                years of experience
              </h2>
              <div className="mt-7 my-2">
                <label className="font-serif text-gray-800">
                  Job Role/Job Position
                </label>
                <Input
                  value={jobPosition}
                  placeholder="Ex. Full Stack Dev"
                  required
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>
              <div className="my-2">
                <label className="font-serif text-gray-800">
                  Job Description/Tech Stack (In Short)
                </label>
                <Textarea
                  value={jobDesc}
                  placeholder="Ex. React, Angular, Vue"
                  required
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
              <div className="my-2">
                <label className="font-serif text-gray-800">
                  Years of Experience
                </label>
                <Input
                  value={jobExperience}
                  type="number"
                  placeholder="Ex. 2"
                  required
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end mt-4">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                { loading ? 
                <> <LoaderCircle className="animate-spin"/> 
                'Generating from AI'
                </> 
                : 'Start Interview' }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
