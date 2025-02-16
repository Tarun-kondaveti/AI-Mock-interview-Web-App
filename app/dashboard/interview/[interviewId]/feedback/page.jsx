"use client";
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation'
import React,{useEffect, useState} from 'react'
import { db } from '@/utils/db';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const Feedback = () => {

    const params=useParams(); 
    const router=useRouter();
    const [feedbackList,setFeedbackList]=useState([]);
const GetFeedback=async ()=>{
    const result = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, params.interviewId))
    .orderBy(UserAnswer.id);
  console.log(result);
  setFeedbackList(result);
}

useEffect(()=>{
GetFeedback();
},[])

  return (
    <div className='p-10'>
      
        {feedbackList?.length===0 ? 
        <>
        
          <h2 className='font-bold text-xl text-gray-900'>No Interview feedback Record Found</h2>

        </>
        :
        <>
          <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
          <h2 className='font-bold text-2xl'>Here is Your Interview FeedBack</h2>
        <h2 className='text-blue-900 text-lg my-3'>Your OverAll interview Rating : <strong>7/10</strong> </h2>
        <h2 className='text-sm text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>
        {feedbackList && feedbackList.map((item,index)=>(
            <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className='p-2 flex gap-7 justify-between bg-gray-200 rounded-lg my-2 text-left w-full'>
            {item.question} <ChevronsUpDown className='h-5 w-5' />
            </CollapsibleTrigger>
            <CollapsibleContent>
             <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded large'><strong>Rating :</strong> {item.rating}</h2>
            <h2 className='-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer : </strong> {item.userAns}</h2>
            <h2 className='-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer : </strong> {item.correctAns}</h2>
            <h2 className='-2 border rounded-lg bg-blue-50 text-sm text-blue-900'><strong>Feedback : </strong> {item.feedback}</h2>
             </div>
            </CollapsibleContent>
          </Collapsible>
          
        ))}
</>
    }
        <Button onClick={()=>router.replace('/dashboard')} className='bg-blue-700'>Go Home</Button>
        
       

    </div>
  )
}

export default Feedback