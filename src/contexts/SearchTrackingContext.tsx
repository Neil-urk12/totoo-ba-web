import React, { useState, useEffect } from 'react';
import type { SearchTrackingContextType } from '../types/searchTracking';
import { SearchTrackingContext } from './SearchTrackingContextValue';

interface SearchTrackingProviderProps {
    children: React.ReactNode;
}

export const SearchTrackingProvider = ({ children }: SearchTrackingProviderProps) => {
    const [searchCount, setSearchCount] = useState<number>(() => {
        // Initialize state with value from localStorage
        const savedCount = localStorage.getItem('fda_search_count');
        return savedCount ? parseInt(savedCount, 10) : 0;
    });

    // Save search count to localStorage whenever it changes (but not on initial load)
    useEffect(() => {
        localStorage.setItem('fda_search_count', searchCount.toString());
    }, [searchCount]);

    const incrementSearchCount = () => {
        setSearchCount(prev => prev + 1);
    };

    const value: SearchTrackingContextType = {
        searchCount,
        incrementSearchCount
    };

    return (
        <SearchTrackingContext.Provider value={value}>
            {children}
        </SearchTrackingContext.Provider>
    );
};
