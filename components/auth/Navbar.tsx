

import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { getSession } from '@/lib/getSession'
import { signOut } from '@/auth'

const Navbar = async () => {

    const session = await getSession()
    const user = session?.user

    return (
        <nav className='text-white bg-[#141414] flex justify-around px-4 py-5'>
            <Link className='font-bold text-xl' href={'/'}>My Fancy Website</Link>
            <ul className='flex gap-4'>

                {!user ? (
                    <>
                        <li>
                            <Link href={'/login'} className='hover:text-gray-400'>Login</Link>
                        </li>
                        <li>
                            <Link href={'/register'} className='hover:text-gray-400'>Register</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href={'/private/dashboard'} className='hover:text-gray-400'>Dashboard</Link>
                        </li>
                        <form action={
                            async () => {
                                'use server'
                                await signOut()
                            }
                        }>
                            <Button className='w-20 h-6' type={'submit'}>Logout</Button>
                        </form>

                    </>
                )
                }
            </ul>
        </nav>
    )
}

export default Navbar
