'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schema/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const VerifyAccount = () => {
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema)
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.verifyCode
      })
      toast({
        title: 'Success',
        description: response.data.message
      })
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'User verification failed.',
        description: axiosError.response?.data?.message ?? 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen top-0 bg-gray-100'>
      <div className='w-[30%] p-10 space-y-6 bg-white flex justify-center shadow-md rounded-lg'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='verifyCode'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel className='font-bold text-lg'>Enter OTP</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent on your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='px-8 py-5 text-lg rounded-full bg-purple-600' type='submit'>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 w-4 h-4 animate-spin' />
                  <span>Verifying...</span>
                </>
              ) : (
                'submit'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount
