import { resend } from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/types/ApiResponse'

export async function sentVerificationEmail (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email, 
      subject: 'Mystry message | verification code',
      react: VerificationEmail({username, otp: verifyCode})
    })
    return {success: true, message: 'Verification mail sent successfully!'}
  } catch (e) {
    return {success: false, message: 'Failed to send verification email...'}
  }
}
