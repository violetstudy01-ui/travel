import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = '@travel-explorer/wishlist';
const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [savedIds, setSavedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active) return;
        if (!value) return;
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) setSavedIds([...new Set(parsed.filter((id) => typeof id === 'string'))]);
        } catch {
          setStorageError('Your saved places could not be read.');
        }
      })
      .catch(() => setStorageError('Your saved places could not be read.'))
      .finally(() => active && setIsLoading(false));
    return () => { active = false; };
  }, []);

  const persist = useCallback(async (nextIds) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
      setStorageError(null);
    } catch {
      setStorageError('Could not save this change. Please try again.');
    }
  }, []);

  const toggleSaved = useCallback((id) => {
    setSavedIds((current) => {
      const nextIds = current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id];
      persist(nextIds);
      return nextIds;
    });
  }, [persist]);

  const value = useMemo(() => ({ savedIds, isLoading, storageError, isSaved: (id) => savedIds.includes(id), toggleSaved }), [isLoading, savedIds, storageError, toggleSaved]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
