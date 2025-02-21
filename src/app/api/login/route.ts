import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { contractABI, contractAddress, walletClient } from "@/utils/viemConfig";
import { recoverAddress, hashMessage } from "viem";
import jwt from 'jsonwebtoken'
import CryptoJS from "crypto-js";

export async function POST(req: Request) {
    await dbConnect()

    try {
        const { userAddress, signedChallenge, challenge } = await req.json()

        const user = await UserModel.findOne({ userAddress })
        if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 })

        // Verify signed message
        const hashedChallenge = hashMessage(challenge)
        const signerAddress = await recoverAddress({ hash: hashedChallenge, signature: signedChallenge })
        if (signerAddress.toLowerCase() != userAddress.toLowerCase()) {
            return Response.json({
                success: false,
                message: "Invalid signature"
            }, { status: 401 })
        }

        const decryptedAuthKey = CryptoJS.AES.decrypt(user.encryptedAuthKey, process.env.ENCRYPTION_SECRET as string).toString(CryptoJS.enc.Utf8)
        const hashedDecryptedAuthKey = hashMessage(decryptedAuthKey)

        // On-chain authentication check
        const isVerified = await walletClient.readContract({
            address: contractAddress,
            abi: contractABI,
            functionName: 'verifyAuthKey',
            args: [userAddress, hashedDecryptedAuthKey]
        })

        if (!isVerified) {
            return Response.json({
                success: false,
                message: "On-chain verification failed"
            }, { status: 200 })
        }

        // Issue JWT token
        const token = jwt.sign({ userAddress }, process.env.JWT_SECRET as string, { expiresIn: '1h' })

        return Response.json({
            success: true,
            message: "Login successful",
            token
        }, { status: 200 })

    } catch (error) {
        console.log("Error while login", error)
        return Response.json({
            success: false,
            message: "Login unsuccessful"
        }, { status: 500 })
    }
}