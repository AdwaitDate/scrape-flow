import Logo from '@/components/Logo'
import { Loader2Icon } from 'lucide-react'
import React from 'react'

function loading() {
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <Logo />
      <Loader2Icon size={30} className='flex animate-spin stroke-primary'/>
    </div>
  )
}

export default loading
