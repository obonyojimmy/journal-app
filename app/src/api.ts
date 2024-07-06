import { encodeFormData, getStorageItem, saveStorageItem } from "./utils";

interface Token {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

interface UserProfile {
    name: string;
    age: number;
}

interface User {
    id: string;
    email: string;
    profile: UserProfile;
}

interface SignInError {
    message: string;
}

export interface Journal {
    id: string;
    title: string;
    content?: string;
    created_at?: string;
}


const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function CallSignIn(username: string, password: string): Promise<Token> {
    const formData = encodeFormData({ username, password })
    const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        body: formData,
    })
    if (!response.ok) return null
    const payload = await response.json();
    return payload as Token
}

export async function CallRefreshToken(): Promise<Token> {
    const refreshToken = await getStorageItem('refresh_token')
    console.log('refreshToken', refreshToken)
    const response = await fetch(`${API_URL}/refresh_token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
    })
    if (!response.ok) {
        await saveStorageItem('refresh_token', null)
        await saveStorageItem('session', null)
    }
    const payload = await response.json();
    await saveStorageItem('refresh_token', payload.refresh_token)
    await saveStorageItem('session', payload.access_token)
    return payload as Token
}



export async function CallRegister(email: string, password: string, name: string = ''): Promise<User | null> {
    const formData = encodeFormData({ email, password })
    const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        body: formData,
    })
    if (!response.ok) return null
    const payload = await response.json();
    return payload as User
}

export async function fetchJournals(): Promise<Array<Journal>> {
    const session = await getStorageItem('session')
    console.log('session', session)
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/journal`, {
        method: 'GET',
        headers
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/journal`, {
            method: 'GET',
            headers
        })
    }
    if (!response.ok) return []
    const payload = await response.json();
    return payload as Array<Journal>;
}