import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = "give me any kind of 3 messages separated by '||' and all 3 messages should not be more than 200 characters please don't give points 1, 2, 3 etc just separate by '||'"

    const result = await model.generateContent(prompt)
    const response = result.response
    const ans = response.text()

    const output = ans.split('||').map(text => text.trim());
    
    return NextResponse.json(
      {
        success: true,
        message: 'Message generated',
        output: output
      },
      { status: 200 }
    )
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: 'Error while generating messages via GEMINI.'
    }, {status: 500})
  }
}
