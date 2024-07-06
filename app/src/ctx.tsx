import React, { useState } from 'react';
import { useStorageState } from './hooks/useStore';
import { encodeFormData, saveStorageItem } from './utils'
import { CallSignIn } from './api'

const API_URL = "http://localhost:5000" //process.env.EXPO_PUBLIC_API_URL;

const AuthContext = React.createContext<{
    signIn: (username: string, password: string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});



// This hook can be used to access the user info.
export function useSession() {
    const value = React.useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }

    return value;
}


export function SessionProvider(props: React.PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext.Provider
            value={{
                signIn: async (username, password) => {
                    // Perform sign-in logic here

                    try {
                        const payload = await CallSignIn(username, password)
                        if (payload) {
                            const access_token = payload.access_token
                            const refresh_token = payload?.refresh_token
                            await saveStorageItem('refresh_token', refresh_token)
                            setSession(payload.access_token);
                        }

                    } catch (error) {
                        console.log('Login failed', error);
                    }
                },
                signOut: () => {
                    setSession(null);
                },
                session,
                isLoading,
            }}>
            {props.children}
        </AuthContext.Provider>
    );
}

