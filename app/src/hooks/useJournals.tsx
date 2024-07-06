import React, { useState } from 'react';
import { useStorageState } from './useStore'
import { useSession } from '../ctx'
import { fetchJournals, Journal } from '../api';
import {saveStorageItem} from '../utils'
const JournalContext = React.createContext<{
    //fetchJournal: () => null;
    journals?: Array<Journal> | null;
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
    const [journals, setJournals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [[cacheLoading, cache], setCache] = useStorageState('journals');

    
    React.useEffect(() => {
        fetchJournals()
            .then(payload => {
                setJournals(payload)
            })
            .catch(() => { })
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
