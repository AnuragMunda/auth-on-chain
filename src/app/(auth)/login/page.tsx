'use client'

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { useSignMessage } from 'wagmi';
import { contractAddress, contractABI } from '../../../utils/viemConfig';
import { useAppKitAccount } from "@reown/appkit/react";
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';

const Login = () => {
    const router = useRouter()
    const { address, isConnected } = useAppKitAccount()
    const { signMessageAsync } = useSignMessage()
    const { data: isRegistered } = useReadContract({
        abi: contractABI,
        address: contractAddress,
        functionName: 'isRegistered',
        args: [address as `0x${string}`]
    })
    const [loading, setLoading] = useState(false);
    const auth = useAuth()

    async function login() {
        if (!isConnected) {
            toast.error('Please connect your wallet')
            return
        }
        if (!isRegistered) {
            toast('⚠ Account not registered.', { duration: 3000 })
            return
        }

        setLoading(true);
        const id = toast.loading('Verifying user...')
        try {
            // Generate a random challenge
            const challenge = crypto.randomUUID();

            // Sign the challenge
            const signedChallenge = await signMessageAsync({ message: challenge });

            // call login api
            const response = await axios.post("/api/login", {
                userAddress: address,
                signedChallenge,
                challenge
            })

            if (!response.data.success) {
                toast.error(response.data.message, { duration: 3000, id })
                return
            }
            localStorage.setItem('authToken', response.data.token)
            auth?.setAuthToken(response.data.token)
            toast.success('Logged in successfully', { duration: 3000, id })
            router.replace('/')
        } catch (error) {
            console.error("Login error: ", error);
            toast.error("Login Failed", { id });
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <div className='bg-slate-400 w-[80%] max-w-72 h-72 rounded-2xl flex flex-col justify-evenly items-center'>
                {isConnected ? (
                    <h1 className='text-black text-xl w-[90%] text-center font-semibold pb-5 border-b-2 border-black'>WELCOME BACK</h1>
                ) : (
                    <h1 className='text-black text-xl w-[90%] text-center font-semibold pb-5 border-b-2 border-black'>CONNECT WALLET TO LOGIN</h1>
                )}
                <div className='flex flex-col gap-5 justify-center items-center'>
                    <button className='bg-slate-800 px-6 py-3 rounded-full hover:bg-slate-600 transition ease-in' onClick={login} disabled={loading}>
                        Login
                    </button>
                    <p className='text-black flex gap-2'>
                        New user?
                        <Link href='/register' className='text-slate-800 font-bold hover:text-white transition ease-in'>Register</Link>
                    </p>
                </div>
            </div>
        </div >
    );
}

export default Login
