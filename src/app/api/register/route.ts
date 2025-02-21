import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import CryptoJS from "crypto-js";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { userAddress, authKey } = await request.json()

        if (!userAddress || !authKey) return Response.json({
            success: false,
            message: "Missing parameters"
        }, { status: 400 })

        const existingUser = await UserModel.findOne({ userAddress });
        if (existingUser) return Response.json({ success: false, message: 'User already registered' }, { status: 400 });

        const encryptedKey = CryptoJS.AES.encrypt(authKey, process.env.ENCRYPTION_SECRET as string).toString()

        const user = new UserModel({
            userAddress,
            encryptedAuthKey: encryptedKey
        })
        await user.save()

        return Response.json({
            success: true,
            message: "User registered successfully"
        }, { status: 200 })

    } catch (error) {
        console.log("Error during registration", error)
        Response.json({
            success: false,
            message: "Error in registering new user"
        }, { status: 500 })
    }
}