import React, { useState } from 'react';
import {useStorageState} from './useStore'
import {useSession} from '../ctx'

const API_URL = "http://localhost:5000" //process.env.EXPO_PUBLIC_API_URL;

const JournalContext = React.createContext<{
    //fetchJournal: () => null;
    journals?: Array<{ id: string, title: string, content?: string, created_at?: string}> | null;
    isLoading: boolean;
}>({
    //fetchJournal: () => null,
    journals: [],
    isLoading: false,
});

export function useJournal() {
    const value = React.useContext(JournalContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useJournal must be wrapped in a <JournalProvider />');
        }
    }

    return value;
}

export function JournalProvider(props: React.PropsWithChildren) {
    const { session } = useSession()
    const [journals, setJournals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [[cacheLoading, cache], setCache] = useStorageState('journals');

    const fetchJournal = async () => {
        // Perform sign-in logic here
        console.log('session', session)
        try {
            const response = await fetch(`${API_URL}/journal`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session}`,
                },
            })
            if (response.ok) {
                console.log('fetchJournal successful');
                const payload = await response.json();
                console.log(payload)
                setJournals(payload)
            }

        } catch (error) {
            console.log('fetchJournal Error', error);
        }

    }
    React.useEffect(() => {
        fetchJournal().then(d => {

        })
    }, [])

    return (
        <JournalContext.Provider
            value={{
                journals,
                isLoading,
            }
            }>
            {props.children}
        </JournalContext.Provider>
    );
}
