'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "../../auth-client";


export default function SignOut() {
    const router = useRouter()

    useEffect(() => {
        authClient.signOut().then(() => {
            router.push('/')
        })
    })
}