import { useContext } from 'react';
import { SearchTrackingContext } from '../contexts/SearchTrackingContextValue';

export const useSearchTracking = () => {
  const context = useContext(SearchTrackingContext);
  if (context === undefined) {
    throw new Error('useSearchTracking must be used within a SearchTrackingProvider');
  }
  return context;
};
