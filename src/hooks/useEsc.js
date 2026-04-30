import { useEffect } from 'react';

export const useEsc = (callback) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    window.addEventListener('keydown', handleEsc);
    
    // Cleanup: Menghapus listener saat komponen di-unmount
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [callback]);
};