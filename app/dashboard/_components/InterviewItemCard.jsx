import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const InterviewItemCard = ({interview}) => {

    const router=useRouter();
    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }

  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-blue-900'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-700'>{interview.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-500g'>Created At: {interview.createdAt}</h2>
        <div className='display flex justify-end gap-5 mt-2'>
            <Link href={'/dashboard/interview/'+interview?.mockId+'/feedback'}>
            <Button  size='sm' variant='outline' className='w-full'>Feedback</Button>
            </Link>
            <Button onClick={onStart} size='sm' className='bg-blue-700 w-full'>Start</Button>
        </div>
    </div>
  )
}

export default InterviewItemCard