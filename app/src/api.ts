import { encodeFormData, getStorageItem, saveStorageItem, searchParams, getDateFromLabel } from "./utils";

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

export interface Category {
    id?: string;
    name: string;
}

export interface Journal {
    id: string;
    title: string;
    content?: string;
    created_at?: string;
    category?: Category | null;
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
    const queryParams = encodeURIComponent(refreshToken)
    const response = await fetch(`${API_URL}/refresh_token?refresh_token=${queryParams}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //body: JSON.stringify({ refresh_token: refreshToken }),
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

export async function GetUser(): Promise<User> {
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/user`, {
            method: 'GET',
            headers
        })
    }
    if (!response.ok) return null
    const payload = await response.json();
    return payload as User;
}

export async function UpdateUser(name: string|null = null, age: number|null=null, password:string|null=null): Promise<User | null> {
    const formData = {} //encodeFormData({ content })
    if (name) formData['name'] = name
    if (age) formData['age'] = age
    if (password) formData['password'] = password
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    console.log(formData)
    let response = await fetch(`${API_URL}/user`, {
        method: 'PUT',
        headers,
        body: encodeFormData(formData),
        mode: 'cors',
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/user`, {
            method: 'PUT',
            headers,
            body: encodeFormData(formData),
            mode: 'cors',
        })
    }
    if (!response.ok) return null
    const payload = await response.json();
    return payload as User;
}

export async function createJournal(title:string, content: string, category: string = ''): Promise<Journal> {
    const formData = encodeFormData({ title, content, category })
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/journal`, {
        method: 'POST',
        headers,
        body: formData,
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/journal`, {
            method: 'POST',
            headers,
            body: formData,
        })
    }
    if (!response.ok) return null
    const payload = await response.json();
    return payload as Journal;
}

export async function fetchJournals(category_id:string|null=null, date_tag:string|null=null): Promise<Array<Journal>> {
    const session = await getStorageItem('session')
    let queryFilters = ""
    if (category_id || date_tag) {
        //queryFilters = "?"
        const params = {}
        if (category_id) {
            params['category_id'] = category_id
        }
        if (date_tag) {
            console.log(getDateFromLabel(date_tag))
            const {from_date, to_date} = getDateFromLabel(date_tag)
            params['from_date'] = from_date
            params['to_date'] = to_date
        }
        queryFilters = `?${searchParams(params)}`
    }
    //if (category_id) queryFilters = `${queryFilters}category_id=${category_id}`
    //if (from_date) queryFilters = `${queryFilters}category_id=${category_id}`
    
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/journal${queryFilters}`, {
        method: 'GET',
        headers
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/journal${queryFilters}`, {
            method: 'GET',
            headers
        })
    }
    if (!response.ok) return []
    const payload = await response.json();
    return payload as Array<Journal>;
}

export async function getJournal(id: string): Promise<Journal> {
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/journal/${id}`, {
        method: 'GET',
        headers
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/journal/${id}`, {
            method: 'GET',
            headers
        })
    }
    if (!response.ok) return null
    const payload = await response.json();
    return payload as Journal;
}

export async function CallUpdateJournal(id:string, content: string): Promise<Journal> {
    const formData = encodeFormData({ content })
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/journal/${id}`, {
        method: 'PUT',
        headers,
        body: formData,
        mode: 'cors',
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/journal/${id}`, {
            method: 'PUT',
            headers,
            body: formData,
            mode: 'cors',
        })
    }
    if (!response.ok) return null
    const payload = await response.json();
    return payload as Journal;
}

export async function CallDeleteJournal(id:string): Promise<string> {
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/journal/${id}`, {
        method: 'DELETE',
        headers,
        mode: 'cors',
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/journal/${id}`, {
            method: 'DELETE',
            headers,
            mode: 'cors',
        })
    }
    if (!response.ok) return null
    const payload = await response.text();
    return payload
}

export async function fetchCategories(): Promise<Array<Category>> {
    const session = await getStorageItem('session')
    const headers = {
        'Authorization': `Bearer ${session}`,
    }
    let response = await fetch(`${API_URL}/category`, {
        method: 'GET',
        headers
    })
    if (response.status === 401) {
        const tokenPayload = await CallRefreshToken();
        headers.Authorization = `Bearer ${tokenPayload.access_token}`;
        response = await fetch(`${API_URL}/category`, {
            method: 'GET',
            headers
        })
    }
    if (!response.ok) return null
    const payload = await response.json();
    return payload as Array<Category>;
}