import { useState, useEffect } from 'react';

// Possible statuses: 'office' | 'home' | 'leave' | 'holiday' | null

export function useAttendanceData() {
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('office-attendance');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse attendance data from localStorage', e);
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('office-attendance', JSON.stringify(attendance));
  }, [attendance]);

  const setDayStatus = (dateKey, status) => {
    setAttendance((prev) => {
      const next = { ...prev };
      if (status === null) {
        delete next[dateKey];
      } else {
        next[dateKey] = status;
      }
      return next;
    });
  };

  const getDayStatus = (dateKey) => {
    return attendance[dateKey] || null;
  };

  return {
    attendance,
    setDayStatus,
    getDayStatus,
  };
}
