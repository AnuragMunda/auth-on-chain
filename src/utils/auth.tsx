'use client'

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";

export function withAuth<T extends object>(Component: ComponentType<T>) {
    return function ProtectedRoute(props: T) {
        const auth = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!auth?.authToken) {
                router.push('/login')
            }
        }, [auth?.authToken, router])

        if (!auth?.authToken) return null

        return <Component {...props} />
    }
}