import { createContext } from 'react';
import type { SearchTrackingContextType } from '../types/searchTracking';

export const SearchTrackingContext = createContext<SearchTrackingContextType | undefined>(undefined);
