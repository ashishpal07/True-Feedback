import dbConnection from "@/lib/connectdb";
import UserModel from "@/model/user";

export async function POST(req: Request) {
  await dbConnection()
  
  try {
    const {username, code} = await req.json()
    const decodeUsername = decodeURIComponent(username)
    const user = await UserModel.findOne({username: decodeUsername})

    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found.'
      }, {status: 404})
    }

    const isValidCode = user.verifyCode === code
    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date()

    if (isValidCode && !isCodeExpired) {
      user.isVerified = true;
      await user.save()
      return Response.json({
        success: true,
        message: 'Account verified successfully!'
      }, {status: 200})
    } else if (!isValidCode)  {
      return Response.json({
        success: false,
        message: 'Your otp has expired please, sign up again!'
      }, {status: 400})
    } else {
      return Response.json({
        success: false,
        message: 'Invalid otp.'
      }, {status: 400})
    }
  } catch (e) {
    return Response.json({
      success: false,
      message: 'Internal server error while verify code.'
    }, {status: 500})
  }
}
