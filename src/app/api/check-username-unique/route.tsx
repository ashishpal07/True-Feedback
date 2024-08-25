import dbConnection from "@/lib/connectdb";
import UserModel from "@/model/user";
import {z} from 'zod'
import { usernameVerification } from "@/schema/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameVerification
})

export async function GET(req: Request) {
  await dbConnection()

  try {
    const {searchParams} = new URL(req.url)
    const queryParams = {
      username: searchParams.get('username')
    }

    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success: false,
        message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
      },{status: 400})
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
    if (existingVerifiedUser) {
      return Response.json({
        success: false,
        message: 'This username has already taken.'
      }, {status: 400})
    }

    return Response.json({
      success: false,
      message: 'This username is available.'
    }, {status: 200})
  } catch (err) {
    return Response.json({
      success: false,
      message: 'Error while checking username'
    },{
      status: 500
    })
  }
}