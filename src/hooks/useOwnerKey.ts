import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'roastmygit_owner_key';

export function useOwnerKey() {
  const [ownerKey, setOwnerKeyState] = useState<string>('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setOwnerKeyState(stored);
    } catch { /* ignore */ }
  }, []);

  const setOwnerKey = useCallback((value: string) => {
    setOwnerKeyState(value);
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
  }, []);

  const clearOwnerKey = useCallback(() => setOwnerKey(''), [setOwnerKey]);

  return { ownerKey, setOwnerKey, clearOwnerKey, hasOwnerKey: !!ownerKey };
}
