import React from 'react';
import { isSameMonth } from 'date-fns';
import { isWorkingDay, getDateKey, isPublicHoliday } from '../utils/dateHelpers';
import { Briefcase, Home, CalendarOff, CalendarCheck, Laptop } from 'lucide-react';

export default function MonthlySummary({ weeks, activeMonthDate, getDayStatus }) {
  let totalWorkingDays = 0;
  let totalLeaves = 0;
  let totalOffice = 0;
  let totalHome = 0;
  let totalRemote = 0;
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

      if (isHoliday || status === 'leave' || status === 'holiday' || status === 'remote') {
        weekLeaves++;
        totalLeaves++;
        if (status === 'remote') totalRemote++;
      } else if (status === 'office') {
        totalOffice++;
      } else if (status === 'home') {
        totalHome++;
      }
    });

    const activeWorkingDays = weekDays.length - weekLeaves;
    if (activeWorkingDays > 0) {
      totalRequired += Math.round(activeWorkingDays * 0.4);
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

  // Face classes for CSS illustration
  const faceStateClass = isHappy ? 'is-happy' : isMeh ? 'is-meh' : 'is-sad';

  return (
    <div className="glass-panel monthly-summary animate-pop">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h2 style={{margin: 0}}>Aylık Özet</h2>
        
        <div className={`illustration-face ${faceStateClass}`} style={{ backgroundColor: faceColor }}>
          <div className="face-eyes">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>
          <div className="face-mouth"></div>
        </div>
      </div>
      
      <div className="summary-grid">
        <div className="summary-item">
          <CalendarCheck size={20} className="icon-blue" style={{ color: 'var(--color-office)' }} />
          <div className="summary-details">
            <span className="summary-label">Hedef Ofis</span>
            <span className="summary-value highlight" style={{ color: 'var(--color-office)' }}>{totalRequired} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <Briefcase size={20} className="icon-blue" style={{ color: 'var(--color-office)' }} />
          <div className="summary-details">
            <span className="summary-label">Gerçekleşen</span>
            <span className="summary-value" style={{ color: 'var(--text-primary)' }}>{totalOffice} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <Home size={20} className="icon-green" style={{ color: 'var(--color-home)' }} />
          <div className="summary-details">
            <span className="summary-label">Evden Çalışma</span>
            <span className="summary-value" style={{ color: 'var(--text-primary)' }}>{totalHome} Gün</span>
          </div>
        </div>

        <div className="summary-item">
          <Laptop size={20} className="icon-teal" style={{ color: 'var(--color-remote)' }} />
          <div className="summary-details">
            <span className="summary-label">Uzaktan</span>
            <span className="summary-value" style={{ color: 'var(--text-primary)' }}>{totalRemote} Gün</span>
          </div>
        </div>
        
        <div className="summary-item">
          <CalendarOff size={20} className="icon-amber" style={{ color: 'var(--color-holiday)' }} />
          <div className="summary-details">
            <span className="summary-label">İzin / Tatil</span>
            <span className="summary-value" style={{ color: 'var(--text-primary)' }}>{totalLeaves} Gün</span>
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
