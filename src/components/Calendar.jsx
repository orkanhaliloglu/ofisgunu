import React from 'react';
import { isSameMonth, isWeekend } from 'date-fns';
import { Building2, Home, Palmtree, TentTree } from 'lucide-react';
import { getDateKey, isWorkingDay, isPublicHoliday } from '../utils/dateHelpers';

const DAYS_OF_WEEK = ['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'];

const STATUS_ORDER = [null, 'office', 'home', 'leave'];

export default function Calendar({ weeks, currentMonthStr, activeMonthDate, getDayStatus, setDayStatus }) {
  
  const handleDayClick = (date) => {
    // Basic logic: we only allow clicking on days in the current month, and ideally only weekdays (though users may work weekends, let's keep it flexible but mostly for weekdays).
    if (!isSameMonth(date, activeMonthDate)) return;
    
    const key = getDateKey(date);
    const currentStatus = getDayStatus(key);
    
    // Cycle through statuses
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
    setDayStatus(key, STATUS_ORDER[nextIndex]);
  };

  const renderIcon = (status, isHol) => {
    if (isHol && !status) return <TentTree size={20} className="text-holiday-icon" style={{color: 'var(--color-holiday)'}} />;
    switch (status) {
      case 'office': return <Building2 size={20} />;
      case 'home': return <Home size={20} />;
      case 'leave': return <Palmtree size={20} />;
      default: return null;
    }
  };

  return (
    <div className="glass-panel calendar animate-pop">
      <div className="calendar-grid">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, dateIndex) => {
              const isEmpty = !isSameMonth(date, activeMonthDate);
              const key = getDateKey(date);
              const status = isEmpty ? null : getDayStatus(key);
              const weekend = isWeekend(date);
              const isHol = !isEmpty && isPublicHoliday(date);
              
              const className = `day-cell ${isEmpty ? 'empty' : ''} ${weekend ? 'is-weekend' : ''} ${status ? `status-${status}` : (isHol ? 'status-holiday' : '')}`;
              
              return (
                <div 
                  key={key} 
                  className={className}
                  onClick={() => handleDayClick(date)}
                >
                  <span className="date-num">{date.getDate()}</span>
                  <div className="status-icon">
                    {renderIcon(status, isHol)}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
