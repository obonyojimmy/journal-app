import React, { useState } from 'react';
import { useStorageState } from './useStore'
import { useSession } from '../ctx'
import { fetchJournals, fetchCategories, Journal, Category } from '../api';
import { saveStorageItem } from '../utils'
const JournalContext = React.createContext<{
    //fetchJournal: () => null;
    journals?: Array<Journal> | null;
    categories?: Array<Category> | null;
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
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [[cacheLoading, cache], setCache] = useStorageState('journals');


    React.useEffect(() => {
        fetchCategories()
            .then(d => {
                setCategories(d)
            })
            .catch(() => { })
        
        fetchJournals()
            .then(payload => {
                setJournals(payload)
            })
            .catch(() => {

            })
            .finally(() => {
                setIsLoading(false)
            })

    }, [])

    return (
        <JournalContext.Provider
            value={{
                journals,
                isLoading,
                categories
            }
            }>
            {props.children}
        </JournalContext.Provider>
    );
}
