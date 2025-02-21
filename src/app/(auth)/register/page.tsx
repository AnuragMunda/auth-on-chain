'use client'

import { useEffect, useRef, useState } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { hashMessage } from 'viem';
import { contractAddress, contractABI } from '../../../utils/viemConfig';
import { useAppKitAccount } from "@reown/appkit/react";
import { config } from '@/utils/wagmiConfig';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios'

const Register = () => {
    const { address, isConnected } = useAppKitAccount()
    const { data: hash, writeContract } = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({
        config,
        hash
    })
    const { data: isRegistered } = useReadContract({
        abi: contractABI,
        address: contractAddress,
        functionName: 'isRegistered',
        args: [address as `0x${string}`]
    })
    const [authKey, setAuthKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingId, setLoadingId] = useState('');
    const hasPageBeenRendered = useRef(false);

    useEffect(() => {
        if (!hasPageBeenRendered.current) {
            hasPageBeenRendered.current = true
            return
        }
        const registerToBackend = async () => {
            // Call backend to store encrypted authKey
            await axios.post('/api/register', {
                userAddress: address,
                authKey
            })
            setLoading(false)
            toast.success('Registration successful.', { duration: 4000, id: loadingId })
        }
        if (isSuccess) {
            registerToBackend()
        }
    }, [isSuccess])

    async function register() {
        if (!isConnected) {
            toast.error('Please connect your wallet')
            return
        }
        if (isRegistered || isSuccess) {
            toast('⚠ Already registered. Please login.', { duration: 3000 })
            return
        }
        setLoading(true);
        const id = toast.loading("Confirming transaction...")
        try {
            // Generate and hash authKey
            const newAuthKey = crypto.randomUUID();
            setAuthKey(newAuthKey)
            const hashedAuthKey = hashMessage(newAuthKey);

            // Register on-chain
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'registerAuthKey',
                args: [hashedAuthKey]
            }, {
                onSuccess() {
                    const loadingId = toast.loading('Registering. Please wait...', {
                        id
                    })
                    setLoadingId(loadingId)
                },
                onError(error) {
                    setLoading(false)
                    toast.error(error.shortMessage, { duration: 4000, id })
                },
            })
        } catch (error) {
            console.error(error);
            setLoading(false)
            toast.error('On-chain Registration failed', { duration: 4000, id: loadingId });
        }
    }

    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <div className='bg-slate-400 w-[80%] max-w-72 h-72 rounded-2xl flex flex-col justify-evenly items-center'>
                {isConnected ? (
                    <h1 className='text-black text-xl w-[90%] text-center font-semibold pb-5 border-b-2 border-black'>REGISTER A NEW ACCOUNT</h1>
                ) : (
                    <h1 className='text-black text-xl w-[90%] text-center font-semibold pb-5 border-b-2 border-black'>CONNECT WALLET TO REGISTER</h1>
                )}
                <div className='flex flex-col gap-5 justify-center items-center'>
                    <button className='bg-slate-800 px-6 py-3 rounded-full hover:bg-slate-600 transition ease-in' onClick={register} disabled={loading}>
                        Register
                    </button>
                    <p className='text-black flex gap-2'>
                        Already registered?
                        <Link href='/login' className='text-slate-800 font-bold hover:text-white transition ease-in'>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register
