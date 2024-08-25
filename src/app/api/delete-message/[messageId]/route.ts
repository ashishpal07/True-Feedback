import { MessageModel } from "@/model/message"
import UserModel from "@/model/user"
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: Request, { params }: { params: { messageId: string } }) {
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  try {

    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: params.messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: 'Message not found or already deleted', success: false },
        { status: 404 }
      );
    }

    const message = await MessageModel.findById(params.messageId)
    if (!message) {
      return Response.json({
        success: false,
        message: 'Message not found'
      }, {status: 404})
    }

    await MessageModel.findByIdAndDelete(params.messageId)

    return Response.json({
      success: true,
      message: 'Message deleted successfully!'
    }, {status: 200})
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: 'Internal server error while deleting message'
    }, {status: 500})
  }
}