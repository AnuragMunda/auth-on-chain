import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import CryptoJS from "crypto-js";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { userAddress, newAuthKey } = await request.json()

        const encryptedAuthKey = CryptoJS.AES.encrypt(newAuthKey, process.env.ENCRYPTION_SECRET as string).toString()
        const result = await UserModel.updateOne({ userAddress }, { encryptedAuthKey })
        console.log(result)
        return Response.json({
            success: true,
            message: "Recovery successful"
        }, { status: 200 })

    } catch (error) {
        console.log("Error in recovering ", error)
        return Response.json({
            success: false,
            message: "Error while recovering"
        }, { status: 500 })
    }
}