import React from 'react'
import Logo from '../icon/logo'
import Link from 'next/link'

export default function AuthHeader() {
    return (
        <div>
            <div className="p-4 text-start">
               <Link href='/'>
                <Logo />
               </Link>
            </div>
        </div>
    )
}
