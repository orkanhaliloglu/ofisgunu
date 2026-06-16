import React, { useState, useMemo } from 'react';
import { addMonths, subMonths, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Building2, Home, Palmtree, Laptop, Plane } from 'lucide-react';
import { getCalendarWeeks, formatMonthYear, isWorkingDay, getDateKey, isPublicHoliday } from './utils/dateHelpers';
import { useAttendanceData } from './hooks/useAttendanceData';
import Calendar from './components/Calendar';
import WeeklyTracker from './components/WeeklyTracker';
import MonthlySummary from './components/MonthlySummary';
import FeedbackForm from './components/FeedbackForm';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { getDayStatus, setDayStatus } = useAttendanceData();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const weeks = getCalendarWeeks(year, monthIndex);
  const currentMonthStr = formatMonthYear(year, monthIndex);

  // Calculate month's progress for dynamic background
  const completionPercent = useMemo(() => {
    let totalOffice = 0;
    let totalRequired = 0;

    weeks.forEach(week => {
      const monthDays = week.filter(date => isSameMonth(date, currentDate));
      const weekDays = monthDays.filter(isWorkingDay);
      if (weekDays.length === 0) return;

      let weekLeaves = 0;
      
      weekDays.forEach(date => {
        const key = getDateKey(date);
        const status = getDayStatus(key);
        const isHoliday = isPublicHoliday(date);

        if (isHoliday || status === 'leave' || status === 'holiday' || status === 'remote') {
          weekLeaves++;
        } else if (status === 'office') {
          totalOffice++;
        }
      });

      const activeWorkingDays = weekDays.length - weekLeaves;
      if (activeWorkingDays > 0) {
        totalRequired += Math.round(activeWorkingDays * 0.4);
      }
    });

    return totalRequired > 0 ? Math.min(100, (totalOffice / totalRequired) * 100) : 100;
  }, [weeks, currentDate, getDayStatus]);

  // Determine background class
  let bgClass = "bg-state-cloudy";
  if (completionPercent >= 100) bgClass = "bg-state-sunny";
  else if (completionPercent >= 50) bgClass = "bg-state-mixed";

  return (
    <div className={`app-wrapper ${bgClass}`}>
      <div className="dynamic-background">
        <div className="moon"></div>
        <div className="sun"></div>
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <div className="app-container">
        <header className="header animate-pop">
          <h1>Ofis Günü</h1>
          
          <div className="month-selector">
            <button className="icon-btn" onClick={handlePrevMonth}>
              <ChevronLeft size={24} />
            </button>
            <div className="month-display">{currentMonthStr}</div>
            <button className="icon-btn" onClick={handleNextMonth}>
              <ChevronRight size={24} />
            </button>
          </div>
        </header>
        
        <main>
          <Calendar 
            weeks={weeks} 
            currentMonthStr={currentMonthStr}
            activeMonthDate={currentDate}
            getDayStatus={getDayStatus}
            setDayStatus={setDayStatus}
          />
          
          <div className="legend animate-pop" style={{ animationDelay: '0.2s' }}>
            <div className="legend-item">
              <div style={{ padding: '4px', borderRadius: '50%', background: 'var(--color-empty)' }}></div>
              Boş
            </div>
            <div className="legend-item" style={{ borderColor: 'var(--color-office)', color: 'var(--color-office)' }}>
              <Building2 size={16} /> Ofis
            </div>
            <div className="legend-item" style={{ borderColor: 'var(--color-home)', color: 'var(--color-home)' }}>
              <Home size={16} /> Ev
            </div>
            <div className="legend-item" style={{ borderColor: 'var(--color-remote)', color: 'var(--color-remote)' }}>
              <Laptop size={16} /> Uzaktan
            </div>
            <div className="legend-item" style={{ borderColor: 'var(--color-leave)', color: 'var(--color-leave)' }}>
              <Plane size={16} /> İzin
            </div>
            <div className="legend-item" style={{ borderColor: 'var(--color-holiday)', color: 'var(--color-holiday)' }}>
              <Palmtree size={16} /> Resmi Tatil
            </div>
          </div>
        </main>

        <aside>
          <MonthlySummary 
            weeks={weeks} 
            activeMonthDate={currentDate}
            getDayStatus={getDayStatus} 
          />
          <WeeklyTracker 
            weeks={weeks} 
            activeMonthDate={currentDate}
            getDayStatus={getDayStatus} 
          />
        </aside>

        <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
          <FeedbackForm />
        </div>

        <footer className="footer">
          <p>by orkan</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
