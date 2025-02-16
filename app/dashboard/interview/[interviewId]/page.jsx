"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Interview = () => {
    const params = useParams();
    const [interviewData, setInterviewData] = useState(null);  // Initialize as null
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    const GetInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
            console.log(result);
            setInterviewData(result[0] || {}); // Ensure state is never undefined
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    return (
        <div className='my-10 '>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {interviewData && (
                <div className='flex flex-col my-5 gap-5 '>
                    <div className='border rounded-lg p-5'>
                    <h2 className='text-lg'>   <strong>Job Role/Job Position:</strong> {interviewData.jobPosition || "Not Available"}</h2>
                    <h2 className='text-lg'>   <strong>Job Description/Tech Stack:</strong> {interviewData.jobDescription || "Not Available"}</h2>
                    <h2 className='text-lg'>   <strong>Years of Experience:</strong> {interviewData.jobExperience || "Not Available"}</h2>
                    </div>
                    <div className='p-5 border round-lg border-yellow-400 bg-yellow-100'>
                       <h2 className='flex gap-2 items-center text-yellow-700'> <Lightbulb ></Lightbulb><span><strong>Information</strong></span> </h2>
                        <h2 className='mt-3 text-yellow-500'>Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview, It Has 5 question which you can answer and at the last you will get the report on the basis of your answer. NOTE: We never record your video, Web cam access you can disable at any time if you want. </h2>
                    </div>
                </div>
            )} 
            <div>
                {webCamEnabled ? (<>
                    <Webcam
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => setWebCamEnabled(false)}
                        mirrored={true}
                        style={{ height: 300, width: 300 }}
                    />
                    <Button className='my-3 bg-blue-500' onClick={() => setWebCamEnabled(false)}>Disable Web Cam and Microphone</Button>
                </>
                ) : (
                    <>
                        <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                        <Button  className='my-3 bg-blue-700' onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>

                    </>
                )}
            </div>
            </div>
            <div className='flex justify-end items-end'>  
                <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>     
                   <Button>START INTERVIEW</Button>
                   </Link>
            </div>
  
        </div>
    );
};

export default Interview;
