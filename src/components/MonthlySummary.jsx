import React from 'react';
import { isSameMonth } from 'date-fns';
import { isWorkingDay, getDateKey, calculateRequiredOfficeDays, isPublicHoliday } from '../utils/dateHelpers';
import { Briefcase, CalendarCheck, CalendarOff, Smile, Meh, Frown } from 'lucide-react';

export default function MonthlySummary({ weeks, activeMonthDate, getDayStatus }) {
  let totalWorkingDays = 0;
  let totalLeaves = 0;
  let totalOffice = 0;
  let totalRequired = 0;

  weeks.forEach(week => {
    const monthDays = week.filter(date => isSameMonth(date, activeMonthDate));
    const weekDays = monthDays.filter(isWorkingDay);
    if (weekDays.length === 0) return;

    let weekLeaves = 0;
    
    weekDays.forEach(date => {
      totalWorkingDays++;
      const key = getDateKey(date);
      const status = getDayStatus(key);
      const isHoliday = isPublicHoliday(date);

      if (isHoliday || status === 'leave' || status === 'holiday') {
        weekLeaves++;
        totalLeaves++;
      } else if (status === 'office') {
        totalOffice++;
      }
    });

    const activeWorkingDays = weekDays.length - weekLeaves;
    if (activeWorkingDays > 0) {
      totalRequired += calculateRequiredOfficeDays(activeWorkingDays);
    }
  });

  const completionPercent = totalRequired > 0 ? Math.min(100, (totalOffice / totalRequired) * 100) : 100;
  const isHappy = completionPercent >= 100;
  const isMeh = completionPercent >= 50 && completionPercent < 100;
  const isSad = completionPercent < 50;
  
  // Decide the color based on happiness
  let faceColor = 'var(--color-holiday)'; // Sad (Red)
  if (isHappy) faceColor = 'var(--color-home)'; // Happy (Green)
  else if (isMeh) faceColor = 'var(--color-leave)'; // Meh (Amber)

  return (
    <div className="glass-panel monthly-summary animate-pop">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{margin: 0}}>Aylık Özet</h2>
        <div 
          className="happiness-face" 
          style={{ 
            color: faceColor,
            transition: 'all 0.5s ease',
            transform: isHappy ? 'scale(1.1) rotate(5deg)' : isSad ? 'scale(0.9) rotate(-5deg)' : 'scale(1)'
          }}
        >
          {isHappy ? <Smile size={32} /> : isMeh ? <Meh size={32} /> : <Frown size={32} />}
        </div>
      </div>
      
      <div className="summary-grid">
        <div className="summary-item">
          <CalendarCheck size={20} className="icon-blue" />
          <div className="summary-details">
            <span className="summary-label">Hedef Ofis</span>
            <span className="summary-value highlight">{totalRequired} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <Briefcase size={20} className="icon-green" />
          <div className="summary-details">
            <span className="summary-label">Gerçekleşen</span>
            <span className="summary-value">{totalOffice} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <CalendarOff size={20} className="icon-amber" />
          <div className="summary-details">
            <span className="summary-label">İzin / Tatil</span>
            <span className="summary-value">{totalLeaves} Gün</span>
          </div>
        </div>
      </div>
      
      <div className="summary-progress-wrapper">
        <div className="summary-progress-header">
          <span>Aylık İlerleme</span>
          <span style={{color: faceColor, fontWeight: 'bold', transition: 'color 0.5s ease'}}>
            {Math.round(completionPercent)}%
          </span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar" 
            style={{ 
              width: `${completionPercent}%`,
              background: faceColor,
              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.8s ease'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
