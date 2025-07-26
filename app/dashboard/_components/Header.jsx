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
    <div className='flex p-4 items-center justify-between bg-secondary shadow-lg'>

        <Image src={'/image.png'} width={80} height={10} alt='logo'   style={{ height: "auto" }}/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-blue-900 cursor-pointer hover:font-bold transition-all ${path === '/dashboard' &&'text-black-700 font-bold underline'}`}>HOME</li>
            </ul>
            <UserButton></UserButton>
    </div>
  )
}

export default Header