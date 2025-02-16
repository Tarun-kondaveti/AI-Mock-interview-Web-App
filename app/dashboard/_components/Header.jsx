"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const Header = () => {
const path=usePathname();
useEffect(()=>{
console.log(path)
},[])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>

        <Image src={'/logo.svg'} width={80} height={10} alt='logo'   style={{ height: "auto" }}/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-blue-600 cursor-pointer hover:font-bold transition-all ${path === '/dashboard' &&'text-blue-600 font-bold'}`}>Dashboard</li>
            <li className={`hover:text-blue-600 cursor-pointer hover:font-bold transition-all  ${path === '/questions' &&'text-blue-600 font-bold'}`}>Questions</li>
            <li className={`hover:text-blue-600 cursor-pointer hover:font-bold transition-all  ${path === '/upgrade' &&'text-blue-600 font-bold'}`}>Upgrade</li>
            <li className={`hover:text-blue-600 cursor-pointer hover:font-bold transition-all  ${path === '/howitwork' &&'text-blue-600 font-bold'}`}>How it Works ?</li>
            </ul>
            <UserButton></UserButton>
    </div>
  )
}

export default Header