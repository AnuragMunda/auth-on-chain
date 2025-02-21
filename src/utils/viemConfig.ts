import { createWalletClient, Hex, http, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

const keypair = privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as Hex)

export const walletClient = createWalletClient({
  account: keypair,
  chain: sepolia,
  transport: http()
}).extend(publicActions)

export const [account] = await walletClient.getAddresses()

export const contractAddress: `0x${string}` = process.env.CONTRACT_ADDRESS as `0x${string}`

export const contractABI = [{ "type": "function", "name": "getGuardian", "inputs": [{ "name": "_user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "isRegistered", "inputs": [{ "name": "_user", "type": "address", "internalType": "address" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "function", "name": "recoverAccount", "inputs": [{ "name": "_user", "type": "address", "internalType": "address" }, { "name": "_newHashedAuthKey", "type": "bytes32", "internalType": "bytes32" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "registerAuthKey", "inputs": [{ "name": "_hashedAuthKey", "type": "bytes32", "internalType": "bytes32" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "setGuardian", "inputs": [{ "name": "_guardian", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "verifyAuthKey", "inputs": [{ "name": "_user", "type": "address", "internalType": "address" }, { "name": "_hashedSignedKey", "type": "bytes32", "internalType": "bytes32" }], "outputs": [{ "name": "", "type": "bool", "internalType": "bool" }], "stateMutability": "view" }, { "type": "event", "name": "AuthKeyRecovered", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "AuthKeyRegistered", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "event", "name": "RecoveryGuardianSet", "inputs": [{ "name": "user", "type": "address", "indexed": true, "internalType": "address" }, { "name": "guardian", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }, { "type": "error", "name": "AuthOnChain_GuardianCannotBeSelf", "inputs": [] }, { "type": "error", "name": "AuthOnChain_InvalidAddress", "inputs": [] }, { "type": "error", "name": "AuthOnChain_InvalidAuthenticationKey", "inputs": [] }, { "type": "error", "name": "AuthOnChain_NotAuthorizedGuardian", "inputs": [] }, { "type": "error", "name": "AuthOnChain_UserAlreadyRegistered", "inputs": [] }, { "type": "error", "name": "AuthOnChain_UserNotRegistered", "inputs": [] }] as const
