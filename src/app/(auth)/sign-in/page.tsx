'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { signInSchema } from '@/schema/signInSchema'
import { signIn } from 'next-auth/react'
import { useState } from 'react'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsSubmitting(true)
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login failed invalid credentials.',
            variant: 'destructive',
            description: 'Invalid username or password.'
          })
        } else {
          toast({
            title: 'Error while log in',
            variant: 'destructive',
            description: result.error
          })
        }
      }

      if (result?.url) {
        router.replace('/dashboard')
        toast({
          title: 'Logged in successfully.',
          variant: 'default',
          description: 'User has logged in successfully.'
        })
      }
    } catch (error) {
      toast({
        title: 'Unexpected error occurred',
        variant: 'destructive',
        description: 'Error occurred while login user.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-[80vh] bg-gray-200'>
      <div className='w-full max-w-md p-8 space-y-8 rounded-lg shadow-md bg-white'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-3xl mb-6'>
            Join Mystery Message
          </h1>
          <p className='mb-4 font-semibold'>
            Sign in to start you anonymous adventure
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              name='identifier'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-md'>Email or Username<span className='text-red-500'> * </span></FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email or username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='password'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-md'>Password<span className='text-red-500'> * </span></FormLabel>
                  <FormControl>
                    <Input placeholder='Enter you password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='bg-black text-white px-10 py-5 font-semibold'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 w-4 h-4 animate-spin text-blue-600' />{' '}
                  Please Wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>

        <div className='text-center mt-4 font-semibold'>
          <p>
            You haven't sign up?{' '}
            <Link
              href={'/sign-up'}
              className='text-blue-600 hover:text-blue-800'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
