import UserModel from '@/model/user'
import { MessageModel } from '@/model/message'
import dbConnection from '@/lib/connectdb'

export async function POST(req: Request) {
  await dbConnection()
  const { username, content } = await req.json()

  try {
    const user = await UserModel.findOne({ username: username })
  
    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found while sending message'
        },
        { status: 404 }
      )
    }

    // check is user accepting the messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: 'User is not accepting the message'
        },
        { status: 403 }
      )
    }

    const message = new MessageModel({
      content,
      createdAt: new Date()
    })
    const messageCreated = await message.save()
    user.messages.push(messageCreated)
    await user.save()

    return Response.json(
      {
        success: true,
        message: 'Message sent successfully.'
      },
      { status: 200 }
    )
  } catch (e) {
    return Response.json(
      {
        success: false,
        message: 'Internal server error while sending message'
      },
      { status: 500 }
    )
  }
}
