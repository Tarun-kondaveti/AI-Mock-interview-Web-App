"use client";

import { useParams } from 'next/navigation'
import React, { useEffect,useState } from 'react'
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StartInterview = () => {
    const params=useParams();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
      const [interviewData, setInterviewData] = useState(null);  
      const [mockInterviewQuestions,setMockInterviewQuestions]=useState();
     const GetInterviewDetails = async () => {
            try {
                const result = await db
                    .select()
                    .from(MockInterview)
                    .where(eq(MockInterview.mockId, params.interviewId));
               const jsonMockResp=JSON.parse(result[0].jsonMockResp);
                setMockInterviewQuestions(jsonMockResp)
                console.log(jsonMockResp);
                setInterviewData(result[0] || {}); // Ensure state is never undefined
            } catch (error) {
                console.error("Error fetching interview details:", error);
            }
        };
    
        useEffect(() => {
            GetInterviewDetails();
        }, []);
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Questions */}
          <QuestionSection 
          mockInterviewQuestions={mockInterviewQuestions} 
          activeQuestionIndex={activeQuestionIndex}/>
            {/* Videos / audio recodring */}
            <RecordAnsSection 
               mockInterviewQuestions={mockInterviewQuestions} 
               activeQuestionIndex={activeQuestionIndex}
               interviewData={interviewData}

            />
        </div>
        <div className='flex justify-end gap-6'>
            {activeQuestionIndex>0 &&  
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} >Previous Question</Button> }
           {activeQuestionIndex < mockInterviewQuestions?.length-1  && 
            <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} >Next Question</Button> }
           {activeQuestionIndex===mockInterviewQuestions?.length-1 &&  
           <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'} >
           <Button>End Interview</Button> 
           </Link>
           }

            
        </div>
    </div>
  )
}

export default StartInterview