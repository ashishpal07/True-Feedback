'use client'

import { User } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user

  return (
    <nav className='sticky top-0 p-4 h-[10vh] md:p-6 shadow-md bg-black text-white'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
        <a href='#' className='text-xl font-bold mb-4 md:mb-0'>
          True Feedback
        </a>
        {session ? (
          <>
            <div className='flex w-[40%] justify-between items-center'>
              <div>
                <Link href={'/dashboard'}>
                  <span className='p-2'>Dashboard</span>
                </Link>
                <Link href={`/u/${user.username}`}>
                  <span className='p-2'>Profile</span>
                </Link>
              </div>
              <div>
                <span className='mr-4 text-sm'>
                  {user.username || user.email}
                </span>
                <Button
                  onClick={() => signOut()}
                  className='w-full md:w-auto bg-red-700'
                >
                  Logout
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Link href='/sign-in'>
            <Button className='w-full px-6 py-4 md:w-auto text-md bg-red-700'>
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
