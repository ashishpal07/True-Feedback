'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schema/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
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

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 500)
  const { toast } = useToast()
  const router = useRouter()

  // zod implementation
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast({
        title: 'signed up successfully.',
        description: response.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: 'sign up failed.',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function checkUsername () {
    if (username) {
      setIsCheckingUsername(true)
      setUsernameMessage('')

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${username}`
        )
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking username.'
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }
  }

  useEffect(() => {
    checkUsername()
  }, [username])

  return (
    <div className='flex flex-col justify-center items-center min-h-[80vh] bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md border'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-3xl mb-6'>
            Join Mystery Message
          </h1>
          <p className='mb-4 text-md'>Sign up to start you anonymous adventure</p>
        </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            name='username'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md'>Username<span className='text-red-500'> * </span></FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter username'
                    className='p-4'
                    {...field}
                    onChange={e => {
                      field.onChange(e)
                      debounced(e.target.value)
                    }}
                  />
                </FormControl>
                {isCheckingUsername && <Loader2 className='animate-spin text-xs text-blue-500' />}
                <p
                  className={`text-xs ${
                    usernameMessage === 'This username is available.'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {usernameMessage}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='email'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-md'>Email<span className='text-red-500'> * </span></FormLabel>
                <FormControl>
                  <Input placeholder='example@example.com' className='p-4' {...field} />
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
                  <Input placeholder='Enter you password' className='p-4' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='bg-black text-white px-10 py-5'  disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 w-4 h-4 animate-spin text-blue-600' /> Please Wait
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </Form>

      <div className='text-center mt-4'>
        <p className='font-semibold'>
          Already a member?{' '}
          <Link href={'/sign-in'} className='text-blue-600 hover:text-blue-800'>
            Sign In
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default page
