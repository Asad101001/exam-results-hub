import { useState, useEffect } from 'react';

export function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (options?: Intl.DateTimeFormatOptions) => {
    return currentDate.toLocaleDateString('en-US', options);
  };

  const formatTime = (options?: Intl.DateTimeFormatOptions) => {
    return currentDate.toLocaleTimeString('en-US', options);
  };

  const getISODate = () => currentDate.toISOString().split('T')[0];

  const getFullDateTime = () => {
    return currentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return {
    currentDate,
    formatDate,
    formatTime,
    getISODate,
    getFullDateTime,
  };
}
