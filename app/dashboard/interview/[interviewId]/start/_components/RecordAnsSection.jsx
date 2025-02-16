"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'

const RecordAnsSection = ({ mockInterviewQuestions, activeQuestionIndex, interviewData }) => {

    const { user } = useUser();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');

    const {
        error,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    // Update userAnswer when results change
    useEffect(() => {
        if (results.length > 0) {
            setUserAnswer(prevAns => prevAns + ' ' + results.map(r => r.transcript).join(' '));
        }
    }, [results]);

    // Save the answer only when recording stops
    useEffect(() => {
        if (!isRecording && userAnswer?.length > 10) {
            UpdateUserAnswerInDb();
        } else if (!isRecording && userAnswer?.length < 10) {
            setLoading(false);
            toast({
                title: "Error while Recording Answer",
                description: "Answer must be at least 10 words",
            });
        }
    }, [isRecording]);

    // Start or stop recording
    const StartStopRecording = () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            setResults([]);  // Clear previous results
            setUserAnswer(''); // Reset user answer
            startSpeechToText();
        }
    };

    // Save the answer to the database
    const UpdateUserAnswerInDb = async () => {
        console.log("Saving Answer:", userAnswer);
        setLoading(true);

        const feedbackPrompt = "Question :" + mockInterviewQuestions[activeQuestionIndex]?.question +
            ", User Answer :" + userAnswer +
            " Depends on Question and user answer for given interview question, please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating and feedback field.";

        try {
            const result = await chatSession.sendMessage(feedbackPrompt);
            let mockJsonResp = result.response.text();
            
            // Remove unnecessary markdown markers
            mockJsonResp = mockJsonResp.replace(/```json|```/g, '');
            
            console.log("Raw JSON Response:", mockJsonResp);

            const JsonFeedbackResp = JSON.parse(mockJsonResp);

            if (JsonFeedbackResp && JsonFeedbackResp.feedback && JsonFeedbackResp.rating) {
                const resp = await db.insert(UserAnswer).values({
                    mockIdRef: interviewData?.mockId,
                    question: mockInterviewQuestions[activeQuestionIndex]?.question,
                    correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
                    userAns: userAnswer,
                    feedback: JsonFeedbackResp.feedback,
                    rating: JsonFeedbackResp.rating,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD-MM-YYYY')
                });

                if (resp) {
                    setResults([]);
                    setUserAnswer(''); // Reset after saving
                }

                toast({
                    title: "Answer Saved Successfully",
                    description: "Your answer has been saved successfully",
                    type: "success",
                });
            } else {
                throw new Error("Invalid JSON response from AI model.");
            }
        } catch (error) {
            console.error("Error in UpdateUserAnswerInDb:", error);
            toast({
                title: "Error",
                description: "Failed to save the answer. Check the console.",
                type: "error",
            });
        }

        setLoading(false);
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5 relative'>
                <Image alt='WebCam' src={'/webCam.png'} width={200} height={200} className='absolute' />
                <Webcam mirrored style={{ height: 300, width: '100%', zIndex: 10 }} />
            </div>
            <Button disabled={loading} onClick={StartStopRecording} className='my-10' variant='outline'>
                {isRecording ? 
                 <h2 className='text-red-600 flex gap-2'>
                     <Mic /> <StopCircle /> Stop Recording...
                 </h2> 
                 : 'Record Answer'}
            </Button>
        </div>
    );
}

export default RecordAnsSection;
