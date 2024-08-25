import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnection from '@/lib/connectdb'
import UserModel from '@/model/user'
import { User } from 'next-auth'

export async function GET(req: Request) {
  await dbConnection()

  const session = await getServerSession(authOptions)
  const user: User = session?.user

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: 'Not authorized!'
      },
      { status: 401 }
    )
  }

  try {
    const findUserById = await UserModel.findById(user._id)

    if (!findUserById) {
      return Response.json(
        {
          success: false,
          message: 'User not found.'
        },
        { status: 404 }
      )
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: findUserById.isAcceptingMessage
      },
      { status: 200 }
    )
  } catch (e) {
    return Response.json(
      {
        success: false,
        message: 'Internal server error while accepting messages!'
      },
      { status: 500 }
    )
  }
}

export async function POST (req: Request) {
  await dbConnection()

  const session = await getServerSession(authOptions)
  const user: User = session?.user

  if (!session || !session?.user) {
    return Response.json(
      {
        success: false,
        message: 'Not authorized!'
      },
      { status: 401 }
    )
  }

  const userId = user._id
  const { acceptMessages } = await req.json()

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages
      },
      { new: true }
    )

    if (!updateUser) {
      return Response.json({
        success: false,
        message: 'User not found. hence not able to update status'
      }, {status: 404})
    }

    return Response.json({
      success: true,
      message: 'Message accepted user updated successfully.',
      updateUser,
    }, {status: 200})
  } catch (e) {
    return Response.json({
      success: false,
      message: 'Internal server error while updating message accept status!'
    }, {status: 500})
  }
}
