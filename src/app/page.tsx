'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import Autoplay from 'embla-carousel-autoplay'
import messages from '../../data/messages.json'

export default function Home () {
  return (
    <>
      <main className='flex min-h-[80vh] flex-col items-center justify-center h-min-[85vh] px-4 md:px-24 py-12 bg-gray-200'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold'>
            Dive into the World of Anonymous Feedback
          </h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className='w-full max-w-xs'
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className='p-1'>
                  <Card>
                    <CardHeader>
                      <span className='text-xl text-slate-400 font-bold'>
                        {message.title}
                      </span>
                    </CardHeader>
                    <CardContent className='flex aspect-square items-center justify-center p-6'>
                      <span className='text-3xl font-semibold text-slate-600'>
                        {message.content}
                      </span>
                    </CardContent>
                    <CardFooter>
                      <span className='text-md text-slate-400'>
                        {message.received}
                      </span>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
    </>
  )
}
