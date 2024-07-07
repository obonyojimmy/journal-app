import React, { useState } from 'react';
import { useStorageState } from './useStore'
import { useSession } from '../ctx'
import { fetchJournals, fetchCategories, createJournal, Journal, Category } from '../api';
import { saveStorageItem } from '../utils'

const JournalContext = React.createContext<{
    //fetchJournal: () => null;
    journals?: Array<Journal> | null;
    categories?: Array<Category> | null;
    isLoading: boolean;
    addJournal: (title: string, content: string, category: string) => Promise<Journal>;
}>({
    //fetchJournal: () => null,
    journals: [],
    categories: [],
    isLoading: false,
    addJournal: () => null,
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


    const getJournals = () => {
        fetchJournals()
            .then(payload => {
                setJournals(payload)
            })
            .catch(() => { })
            .finally(() => { setIsLoading(false) })
    }

    React.useEffect(() => {
        fetchCategories()
            .then(d => { setCategories(d)  })
            .catch(() => { })
        getJournals()


    }, [])

    return (
        <JournalContext.Provider
            value={{
                journals,
                isLoading,
                categories,
                addJournal: async (title: string, content: string, category: string) => {
                    const journal = await createJournal(title, content, category)
                    journals.push(journal)
                    if(journal?.category){
                        if (!categories.map(d => d?.name).includes(journal.category.name)){
                            categories.push(journal?.category)
                        }
                        //const uniqueCats = [...new Set([...categories, journal.category])]
                        //setCategories(uniqueCats)
                    }
                    
                    return journal
                },
            }}
        >
            {props.children}
        </JournalContext.Provider>
    );
}
