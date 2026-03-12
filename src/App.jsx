import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Building2, Home, Palmtree, TentTree } from 'lucide-react';
import { getCalendarWeeks, formatMonthYear } from './utils/dateHelpers';
import { useAttendanceData } from './hooks/useAttendanceData';
import Calendar from './components/Calendar';
import WeeklyTracker from './components/WeeklyTracker';
import MonthlySummary from './components/MonthlySummary';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { getDayStatus, setDayStatus } = useAttendanceData();

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const weeks = getCalendarWeeks(year, monthIndex);
  const currentMonthStr = formatMonthYear(year, monthIndex);

  return (
    <div className="app-container">
      <header className="header animate-pop">
        <h1>%40 Ofis Günlüğü</h1>
        
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
            Eksik / Boş (Tıkla!)
          </div>
          <div className="legend-item" style={{ borderColor: 'var(--color-office)', color: 'var(--color-office)' }}>
            <Building2 size={16} /> Ofis
          </div>
          <div className="legend-item" style={{ borderColor: 'var(--color-home)', color: 'var(--color-home)' }}>
            <Home size={16} /> Ev / Uzaktan
          </div>
          <div className="legend-item" style={{ borderColor: 'var(--color-leave)', color: 'var(--color-leave)' }}>
            <Palmtree size={16} /> İzin
          </div>
          <div className="legend-item" style={{ borderColor: 'var(--color-holiday)', color: 'var(--color-holiday)' }}>
            <TentTree size={16} /> Resmi Tatil
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
    </div>
  );
}

export default App;
