import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    userAddress: string;
    encryptedAuthKey: string;
    jwtToken: string;
    nonce: string;
    recoveryGuardian: string;
    lastLogin: Date;
}

const UserSchema: Schema<User> = new Schema({
    userAddress: {
        type: String,
        required: true,
        unique: true
    },
    encryptedAuthKey: {
        type: String,
        required: true
    },
    jwtToken: {
        type: String
    },
    nonce: {
        type: String
    },
    recoveryGuardian: {
        type: String
    },
    lastLogin: {
        type: Date
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel