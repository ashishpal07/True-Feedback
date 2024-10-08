import mongoose, { Schema, Document } from 'mongoose'
import MessageSchema, {Message} from './message'

export interface User extends Document {
  username: string
  email: string
  password: string
  verifyCode: string
  verifyCodeExpiry: Date
  isVerified: boolean
  isAcceptingMessage: boolean
  messages: Message[]
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, 'User name is required.'],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    unique: true,
    match: [/.+@.+\..+/, 'Use valid email address.']
  },
  password: {
    type: String,
    required: [true, 'Password name is required']
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify code is required.']
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify code expiry is required.']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true
  },
  messages: [MessageSchema]
})

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema)

export default UserModel
