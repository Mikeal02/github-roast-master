import { useState, useEffect } from 'react';

const STORAGE_KEY = 'github-roast-history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addToHistory = (username) => {
    setHistory(prev => {
      const filtered = prev.filter(u => u.toLowerCase() !== username.toLowerCase());
      const updated = [username, ...filtered].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromHistory = (username) => {
    setHistory(prev => {
      const updated = prev.filter(u => u !== username);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
