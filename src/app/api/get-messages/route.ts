import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnection from '@/lib/connectdb'
import UserModel from '@/model/user'
import { User } from 'next-auth'
import mongoose from 'mongoose'

export async function GET (req: Request) {
  await dbConnection()

  const session = await getServerSession(authOptions)
  const user: User = session?.user

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: 'Not authenticated.'
      },
      { status: 401 }
    )
  }

  const userId = new mongoose.Types.ObjectId(user._id)

  try {
    const userAggregate = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } }
    ])

    if (!userAggregate || userAggregate.length === 0) {
      return Response.json(
        {
          success: false,
          message: 'no messages present!'
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        messages: userAggregate[0].messages
      },
      { status: 200 }
    )
  } catch (e) {
    return Response.json(
      {
        success: true,
        messages: 'Internal server error while getting all messages.'
      },
      { status: 500 }
    )
  }
}
